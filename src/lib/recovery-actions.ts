
'use server';

import sgMail from '@sendgrid/mail';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc, deleteDoc, Timestamp } from 'firebase/firestore';
import { firebaseConfig } from '@/firebase/config';

// Initialize Firebase Client SDK for server-side use. 
// Using the client SDK here avoids credential issues with firebase-admin in restricted environments.
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

/**
 * Generates and sends a 6-digit recovery code via Twilio SendGrid.
 */
export async function sendRecoveryCode(email: string) {
  if (!process.env.SENDGRID_API_KEY) {
    throw new Error('SENDGRID_API_KEY is not configured.');
  }

  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  // Generate 6-digit code
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  
  // Store in Firestore with expiration (10 minutes)
  const expiration = new Date();
  expiration.setMinutes(expiration.getMinutes() + 10);

  try {
    const docRef = doc(db, 'recovery_codes', email.toLowerCase());
    await setDoc(docRef, {
      code,
      expiresAt: Timestamp.fromDate(expiration),
      createdAt: Timestamp.now(),
    });

    // Send Email
    const msg = {
      to: email,
      from: process.env.SENDGRID_FROM_EMAIL || 'noreply@novavr.local',
      subject: 'Your NovaVR Recovery Token',
      text: `Your identity verification token is: ${code}. It expires in 10 minutes.`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; background: #0f172a; color: #f8fafc; border-radius: 10px;">
          <h2 style="color: #3b82f6;">NovaVR Identity Recovery</h2>
          <p>A request was made to access your account. Use the token below to verify your identity:</p>
          <div style="font-size: 32px; font-weight: bold; letter-spacing: 5px; padding: 20px; background: rgba(255,255,255,0.05); text-align: center; border-radius: 8px; margin: 20px 0;">
            ${code}
          </div>
          <p style="font-size: 12px; color: #94a3b8;">This code will expire in 10 minutes. If you did not request this, please ignore this email.</p>
        </div>
      `,
    };

    await sgMail.send(msg);
    return { success: true };
  } catch (error: any) {
    console.error('SendGrid/Firestore Error:', error);
    throw new Error(error.message || 'Failed to send recovery email. Ensure your Firestore rules allow access to the "recovery_codes" collection.');
  }
}

/**
 * Verifies the 6-digit code provided by the user.
 */
export async function verifyRecoveryCode(email: string, code: string) {
  try {
    const docRef = doc(db, 'recovery_codes', email.toLowerCase());
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      throw new Error('No recovery request found for this email.');
    }

    const data = docSnap.data();
    const now = Timestamp.now();

    if (data.expiresAt.seconds < now.seconds) {
      throw new Error('The verification code has expired.');
    }

    if (data.code !== code) {
      throw new Error('Invalid verification token.');
    }

    // Success: Delete the code so it can't be reused
    await deleteDoc(docRef);

    return { success: true };
  } catch (error: any) {
    console.error('Verification Error:', error);
    throw new Error(error.message || 'Verification failed.');
  }
}

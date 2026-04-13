'use server';

import sgMail from '@sendgrid/mail';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc, deleteDoc, Timestamp } from 'firebase/firestore';
import { firebaseConfig } from '@/firebase/config';

/**
 * Helper to initialize Firebase safely on the server.
 */
function getDb() {
  try {
    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    return getFirestore(app);
  } catch (error) {
    console.error('Firebase Server Initialization Failed');
    throw error;
  }
}

/**
 * Generates and sends a 6-digit recovery code via Twilio SendGrid.
 * Returns a clean, serializable object to prevent Next.js "unexpected response" errors.
 */
export async function sendRecoveryCode(email: string) {
  try {
    const apiKey = process.env.SENDGRID_API_KEY;
    const fromEmail = process.env.SENDGRID_FROM_EMAIL;

    // 1. Validate environment configuration
    if (!apiKey || !fromEmail) {
      console.warn('Recovery Error: SENDGRID_API_KEY or SENDGRID_FROM_EMAIL is missing in .env');
      return { 
        success: false, 
        error: 'The recovery system is not fully configured. Please contact support.' 
      };
    }

    // 2. Setup Services
    sgMail.setApiKey(apiKey);
    const db = getDb();
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiration = new Date();
    expiration.setMinutes(expiration.getMinutes() + 10);

    // 3. Store the code in Firestore
    const targetEmail = email.toLowerCase().trim();
    const docRef = doc(db, 'recovery_codes', targetEmail);
    
    await setDoc(docRef, {
      code,
      expiresAt: Timestamp.fromDate(expiration),
      createdAt: Timestamp.now(),
    });

    // 4. Prepare the email
    const msg = {
      to: targetEmail,
      from: fromEmail.trim(),
      subject: 'Your NovaVR Recovery Token',
      text: `Your identity verification token is: ${code}. It expires in 10 minutes.`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; background: #0f172a; color: #f8fafc; border-radius: 10px;">
          <h2 style="color: #3b82f6;">NovaVR Identity Recovery</h2>
          <p>Use the token below to verify your identity:</p>
          <div style="font-size: 32px; font-weight: bold; letter-spacing: 5px; padding: 20px; background: rgba(255,255,255,0.05); text-align: center; border-radius: 8px; margin: 20px 0;">
            ${code}
          </div>
          <p style="font-size: 12px; color: #94a3b8;">This code will expire in 10 minutes. If you did not request this, please ignore this email.</p>
        </div>
      `,
    };

    // 5. Send via SendGrid
    await sgMail.send(msg);
    
    return { success: true };
  } catch (error: any) {
    // Return a simple string to ensure serializability
    const errorMessage = error?.response?.body?.errors?.[0]?.message || error?.message || 'Internal server error';
    console.error('sendRecoveryCode Failure:', errorMessage);

    return { 
      success: false, 
      error: errorMessage.includes('403') 
        ? 'Email delivery failed. Ensure your "From" email is verified in SendGrid.' 
        : 'Failed to send recovery code. Please try again later.'
    };
  }
}

/**
 * Verifies the 6-digit code provided by the user.
 */
export async function verifyRecoveryCode(email: string, code: string) {
  try {
    if (!email || !code) return { success: false, error: 'Missing identity or token.' };

    const db = getDb();
    const targetEmail = email.toLowerCase().trim();
    const docRef = doc(db, 'recovery_codes', targetEmail);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return { success: false, error: 'No active recovery request found for this identity.' };
    }

    const data = docSnap.data();
    const now = Timestamp.now();

    if (data.expiresAt.seconds < now.seconds) {
      await deleteDoc(docRef);
      return { success: false, error: 'The verification token has expired.' };
    }

    if (data.code !== code.trim()) {
      return { success: false, error: 'Invalid verification token. Please check the code and try again.' };
    }

    // Success: Consume the code
    await deleteDoc(docRef);

    return { success: true };
  } catch (error: any) {
    console.error('verifyRecoveryCode Failure:', error?.message || 'Unknown');
    return { success: false, error: 'System verification error. Please try again.' };
  }
}

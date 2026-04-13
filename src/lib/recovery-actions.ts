
'use server';

import sgMail from '@sendgrid/mail';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc, deleteDoc, Timestamp } from 'firebase/firestore';
import { firebaseConfig } from '@/firebase/config';

/**
 * Helper to initialize Firebase safely on the server.
 */
function getDb() {
  const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  return getFirestore(app);
}

/**
 * Generates and sends a 6-digit recovery code via Twilio SendGrid.
 * Returns a structured object instead of throwing to avoid generic Next.js action errors.
 */
export async function sendRecoveryCode(email: string) {
  const apiKey = process.env.SENDGRID_API_KEY;
  const fromEmail = process.env.SENDGRID_FROM_EMAIL;

  if (!apiKey || !fromEmail) {
    console.error('Recovery Configuration Error: Missing SENDGRID_API_KEY or SENDGRID_FROM_EMAIL');
    return { 
      success: false, 
      error: 'Recovery system is not configured. Please check environment variables.' 
    };
  }

  try {
    sgMail.setApiKey(apiKey);
    const db = getDb();

    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store in Firestore with expiration (10 minutes)
    const expiration = new Date();
    expiration.setMinutes(expiration.getMinutes() + 10);

    // 1. Store the code in Firestore
    const docRef = doc(db, 'recovery_codes', email.toLowerCase());
    await setDoc(docRef, {
      code,
      expiresAt: Timestamp.fromDate(expiration),
      createdAt: Timestamp.now(),
    });

    // 2. Prepare the email
    const msg = {
      to: email,
      from: fromEmail,
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

    // 3. Send via SendGrid
    await sgMail.send(msg);
    
    return { success: true };
  } catch (error: any) {
    console.error('Recovery Action Failure:', error);

    let errorMessage = 'An internal error occurred during the recovery process.';

    if (error.response) {
      // Handle SendGrid specific errors (e.g., unverified sender)
      const body = error.response.body;
      console.error('SendGrid API Error Details:', JSON.stringify(body, null, 2));
      errorMessage = body?.errors?.[0]?.message || 'Email provider rejected the request.';
    } else if (error.message) {
      errorMessage = error.message;
    }

    return { success: false, error: errorMessage };
  }
}

/**
 * Verifies the 6-digit code provided by the user.
 */
export async function verifyRecoveryCode(email: string, code: string) {
  try {
    const db = getDb();
    const docRef = doc(db, 'recovery_codes', email.toLowerCase());
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return { success: false, error: 'No recovery request found for this email.' };
    }

    const data = docSnap.data();
    const now = Timestamp.now();

    if (data.expiresAt.seconds < now.seconds) {
      await deleteDoc(docRef);
      return { success: false, error: 'The verification code has expired.' };
    }

    if (data.code !== code) {
      return { success: false, error: 'Invalid verification token.' };
    }

    // Success: Delete the code so it can't be reused
    await deleteDoc(docRef);

    return { success: true };
  } catch (error: any) {
    console.error('Verification Action Failure:', error);
    return { success: false, error: error.message || 'Verification failed.' };
  }
}

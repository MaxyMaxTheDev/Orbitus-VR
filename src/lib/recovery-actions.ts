'use server';

import sgMail from '@sendgrid/mail';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp, getApps, cert } from 'firebase-admin/app';

// Initialize Firebase Admin for server-side operations
if (!getApps().length) {
  // Note: For local development, ensure GOOGLE_APPLICATION_CREDENTIALS is set
  // or provide service account JSON.
  initializeApp();
}

const db = getFirestore();

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

  await db.collection('recovery_codes').doc(email.toLowerCase()).set({
    code,
    expiresAt: expiration,
    createdAt: new Date(),
  });

  // Send Email
  const msg = {
    to: email,
    from: process.env.SENDGRID_FROM_EMAIL || 'noreply@xenovavr.local',
    subject: 'Your XenovaVR Recovery Token',
    text: `Your identity verification token is: ${code}. It expires in 10 minutes.`,
    html: `
      <div style="font-family: sans-serif; padding: 20px; background: #0f172a; color: #f8fafc; border-radius: 10px;">
        <h2 style="color: #3b82f6;">XenovaVR Identity Recovery</h2>
        <p>A request was made to access your account. Use the token below to verify your identity:</p>
        <div style="font-size: 32px; font-weight: bold; letter-spacing: 5px; padding: 20px; background: rgba(255,255,255,0.05); text-align: center; border-radius: 8px; margin: 20px 0;">
          ${code}
        </div>
        <p style="font-size: 12px; color: #94a3b8;">This code will expire in 10 minutes. If you did not request this, please ignore this email.</p>
      </div>
    `,
  };

  try {
    await sgMail.send(msg);
    return { success: true };
  } catch (error: any) {
    console.error('SendGrid Error:', error.response?.body || error);
    throw new Error('Failed to send recovery email via SendGrid.');
  }
}

/**
 * Verifies the 6-digit code provided by the user.
 */
export async function verifyRecoveryCode(email: string, code: string) {
  const doc = await db.collection('recovery_codes').doc(email.toLowerCase()).get();
  
  if (!doc.exists) {
    throw new Error('No recovery request found for this email.');
  }

  const data = doc.data();
  const now = new Date();

  if (data?.expiresAt.toDate() < now) {
    throw new Error('The verification code has expired.');
  }

  if (data?.code !== code) {
    throw new Error('Invalid verification token.');
  }

  // Success: Delete the code so it can't be reused
  await db.collection('recovery_codes').doc(email.toLowerCase()).delete();

  return { success: true };
}

'use server';

import sgMail from '@sendgrid/mail';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc, deleteDoc, Timestamp } from 'firebase/firestore';
import { firebaseConfig } from '@/firebase/config';

/**
 * Helper to initialize Firestore safely on the server.
 * Uses the Client SDK which is compatible with Node.js environments.
 */
function getDb() {
  try {
    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    return getFirestore(app);
  } catch (error: any) {
    const msg = error?.message || 'Unknown Firebase Init Error';
    console.error('[Recovery] Firebase Init Error:', msg);
    throw new Error(msg);
  }
}

/**
 * Generates and sends a 6-digit recovery code via SendGrid.
 * Returns a strictly serializable object to avoid Next.js serialization errors.
 */
export async function sendRecoveryCode(email: string) {
  try {
    const apiKey = process.env.SENDGRID_API_KEY;
    const fromEmail = process.env.SENDGRID_FROM_EMAIL;

    // 1. Validate environment configuration
    if (!apiKey || !fromEmail) {
      console.error('[Recovery] Configuration missing in .env');
      return { 
        success: false, 
        error: 'Recovery system is not configured. Missing API keys.' 
      };
    }

    // 2. Setup SendGrid
    sgMail.setApiKey(apiKey);

    // 3. Generate Code and Expiration
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiration = new Date();
    expiration.setMinutes(expiration.getMinutes() + 10);

    // 4. Store in Firestore
    const db = getDb();
    const targetEmail = (email || '').toLowerCase().trim();
    if (!targetEmail) return { success: false, error: 'Invalid email address provided.' };

    const docRef = doc(db, 'recovery_codes', targetEmail);
    
    await setDoc(docRef, {
      code,
      expiresAt: Timestamp.fromDate(expiration),
      createdAt: Timestamp.now(),
    });

    // 5. Prepare and Send Email
    const msg = {
      to: targetEmail,
      from: fromEmail.trim(),
      subject: 'NovaVR Identity Verification',
      text: `Your verification code is: ${code}. It expires in 10 minutes.`,
      html: `
        <div style="font-family: sans-serif; padding: 40px; background: #0f172a; color: #f8fafc; border-radius: 16px;">
          <h2 style="color: #3b82f6; margin-bottom: 24px;">NovaVR Security</h2>
          <p>Please use the verification token below to confirm your identity:</p>
          <div style="font-size: 36px; font-weight: 800; letter-spacing: 8px; padding: 30px; background: rgba(255,255,255,0.05); text-align: center; border-radius: 12px; margin: 30px 0; border: 1px solid rgba(255,255,255,0.1);">
            ${code}
          </div>
          <p style="font-size: 13px; color: #94a3b8; line-height: 1.6;">This code is valid for 10 minutes. If you did not request this verification, please ignore this message.</p>
        </div>
      `,
    };

    await sgMail.send(msg);
    
    // Explicitly return a flat, clean object
    return { success: true };

  } catch (error: any) {
    // Extract the most readable error message
    let errorMessage = 'Internal recovery system failure.';
    
    if (error?.response?.body?.errors?.[0]?.message) {
      errorMessage = error.response.body.errors[0].message;
    } else if (error?.message) {
      errorMessage = error.message;
    }

    console.error('[Recovery] Action Failed:', errorMessage);

    // Filter common errors for user-friendly feedback
    if (errorMessage.includes('403') || errorMessage.includes('Unauthorized')) {
      errorMessage = 'Email system authentication failed. Check SendGrid verification.';
    }

    return { 
      success: false, 
      error: errorMessage 
    };
  }
}

/**
 * Verifies the 6-digit code provided by the user.
 */
export async function verifyRecoveryCode(email: string, code: string) {
  try {
    const userEmail = (email || '').toLowerCase().trim();
    const userCode = (code || '').trim();

    if (!userEmail || !userCode) {
      return { success: false, error: 'Identity and token are required.' };
    }

    const db = getDb();
    const docRef = doc(db, 'recovery_codes', userEmail);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return { success: false, error: 'No active recovery request found.' };
    }

    const data = docSnap.data();
    const now = Timestamp.now();

    // Check expiration
    if (data.expiresAt.seconds < now.seconds) {
      await deleteDoc(docRef);
      return { success: false, error: 'Verification token has expired.' };
    }

    // Check code match
    if (data.code !== userCode) {
      return { success: false, error: 'Invalid verification token.' };
    }

    // Success: Clean up and return
    await deleteDoc(docRef);
    return { success: true };

  } catch (error: any) {
    const msg = error?.message || 'Verification system error.';
    console.error('[Recovery] Verification Failed:', msg);
    return { success: false, error: msg };
  }
}

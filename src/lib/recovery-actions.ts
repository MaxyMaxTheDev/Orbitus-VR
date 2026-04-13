'use server';

import sgMail from '@sendgrid/mail';

/**
 * Generates and sends a 6-digit recovery code via SendGrid.
 * Returns the code to the client to be stored in IndexedDB, avoiding Firestore.
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

    // 3. Generate Code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const targetEmail = (email || '').toLowerCase().trim();
    if (!targetEmail) return { success: false, error: 'Invalid email address provided.' };

    // 4. Prepare and Send Email
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
    
    // Return success and the code to the client for local verification
    return { 
        success: true, 
        code 
    };

  } catch (error: any) {
    let errorMessage = 'Internal recovery system failure.';
    
    if (error?.response?.body?.errors?.[0]?.message) {
      errorMessage = error.response.body.errors[0].message;
    } else if (error?.message) {
      errorMessage = error.message;
    }

    console.error('[Recovery] Action Failed:', errorMessage);

    if (errorMessage.includes('403') || errorMessage.includes('Unauthorized')) {
      errorMessage = 'Email system authentication failed. Check SendGrid verification.';
    }

    return { 
      success: false, 
      error: errorMessage 
    };
  }
}

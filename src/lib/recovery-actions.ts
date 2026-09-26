'use server';

import { Resend } from 'resend';

import {getVercelEnv} from './vercel-env';

type ResendError = { name: string; message: string };

/**
 * Translates a Resend API error into something actionable. Resend returns a
 * typed `name` on every failure, which is far more reliable than matching on
 * the human-readable message.
 */
function describeResendError(error: ResendError): string {
  switch (error.name) {
    case 'missing_api_key':
    case 'restricted_api_key':
    case 'invalid_api_key':
      return 'The Resend API Key is invalid, expired, or revoked. Check RESEND_API_KEY in Vercel Environment Variables.';
    case 'invalid_from_address':
      return 'The sender email address is not verified in Resend. Please check RESEND_FROM_EMAIL.';
    case 'daily_quota_exceeded':
    case 'monthly_quota_exceeded':
      return 'The email service has reached its sending limit for this period. Please try again later.';
    case 'rate_limit_exceeded':
      return 'Too many verification emails were requested. Please wait a moment and try again.';
    default:
      return error.message || 'An error occurred while sending the recovery code.';
  }
}

/**
 * Generates and sends a 6-digit recovery code via Resend.
 * Returns the code to the client to be stored in IndexedDB, avoiding Firestore.
 */
export async function sendRecoveryCode(email: string) {
  try {
    const apiKey = getVercelEnv('RESEND_API_KEY');
    const fromEmail = getVercelEnv('RESEND_FROM_EMAIL');

    // 1. Validate environment configuration
    if (!apiKey || !fromEmail) {
      return {
        success: false,
        error: 'Recovery system is not configured. Set RESEND_API_KEY and RESEND_FROM_EMAIL in your Vercel project Environment Variables.'
      };
    }

    // 2. Setup Resend
    const resend = new Resend(apiKey.trim());

    // 3. Generate Code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const targetEmail = (email || '').toLowerCase().trim();
    if (!targetEmail) return { success: false, error: 'Please provide a valid email address.' };

    // 4. Send Email. Resend reports API failures in `error` rather than throwing.
    const { error } = await resend.emails.send({
      to: targetEmail,
      from: fromEmail.trim(),
      subject: 'OrbitusVR Identity Verification',
      text: `Your verification code is: ${code}. remember after 10 minutes the code will expire and go bye bye!`,
      html: `
        <div style="font-family: sans-serif; padding: 40px; background: #0f172a; color: #f8fafc; border-radius: 16px;">
          <h2 style="color: #3b82f6; margin-bottom: 24px;">OrbitusVR Security</h2>
          <p>Please use the verification token below to confirm your identity:</p>
          <div style="font-size: 36px; font-weight: 800; letter-spacing: 8px; padding: 30px; background: rgba(255,255,255,0.05); text-align: center; border-radius: 12px; margin: 30px 0; border: 1px solid rgba(255,255,255,0.1);">
            ${code}
          </div>
          <p style="font-size: 13px; color: #94a3b8; line-height: 1.6;">remember after 10 minutes the code will expire and go bye bye!<br/>If you did not request this verification, please ignore this message.</p>
        </div>
      `,
    });

    if (error) {
      console.error('[Recovery] Resend Error:', error.name, error.message);
      return { success: false, error: describeResendError(error) };
    }

    return {
      success: true,
      code
    };

  } catch (error: any) {
    const errorMessage = error?.message || 'An error occurred while sending the recovery code.';
    console.error('[Recovery] Resend Error:', errorMessage);
    return {
      success: false,
      error: errorMessage
    };
  }
}

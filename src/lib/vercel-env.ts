const VERCEL_ENV_ERROR = 'Set it in the Vercel project Environment Variables.';

function normalizeEnvValue(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

export function getVercelEnv(name: string): string | undefined {
  return normalizeEnvValue(process.env[name]);
}

export function requireVercelEnv(name: string): string {
  const value = getVercelEnv(name);

  if (!value) {
    throw new Error(`${name} is not configured. ${VERCEL_ENV_ERROR}`);
  }

  return value;
}

export function hasGeminiApiKey(): boolean {
  return Boolean(getVercelEnv('GEMINI_API_KEY'));
}

export const missingGeminiApiKeyMessage =
  'AI features are disabled. Set GEMINI_API_KEY in your Vercel project Environment Variables.';

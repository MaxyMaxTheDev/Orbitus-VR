import {googleAI} from '@genkit-ai/google-genai';
import {genkit, z} from 'genkit';

import {getVercelEnv} from '@/lib/vercel-env';

export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: getVercelEnv('GOOGLE_GENAI_API_KEY'),
    }),
  ],
  model: googleAI.model('gemini-2.5-flash'),
});

export { z };

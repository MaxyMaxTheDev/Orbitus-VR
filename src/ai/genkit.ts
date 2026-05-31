import {googleAI} from '@genkit-ai/google-genai';
import {genkit, z} from 'genkit';

import {getVercelEnv} from '@/lib/vercel-env';

export const geminiTextModel = googleAI.model('gemini-2.5-flash');
export const geminiImageModel = googleAI.model('gemini-2.5-flash-image');

export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: getVercelEnv('GEMINI_API_KEY'),
    }),
  ],
  model: geminiTextModel,
});

export { z };

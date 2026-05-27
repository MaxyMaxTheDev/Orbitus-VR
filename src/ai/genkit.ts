import {genkit, z} from 'genkit';
import {groq} from '@genkit-ai/groq';

export const ai = genkit({
  plugins: [
    groq({
      apiKey: process.env.GROQ_API_KEY,
    }),
  ],
  model: 'groq/llama-3.3-70b-versatile',
});

export { z };

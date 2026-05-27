import {openAICompatible} from '@genkit-ai/compat-oai';
import {genkit, z} from 'genkit';

export const ai = genkit({
  plugins: [
    openAICompatible({
      name: 'groq',
      apiKey: process.env.GROQ_API_KEY,
      baseURL: 'https://api.groq.com/openai/v1',
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

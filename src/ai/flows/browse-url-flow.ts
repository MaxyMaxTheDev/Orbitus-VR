/**
 * @fileOverview Shared Zod schemas for AI flows and components.
 */
import { z } from 'zod';

// For chat.ts
export const ChatInputSchema = z.object({
  message: z.string().min(1, "Message cannot be empty").describe('The user message.'),
});
export type ChatInput = z.infer<typeof ChatInputSchema>;
export const ChatOutputSchema = z.object({
  message: z.string().describe('The AI response.'),
});
export type ChatOutput = z.infer<typeof ChatOutputSchema>;

// For explain-code-flow.ts
export const ExplainCodeInputSchema = z.object({
  code: z.string().min(1, 'Code cannot be empty').describe('The code snippet to explain.'),
});
export type ExplainCodeInput = z.infer<typeof ExplainCodeInputSchema>;
export const ExplainCodeOutputSchema = z.object({
  explanation: z.string().describe('The AI-generated explanation of the code.'),
});
export type ExplainCodeOutput = z.infer<typeof ExplainCodeOutputSchema>;

// For image-generation-flow.ts
export const ImageGenerationInputSchema = z.object({
  prompt: z.string().min(1, 'Prompt cannot be empty').describe('A text description of the image to generate.'),
});
export type ImageGenerationInput = z.infer<typeof ImageGenerationInputSchema>;
export const ImageGenerationOutputSchema = z.object({
  imageUrl: z.string().describe('The data URI of the generated image.'),
});
export type ImageGenerationOutput = z.infer<typeof ImageGenerationOutputSchema>;

// For quote-flow.ts
export const QuoteOutputSchema = z.object({
  quote: z.string().describe('The generated quote.'),
  author: z.string().describe('The fictional or real author of the quote.'),
});
export type QuoteOutput = z.infer<typeof QuoteOutputSchema>;

// For summarize-url-flow.ts and browser.tsx
export const SummarizeUrlInputSchema = z.object({
  url: z.string().min(1, { message: "URL cannot be empty." }).describe('The URL to summarize or browse.'),
});
export type SummarizeUrlInput = z.infer<typeof SummarizeUrlInputSchema>;
export const SummarizeUrlOutputSchema = z.object({
  summary: z.string().describe('The AI-generated summary of the URL content.'),
});
export type SummarizeUrlOutput = z.infer<typeof SummarizeUrlOutputSchema>;

// For vr-chat-flow.ts
export const MessageSchema = z.object({
  author: z.string(),
  text: z.string(),
});
export type Message = z.infer<typeof MessageSchema>;

export const VRChatInputSchema = z.object({
  history: z.array(MessageSchema),
  userMessage: z.string(),
});
export type VRChatInput = z.infer<typeof VRChatInputSchema>;

export const VRChatOutputSchema = z.object({
  responses: z.array(MessageSchema),
});
export type VRChatOutput = z.infer<typeof VRChatOutputSchema>;

// For generate-app-banner-flow.ts
export const GenerateAppBannerInputSchema = z.object({
  appName: z.string().describe('The name of the application.'),
  description: z.string().describe('A description of what the application does.'),
});
export type GenerateAppBannerInput = z.infer<typeof GenerateAppBannerInputSchema>;

export const GenerateAppBannerOutputSchema = z.object({
  imageUrl: z.string().describe('The data URI of the generated banner image.'),
});
export type GenerateAppBannerOutput = z.infer<typeof GenerateAppBannerOutputSchema>;

// For login-flow.ts
export const LoginInputSchema = z.object({
  username: z.string().describe("The user's username."),
  password: z.string().describe("The user's password."),
});
export type LoginInput = z.infer<typeof LoginInputSchema>;
export const LoginOutputSchema = z.object({
  success: z.boolean().describe('Whether the login was successful.'),
  message: z.string().describe('A message indicating the result of the login attempt.'),
});
export type LoginOutput = z.infer<typeof LoginOutputSchema>;

// For signup-flow.ts
export const SignupInputSchema = z.object({
  username: z.string().describe("The user's desired username."),
  password: z.string().describe("The user's desired password."),
});
export type SignupInput = z.infer<typeof SignupInputSchema>;
export const SignupOutputSchema = z.object({
  success: z.boolean().describe('Whether the signup was successful.'),
  message: z.string().describe('A message indicating the result of the signup attempt.'),
});
export type SignupOutput = z.infer<typeof SignupOutputSchema>;

// For profile-code-flow.ts
export const ProfileCodeInputSchema = z.object({
  code: z.string().min(1, 'Code cannot be empty').describe('The code snippet to profile.'),
});
export type ProfileCodeInput = z.infer<typeof ProfileCodeInputSchema>;

export const ProfileCodeOutputSchema = z.object({
  quantumComplexity: z.string().describe("A fictional 'Quantum Complexity' score or rating (e.g., 'Low', '7.2 Qubits')."),
  temporalStability: z.string().describe("A fictional 'Temporal Stability' percentage (e.g., '99.8%')."),
  aethericConsumption: z.string().describe("A fictional 'Aetheric Consumption' value with units (e.g., '14.2μA', 'High')."),
  summary: z.string().describe("A brief, one or two sentence summary of the code's fictional performance profile."),
});
export type ProfileCodeOutput = z.infer<typeof ProfileCodeOutputSchema>;

// For news-feed-flow.ts
export const NewsItemSchema = z.object({
  title: z.string().describe('A compelling, futuristic news headline.'),
  source: z.string().describe("The fictional source of the news (e.g., 'CyberNet Times', 'Galactic Herald')."),
  timestamp: z.string().describe("A relative timestamp (e.g., '5m ago', '2h ago')."),
  content: z.string().describe("The full text content of the news article, 2-3 paragraphs long. Use markdown for formatting if appropriate (e.g., line breaks)."),
});
export type NewsItem = z.infer<typeof NewsItemSchema>;

export const NewsFeedOutputSchema = z.object({
  articles: z.array(NewsItemSchema),
});
export type NewsFeedOutput = z.infer<typeof NewsFeedOutputSchema>;
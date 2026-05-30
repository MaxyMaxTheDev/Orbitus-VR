# Firebase Studio

This is a NextJS starter in Firebase Studio.

## Getting Started

To get started, download the source code by going back to the main repo page (github.com/MaxyMaxTheDev/studio), clicking the dropdown button on the Code button and click ZIP and extracting the zip to a new empty folder and run this command: cd /path/to/your_extracted_folder. You can also just use Git like this: git clone https://github.com/MaxyMaxTheDev/studio.git. Or you can fork this repo. When you are done, take a look at `src/app/page.tsx`.

## Vercel Environment Variables

This project reads API keys and deployment-specific secrets from Vercel Environment Variables. Add these values in your Vercel project settings before deploying. For local development, you can run `vercel env pull .env.local` to download the same values into your machine.

### Google GenAI

Obtain an API key from [Google AI Studio](https://aistudio.google.com/apikey), then add:

```env
GOOGLE_GENAI_API_KEY="YOUR_GOOGLE_GENAI_API_KEY_HERE"
```

### SendGrid (for Password Recovery)

Obtain an API key from [SendGrid](https://app.sendgrid.com/settings/api_keys) and verify a sender identity in SendGrid, then add:

```env
SENDGRID_API_KEY="YOUR_SENDGRID_API_KEY_HERE"
SENDGRID_FROM_EMAIL="noreply@yourdomain.com"
```

### Google OAuth / NextAuth.js

Create OAuth credentials in Google Cloud and generate a `NEXTAUTH_SECRET` with a command such as `openssl rand -base64 32`, then add:

```env
GOOGLE_CLIENT_ID="YOUR_GOOGLE_CLIENT_ID_HERE"
GOOGLE_CLIENT_SECRET="YOUR_GOOGLE_CLIENT_SECRET_HERE"
NEXTAUTH_SECRET="YOUR_RANDOMLY_GENERATED_SECRET_HERE"
NEXTAUTH_URL="https://your-vercel-domain.vercel.app"
```

Make sure `NEXTAUTH_URL` matches your deployed Vercel URL and that the matching callback URL is listed in Google Cloud OAuth Authorized redirect URIs.

### Firebase Web App

Firebase client configuration is read from Vercel public environment variables:

```env
NEXT_PUBLIC_FIREBASE_API_KEY="YOUR_FIREBASE_WEB_API_KEY"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="YOUR_PROJECT.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="YOUR_PROJECT_ID"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="YOUR_PROJECT.firebasestorage.app"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="YOUR_SENDER_ID"
NEXT_PUBLIC_FIREBASE_APP_ID="YOUR_FIREBASE_APP_ID"
```

# Firebase Studio

This is a NextJS starter in Firebase Studio.

## Getting Started

To get started, take a look at `src/app/page.tsx`.

## Environment Setup

This project uses AI features and email recovery. To enable them, you need to provide API keys.

1.  Create a file named `.env` in the root of the project if it doesn't already exist.
2.  Add the following lines to your `.env` file, replacing the placeholder values with your actual keys.

### Google AI (for Gemini)

*   Obtain an API key from [Google AI Studio](https://aistudio.google.com/app/apikey).

```
GOOGLE_API_KEY="YOUR_GEMINI_API_KEY_HERE"
```

### SendGrid (for Password Recovery)

*   Obtain an API key from [SendGrid](https://app.sendgrid.com/settings/api_keys).
*   Verify a sender identity in SendGrid to use as the "from" email.

```
SENDGRID_API_KEY="YOUR_SENDGRID_API_KEY_HERE"
SENDGRID_FROM_EMAIL="noreply@yourdomain.com"
```

### NextAuth.js Configuration

*   A `NEXTAUTH_SECRET` is used to sign session cookies. You can generate a random string for this. A quick way is to run `openssl rand -base64 32` in your terminal.
*   You also need to provide the canonical URL of your deployment.

```
NEXTAUTH_SECRET="YOUR_RANDOMLY_GENERATED_SECRET_HERE"
NEXTAUTH_URL="https://9000-firebase-studio-1751585948550.cluster-joak5ukfbnbyqspg4tewa33d24.cloudworkstations.dev"
```

Make sure the `NEXTAUTH_URL` matches the URL you are using to access the application.

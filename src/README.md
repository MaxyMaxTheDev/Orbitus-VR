# Firebase Studio

This is a NextJS starter in Firebase Studio.

## Getting Started

To get started, take a look at `src/app/page.tsx`.

## Environment Setup

This project uses AI features, Google Authentication, and SendGrid email recovery. To enable these features, you need to provide API keys.

1.  Create a file named `.env` in the root of the project if it doesn't already exist.
2.  Add the following lines to your `.env` file, replacing the placeholder values with your actual keys.

### Groq AI

*   Obtain an API key from [Groq Console](https://console.groq.com/keys).

```
GROQ_API_KEY="YOUR_GROQ_API_KEY_HERE"
```

### SendGrid (for Password Recovery)

*   Obtain an API key from [SendGrid](https://app.sendgrid.com/settings/api_keys).
*   Verify a sender identity in SendGrid.

```
SENDGRID_API_KEY="YOUR_SENDGRID_API_KEY_HERE"
SENDGRID_FROM_EMAIL="noreply@yourdomain.com"
```

### Google Authentication (for Mail App)

*   Go to the [Google Cloud Console](https://console.cloud.google.com/apis/credentials) to create OAuth 2.0 credentials.
*   You will need a **Client ID** and a **Client Secret**.

```
GOOGLE_CLIENT_ID="YOUR_GOOGLE_CLIENT_ID_HERE"
GOOGLE_CLIENT_SECRET="YOUR_GOOGLE_CLIENT_SECRET_HERE"
```

### NextAuth.js Configuration

*   `next-auth` requires a secret key to sign session cookies. You can generate a random string for this. A quick way is to run `openssl rand -base64 32` in your terminal.
*   You also need to provide the canonical URL of your deployment.

```
NEXTAUTH_SECRET="YOUR_RANDOMLY_GENERATED_SECRET_HERE"
NEXTAUTH_URL="https://9000-firebase-studio-1751585948550.cluster-joak5ukfbnbyqspg4tewa33d24.cloudworkstations.dev"
```

Make sure the `NEXTAUTH_URL` matches the URL you are using to access the application, and that this URL is listed in your Google Cloud OAuth "Authorized redirect URIs".

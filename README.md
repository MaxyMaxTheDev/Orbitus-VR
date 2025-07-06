# Firebase Studio

This is a NextJS starter in Firebase Studio.

## Getting Started

To get started, take a look at `src/app/page.tsx`.

## Environment Setup

This project uses AI features. To enable them, you need to provide a Google AI API key.

1.  Create a file named `.env` in the root of the project if it doesn't already exist.
2.  Add the following lines to your `.env` file, replacing the placeholder value with your actual key.

### Google AI (for Gemini)

*   Obtain an API key from [Google AI Studio](https://aistudio.google.com/app/apikey).

```
GOOGLE_API_KEY="YOUR_GEMINI_API_KEY_HERE"
```

*   A `NEXTAUTH_SECRET` is used to sign session cookies. This is not strictly required for this app anymore, but it's good practice. You can generate a random string for this. A quick way is to run `openssl rand -base64 32` in your terminal.
*   You also need to provide the canonical URL of your deployment.

```
NEXTAUTH_SECRET="YOUR_RANDOMLY_GENERATED_SECRET_HERE"
NEXTAUTH_URL="https://9000-firebase-studio-1751585948550.cluster-joak5ukfbnbyqspg4tewa33d24.cloudworkstations.dev"
```

Make sure the `NEXTAUTH_URL` matches the URL you are using to access the application.

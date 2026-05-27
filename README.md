# Firebase Studio

This is a NextJS starter in Firebase Studio.

## Getting Started

To get started, download the source code by going back to the main repo page (github.com/MaxyMaxTheDev/studio), clicking the dropdown button on the Code button and click ZIP and extracting the zip to a new empty folder and run this command: cd /path/to/your_extracted_folder. You can also just use Git like this: git clone https://github.com/MaxyMaxTheDev/studio.git. Or you can fork this repo. When you are done, take a look at `src/app/page.tsx`.

## Environment Setup

This project uses AI slop features and email recovery. To enable them, you need to provide API keys.

1.  Create a file named `.env` in the root of the project if it doesn't already exist.
2.  Add the following lines to your `.env` file, replacing the placeholder values with your actual keys.

### Groq AI

*   Obtain an API key from [Groq Console](https://console.groq.com/keys).

```
GROQ_API_KEY="YOUR_GROQ_API_KEY_HERE"
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
NEXTAUTH_URL="localhost:PORT"
```

Make sure the `NEXTAUTH_URL` matches the URL you are using to access the application.

# OrbitusVR

This is a NextJS virtual reality desktop environment.

## Getting Started

To get started, download the source code by going back to the main repo page (github.com/MaxyMaxTheDev/studio), clicking the dropdown button on the Code button and click ZIP and extracting the zip to a new empty folder and run this command: cd /path/to/your_extracted_folder. You can also just use Git like this: git clone https://github.com/MaxyMaxTheDev/studio.git. Or you can fork this repo. When you are done, take a look at `src/app/page.tsx`.


## Local Accounts

OrbitusVR stores app login and signup identities in the browser under the `users.json` data key, seeded by `src/data/users.json`. This replaces Firebase Authentication for the desktop login flow.

## Vercel Environment Variables

This project reads API keys and deployment-specific secrets from Vercel Environment Variables. Add these values in your Vercel project settings before deploying. For local development, you can run `vercel env pull .env.local` to download the same values into your machine.

### Gemini AI

Obtain an API key from [Google AI Studio](https://aistudio.google.com/apikey), then add:

```env
GEMINI_API_KEY="YOUR_GEMINI_API_KEY_HERE"
```

### SendGrid (for Password Recovery)

Obtain an API key from [SendGrid](https://app.sendgrid.com/settings/api_keys) and verify a sender identity in SendGrid, then add:

```env
SENDGRID_API_KEY="YOUR_SENDGRID_API_KEY_HERE"
SENDGRID_FROM_EMAIL="noreply@yourdomain.com"
```


### AccuWeather (for Weather)

Obtain an API key from [AccuWeather](https://developer.accuweather.com/), then add:

```env
ACCUWEATHER_API_KEY="YOUR_ACCUWEATHER_API_KEY_HERE"
```

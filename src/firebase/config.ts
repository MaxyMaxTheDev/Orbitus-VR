import type { FirebaseOptions } from 'firebase/app';

// ERROR: The API Key below is not valid.
//
// To fix this, you must:
// 1. Go to your Firebase project console: https://console.firebase.google.com/project/nexus-portal-ei12t/settings/general
// 2. In the "Your apps" card, find your web app.
// 3. Select "Config" to see your firebaseConfig object.
// 4. Copy the entire object and paste it here, replacing the placeholder below.
export const firebaseConfig: FirebaseOptions = {
  apiKey: "REPLACE_WITH_YOUR_API_KEY",
  authDomain: "nexus-portal-ei12t.firebaseapp.com",
  projectId: "nexus-portal-ei12t",
  storageBucket: "nexus-portal-ei12t.appspot.com",
  messagingSenderId: "REPLACE_WITH_YOUR_MESSAGING_SENDER_ID",
  appId: "REPLACE_WITH_YOUR_APP_ID",
};

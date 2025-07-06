
"use client";

import { ServerCrash } from 'lucide-react';

export function MailApp() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 p-8 text-center">
      <ServerCrash className="h-16 w-16 text-destructive" />
      <h2 className="text-2xl font-bold text-foreground">Gmail Integration Unavailable</h2>
      <p className="max-w-md text-muted-foreground">
        Direct Gmail integration is not currently supported due to Google's security policies that prevent sign-in from embedded frames (iframes).
      </p>
      <p className="text-sm text-muted-foreground">
        We are exploring alternative solutions for future updates.
      </p>
    </div>
  );
}

import { NextResponse } from 'next/server';

// The client polls this to detect that a newer Vercel deployment is live.
// VERCEL_GIT_COMMIT_SHA is injected per-deployment, so it changes whenever a
// new commit is promoted. Never cache it, or clients will keep seeing the old id.
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const buildId =
    process.env.VERCEL_GIT_COMMIT_SHA?.trim() ||
    process.env.VERCEL_GIT_COMMIT_REF?.trim() ||
    null;

  return NextResponse.json(
    { buildId },
    {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    },
  );
}

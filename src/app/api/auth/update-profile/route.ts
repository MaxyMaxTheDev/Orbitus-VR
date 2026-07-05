import { NextResponse } from 'next/server';
import { readUsers, writeUsers } from '@/lib/users-store';

export async function POST(request: Request) {
  try {
    const { uid, displayName } = await request.json();

    if (!uid) {
      return NextResponse.json({ error: 'UID is required.' }, { status: 400 });
    }

    const users = await readUsers();
    const user = users.find((u) => u.uid === uid);

    if (!user) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

    if (displayName !== undefined) {
      user.displayName = displayName;
    }

    await writeUsers(users);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

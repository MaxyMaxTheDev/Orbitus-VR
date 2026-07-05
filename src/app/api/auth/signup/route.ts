import { NextResponse } from 'next/server';
import { readUsers, writeUsers, generateUid } from '@/lib/users-store';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    const users = await readUsers();

    if (users.find((u) => u.email === email)) {
      return NextResponse.json({ error: 'Email already in use.', code: 'auth/email-already-in-use' }, { status: 409 });
    }

    const newUser = {
      uid: generateUid(),
      email,
      password,
      displayName: email.split('@')[0],
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    await writeUsers(users);

    return NextResponse.json({
      user: {
        uid: newUser.uid,
        email: newUser.email,
        displayName: newUser.displayName,
      },
    });
  } catch {
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

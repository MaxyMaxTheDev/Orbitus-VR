import { NextResponse } from 'next/server';
import { readUsers } from '@/lib/users-store';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    const users = await readUsers();
    const user = users.find((u) => u.email === email);

    if (!user) {
      return NextResponse.json({ error: 'User not found.', code: 'auth/user-not-found' }, { status: 401 });
    }

    if (user.password !== password) {
      return NextResponse.json({ error: 'Wrong password.', code: 'auth/wrong-password' }, { status: 401 });
    }

    return NextResponse.json({
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
      },
    });
  } catch {
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

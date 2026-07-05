'use client';

import { useEffect, useState, useCallback } from 'react';

export interface LocalUser {
  uid: string;
  email: string;
  displayName: string;
}

interface AuthState {
  user: LocalUser | null;
  isLoading: boolean;
}

let listeners: Array<() => void> = [];
let currentState: AuthState = { user: null, isLoading: true };

function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}

function loadFromStorage(): LocalUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem('orbitus-auth-user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveToStorage(user: LocalUser | null) {
  if (typeof window === 'undefined') return;
  if (user) {
    localStorage.setItem('orbitus-auth-user', JSON.stringify(user));
  } else {
    localStorage.removeItem('orbitus-auth-user');
  }
}

async function apiCall<T>(path: string, body: Record<string, unknown>): Promise<T> {
  const res = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) {
    const err = new Error(data.error || 'Request failed') as Error & { code?: string };
    err.code = data.code;
    throw err;
  }
  return data as T;
}

export async function signInWithEmailAndPassword(email: string, password: string): Promise<{ user: LocalUser }> {
  const data = await apiCall<{ user: LocalUser }>('/api/auth/signin', { email, password });
  currentState = { ...currentState, user: data.user };
  saveToStorage(data.user);
  emitChange();
  return data;
}

export async function createUserWithEmailAndPassword(email: string, password: string): Promise<{ user: LocalUser }> {
  const data = await apiCall<{ user: LocalUser }>('/api/auth/signup', { email, password });
  currentState = { ...currentState, user: data.user };
  saveToStorage(data.user);
  emitChange();
  return data;
}

export async function updateProfile(updates: { displayName?: string }): Promise<void> {
  const current = currentState.user;
  if (!current) throw new Error('No user logged in');
  await apiCall('/api/auth/update-profile', { uid: current.uid, ...updates });
  const updatedUser = { ...current, ...updates };
  currentState = { ...currentState, user: updatedUser };
  saveToStorage(updatedUser);
  emitChange();
}

export function onAuthStateChanged(callback: (user: LocalUser | null) => void): () => void {
  const listener = () => callback(currentState.user);
  listeners.push(listener);

  if (currentState.isLoading) {
    const user = loadFromStorage();
    currentState = { user, isLoading: false };
    emitChange();
  } else {
    callback(currentState.user);
  }

  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

export function getCurrentUser(): LocalUser | null {
  return currentState.user;
}

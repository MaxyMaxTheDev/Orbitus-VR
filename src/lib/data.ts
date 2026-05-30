import { get, set } from '@/lib/idb';
import type { UserDataType } from '@/lib/types';

function userDataKey(uid: string): string {
  return `orbitus-vr-user-data-${uid}`;
}

export async function getUserData(uid: string): Promise<UserDataType | undefined> {
  return get<UserDataType>(userDataKey(uid));
}

export async function setUserData(uid: string, data: UserDataType): Promise<void> {
  await set(userDataKey(uid), data);
}

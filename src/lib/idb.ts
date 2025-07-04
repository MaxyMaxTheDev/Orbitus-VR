
import { openDB, type DBSchema, type IDBPDatabase } from 'idb';

const DB_NAME = 'nexusvr-db';
const DB_VERSION = 1;
const STORE_NAME = 'settings';

interface NexusVRDBSchema extends DBSchema {
  [STORE_NAME]: {
    key: string;
    value: any;
  };
}

let dbPromise: Promise<IDBPDatabase<NexusVRDBSchema>> | null = null;

function getDb() {
    if (!dbPromise) {
        dbPromise = openDB<NexusVRDBSchema>(DB_NAME, DB_VERSION, {
            upgrade(db) {
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    db.createObjectStore(STORE_NAME);
                }
            },
        });
    }
    return dbPromise;
}

export async function get<T>(key: string): Promise<T | undefined> {
  const db = await getDb();
  return db.get(STORE_NAME, key);
}

export async function set(key: string, val: any): Promise<IDBValidKey> {
  const db = await getDb();
  return db.put(STORE_NAME, val, key);
}

export async function del(key: string): Promise<void> {
  const db = await getDb();
  return db.delete(STORE_NAME, key);
}

export async function clearAll(): Promise<void> {
  const db = await getDb();
  return db.clear(STORE_NAME);
}

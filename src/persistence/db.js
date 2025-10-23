import { MongoClient } from 'mongodb';

let client;
let db;

export async function connectToDb() {
  if (db) return db;
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI is not set. See .env.example');
  }
  client = new MongoClient(uri);
  await client.connect();
  db = client.db('assignment3');
  await db.collection('albums').createIndex({ _id: 1 });
  await db.collection('photos').createIndex({ albumId: 1 });
  return db;
}

export function getDb() {
  if (!db) throw new Error('DB not initialized. Call connectToDb() first.');
  return db;
}

export async function closeDb() {
  if (client) {
    await client.close();
    client = undefined;
    db = undefined;
  }
}

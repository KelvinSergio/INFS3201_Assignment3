// seed.js
import dotenv from 'dotenv';
import { connectToDb, getDb, closeDb } from './src/persistence/db.js';

dotenv.config();

async function main() {
  try {
    await connectToDb();
    const db = getDb();

    // Minimal sample data — adjust as you like
    const albums = [
      { _id: 'a1', title: 'Summer Trip', description: 'Beach & sunsets' },
      { _id: 'a2', title: 'Family', description: 'Family moments' },
      { _id: 'a3', title: 'Nature', description: 'Forests and mountains' }
    ];

    const photos = [
      { _id: 'p1', albumId: 'a1', title: 'Sunset 01', description: 'Orange sky', filename: 'sunset01.jpg' },
      { _id: 'p2', albumId: 'a1', title: 'Sunset 02', description: 'Golden hour', filename: 'sunset02.jpg' },
      { _id: 'p3', albumId: 'a2', title: 'Family Portrait', description: 'At the park', filename: 'family01.jpg' },
      { _id: 'p4', albumId: 'a3', title: 'Deep Forest', description: 'Misty morning', filename: 'forest01.jpg' }
    ];

    // Upsert to avoid duplicates if you run seed twice
    for (let i = 0; i < albums.length; i++) {
      const a = albums[i];
      await db.collection('albums').updateOne({ _id: a._id }, { $set: a }, { upsert: true });
    }
    for (let i = 0; i < photos.length; i++) {
      const p = photos[i];
      await db.collection('photos').updateOne({ _id: p._id }, { $set: p }, { upsert: true });
    }

    console.log('Seeded albums and photos ✅');
  } catch (err) {
    console.error('Seeding failed:', err);
  } finally {
    await closeDb();
  }
}

main();

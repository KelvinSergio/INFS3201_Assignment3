import { getDb } from '../persistence/db.js';

export async function getPhotoById(photoId) {
  const db = getDb();
  return db.collection('photos').findOne({ _id: photoId });
}

export async function updatePhoto(photoId, payload) {
  const db = getDb();
  const title = typeof payload.title === 'string' ? payload.title.trim() : '';
  const description =
    typeof payload.description === 'string' ? payload.description.trim() : '';

  if (title.length === 0) return { ok: false, error: 'Title is required.' };
  if (title.length > 200) return { ok: false, error: 'Title must be ≤ 200 chars.' };
  if (description.length > 1000) return { ok: false, error: 'Description must be ≤ 1000 chars.' };

  const res = await db.collection('photos').updateOne(
    { _id: photoId },
    { $set: { title, description } }
  );

  if (res.matchedCount !== 1) return { ok: false, error: 'Photo not found.' };
  return { ok: true };
}

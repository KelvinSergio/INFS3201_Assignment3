import { getDb } from '../persistence/db.js';

export async function getAllAlbums() {
  const db = getDb();
  const cursor = db.collection('albums').find({});
  const albums = [];
  for await (const doc of cursor) {
    albums.push(doc);
  }
  return albums;
}

export async function getAlbumById(albumId) {
  const db = getDb();
  return db.collection('albums').findOne({ _id: albumId });
}

export async function countPhotosInAlbum(albumId) {
  const db = getDb();
  return db.collection('photos').countDocuments({ albumId });
}

export async function getPhotosForAlbum(albumId) {
  const db = getDb();
  const cursor = db
    .collection('photos')
    .find({ albumId })
    .project({ _id: 1, title: 1, filename: 1 }); // <-- include filename
  const photos = [];
  for await (const doc of cursor) {
    photos.push(doc);
  }
  return photos;
}

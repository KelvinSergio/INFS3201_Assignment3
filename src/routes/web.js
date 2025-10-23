import { Router } from 'express';
import {
  getAllAlbums,
  getAlbumById,
  countPhotosInAlbum,
  getPhotosForAlbum
} from '../business/albumsService.js';
import { getPhotoById, updatePhoto } from '../business/photosService.js';

const router = Router();

// Home -> list albums
router.get('/', async (req, res) => {
  try {
    const albums = await getAllAlbums();

    // Enrich with photo counts (no .map/.filter)
    const list = [];
    for (let i = 0; i < albums.length; i++) {
      const a = albums[i];
      const total = await countPhotosInAlbum(a._id);
      list.push({ _id: a._id, title: a.title, description: a.description || '', count: total });
    }

    res.render('albums', { albums: list });
  } catch (e) {
    res.status(500).send('Server error');
  }
});

// Album details -> photos list
router.get('/albums/:albumId', async (req, res) => {
  try {
    const albumId = req.params.albumId;
    const album = await getAlbumById(albumId);
    if (!album) return res.status(404).send('Album not found');

    const photos = await getPhotosForAlbum(albumId);
    res.render('albumDetails', { album, photos });
  } catch (e) {
    res.status(500).send('Server error');
  }
});

// Photo details
router.get('/photos/:photoId', async (req, res) => {
  try {
    const photo = await getPhotoById(req.params.photoId);
    if (!photo) return res.status(404).send('Photo not found');
    res.render('photoDetails', { photo });
  } catch (e) {
    res.status(500).send('Server error');
  }
});

// Photo edit form
router.get('/photos/:photoId/edit', async (req, res) => {
  try {
    const photo = await getPhotoById(req.params.photoId);
    if (!photo) return res.status(404).send('Photo not found');
    res.render('photoEdit', { photo });
  } catch (e) {
    res.status(500).send('Server error');
  }
});

// Photo edit submit
router.post('/photos/:photoId/edit', async (req, res) => {
  try {
    const photoId = req.params.photoId;
    const payload = { title: req.body.title || '', description: req.body.description || '' };
    const result = await updatePhoto(photoId, payload);

    if (!result.ok) {
      const photo = await getPhotoById(photoId);
      return res.status(400).render('photoEdit', { photo, error: result.error });
    }
    res.redirect('/photos/' + photoId);
  } catch (e) {
    res.status(500).send('Server error');
  }
});

export default router;

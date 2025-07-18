import express from 'express';
import { addReleasePost, getReleasePosts } from '../controllers/releasePostController';



const router = express.Router();

router.get('/', getReleasePosts);
router.post('/addPost', addReleasePost);

export default router;

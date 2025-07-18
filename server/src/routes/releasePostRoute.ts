import express from 'express';
import { addReleasePost, deleteReleasePost, getReleasePosts } from '../controllers/releasePostController';



const router = express.Router();

router.get('/', getReleasePosts);
router.post('/addPost', addReleasePost);
router.delete('/:postId', deleteReleasePost);

export default router;

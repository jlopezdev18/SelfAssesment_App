import express from 'express';
import { addReleasePost } from '../controllers/releasePostController';


const router = express.Router();

router.post('/addPost', addReleasePost);

export default router;

import { Router } from 'express';
import {
  addPostController,
  getAllPostsController,
  purchasePostController,
} from '../controller/post.controller.js';
import multer from 'multer';

export const postRouter = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
});

const upload = multer({ storage: storage });

postRouter.post('/add', upload.single('image'), addPostController);
postRouter.get('/all', getAllPostsController);
postRouter.post('/purchase', purchasePostController);

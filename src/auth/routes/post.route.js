import { Router } from 'express';
import { addPostController } from '../controller/post.controller.js';
import multer from 'multer';

export const postRouter = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now());
  },
});

const upload = multer({ storage: storage });

postRouter.post('/add', upload.single('image'), addPostController);

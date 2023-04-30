import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { ENVIRONMENT } from './src/config/configuration.js';
import appRouter from './src/route/index.js';
import mongoose from "mongoose";
import * as dotenv from 'dotenv'

dotenv.config()
const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('/', appRouter);

app.listen(ENVIRONMENT.port, () => {
  console.log(`Server started in port ${ENVIRONMENT.port}`);

  mongoose
    .connect(ENVIRONMENT.dbString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: ENVIRONMENT.dbName,
    })
    .then(() => {
      console.log('Connected to mongodb');
    })
    .catch((err) => {
      console.error(err);
    });
});

import path from 'path';
import express from 'express';
import cors from 'cors';
import { tweetsRouter, authRouter, membersRouter } from './routes';
import { error } from './middleware/error';
import { initPassport } from './utils/passport';

initPassport();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/public', express.static(path.join(__dirname, 'static')));

app.use(tweetsRouter);
app.use(membersRouter);
app.use(authRouter);

app.use(error);

export default app;
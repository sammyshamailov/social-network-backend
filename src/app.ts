import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import path from 'path';

import { error } from './middleware/error';
import { authRouter, membersRouter, tweetsRouter } from './routes';
import { initPassport } from './utils/passport';

initPassport();

const app = express();

app.use(cors());
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({extended: true}));
app.use('/static', express.static(path.join(__dirname, 'static')));

app.use(tweetsRouter);
app.use(membersRouter);
app.use(authRouter);

app.use(error);

export default app;
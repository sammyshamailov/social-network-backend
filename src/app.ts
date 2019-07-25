import express from 'express';
import cors from 'cors';
import { router as productsRouter } from './routes/products';
// import { logMiddleware } from './middleware/log';
//import { logErrors, clientErrorHandler, errorHandler } from './middleware/error';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

//app.use(logMiddleware);

// app.get('/api/test', (req, res) => res.send('Hello Express'));
app.use('/products', productsRouter);

// app.use(logErrors);
// app.use(clientErrorHandler);
// app.use(errorHandler);

export { app };

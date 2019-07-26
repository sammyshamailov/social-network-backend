import express from 'express';
import cors from 'cors';
import { router as productsRouter } from './routes/products';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use('/products', productsRouter);


export { app };

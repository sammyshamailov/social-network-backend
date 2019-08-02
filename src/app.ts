import express from 'express';
import cors from 'cors';
import { router as productsRouter } from './routes/products';
import { router as categoriesRouter } from './routes/categories';
import { inputError } from './middleware/error';
import path from 'path';


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use('/public', express.static(path.join(__dirname, 'static')));

app.use('/products', productsRouter);
app.use('/categories', categoriesRouter);

app.use(inputError);


export { app };

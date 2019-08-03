import express from 'express';
import cors from 'cors';
// // import { router as productsRouter } from './routes/products';
// import { router as categoriesRouter } from './routes/categories';
import { inputError } from './middleware/error';
import path from 'path';
import { initConfig } from './utils/config';
import productsRouter from './routes/products.routes';
import categoriesRouter from './routes/categories.routes'

initConfig();


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use('/public', express.static(path.join(__dirname, 'static')));

categoriesRouter(app);
productsRouter(app);

app.use(inputError);


export { app };

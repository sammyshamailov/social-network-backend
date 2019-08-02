import { Application } from 'express';
import * as productsController from '../controllers/products.controller';

function router(app: Application) {
  app.get('/products', productsController.getAll);

  app.get('/products/:id', productsController.getById);

  app.post('/products', productsController.add);

  app.put('/products/:id', productsController.update);

  app.delete('/products/:id', productsController.remove);
}

export default router;
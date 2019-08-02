import { Application } from 'express';
import * as categoriesController from '../controllers/categories.controller';

function router(app: Application) {
  app.get('/categories', categoriesController.getAll);

  app.get('/categories/:id', categoriesController.getById);

  app.get('/categories/:id/products', categoriesController.getProductsById);

  app.post('/categories', categoriesController.add);

  app.put('/categories/:id', categoriesController.update);

  app.delete('/categories/:id', categoriesController.remove);
}

export default router;

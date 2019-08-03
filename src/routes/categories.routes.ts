import { Application } from 'express';
import * as categoriesController from '../controllers/categories.controller';
import { idValidation } from '../middleware/validation';

function router(app: Application) {
  app.get('/categories', categoriesController.getAll);

  app.get('/categories/:id', idValidation, categoriesController.getById);

  app.get('/categories/:id/products', idValidation, categoriesController.getProductsById);

  app.post('/categories', categoriesController.add);

  app.put('/categories/:id', idValidation, categoriesController.update);

  app.delete('/categories/:id', idValidation, categoriesController.remove);
}

export default router;

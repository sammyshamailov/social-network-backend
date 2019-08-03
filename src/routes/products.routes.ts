import { Application } from 'express';
import * as productsController from '../controllers/products.controller';
import { idValidation, nameValidation } from '../middleware/validation';

function router(app: Application) {
  app.get('/products', productsController.getAll);

  app.get('/products/:id', idValidation, productsController.getById);

  app.post('/products', nameValidation, productsController.add);

  app.put('/products/:id', idValidation, nameValidation,  productsController.update);

  app.delete('/products/:id', idValidation, productsController.remove);
}

export default router;
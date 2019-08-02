import { Request, Response, NextFunction, Router } from 'express';
import {Product } from '../models';
import uuidv1 from 'uuid/v1';
import { nameValidation, idValidation } from '../middleware/validation';
import { products } from '../store/index';

function loadProducts(): Promise<Product[]> {
  return Promise.resolve(products);
}

function findProductIndex(req: Request, res: Response, next: NextFunction) {
  const id = req.params.id;
  const matchingIndex = products.findIndex(o => o.id === id);

  if (matchingIndex < 0) {
    res.sendStatus(404);
    return;
  }

  res.locals.matchingIndex = matchingIndex;
  res.locals.productId = id;
  next();
}

const router = Router();

router.get('/', async (req, res) => {
  res.send(products);
});

router.get('/:id',
  idValidation,
  (req, res, next) => {
    const id = req.params.id;
    loadProducts()
      .then(products => {
        const matching = products.find(o => o.id === id);

        if (!matching) {
          res.sendStatus(404);
          return;
        }

        res.send(matching);
      })
      .catch(next);
  });

router.post('/',
  nameValidation,
  (req, res) => {

    const product: Product = req.body;

    product.id = uuidv1();

    if (!product.categoryId) {
      product.categoryId = uuidv1();
    }

    products.push(product);
    res.status(201).send(product);
  });

router.put('/:id',
  idValidation,
  nameValidation,
  findProductIndex,
  (req, res) => {

    const { productId, matchingIndex } = res.locals;
    const product: Product = req.body;

    product.id = productId;
    products[matchingIndex] = product;

    res.send(product);
  },
);

router.delete('/:id',
  idValidation,
  findProductIndex,
  (req, res) => {

    products.splice(res.locals.matchingIndex, 1);

    res.sendStatus(204);
  },
);

export { router };

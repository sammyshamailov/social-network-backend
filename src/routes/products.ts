import { Request, Response, NextFunction, Router } from 'express';
import { ProductData, Product } from '../models';
import uuidv1 from 'uuid/v1';

const products: Product[] = ProductData;
  
  
function findProductIndex(req: Request, res: Response, next: NextFunction) {
  const id = req.params.id;
  const matchingIndex = products.findIndex(o => o.id === id);
  
  if (id.length < 36){
    res.sendStatus(404);
    return;
  }

  else if (matchingIndex < 0) {
    res.sendStatus(400);
    return;
  }
  
  res.locals.matchingIndex = matchingIndex;
  res.locals.productId = id;
  next();
}
  
const router = Router();
  
router.get('/', (req, res) => {
  res.send(products);
});

router.get('/:id', (req, res) => {
  const id = req.params.id;
  const matching = products.find(o => o.id === id);
  
  if (id.length < 36){
    res.sendStatus(404);
    return;
  }

  else if (!matching) {
    res.sendStatus(400);
    return;
  }
  
  res.send(matching);
});
  
router.post('/', (req, res) => {
  const product: Product = req.body;

  if((!product.name) || (product.name.length < 3)){
    res.sendStatus(409);
    return;
  }
  
  product.id = uuidv1();

  if(!product.categoryId){
    product.categoryId = uuidv1();
  }

  products.push(product);
  res.status(201).send(product);
});
  
router.put('/:id',
  findProductIndex,
  (req, res) => {
    const { productId, matchingIndex } = res.locals;
  
    const product: Product = req.body;

    if((!product.name) || (product.name.length < 3)){
      res.sendStatus(409);
      return;
    }

    product.id = productId;
    products[matchingIndex] = product;
  
    res.send(product);
  },
);
  
router.delete('/:id',
  findProductIndex,
  (req, res) => {
    products.splice(res.locals.matchingIndex, 1);
  
    res.sendStatus(204);
  },
);
  
export { router };
  
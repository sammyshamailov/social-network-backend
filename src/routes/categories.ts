import { Request, Response, NextFunction, Router } from 'express';
import { CategoryData, Category, Product, ProductData } from '../models';
import uuidv1 from 'uuid/v1';
import { idValidation } from '../middleware/validation';

const categories: Category[] = CategoryData;
const products: Product[] = ProductData;

function loadCategories(): Promise<Category[]> {
  return Promise.resolve(categories);
}

function wrapAsyncAndSend(
  handler: (req: Request, res: Response, next?: NextFunction) => Promise<Category[]>,
): (req: Request, res: Response, next: NextFunction) => void {
  return (req: Request, res: Response, next?: NextFunction) => {
    handler(req, res, next)
      .then(data => {
        const id = req.params.id;
        const matching = data.find(o => o.id === id);
    
        if (!matching) {
          res.sendStatus(404);
          return;
          // throw new Error('test');
        }
        res.send(matching);
      })
      .catch(next);
  };
}

function findCategoryIndex(req: Request, res: Response, next: NextFunction) {
  const id = req.params.id;
  const matchingIndex = categories.findIndex(o => o.id === id);

  if (matchingIndex < 0) {
    res.sendStatus(404);
    return;
  }

  res.locals.matchingIndex = matchingIndex;
  res.locals.categoryId = id;
  next();
}

const router = Router();

router.get('/', (req, res) => {
  res.send(categories);
});

router.get('/:id',
  idValidation,
  wrapAsyncAndSend(async (req, res, next) => {
    const categories = await loadCategories();
    return categories;
  }));

router.get('/:id/products',
  idValidation,
  (req, res) => {
    const id = req.params.id;

    let productList: Product[] = [];
    for (let i: number = 0; i < products.length; i++) {
      if (products[i].categoryId === id) {
        productList.push(products[i]);
      }
    }

    if (productList.length === 0) {
      res.sendStatus(404);
      return;
    }

    res.send(productList);
  });

router.post('/', (req, res) => {
  const category: Category = req.body;

  category.id = uuidv1();
  categories.push(category);
  res.status(201).send(category);
});

router.put('/:id',
  findCategoryIndex,
  (req, res) => {
    const { categoryId, matchingIndex } = res.locals;

    const category: Category = req.body;

    category.id = categoryId;
    categories[matchingIndex] = category;

    res.send(category);
  },
);

router.delete('/:id',
  findCategoryIndex,
  (req, res) => {
    categories.splice(res.locals.matchingIndex, 1);

    res.sendStatus(204);
  },
);

export { router };

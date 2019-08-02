import { Request, Response, NextFunction, Router } from 'express';
import { Category, Product } from '../models';
import uuidv1 from 'uuid/v1';
import { idValidation } from '../middleware/validation';
import { createHttpClient } from '../utils/http-client';

const client = createHttpClient(`http://localhost:3000/public`);

let categoryData = setCategories();
let categories: Category[];

let productsData = setProducts();
let products: Product[];

function loadProducts(): Promise<Product[]> {
  return Promise.resolve(productsData);
}

function loadCategories(): Promise<Category[]> {
  return Promise.resolve(categoryData);
}

async function setProducts(): Promise<Product[]> {
  try {
    let list = await client.get('/product.json');
    return list.Product;
  }
  catch (err) {
    throw new Error(err);
  }
}

async function setCategories(): Promise<Category[]> {
  try {
    let list = await client.get('/category.json');
    return list.Category;
  }
  catch (err) {
    throw new Error(err);
  }
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

router.get('/', async (req, res) => {
  products = await loadProducts();
  categories = await loadCategories();
  res.send(categories);
});

router.get('/:id',
  idValidation,
  (req, res, next) => {
    const id = req.params.id;
    loadCategories()
      .then(categories => {
        const matching = categories.find(o => o.id === id);

        if (!matching) {
          res.sendStatus(404);
          return;
        }

        res.send(matching);
      })
      .catch(next);
  });

router.get('/:id/products',
  idValidation,
  (req, res) => {
    const id = req.params.id;

    const productList: Product[] = [];
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

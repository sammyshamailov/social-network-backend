import { Request, Response, NextFunction, Router } from 'express';
import { CategoryData, Category } from '../models';
import uuidv1 from 'uuid/v1';

const categories: Category[] = CategoryData;
  
  
function findCategoryIndex(req: Request, res: Response, next: NextFunction) {
  const id = req.params.id;
  const matchingIndex = categories.findIndex(o => o.id === id);
  
  if (id.length < 36){
    res.sendStatus(404);
    return;
  }

  else if (matchingIndex < 0) {
    res.sendStatus(400);
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

router.get('/:id', (req, res) => {
  const id = req.params.id;
  const matching = categories.find(o => o.id === id);
  
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
  const category: Category = req.body;

  if(category.name.length < 3){
    res.sendStatus(409);
    return;
  }
  
  category.id = uuidv1();
  categories.push(category);
  res.status(201).send(category);
});
  
router.put('/:id',
  findCategoryIndex,
  (req, res) => {
    const { categoryId, matchingIndex } = res.locals;
  
    const category: Category = req.body;

    if(category.name && category.name.length < 3){
      res.sendStatus(409);
      return;
    }

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
  
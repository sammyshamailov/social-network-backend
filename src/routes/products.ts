import { Request, Response, NextFunction, Router } from 'express';
import { ProductData, Product } from '../models';
import uuidv1 from 'uuid/v1';


// TODO: should be elsewhere
// const products: Product1[] = [
//     { id: "uuidv1()", name: 'CVWeb', categoryId: "uuidv3()", itemInStock:5},
//     { id: "uuidv2()", name: 'CVCloud', categoryId: "uuidv4()", itemInStock:5},
//   ];

const products: Product[] = ProductData;
console.log(products)
  
  function loadProducts(): Promise<Product[]> {
    return Promise.resolve(products);
  }
  
  // function findProjectIndex(req: Request, res: Response, next: NextFunction) {
  //   const id = req.params.id;
  //   const matchingIndex = products.findIndex(o => o.id === id);
  
  //   if (matchingIndex < 0) {
  //     res.sendStatus(404);
  //     return;
  //   }
  
  //   res.locals.matchingIndex = matchingIndex;
  //   res.locals.productId = id;
  //   next();
  // }
  
  const router = Router();
  
  function wrapAsyncAndSend(
    handler: (req: Request, res: Response, next?: NextFunction) => Promise<any>,
  ): (req: Request, res: Response, next: NextFunction) => void {
    return (req: Request, res: Response, next?: NextFunction) => {
      handler(req, res, next)
        .then(o => res.send(o))
        .catch(next);
    };
  }
  
  router.get('/', wrapAsyncAndSend(async (req, res, next) => {
    const projects = await loadProducts();
    return projects;
  }));
  
  // router.get('/:id', (req, res) => {
  //   const id = req.params.id;
  //   const matching = products.find(o => o.id === id);
  
  //   if (!matching) {
  //     res.sendStatus(404);
  //     return;
  //   }
  
  //   res.send(matching);
  // });
  
  // router.post('/', (req, res) => {
  //   const project: Product = req.body;
  //   project.id = uuidv1();
  //   products.push(project);
  
  //   res.status(201).send(project);
  // });
  
  // router.put('/:id',
  //   findProjectIndex,
  //   (req, res) => {
  //     const { projectId, matchingIndex } = res.locals;
  
  //     const project: Product = req.body;
  //     project.id = projectId;
  
  //     products[matchingIndex] = project;
  
  //     res.send(project);
  //   },
  // );
  
  // router.delete('/:id',
  //   findProjectIndex,
  //   (req, res) => {
  //     products.splice(res.locals.matchingIndex, 1);
  
  //     res.sendStatus(204);
  //   },
  // );
  
  export { router };
  
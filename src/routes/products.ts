import { Request, Response, NextFunction, Router } from 'express';
import { Product } from '../models';
import uuidv1 from 'uuid/v1';


// TODO: should be elsewhere
const productsState: Product[] = [
    { id: uuidv1(), name: 'CVWeb', categoryId: uuidv1(), itemInStock:5},
    { id: uuidv1(), name: 'CVCloud', categoryId: uuidv1(), itemInStock:5},
  ];
  
  function loadProjects(): Promise<Product[]> {
    return Promise.resolve(productsState);
  }
  
  // function findProjectIndex(req: Request, res: Response, next: NextFunction) {
  //   const id = req.params.id;
  //   const matchingIndex = projects.findIndex(o => o.id === id);
  
  //   if (matchingIndex < 0) {
  //     res.sendStatus(404);
  //     return;
  //   }
  
  //   res.locals.matchingIndex = matchingIndex;
  //   res.locals.projectId = id;
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
    const projects = await loadProjects();
    return projects;
  }));
  
  // router.get('/:id', (req, res) => {
  //   const id = req.params.id;
  //   const matching = projects.find(o => o.id === id);
  
  //   if (!matching) {
  //     res.sendStatus(404);
  //     return;
  //   }
  
  //   res.send(matching);
  // });
  
  // router.post('/', (req, res) => {
  //   const project: Project = req.body;
  //   project.id = uuidv1();
  //   projects.push(project);
  
  //   res.status(201).send(project);
  // });
  
  // router.put('/:id',
  //   findProjectIndex,
  //   (req, res) => {
  //     const { projectId, matchingIndex } = res.locals;
  
  //     const project: Project = req.body;
  //     project.id = projectId;
  
  //     projects[matchingIndex] = project;
  
  //     res.send(project);
  //   },
  // );
  
  // router.delete('/:id',
  //   findProjectIndex,
  //   (req, res) => {
  //     projects.splice(res.locals.matchingIndex, 1);
  
  //     res.sendStatus(204);
  //   },
  // );
  
  export { router };
  
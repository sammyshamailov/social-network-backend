import { Request, Response, NextFunction } from 'express';
import { Product } from '../models';
import productsService from '../services/products.service';

export function getAll(req: Request, res: Response): void {
  const products = productsService.getAll();
  res.send(products);
}

export function getById(req: Request, res: Response, next: NextFunction): void {
  const id = req.params.id;
  const product = productsService.getById(id);
  if (!product) {
    next(new Error("not-found"));
  }
  res.send(product);
}

export function add(req: Request, res: Response): void {
  const product = req.body as Product;
  const added = productsService.add(product);
  res.status(201).send(added);
}

export function update(req: Request, res: Response, next: NextFunction): void {
  const id = req.params.id;
  const product = req.body as Product;
  product.id = id;

  const updated = productsService.update(product);
  if (!updated) {
    next(new Error("not-found"));
  }
  res.send(updated);
}

export function remove(req: Request, res: Response, next: NextFunction): void {
  const id = req.params.id;
  const removed = productsService.remove(id);
  if (!removed) {
    next(new Error("not-found"));
  }
  res.sendStatus(204);
}

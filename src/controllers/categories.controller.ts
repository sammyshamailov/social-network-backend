import { Request, Response, NextFunction } from 'express';
import { Category, Product } from '../models';
import categoriesService from '../services/categories.service';

export function getAll(req: Request, res: Response): void {
  const projects = categoriesService.getAll();
  res.send(projects);
}

export function getById(req: Request, res: Response, next: NextFunction): void {
  const id = req.params.id;
  const category = categoriesService.getById(id);
  if (!category) {
    next(new Error("not-found"));
  }
  res.send(category);
}

export function getProductsById(req: Request, res: Response, next: NextFunction): void {
  const id = req.params.id;
  const productList = categoriesService.getProductsById(id);
  if (!productList) {
    next(new Error("not-found"));
  }
  res.send(productList);
}

export function add(req: Request, res: Response): void {
  const category = req.body as Category;
  const added = categoriesService.add(category);
  res.status(201).send(added);
}

export function update(req: Request, res: Response, next: NextFunction): void {
  const id = req.params.id;
  const category = req.body as Category;
  category.id = id;

  const updated = categoriesService.update(category);
  if (!updated) {
    next(new Error("not-found"));
  }
  res.send(updated);
}

export function remove(req: Request, res: Response, next: NextFunction): void {
  const id = req.params.id;
  const removed = categoriesService.remove(id);
  if (!removed) {
    next(new Error("not-found"));
  }
  res.sendStatus(204);
}

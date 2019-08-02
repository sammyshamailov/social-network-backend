import uuidv1 from 'uuid/v1';
import { Product } from '../models';
import {products} from '../store';

function getAll(): Product[] {
  return products;
}

function getById(id: string): Product | undefined {
  return products.find(p => p.id === id);
}

function add(product: Product): Product {
  product.id = uuidv1();
  if (!product.categoryId) {
    product.categoryId = uuidv1();
  }
  products.push(product);
  return product;
}

function update(product: Product): Product | undefined {
  const existing = getById(product.id);
  if (!existing) return;

  Object.assign(existing, product);
  return existing;
}

function remove(id: string): Product | undefined {
  const existingIndex = products.findIndex(o => o.id === id);
  if (existingIndex < 0) return;

  const removed = products.splice(existingIndex, 1);
  return removed[0];
}

export default {
  getAll,
  getById,
  add,
  update,
  remove,
};
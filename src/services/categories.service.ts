import uuidv1 from 'uuid/v1';
import { Product, Category } from '../models';
import { categories, products } from '../store';

function getAll(): Category[] {
    return categories;
}

function getById(id: string): Category | undefined {
    return categories.find(p => p.id === id);
}


export function getProductsById(id: string): Product[] | undefined {
    const productList: Product[] = [];
    for (let i: number = 0; i < products.length; i++) {
        if (products[i].categoryId === id) {
            productList.push(products[i]);
        }
    }

    if (productList.length === 0) return;

    return productList;
}

function add(category: Category): Category {
    category.id = uuidv1();
    categories.push(category);
    return category;
}

function update(category: Category): Category | undefined {
    const existing = getById(category.id);
    if (!existing) return;

    Object.assign(existing, category);
    return existing;
}

function remove(id: string): Category | undefined {
    const existingIndex = categories.findIndex(o => o.id === id);
    if (existingIndex < 0) return;

    const removed = categories.splice(existingIndex, 1);
    return removed[0];
}

export default {
    getAll,
    getById,
    getProductsById,
    add,
    update,
    remove,
};
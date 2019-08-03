import { createHttpClient } from '../utils/http-client';
import { Category, Product } from '../models';

let categoryData: Promise<Category[]>;
let productsData: Promise<Product[]>;
let categories: Category[];
let products: Product[];

function loadProducts(): Promise<Product[]> {
  return Promise.resolve(productsData);
}

function loadCategories(): Promise<Category[]> {
  return Promise.resolve(categoryData);
}

async function init(){
    setData();
    categories = await loadCategories();
    products = await loadProducts();
}

function setData(): void {
    categoryData = setCategories();
    productsData = setProducts();
}

async function setProducts(): Promise<Product[]> {
    try {
        const port = process.env['PORT'];
        const client = createHttpClient(`http://localhost:${port}/public`);
        let list = await client.get('/product.json');
        return list.Product;
    }
    catch (err) {
        throw new Error(err);
    }
}

async function setCategories(): Promise<Category[]> {
    try {
        const port = process.env['PORT'];
        const client = createHttpClient(`http://localhost:${port}/public`);
        let list = await client.get('/category.json');
        return list.Category;
    }
    catch (err) {
        throw new Error(err);
    }
}

export {
    categoryData,
    productsData,
    setData,
    init,
    categories,
    products
}
import { Product, Category, Brand, Order } from '../types';

const API_BASE = '/api';

export const api = {
  getProducts: async (): Promise<Product[]> => {
    const res = await fetch(`${API_BASE}/products`);
    return res.json();
  },
  getCategories: async (): Promise<Category[]> => {
    const res = await fetch(`${API_BASE}/categories`);
    return res.json();
  },
  getBrands: async (): Promise<Brand[]> => {
    const res = await fetch(`${API_BASE}/brands`);
    return res.json();
  },
  getOrders: async (): Promise<Order[]> => {
    const res = await fetch(`${API_BASE}/orders`);
    return res.json();
  },
  createOrder: async (order: Order, items: any[]) => {
    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order, items })
    });
    return res.json();
  },
  getSearchHistory: async (): Promise<string[]> => {
    const res = await fetch(`${API_BASE}/search-history`);
    return res.json();
  },
  saveSearch: async (term: string) => {
    const res = await fetch(`${API_BASE}/search-history`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ term })
    });
    return res.json();
  },
  getStats: async (): Promise<any> => {
    const res = await fetch(`${API_BASE}/stats`);
    return res.json();
  }
};

import Database from 'better-sqlite3';
import { PRODUCTS, CATEGORIES, BRANDS, MOCK_ORDERS, MOCK_CUSTOMERS } from './src/data';

const db = new Database('pharma.db');

// Create Tables
db.exec(`
  CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    icon TEXT
  );

  CREATE TABLE IF NOT EXISTS brands (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    logo TEXT
  );

  CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    brand TEXT,
    generic TEXT,
    mrp REAL,
    discountPrice REAL,
    image TEXT,
    isFlashSale INTEGER DEFAULT 0,
    isNewLaunched INTEGER DEFAULT 0,
    category TEXT,
    description TEXT,
    dosage TEXT,
    type TEXT,
    stock INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS customers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    phone TEXT,
    address TEXT,
    joinedDate TEXT,
    totalOrders INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    customerName TEXT,
    customerEmail TEXT,
    total REAL,
    status TEXT,
    date TEXT,
    trackingId TEXT
  );

  CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    orderId TEXT,
    productId TEXT,
    name TEXT,
    price REAL,
    quantity INTEGER,
    image TEXT,
    FOREIGN KEY (orderId) REFERENCES orders(id)
  );

  CREATE TABLE IF NOT EXISTS search_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    term TEXT NOT NULL,
    date TEXT NOT NULL
  );
`);

console.log('Seeding database...');

// Clear existing data
db.exec('DELETE FROM products');
db.exec('DELETE FROM categories');
db.exec('DELETE FROM brands');
db.exec('DELETE FROM orders');
db.exec('DELETE FROM customers');
db.exec('DELETE FROM order_items');

// Seed Categories
const insertCategory = db.prepare('INSERT INTO categories (id, name, icon) VALUES (?, ?, ?)');
for (const cat of CATEGORIES) {
  insertCategory.run(cat.id, cat.name, cat.icon);
}

// Seed Brands
const insertBrand = db.prepare('INSERT INTO brands (id, name, logo) VALUES (?, ?, ?)');
for (const brand of BRANDS) {
  insertBrand.run(brand.id, brand.name, brand.logo);
}

// Seed Products
const insertProduct = db.prepare(`
  INSERT INTO products (id, name, brand, generic, mrp, discountPrice, image, isFlashSale, isNewLaunched, category, description, dosage, type, stock)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);
for (const p of PRODUCTS) {
  insertProduct.run(
    p.id, p.name, p.brand, p.generic, p.mrp, p.discountPrice, p.image, 
    p.isFlashSale ? 1 : 0, 
    p.isNewLaunched ? 1 : 0, 
    p.category, p.description, p.dosage, p.type, p.stock
  );
}

// Seed Customers
const insertCustomer = db.prepare(`
  INSERT INTO customers (id, name, email, phone, address, joinedDate, totalOrders)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);
for (const c of MOCK_CUSTOMERS) {
  insertCustomer.run(c.id, c.name, c.email, c.phone, c.address, c.joinedDate, c.totalOrders);
}

// Seed Orders
const insertOrder = db.prepare(`
  INSERT INTO orders (id, customerName, customerEmail, total, status, date, trackingId)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);
for (const o of MOCK_ORDERS) {
  insertOrder.run(o.id, o.customerName, o.customerEmail, o.total, o.status, o.date, o.trackingId || null);
}

console.log('Seeding completed successfully!');
db.close();

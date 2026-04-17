import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import Database from 'better-sqlite3';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Database
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

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get('/api/products', (req, res) => {
    const products = db.prepare('SELECT * FROM products').all();
    res.json(products.map((p: any) => ({
      ...p,
      isFlashSale: !!p.isFlashSale,
      isNewLaunched: !!p.isNewLaunched
    })));
  });

  app.post('/api/products', (req, res) => {
    const p = req.body;
    const stmt = db.prepare(`
      INSERT INTO products (id, name, brand, generic, mrp, discountPrice, image, isFlashSale, isNewLaunched, category, description, dosage, type, stock)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(p.id, p.name, p.brand, p.generic, p.mrp, p.discountPrice, p.image, p.isFlashSale ? 1 : 0, p.isNewLaunched ? 1 : 0, p.category, p.description, p.dosage, p.type, p.stock);
    res.status(201).json({ success: true });
  });

  app.get('/api/categories', (req, res) => {
    const categories = db.prepare('SELECT * FROM categories').all();
    res.json(categories);
  });

  app.get('/api/brands', (req, res) => {
    const brands = db.prepare('SELECT * FROM brands').all();
    res.json(brands);
  });

  app.get('/api/orders', (req, res) => {
    const orders = db.prepare('SELECT * FROM orders').all();
    res.json(orders);
  });

  app.post('/api/orders', (req, res) => {
    const { order, items } = req.body;
    const insertOrder = db.prepare(`
      INSERT INTO orders (id, customerName, customerEmail, total, status, date, trackingId)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    
    const insertItem = db.prepare(`
      INSERT INTO order_items (orderId, productId, name, price, quantity, image)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const transaction = db.transaction(() => {
      insertOrder.run(order.id, order.customerName, order.customerEmail, order.total, order.status, order.date, order.trackingId);
      for (const item of items) {
        insertItem.run(order.id, item.id, item.name, item.discountPrice, item.quantity, item.image);
      }
    });

    transaction();
    res.status(201).json({ success: true, orderId: order.id });
  });

  app.get('/api/search-history', (req, res) => {
    const history = db.prepare('SELECT term FROM search_history ORDER BY id DESC LIMIT 10').all();
    res.json(history.map((h: any) => h.term));
  });

  app.post('/api/search-history', (req, res) => {
    const { term } = req.body;
    db.prepare('INSERT INTO search_history (term, date) VALUES (?, ?)').run(term, new Date().toISOString());
    res.json({ success: true });
  });

  app.get('/api/stats', (req, res) => {
    const totalProducts = db.prepare('SELECT COUNT(*) as count FROM products').get() as any;
    const totalOrders = db.prepare('SELECT COUNT(*) as count FROM orders').get() as any;
    const totalCustomers = db.prepare('SELECT COUNT(*) as count FROM customers').get() as any;
    const pendingOrders = db.prepare("SELECT COUNT(*) as count FROM orders WHERE status = 'Pending'").get() as any;
    const deliveredOrders = db.prepare("SELECT COUNT(*) as count FROM orders WHERE status = 'Delivered'").get() as any;
    const processingOrders = db.prepare("SELECT COUNT(*) as count FROM orders WHERE status = 'Processing'").get() as any;
    const cancelledOrders = db.prepare("SELECT COUNT(*) as count FROM orders WHERE status = 'Cancelled'").get() as any;
    const confirmedOrders = db.prepare("SELECT COUNT(*) as count FROM orders WHERE status = 'Confirmed'").get() as any;

    res.json({
      totalProducts: totalProducts.count,
      totalOrders: totalOrders.count,
      totalCustomers: totalCustomers.count,
      pendingOrders: pendingOrders.count,
      deliveredOrders: deliveredOrders.count,
      processingOrders: processingOrders.count,
      cancelledOrders: cancelledOrders.count,
      confirmedOrders: confirmedOrders.count
    });
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

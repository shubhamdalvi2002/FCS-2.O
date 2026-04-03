import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import fs from "fs";

// Mock Database Initialization
const DB_PATH = path.join(process.cwd(), "db.json");
if (!fs.existsSync(DB_PATH)) {
  fs.writeFileSync(DB_PATH, JSON.stringify({
    users: [],
    products: [
      { id: "1", name: "Broiler Chicken", category: "Chicken", price: 260, unit: "kg", image: "https://images.unsplash.com/photo-1587593810167-a84920ea0781?q=90&w=1200", description: "Fresh farm-raised broiler chicken." },
      { id: "2", name: "Gavathi (Desi) Chicken", category: "Chicken", price: 260, unit: "kg", image: "https://images.unsplash.com/photo-1612170153139-6f881ff067e0?q=90&w=1200", description: "Authentic country-style desi chicken." },
      { id: "3", name: "RR Chicken", category: "Chicken", price: 260, unit: "kg", image: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?q=90&w=1200", description: "Premium RR breed chicken." },
      { id: "4", name: "Broiler Eggs", category: "Eggs", price: 7, unit: "egg", image: "https://images.unsplash.com/photo-1516448620398-c5f44bf9f441?q=90&w=1200", description: "High-quality broiler eggs." },
      { id: "5", name: "Gavathi Eggs", category: "Eggs", price: 7, unit: "egg", image: "https://images.unsplash.com/photo-1598965675045-45c5e72c7d05?q=90&w=1200", description: "Nutritious gavathi desi eggs." }
    ],
    orders: [],
    settings: { deliveryCharge: 10, codEnabled: true }
  }, null, 2));
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/products", (req, res) => {
    const db = JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
    res.json(db.products);
  });

  app.post("/api/products", (req, res) => {
    const db = JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
    const newProduct = {
      id: Math.random().toString(36).substr(2, 9),
      ...req.body
    };
    db.products.push(newProduct);
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
    res.status(201).json(newProduct);
  });

  app.put("/api/products/:id", (req, res) => {
    const db = JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
    const index = db.products.findIndex((p: any) => p.id === req.params.id);
    if (index !== -1) {
      db.products[index] = { ...db.products[index], ...req.body };
      fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
      res.json(db.products[index]);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  });

  app.delete("/api/products/:id", (req, res) => {
    const db = JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
    db.products = db.products.filter((p: any) => p.id !== req.params.id);
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
    res.status(204).send();
  });

  app.get("/api/settings", (req, res) => {
    const db = JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
    res.json(db.settings);
  });

  app.put("/api/settings", (req, res) => {
    const db = JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
    db.settings = { ...db.settings, ...req.body };
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
    res.json(db.settings);
  });

  app.get("/api/orders", (req, res) => {
    const db = JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
    res.json(db.orders);
  });

  app.post("/api/orders", (req, res) => {
    const db = JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
    const newOrder = {
      id: "ORD-" + Math.random().toString(36).substr(2, 9).toUpperCase(),
      ...req.body,
      status: "Order Received",
      createdAt: new Date().toISOString()
    };
    db.orders.push(newOrder);
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
    res.status(201).json(newOrder);
  });

  app.put("/api/orders/:id", (req, res) => {
    const db = JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
    const index = db.orders.findIndex((o: any) => o.id === req.params.id);
    if (index !== -1) {
      db.orders[index] = { ...db.orders[index], ...req.body };
      fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
      res.json(db.orders[index]);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  });

  app.get("/api/admin/stats", (req, res) => {
    const db = JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
    const totalRevenue = db.orders.reduce((acc: number, order: any) => acc + order.total, 0);
    const totalOrders = db.orders.length;
    const totalCustomers = new Set(db.orders.map((o: any) => o.customerEmail)).size;
    
    res.json({
      totalOrders,
      totalRevenue,
      totalCustomers,
      productsSoldToday: totalOrders > 0 ? Math.floor(Math.random() * 50) + 10 : 0
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

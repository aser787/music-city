import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { db } from './server/db';
import { isEmailAuthorized, validateProductData } from './src/utils/menuLogic';

dotenv.config();

const app = express();
const PORT = 3000;
const isDev = process.env.NODE_ENV !== 'production';

// Ensure uploads directory exists
const UPLOADS_DIR = path.resolve(process.cwd(), 'public/uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Body parsing with generous limit for base64 uploads
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Static files for uploaded images
app.use('/uploads', express.static(UPLOADS_DIR));
app.use('/assets', express.static(path.resolve(process.cwd(), 'public/assets')));

// --- AUTH MIDDLEWARE ---
function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Authentication required. No session token provided.' });
    return;
  }

  const token = authHeader.substring(7);
  const session = db.validateSession(token);
  if (!session) {
    res.status(401).json({ error: 'Session expired or invalid. Please sign in again.' });
    return;
  }

  (req as any).adminEmail = session.email;
  next();
}

// --- AUTH ROUTES ---
app.post('/api/auth/status', (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) {
    res.status(400).json({ error: 'Email is required' });
    return;
  }

  const allowlist = process.env.MUSIC_CITY_ADMIN_EMAILS || 'asercr7777@gmail.com,admin@musiccity.eg';
  const isAllowed = isEmailAuthorized(email, allowlist);

  if (!isAllowed) {
    res.status(403).json({
      allowed: false,
      hasPassword: false,
      message: 'This email is not authorized to access the Music City management system.',
    });
    return;
  }

  const hasPassword = db.hasAdminAccount(email);
  res.json({
    allowed: true,
    hasPassword,
    message: hasPassword ? 'Email authorized' : 'First-time setup required for this authorized email.',
  });
});

app.post('/api/auth/setup-password', (req: Request, res: Response) => {
  const { email, password } = req.body;
  const result = db.registerAdminPassword(email, password);
  if (!result.success) {
    res.status(400).json({ error: result.message });
    return;
  }

  const token = db.createSession(email);
  res.json({
    success: true,
    token,
    user: { email, role: 'owner' },
    message: result.message,
  });
});

app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required' });
    return;
  }

  const allowlist = process.env.MUSIC_CITY_ADMIN_EMAILS || 'asercr7777@gmail.com,admin@musiccity.eg';
  if (!isEmailAuthorized(email, allowlist)) {
    res.status(403).json({ error: 'Unauthorized email. Access restricted to restaurant administrators.' });
    return;
  }

  // If password not yet registered, notify user to set up password
  if (!db.hasAdminAccount(email)) {
    res.status(409).json({
      error: 'First-time password setup required',
      needsSetup: true,
    });
    return;
  }

  const isValid = db.verifyAdminCredentials(email, password);
  if (!isValid) {
    res.status(401).json({ error: 'Incorrect email or password' });
    return;
  }

  const token = db.createSession(email);
  res.json({
    success: true,
    token,
    user: { email, role: 'owner' },
  });
});

app.get('/api/auth/me', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'No token' });
    return;
  }
  const token = authHeader.substring(7);
  const session = db.validateSession(token);
  if (!session) {
    res.status(401).json({ error: 'Invalid or expired session' });
    return;
  }
  res.json({ email: session.email, role: 'owner' });
});

app.post('/api/auth/logout', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    db.deleteSession(authHeader.substring(7));
  }
  res.json({ success: true });
});

// --- PUBLIC MENU & CONTENT ROUTES ---
app.get('/api/categories', (req: Request, res: Response) => {
  const categories = db.getCategories().filter(c => c.is_active);
  res.json(categories);
});

app.get('/api/categories/:id', (req: Request, res: Response) => {
  const category = db.getCategory(req.params.id);
  if (!category) {
    res.status(404).json({ error: 'Category not found' });
    return;
  }
  res.json(category);
});

app.get('/api/products', (req: Request, res: Response) => {
  const { category_id, featured } = req.query;
  const products = db.getProducts({
    categoryId: typeof category_id === 'string' ? category_id : undefined,
    isActiveOnly: true,
    isFeaturedOnly: featured === 'true',
  });
  res.json(products);
});

app.get('/api/products/:id', (req: Request, res: Response) => {
  const product = db.getProduct(req.params.id);
  if (!product || !product.is_active || product.needs_review) {
    res.status(404).json({ error: 'Product not found' });
    return;
  }
  res.json(product);
});

app.get('/api/content', (_req: Request, res: Response) => {
  res.json(db.getSiteContent());
});

// --- PROTECTED ADMIN ROUTES ---
app.get('/api/admin/stats', requireAdmin, (_req: Request, res: Response) => {
  res.json(db.getStats());
});

app.get('/api/admin/categories', requireAdmin, (_req: Request, res: Response) => {
  res.json(db.getCategories());
});

app.post('/api/admin/categories', requireAdmin, (req: Request, res: Response) => {
  const { name_ar, name_en, slug, image, sort_order, is_active, description_ar, description_en } = req.body;
  if (!name_ar || !name_ar.trim()) {
    res.status(400).json({ error: 'Arabic category name is required' });
    return;
  }
  const cleanSlug = slug || name_en?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || `cat-${Date.now()}`;
  const category = db.createCategory({
    slug: cleanSlug,
    name_ar: name_ar.trim(),
    name_en: name_en?.trim() || name_ar.trim(),
    description_ar: description_ar?.trim(),
    description_en: description_en?.trim(),
    image: image || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=85',
    sort_order: typeof sort_order === 'number' ? sort_order : 100,
    is_active: is_active ?? true,
  });
  res.status(201).json(category);
});

app.put('/api/admin/categories/:id', requireAdmin, (req: Request, res: Response) => {
  const updated = db.updateCategory(req.params.id, req.body);
  if (!updated) {
    res.status(404).json({ error: 'Category not found' });
    return;
  }
  res.json(updated);
});

app.delete('/api/admin/categories/:id', requireAdmin, (req: Request, res: Response) => {
  const { reassignToId } = req.body;
  const result = db.deleteCategory(req.params.id, reassignToId);
  if (!result.success) {
    res.status(404).json({ error: 'Category not found' });
    return;
  }
  res.json(result);
});

app.get('/api/admin/products', requireAdmin, (req: Request, res: Response) => {
  const { category_id, needs_review } = req.query;
  const products = db.getProducts({
    categoryId: typeof category_id === 'string' ? category_id : undefined,
    needsReviewOnly: needs_review === 'true',
  });
  res.json(products);
});

app.post('/api/admin/products', requireAdmin, (req: Request, res: Response) => {
  const validation = validateProductData(req.body);
  if (!validation.isValid) {
    res.status(400).json({ error: validation.errors.join(', ') });
    return;
  }

  const product = db.createProduct({
    ...req.body,
    name_en: req.body.name_en || req.body.name_ar,
    price: Number(req.body.price),
  });
  res.status(201).json(product);
});

app.put('/api/admin/products/:id', requireAdmin, (req: Request, res: Response) => {
  if (req.body.price !== undefined) {
    const p = Number(req.body.price);
    if (isNaN(p) || p <= 0) {
      res.status(400).json({ error: 'Price must be a valid positive number' });
      return;
    }
  }

  const updated = db.updateProduct(req.params.id, req.body);
  if (!updated) {
    res.status(404).json({ error: 'Product not found' });
    return;
  }
  res.json(updated);
});

app.delete('/api/admin/products/:id', requireAdmin, (req: Request, res: Response) => {
  const success = db.deleteProduct(req.params.id);
  if (!success) {
    res.status(404).json({ error: 'Product not found' });
    return;
  }
  res.json({ success: true });
});

app.put('/api/admin/content', requireAdmin, (req: Request, res: Response) => {
  const updated = db.updateSiteContent(req.body);
  res.json(updated);
});

// Image Upload Endpoint with real file validation and persistence
app.post('/api/admin/upload', requireAdmin, (req: Request, res: Response) => {
  try {
    const { filename, base64Data } = req.body;
    if (!filename || !base64Data) {
      res.status(400).json({ error: 'Filename and base64Data are required' });
      return;
    }

    // Match data URI header
    const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      res.status(400).json({ error: 'Invalid base64 image format' });
      return;
    }

    const mimeType = matches[1];
    const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedMimes.includes(mimeType)) {
      res.status(400).json({ error: 'Only JPEG, PNG, WEBP, or GIF images are allowed' });
      return;
    }

    const buffer = Buffer.from(matches[2], 'base64');
    if (buffer.length > 5 * 1024 * 1024) {
      res.status(400).json({ error: 'Image size exceeds maximum 5MB limit' });
      return;
    }

    const ext = mimeType.split('/')[1].replace('jpeg', 'jpg');
    const safeName = `mc_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${ext}`;
    const filePath = path.join(UPLOADS_DIR, safeName);

    fs.writeFileSync(filePath, buffer);
    res.json({
      success: true,
      url: `/uploads/${safeName}`,
    });
  } catch (err: any) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Failed to process image upload' });
  }
});

// --- SERVER START & VITE DEV INTEGRATION ---
async function startServer() {
  if (isDev) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Music City full-stack server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});

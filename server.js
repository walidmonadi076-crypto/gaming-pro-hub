const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const multer = require('multer');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const db = require('./database');

const app = express();
const PORT = 5000;

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const secretPath = path.join(__dirname, '.session-secret');
let sessionSecret;

if (fs.existsSync(secretPath)) {
  sessionSecret = fs.readFileSync(secretPath, 'utf8');
} else {
  sessionSecret = crypto.randomBytes(32).toString('hex');
  fs.writeFileSync(secretPath, sessionSecret, 'utf8');
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed!'));
  }
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'Too many login attempts. Please try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(session({
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false,
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: 'strict'
  }
}));

app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static(uploadDir));
app.use(express.static(path.join(__dirname)));

function requireAuth(req, res, next) {
  if (req.session && req.session.adminId) {
    return next();
  }
  return res.status(401).json({ error: 'Unauthorized' });
}

function validateImagePath(imagePath) {
  if (!imagePath) return null;
  
  if (imagePath.startsWith('./assets/images/')) {
    return imagePath;
  }
  
  if (imagePath.startsWith('/uploads/')) {
    const filename = path.basename(imagePath);
    const safePath = path.join(uploadDir, filename);
    if (fs.existsSync(safePath)) {
      return imagePath;
    }
  }
  
  return null;
}

function deleteOldImage(imagePath) {
  if (!imagePath || !imagePath.startsWith('/uploads/')) {
    return;
  }
  
  try {
    const filename = path.basename(imagePath);
    const filePath = path.join(uploadDir, filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    console.error('Error deleting old image:', error);
  }
}

app.post('/api/admin/login', loginLimiter, (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }
  
  const admin = db.prepare('SELECT * FROM admin_users WHERE username = ?').get(username);
  
  if (!admin) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  const passwordMatch = bcrypt.compareSync(password, admin.password_hash);
  
  if (!passwordMatch) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  req.session.adminId = admin.id;
  req.session.username = admin.username;
  
  res.json({ success: true, username: admin.username });
});

app.post('/api/admin/logout', (req, res) => {
  req.session.destroy();
  res.json({ success: true });
});

app.get('/api/admin/check', (req, res) => {
  if (req.session && req.session.adminId) {
    res.json({ authenticated: true, username: req.session.username });
  } else {
    res.json({ authenticated: false });
  }
});

app.post('/api/admin/change-password', requireAuth, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Current and new password required' });
  }
  
  if (newPassword.length < 8) {
    return res.status(400).json({ error: 'New password must be at least 8 characters' });
  }
  
  try {
    const admin = db.prepare('SELECT * FROM admin_users WHERE id = ?').get(req.session.adminId);
    
    if (!admin) {
      return res.status(404).json({ error: 'Admin account not found' });
    }
    
    const passwordMatch = bcrypt.compareSync(currentPassword, admin.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }
    
    const newPasswordHash = bcrypt.hashSync(newPassword, 10);
    db.prepare('UPDATE admin_users SET password_hash = ? WHERE id = ?').run(newPasswordHash, req.session.adminId);
    
    res.json({ success: true });
  } catch (error) {
    console.error('Password change error:', error);
    res.status(500).json({ error: 'Failed to change password' });
  }
});

app.get('/api/games', (req, res) => {
  const games = db.prepare('SELECT * FROM games ORDER BY created_at DESC').all();
  res.json(games);
});

app.get('/api/games/:id', requireAuth, (req, res) => {
  const game = db.prepare('SELECT * FROM games WHERE id = ?').get(req.params.id);
  if (!game) {
    return res.status(404).json({ error: 'Game not found' });
  }
  res.json(game);
});

app.post('/api/games', requireAuth, upload.single('image'), (req, res) => {
  try {
    const { title, genre, description, category, cta_text } = req.body;
    
    if (!title || !genre || !description || !category || !cta_text) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    let imagePath = req.body.existing_image;
    
    if (req.file) {
      imagePath = '/uploads/' + req.file.filename;
    } else if (imagePath) {
      imagePath = validateImagePath(imagePath);
      if (!imagePath) {
        return res.status(400).json({ error: 'Invalid image path' });
      }
    } else {
      return res.status(400).json({ error: 'Image is required' });
    }
    
    const result = db.prepare(`
      INSERT INTO games (title, genre, description, image, category, cta_text)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(title, genre, description, imagePath, category, cta_text);
    
    res.json({ success: true, id: result.lastInsertRowid });
  } catch (error) {
    console.error('Create game error:', error);
    res.status(500).json({ error: 'Failed to create game' });
  }
});

app.put('/api/games/:id', requireAuth, upload.single('image'), (req, res) => {
  try {
    const { title, genre, description, category, cta_text } = req.body;
    
    if (!title || !genre || !description || !category || !cta_text) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    const existingGame = db.prepare('SELECT * FROM games WHERE id = ?').get(req.params.id);
    if (!existingGame) {
      return res.status(404).json({ error: 'Game not found' });
    }
    
    let imagePath = existingGame.image;
    
    if (req.file) {
      deleteOldImage(existingGame.image);
      imagePath = '/uploads/' + req.file.filename;
    } else if (req.body.existing_image && req.body.existing_image !== existingGame.image) {
      const validatedPath = validateImagePath(req.body.existing_image);
      if (validatedPath) {
        deleteOldImage(existingGame.image);
        imagePath = validatedPath;
      }
    }
    
    db.prepare(`
      UPDATE games 
      SET title = ?, genre = ?, description = ?, image = ?, category = ?, cta_text = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(title, genre, description, imagePath, category, cta_text, req.params.id);
    
    res.json({ success: true });
  } catch (error) {
    console.error('Update game error:', error);
    res.status(500).json({ error: 'Failed to update game' });
  }
});

app.delete('/api/games/:id', requireAuth, (req, res) => {
  try {
    const game = db.prepare('SELECT * FROM games WHERE id = ?').get(req.params.id);
    if (game) {
      deleteOldImage(game.image);
    }
    
    db.prepare('DELETE FROM games WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  } catch (error) {
    console.error('Delete game error:', error);
    res.status(500).json({ error: 'Failed to delete game' });
  }
});

app.get('/api/content', (req, res) => {
  const content = db.prepare('SELECT * FROM site_content').all();
  const contentMap = {};
  content.forEach(item => {
    contentMap[item.content_key] = item.content_value;
  });
  res.json(contentMap);
});

app.put('/api/content/:key', requireAuth, (req, res) => {
  try {
    const { value } = req.body;
    
    if (value === undefined || value === null) {
      return res.status(400).json({ error: 'Value is required' });
    }
    
    const existing = db.prepare('SELECT * FROM site_content WHERE content_key = ?').get(req.params.key);
    if (!existing) {
      return res.status(404).json({ error: 'Content key not found' });
    }
    
    db.prepare(`
      UPDATE site_content 
      SET content_value = ?, updated_at = CURRENT_TIMESTAMP
      WHERE content_key = ?
    `).run(value, req.params.key);
    
    res.json({ success: true });
  } catch (error) {
    console.error('Update content error:', error);
    res.status(500).json({ error: 'Failed to update content' });
  }
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin', 'index.html'));
});

app.get('*', (req, res) => {
  if (req.path.startsWith('/admin')) {
    res.sendFile(path.join(__dirname, 'admin', 'index.html'));
  } else {
    res.sendFile(path.join(__dirname, 'index.html'));
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Gamics server running on http://0.0.0.0:${PORT}`);
  console.log(`Admin panel available at http://0.0.0.0:${PORT}/admin`);
  console.log(`\n⚠️  SECURITY NOTICE: Please change the default admin password immediately!`);
  console.log(`   Default credentials: admin / admin123\n`);
});

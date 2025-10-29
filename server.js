const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('./database');

const app = express();
const PORT = 5000;

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
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

app.use(session({
  secret: 'gamics-secret-key-' + Math.random().toString(36),
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false,
    maxAge: 24 * 60 * 60 * 1000
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

app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  
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
    let imagePath = req.body.existing_image;
    
    if (req.file) {
      imagePath = '/uploads/' + req.file.filename;
    }
    
    const result = db.prepare(`
      INSERT INTO games (title, genre, description, image, category, cta_text)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(title, genre, description, imagePath, category, cta_text);
    
    res.json({ success: true, id: result.lastInsertRowid });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/games/:id', requireAuth, upload.single('image'), (req, res) => {
  try {
    const { title, genre, description, category, cta_text } = req.body;
    let imagePath = req.body.existing_image;
    
    if (req.file) {
      imagePath = '/uploads/' + req.file.filename;
    }
    
    db.prepare(`
      UPDATE games 
      SET title = ?, genre = ?, description = ?, image = ?, category = ?, cta_text = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(title, genre, description, imagePath, category, cta_text, req.params.id);
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/games/:id', requireAuth, (req, res) => {
  try {
    db.prepare('DELETE FROM games WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
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
    
    db.prepare(`
      UPDATE site_content 
      SET content_value = ?, updated_at = CURRENT_TIMESTAMP
      WHERE content_key = ?
    `).run(value, req.params.key);
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
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
});

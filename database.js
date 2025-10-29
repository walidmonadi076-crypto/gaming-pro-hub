const Database = require('better-sqlite3');
const bcrypt = require('bcrypt');
const path = require('path');

const db = new Database(path.join(__dirname, 'gamics.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS games (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    genre TEXT NOT NULL,
    description TEXT NOT NULL,
    image TEXT NOT NULL,
    category TEXT NOT NULL,
    cta_text TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS site_content (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    content_key TEXT UNIQUE NOT NULL,
    content_value TEXT NOT NULL,
    content_type TEXT DEFAULT 'text',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS admin_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

function initializeData() {
  const gameCount = db.prepare('SELECT COUNT(*) as count FROM games').get();
  
  if (gameCount.count === 0) {
    const insertGame = db.prepare(`
      INSERT INTO games (title, genre, description, image, category, cta_text)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const games = [
      {
        title: "Cyberpunk 2077",
        genre: "RPG / FPS",
        description: "Unlock exclusive gear and premium content now! Requires quick human verification.",
        image: "./assets/images/featured-game-1.jpg",
        category: "New Release",
        cta_text: "VIEW OFFER"
      },
      {
        title: "FC 24 (FIFA)",
        genre: "Sports / Simulation",
        description: "Get free Ultimate Team coins and early access to season passes!",
        image: "./assets/images/featured-game-2.jpg",
        category: "Exclusive",
        cta_text: "CLAIM REWARD"
      },
      {
        title: "Assassin's Creed",
        genre: "Action / Adventure",
        description: "Free download for the latest DLC and 100% completion saves.",
        image: "./assets/images/featured-game-3.jpg",
        category: "Limited Time",
        cta_text: "DOWNLOAD"
      },
      {
        title: "Call of Duty",
        genre: "Action / Adventure",
        description: "Experience intense warfare with the latest weapons and maps.",
        image: "./assets/images/featured-game-4.jpg",
        category: "Featured",
        cta_text: "DOWNLOAD"
      }
    ];

    games.forEach(game => {
      insertGame.run(game.title, game.genre, game.description, game.image, game.category, game.cta_text);
    });

    console.log('Initial games data loaded');
  }

  const contentCount = db.prepare('SELECT COUNT(*) as count FROM site_content').get();
  
  if (contentCount.count === 0) {
    const insertContent = db.prepare(`
      INSERT INTO site_content (content_key, content_value, content_type)
      VALUES (?, ?, ?)
    `);

    const siteContent = [
      { key: 'hero_title', value: 'Create Manage Matches', type: 'text' },
      { key: 'hero_subtitle', value: 'World Gaming', type: 'text' },
      { key: 'hero_description', value: 'Find technology or people for digital projects in public sector and Find an individual specialist develope researcher.', type: 'text' },
      { key: 'countdown_days', value: '10', type: 'text' },
      { key: 'site_title', value: 'Gamics - Create Manage Matches', type: 'text' }
    ];

    siteContent.forEach(content => {
      insertContent.run(content.key, content.value, content.type);
    });

    console.log('Initial site content loaded');
  }

  const adminCount = db.prepare('SELECT COUNT(*) as count FROM admin_users').get();
  
  if (adminCount.count === 0) {
    const defaultPassword = 'admin123';
    const passwordHash = bcrypt.hashSync(defaultPassword, 10);
    
    db.prepare(`
      INSERT INTO admin_users (username, password_hash)
      VALUES (?, ?)
    `).run('admin', passwordHash);

    console.log('Default admin user created (username: admin, password: admin123)');
  }
}

initializeData();

module.exports = db;

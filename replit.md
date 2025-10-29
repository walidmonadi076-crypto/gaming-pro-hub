# Gamics - Gaming Website with Admin Panel

## Overview
Gamics is a fully responsive gaming website with a complete content management system. It features dynamic game loading, CPA locker functionality, and a powerful admin panel for managing all content without touching code.

## Project Structure
- `index.html` - Main website HTML
- `admin/` - Complete admin panel
  - `index.html` - Admin interface
  - `admin.css` - Admin styling
  - `admin.js` - Admin functionality
- `assets/` - Website assets
  - `css/style.css` - Main stylesheet
  - `js/script.js` - Navigation and UI interactions
  - `images/` - Image assets
- `server.js` - Express backend server with API
- `database.js` - SQLite database initialization and schema
- `game-loader.js` - Dynamically loads games from API
- `content-loader.js` - Dynamically loads site content from API
- `cpa-locker.js` - CPA locker overlay functionality
- `uploads/` - User-uploaded images storage
- `gamics.db` - SQLite database file

## Architecture

### Backend
- **Framework**: Express.js
- **Database**: SQLite with better-sqlite3
- **Authentication**: Session-based with bcrypt password hashing
- **File Uploads**: Multer for image handling
- **API Endpoints**:
  - `POST /api/admin/login` - Admin login
  - `POST /api/admin/logout` - Admin logout
  - `GET /api/admin/check` - Check authentication status
  - `GET /api/games` - Fetch all games
  - `GET /api/games/:id` - Fetch single game
  - `POST /api/games` - Create new game
  - `PUT /api/games/:id` - Update game
  - `DELETE /api/games/:id` - Delete game
  - `GET /api/content` - Fetch site content
  - `PUT /api/content/:key` - Update site content

### Frontend
- **Main Site**: Pure HTML/CSS/JavaScript
- **Admin Panel**: SPA-style interface with dynamic page switching
- **Data Loading**: Fetch API for dynamic content
- **Features**:
  - Responsive design
  - Dynamic game card loading from database
  - Dynamic site content from database
  - CPA locker overlay system

### Database Schema
1. **games**: id, title, genre, description, image, category, cta_text, created_at, updated_at
2. **site_content**: id, content_key, content_value, content_type, updated_at
3. **admin_users**: id, username, password_hash, created_at

## Admin Panel Features

### Authentication
- Secure login system with session management
- Default credentials: **admin / admin123**
- Password hashing with bcrypt

### Dashboard
- Quick stats overview
- Total games count
- Quick action buttons
- Direct access to all management features

### Game Management
- Add new games with image upload
- Edit existing games
- Delete games with confirmation
- Upload custom game images
- All changes reflect immediately on the website

### Content Management
- Edit hero section content
- Update countdown days
- Modify site title and descriptions
- No code editing required
- Real-time updates

### Image Upload System
- Support for JPEG, PNG, GIF, WebP
- 5MB file size limit
- Automatic file naming and storage
- Image preview in admin panel

## Usage

### Running the Application
```bash
npm start
```
The server runs on port 5000 and serves:
- Main website: `http://localhost:5000/`
- Admin panel: `http://localhost:5000/admin`

### Admin Panel Access
1. Navigate to `/admin`
2. Login with default credentials: username `admin`, password `admin123`
3. **⚠️ IMPORTANT**: Change the default password immediately after first login
4. Manage games and content from the dashboard

**Security Note**: The login is protected by rate limiting (5 attempts per 15 minutes)

### Adding a New Game
1. Go to "Manage Games" in admin panel
2. Click "Add New Game"
3. Fill in game details:
   - Title (e.g., "Cyberpunk 2077")
   - Genre (e.g., "RPG / FPS")
   - Description
   - Category (e.g., "New Release")
   - CTA Text (e.g., "DOWNLOAD")
   - Upload game image
4. Click "Save Game"
5. Changes appear instantly on the website

### Editing Site Content
1. Go to "Site Content" in admin panel
2. Modify any text fields
3. Click "Save Changes"
4. Website updates immediately

## Recent Changes
- **2025-10-29**: Complete dynamic transformation
  - Converted from static to database-driven website
  - Added SQLite database with full schema
  - Built REST API with Express
  - Created comprehensive admin panel
  - Implemented session-based authentication
  - Added image upload system with multer
  - Updated frontend to fetch data from API
  - Removed dependency on static games.json
  - All content now manageable without code changes

## Security Features
- **Password Security**: bcrypt hashing with 10 rounds, minimum 8 character requirement
- **Session Management**: Persistent session secret stored in `.session-secret` file
- **Cookie Security**: httpOnly and sameSite flags prevent XSS and CSRF attacks
- **Rate Limiting**: Login attempts limited to 5 per 15 minutes to prevent brute force
- **SQL Injection Protection**: All queries use prepared statements
- **File Upload Security**:
  - Type validation (only image files: JPEG, PNG, GIF, WebP)
  - Size limit: 5MB maximum
  - Path validation to prevent directory traversal
  - Automatic cleanup of old images on update/delete
- **Input Validation**: All API endpoints validate required fields
- **Error Handling**: Secure error messages without stack trace exposure
- **Password Change**: API endpoint for changing admin password
- **Authentication Required**: All admin operations require valid session

## User Preferences
- Clean, modern admin interface with dark theme
- Responsive design for all devices
- Real-time content updates without page refresh
- User-friendly error messages and confirmations

## Technical Notes
- Cache control headers ensure fresh content delivery
- Uploads stored in `/uploads` directory (auto-created)
- Database file: `gamics.db` (SQLite)
- Session secret persists in `.session-secret` file (auto-generated once)
- All admin API routes require authentication
- Public endpoints: `/api/games`, `/api/content`
- Old uploaded images automatically deleted when replaced
- Image paths validated to prevent arbitrary URL injection

## Future Enhancement Ideas
- User roles and permissions
- Bulk game import/export
- Image optimization
- Analytics dashboard
- SEO settings management
- Theme customization
- Email notifications

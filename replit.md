# Gamics - Gaming Website

## Overview
Gamics is a fully responsive gaming website built with HTML, CSS, and JavaScript. It features dynamic game loading, CPA locker functionality, and a modern gaming aesthetic.

## Project Structure
- `index.html` - Main HTML file
- `assets/` - Contains CSS, JavaScript, and image files
  - `css/style.css` - Main stylesheet
  - `js/script.js` - Navigation and UI interactions
  - `images/` - All image assets
- `games.json` - Game data loaded dynamically
- `game-loader.js` - Dynamically loads game cards from JSON
- `cpa-locker.js` - CPA locker overlay functionality
- `server.js` - Express server for serving static files

## Architecture
- **Frontend**: Pure HTML/CSS/JavaScript (no framework)
- **Server**: Express.js serving static files on port 5000
- **Data**: JSON-based game data
- **Features**:
  - Responsive design
  - Dynamic game card loading
  - CPA locker overlay system
  - Navigation and search functionality

## Recent Changes
- **2025-10-29**: Initial Replit setup
  - Added Express server to serve static files
  - Configured to run on port 5000 with cache control headers
  - Set up workflow for development

## Setup
The site runs on an Express server that serves static files with proper cache control headers to ensure users see updates immediately.

Run with: `npm start`

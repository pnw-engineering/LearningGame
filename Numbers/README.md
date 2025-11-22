# Addition Game Numbers (nginx Version)

A simple web-based addition game served with nginx, using local storage for data persistence.

## Features

- User registration and management (local storage)
- Game statistics tracking
- Difficulty levels
- Responsive design
- Client-side data persistence
- Offline functionality

## Installation & Running

### With Docker (Recommended)

1. Clone the repository
2. Build and run with Docker Compose:
   ```bash
   docker-compose up --build
   ```

The game is now available at `http://localhost`

### With Local nginx

1. Install nginx
2. Copy the files to your web server directory
3. Use the provided `nginx.conf` configuration
4. Start nginx

### Development

For development, you can serve the files with any static web server:

```bash
# Using Python (if available)
python -m http.server 8000

# Using Node.js http-server (if available)
npx http-server

# Using PHP (if available)
php -S localhost:8000
```

## Architecture Changes

This application has been converted from a Node.js/Express backend to a static web application:

- **Removed**: Node.js server, Express API, SQLite database, package.json
- **Added**: nginx web server, local storage API, client-side persistence
- **Benefits**: Simpler deployment, no server maintenance, works offline

## File Structure

- `nginx.conf` - nginx server configuration
- `local-storage-api.js` - Client-side API replacement
- `main.js` - Game logic (updated for local storage)
- `main.css` - Styling
- `index.html` - Main game interface
- `*.html` - Various debug and management pages
- `Dockerfile` - Docker configuration for nginx
- `docker-compose.yml` - Docker Compose setup

## Local Storage API

The application now uses a client-side API that stores data in the browser's local storage:

### Available Methods

- `api.getUsers()` - Get all users
- `api.createUser(userData)` - Create new user
- `api.getUser(userId)` - Get specific user
- `api.deleteUser(userId)` - Delete user
- `api.saveGameResult(gameData)` - Save game result
- `api.getUserGames(userId)` - Get user's game history
- `api.getLeaderboard(limit)` - Get top scores
- `api.health()` - Health check
- `api.inspect()` - Database inspection
- `api.exportData()` - Export all data
- `api.importData(data)` - Import data
- `api.clearData()` - Clear all data

## Game Features

- Multiple difficulty levels
- Score tracking
- User statistics
- Responsive design for mobile devices
- Offline functionality
- Data persistence across browser sessions
- User management system
- Game history tracking
- Leaderboards

## Data Storage

All data is stored in the browser's local storage using JSON format:

```json
{
  "users": [...],
  "games": [...],
  "lastUserId": 0,
  "lastGameId": 0
}
```

## Browser Compatibility

Works in all modern browsers that support:

- Local Storage API
- ES6+ JavaScript features
- CSS Grid and Flexbox

## Security Features

The nginx configuration includes:

- Security headers (X-Frame-Options, X-Content-Type-Options, etc.)
- Gzip compression
- Static asset caching
- Protection against directory traversal
- Blocked access to sensitive files and directories

## Development Notes

- No backend server required
- Data persists only in the user's browser
- For multi-user scenarios, consider implementing a cloud storage solution
- All game logic runs client-side
- Fully functional offline after initial load

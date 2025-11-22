#!/bin/bash

# Simple development server startup script
# This script starts a local development server for the Addition Game

echo "Starting Addition Game development server..."

# Check if Python is available
if command -v python3 &> /dev/null; then
    echo "Using Python 3 to serve files on http://localhost:8000"
    python3 -m http.server 8000
elif command -v python &> /dev/null; then
    echo "Using Python to serve files on http://localhost:8000"
    python -m http.server 8000
# Check if Node.js http-server is available
elif command -v npx &> /dev/null; then
    echo "Using Node.js http-server on http://localhost:8080"
    npx http-server -p 8080
# Check if PHP is available
elif command -v php &> /dev/null; then
    echo "Using PHP built-in server on http://localhost:8000"
    php -S localhost:8000
else
    echo "No suitable development server found."
    echo "Please install one of the following:"
    echo "  - Python (python3 -m http.server)"
    echo "  - Node.js (npx http-server)"
    echo "  - PHP (php -S localhost:8000)"
    echo "Or use Docker: docker-compose up"
    exit 1
fi
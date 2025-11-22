@echo off
REM Windows batch script to start development server

echo Starting Addition Game development server...

REM Check if Python is available
python --version >nul 2>&1
if %errorlevel% == 0 (
    echo Using Python to serve files on http://localhost:8000
    python -m http.server 8000
    goto :end
)

REM Check if Node.js is available
node --version >nul 2>&1
if %errorlevel% == 0 (
    echo Using Node.js http-server on http://localhost:8080
    npx http-server -p 8080
    goto :end
)

REM Check if PHP is available
php --version >nul 2>&1
if %errorlevel% == 0 (
    echo Using PHP built-in server on http://localhost:8000
    php -S localhost:8000
    goto :end
)

echo No suitable development server found.
echo Please install one of the following:
echo   - Python: python -m http.server
echo   - Node.js: npx http-server
echo   - PHP: php -S localhost:8000
echo Or use Docker: docker-compose up
pause

:end
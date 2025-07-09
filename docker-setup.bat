@echo off
echo 🚀 CampusKART Docker Setup
echo ==========================

REM Check if Docker is installed
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not installed. Please install Docker first.
    pause
    exit /b 1
)

REM Check if Docker Compose is installed
docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker Compose is not installed. Please install Docker Compose first.
    pause
    exit /b 1
)

echo ✅ Docker and Docker Compose are installed

REM Create .env file if it doesn't exist
if not exist .env (
    echo 📝 Creating .env file from template...
    copy env.example .env
    echo ✅ .env file created. Please edit it with your actual values.
) else (
    echo ✅ .env file already exists
)

REM Create uploads directory if it doesn't exist
if not exist uploads (
    echo 📁 Creating uploads directory...
    mkdir uploads
    echo ✅ uploads directory created
) else (
    echo ✅ uploads directory already exists
)

echo.
echo 🎯 Next steps:
echo 1. Edit the .env file with your actual values
echo 2. Run: docker-compose up --build
echo 3. Access the application at: http://localhost:3001
echo.
echo 📚 For more information, see README-Docker.md
pause 
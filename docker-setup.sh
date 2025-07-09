#!/bin/bash

echo "🚀 CampusKART Docker Setup"
echo "=========================="

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

echo "✅ Docker and Docker Compose are installed"

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp env.example .env
    echo "✅ .env file created. Please edit it with your actual values."
else
    echo "✅ .env file already exists"
fi

# Create uploads directory if it doesn't exist
if [ ! -d uploads ]; then
    echo "📁 Creating uploads directory..."
    mkdir uploads
    echo "✅ uploads directory created"
else
    echo "✅ uploads directory already exists"
fi

echo ""
echo "🎯 Next steps:"
echo "1. Edit the .env file with your actual values"
echo "2. Run: docker-compose up --build"
echo "3. Access the application at: http://localhost:3001"
echo ""
echo "📚 For more information, see README-Docker.md" 
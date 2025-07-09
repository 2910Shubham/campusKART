# CampusKART Docker Setup

This document explains how to run the CampusKART application using Docker.

## Prerequisites

- Docker
- Docker Compose

## Quick Start

1. **Clone the repository and navigate to the project directory**

2. **Set up environment variables**
   ```bash
   # Copy the example environment file
   cp env.example .env
   
   # Edit the .env file with your actual values
   nano .env
   ```

3. **Build and run the application**
   ```bash
   # Build and start all services
   docker-compose up --build
   
   # Or run in detached mode
   docker-compose up -d --build
   ```

4. **Access the application**
   - Web application: http://localhost:3001
   - MongoDB: localhost:27017

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# MongoDB Configuration
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=password

# JWT Configuration
JWT_KEY=your-super-secret-jwt-key-here

# Cloudinary Configuration (for image uploads)
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# Application Configuration
NODE_ENV=production
```

## Docker Commands

### Start services
```bash
docker-compose up
```

### Start services in background
```bash
docker-compose up -d
```

### Stop services
```bash
docker-compose down
```

### View logs
```bash
# All services
docker-compose logs

# Specific service
docker-compose logs app
docker-compose logs mongo
```

### Rebuild and restart
```bash
docker-compose up --build
```

### Access container shell
```bash
# App container
docker-compose exec app sh

# MongoDB container
docker-compose exec mongo mongosh
```

## Data Persistence

- MongoDB data is persisted in a Docker volume named `mongo_data`
- Uploaded files are stored in the `./uploads` directory (mounted as volume)

## Production Deployment

For production deployment:

1. **Update environment variables** with production values
2. **Use a reverse proxy** (like Nginx) for SSL termination
3. **Set up proper MongoDB authentication**
4. **Configure Cloudinary** with production credentials
5. **Use Docker secrets** for sensitive data

## Troubleshooting

### Port conflicts
If port 3001 or 27017 are already in use:
```bash
# Check what's using the ports
netstat -tulpn | grep :3001
netstat -tulpn | grep :27017

# Or modify docker-compose.yml to use different ports
```

### Permission issues
```bash
# Fix uploads directory permissions
sudo chown -R $USER:$USER ./uploads
```

### MongoDB connection issues
```bash
# Check MongoDB logs
docker-compose logs mongo

# Restart MongoDB service
docker-compose restart mongo
```

### Application not starting
```bash
# Check application logs
docker-compose logs app

# Rebuild the application
docker-compose up --build
``` 
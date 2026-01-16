# campusKART 🛒

A modern e-commerce platform built for campus communities, enabling students to buy and sell products seamlessly. campusKART provides user authentication, product management, and image upload capabilities with a clean and intuitive interface.

## ✨ Features

- **User Authentication**: Secure registration and login with JWT tokens and bcrypt password hashing
- **Product Management**: Create, list, edit, and manage product listings
- **User Profiles**: Personalized user profiles with profile update functionality
- **Image Upload**: Cloudinary integration for reliable image storage and delivery
- **Session Management**: Persistent session management with flash messages for user feedback
- **Responsive Design**: EJS templating for dynamic, responsive web pages
- **Docker Support**: Complete Docker and Docker Compose configuration for easy deployment

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** (v7 or higher)
- **MongoDB** (v4.4 or higher) - or use Docker Compose
- **Git**

### Optional
- **Docker** and **Docker Compose** (for containerized deployment)
- **Cloudinary Account** (for image upload functionality)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/campuskart.git
cd campuskart
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory and configure the following variables:

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

For development, you can use the provided `env.example` as a template:

```bash
cp env.example .env
```

### 4. Start the Application

#### Option A: Local Development (with Docker MongoDB)

```bash
# Start MongoDB using Docker Compose
docker-compose up -d

# Run the application
npm start
```

#### Option B: Full Docker Setup

**For Windows:**
```bash
.\docker-setup.bat
```

**For macOS/Linux:**
```bash
bash docker-setup.sh
```

#### Option C: Manual Setup

Ensure MongoDB is running on your machine, then:

```bash
npm start
```

The application will be available at `http://localhost:3000`

## 📁 Project Structure

```
campusKART/
├── app.js                      # Main application entry point
├── package.json                # Project dependencies
├── Dockerfile                  # Docker configuration
├── docker-compose.yml          # Docker Compose setup
├── env.example                 # Environment variables template
│
├── config/
│   ├── cloudinary.js          # Cloudinary configuration
│   ├── keys.js                # API keys management
│   ├── mongoose-connection.js # MongoDB connection setup
│   ├── development.json       # Development configuration
│   └── production.json        # Production configuration
│
├── controllers/
│   ├── authController.js      # Authentication logic
│   ├── productController.js   # Product operations (create, read)
│   ├── productEditController.js # Product update operations
│   └── profileController.js   # User profile management
│
├── routes/
│   ├── indexRouter.js         # Home page routes
│   ├── productRouter.js       # Product-related routes
│   └── userRouter.js          # User and auth routes
│
├── middlewares/
│   ├── isLoggedIn.js          # Authentication middleware
│   └── multerUpload.js        # File upload middleware
│
├── models/
│   ├── productModel.js        # Product schema and model
│   └── userModel.js           # User schema and model
│
├── views/
│   ├── home.ejs               # Home page template
│   ├── index.ejs              # Index page template
│   ├── product.ejs            # Product details page
│   ├── productEdit.ejs        # Product edit form
│   ├── list-product.ejs       # Products listing page
│   ├── profile.ejs            # User profile page
│   ├── profile-update.ejs     # Profile edit form
│   └── partials/
│       ├── header.ejs         # Header component
│       └── footer.ejs         # Footer component
│
├── public/
│   ├── images/                # Static images
│   ├── javascripts/           # Client-side JavaScript
│   └── stylesheet/            # CSS stylesheets
│
├── uploads/                   # Local file uploads (if using local storage)
├── mongo-init/                # MongoDB initialization scripts
└── utils/
    └── generateToken.js       # JWT token generation utility
```

## 🔧 Technology Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing and salting

### Frontend
- **EJS** - Embedded JavaScript templating
- **HTML5/CSS3** - Markup and styling
- **JavaScript** - Client-side interactivity

### External Services
- **Cloudinary** - Image storage and delivery
- **Docker** - Containerization

### Additional Libraries
- **express-session** - Session management
- **cookie-parser** - Cookie parsing
- **connect-flash** - Flash message handling
- **multer** - File upload handling
- **dotenv** - Environment variable management

## 📝 API Endpoints

### User Routes (`/user`)
- `POST /user/register` - Register a new user
- `POST /user/login` - User login
- `GET /user/logout` - User logout
- `GET /user/profile` - View user profile
- `POST /user/profile-update` - Update user profile

### Product Routes (`/product`)
- `GET /product` - Get all products
- `POST /product/create` - Create a new product
- `GET /product/:id` - Get product details
- `GET /product/:id/edit` - Edit product page
- `POST /product/:id/update` - Update product
- `POST /product/:id/delete` - Delete product

### Index Routes (`/`)
- `GET /` - Home page
- `GET /about` - About page

## 🔐 Security Features

- **Password Hashing**: bcryptjs for secure password storage
- **JWT Authentication**: Token-based authentication
- **Session Management**: Secure session handling with express-session
- **Environment Variables**: Sensitive data stored in .env file
- **Input Validation**: Middleware validation before processing user input

## 🐳 Docker Deployment

### Build and Run with Docker Compose

```bash
docker-compose up --build
```

This will:
- Create a MongoDB container
- Create a Node.js application container
- Set up networking between containers
- Initialize the database

### Stop Docker Containers

```bash
docker-compose down
```

## 📚 Configuration Files

### `config/development.json`
Development-specific configuration settings

### `config/production.json`
Production-specific configuration settings

### `config/keys.js`
Central configuration loader that selects between development and production configs based on NODE_ENV

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License - see the LICENSE file for details.

## 💡 Future Enhancements

- [ ] Payment gateway integration (Stripe/PayPal)
- [ ] Advanced search and filtering
- [ ] Product reviews and ratings
- [ ] Order tracking system
- [ ] Email notifications
- [ ] Admin dashboard
- [ ] Analytics and reporting
- [ ] Mobile app version

## 🆘 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running and accessible
- Check MONGO_ROOT_USERNAME and MONGO_ROOT_PASSWORD in .env
- Verify MongoDB connection string in `config/mongoose-connection.js`

### Image Upload Issues
- Verify Cloudinary credentials in .env
- Check internet connection for cloud upload
- Ensure file size limits are appropriate

### Session Issues
- Clear browser cookies and cache
- Verify JWT_KEY is set correctly in .env
- Check express-session configuration

## 📞 Support

For issues and questions, please open an issue on the GitHub repository or contact the development team.

---

**Made with ❤️ for campus communities**

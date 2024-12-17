# E-commerce API

## Overview
A comprehensive e-commerce REST API built with Express, Node.js, and PostgreSQL. This API enables CRUD operations for products, user accounts, shopping carts, and orders, with Swagger documentation for easy endpoint interaction.

## Features
- **User Registration and Authentication**
  - User registration
  - JWT-based authentication
- **Product Management**
  - Full CRUD operations for products
- **User Account Management**
  - Update user information
  - Account deletion
- **Shopping Cart Management**
  - Add/remove items
  - Update quantities
- **Order Management**
  - Place orders
  - View order history
  - Update/cancel orders
- **Checkout Process**
  - Simulated checkout
  - Automatic order creation
- **API Documentation**
  - Interactive Swagger UI

## Technologies
- Node.js
- Express
- PostgreSQL
- Sequelize ORM
- Swagger UI
- JWT
- bcrypt
- dotenv
- Git

## Setup Instructions
1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd ecommerce-api
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment:**
   Create a `.env` file:
   ```
   DATABASE_URL=postgres://<username>:<password>@localhost:5432/<database-name>
   JWT_SECRET=<your_jwt_secret_key>
   PORT=3000
   NODE_ENV=development
   ```

4. **Database Setup:**
   - Ensure PostgreSQL is installed
   - Create database: `createdb <database-name>`
   - Test connection: `node src/config/db.js`
   - Run migrations: `npx sequelize-cli db:migrate`

5. **Start the server:**
   ```bash
   node src/server.js
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user

### Users
- `GET /api/users/:id` - Get user info
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Products
- `GET /api/products` - List products
- `GET /api/products/:id` - Get product
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Shopping Cart
- `GET /api/carts` - List carts
- `GET /api/carts/:id` - Get cart
- `POST /api/carts` - Create cart
- `PUT /api/carts/:id` - Update cart
- `DELETE /api/carts/:id` - Delete cart

### Orders
- `GET /api/orders` - List orders
- `GET /api/orders/:id` - Get order
- `POST /api/orders` - Create order
- `PUT /api/orders/:id` - Update order
- `DELETE /api/orders/:id` - Cancel order

## Authentication
Use JWT tokens in Authorization header:
```
Authorization: Bearer <token>
```

## Error Codes
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Server Error

## Contact
- Email: emilio.pg95@gmail.com
- GitHub: https://github.com/EmilioPG13

## Future Enhancements
- Automated testing
- Enhanced security features
- Global error handling
- Performance optimization
- Payment processing integration
- Cloud deployment
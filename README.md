# E-commerce API

## Overview
A comprehensive e-commerce REST API built with Express, Node.js, and PostgreSQL, complemented by a React-based frontend. This API enables CRUD operations for products, user accounts, shopping carts, and orders, with Swagger documentation for easy endpoint interaction. The client application provides a user-friendly interface for interacting with the API.

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
- **Interactive Frontend**
  - React-based client for seamless user experience

## Technologies
- **Backend:**
  - Node.js
  - Express
  - PostgreSQL
  - Sequelize ORM
  - Swagger UI
  - JWT
  - bcrypt
  - dotenv
  - Git
- **Frontend:**
  - React
  - Tailwind CSS
  - Axios
  - React Router

    ...
  ## Setup Instructions
  
  ### Backend Setup
  1.  **Clone the repository:**
      ```bash
      git clone <repository-url>
      cd ecommerce-api
      ```
  2.  **Install dependencies:**
      ```bash
      npm install
      ```
  3.  **Configure Environment:**
      Create a `.env` file in the root directory:
      ```
      DATABASE_URL=postgres://<username>:<password>@localhost:5432/<database-name>
      JWT_SECRET=<your_jwt_secret_key>
      PORT=3000
      NODE_ENV=development
      ```
  4.  **Database Setup:**
      -   Ensure PostgreSQL is installed
      -   Create database: `createdb <database-name>`
      -   Test connection: `node src/config/db.js`
      -   Run migrations: `npx sequelize-cli db:migrate`
  5.  **Start the server:**
      ```bash
      node src/server.js
      ```
  
  ### Frontend Setup
  
  1.  **Navigate to the client directory:**
      ```bash
      cd client
      ```
  2.  **Install dependencies:**
      ```bash
      npm install
      ```
  3.  **Configure Environment:**
      Create a `.env` file in the `client` directory:
      ```
      REACT_APP_API_URL=http://localhost:3000/api
      REACT_APP_STRIPE_PUBLIC_KEY=<your_stripe_public_key>
      ```
  4.  **Start the client:**
      ```bash
      npm start
      ```
  // filepath: c:\Users\Emili\Desktop\Studies\Codecademy\ecommerce-api\README.md
  ...
  ## Setup Instructions
  
  ### Backend Setup
  1.  **Clone the repository:**
      ```bash
      git clone <repository-url>
      cd ecommerce-api
      ```
  2.  **Install dependencies:**
      ```bash
      npm install
      ```
  3.  **Configure Environment:**
      Create a `.env` file in the root directory:
      ```
      DATABASE_URL=postgres://<username>:<password>@localhost:5432/<database-name>
      JWT_SECRET=<your_jwt_secret_key>
      PORT=3000
      NODE_ENV=development
      ```
  4.  **Database Setup:**
      -   Ensure PostgreSQL is installed
      -   Create database: `createdb <database-name>`
      -   Test connection: `node src/config/db.js`
      -   Run migrations: `npx sequelize-cli db:migrate`
  5.  **Start the server:**
      ```bash
      node src/server.js
      ```
  
  ### Frontend Setup
  
  1.  **Navigate to the client directory:**
      ```bash
      cd client
      ```
  2.  **Install dependencies:**
      ```bash
      npm install
      ```
  3.  **Configure Environment:**
      Create a `.env` file in the `client` directory:
      ```
      REACT_APP_API_URL=http://localhost:3000/api
      REACT_APP_STRIPE_PUBLIC_KEY=<your_stripe_public_key>
      ```
  4.  **Start the client:**
      ```bash
      npm start
      ```
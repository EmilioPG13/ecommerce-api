# E-commerce API

## Overview
A comprehensive e-commerce REST API built with Express, Node.js, and PostgreSQL, complemented by a React-based frontend. This API enables CRUD operations for products, user accounts, shopping carts, and orders, with Swagger documentation for easy endpoint interaction. The client application provides a user-friendly interface for interacting with the API. This project is deployed on Render.

## Features
- **User Registration and Authentication**
  - User registration
  - JWT-based authentication
- **Product Management**
  - Full CRUD operations for products
  - Seeding script to import products from an external API ([`importProducts.js`](importProducts.js))
- **User Account Management**
  - Update user information ([`src/controllers/userController.js`](src/controllers/userController.js))
  - Account deletion ([`src/controllers/userController.js`](src/controllers/userController.js))
- **Shopping Cart Management**
  - Add/remove items
  - Update quantities
  - View cart summary ([`src/controllers/cartController.js`](src/controllers/cartController.js))
- **Order Management**
  - Place orders via checkout
  - View order history (Functionality may need implementation/verification)
- **Checkout Process**
  - Transactional checkout process ([`src/controllers/checkoutController.js`](src/controllers/checkoutController.js))
  - Creates an order and order items, then clears the cart.
- **API Documentation**
  - Interactive Swagger UI (`/api-docs`)
- **Interactive Frontend** ([`client/`](client/))
  - React-based client for seamless user experience ([`client/src/App.js`](client/src/App.js))
  - Uses Tailwind CSS for styling ([`client/src/index.css`](client/src/index.css))
  - Interacts with backend API via Axios ([`client/src/services/api.js`](client/src/services/api.js))

## Technologies
- **Backend:**
  - Node.js
  - Express ([`src/app.js`](src/app.js))
  - PostgreSQL
  - Sequelize ORM ([`src/config/db.js`](src/config/db.js), [`models/`](models/), [`src/models/`](src/models/))
  - Swagger UI
  - JWT (for authentication)
  - bcrypt (for password hashing)
  - dotenv (for environment variables)
  - CORS
  - Git
- **Frontend:**
  - React ([`client/src/App.js`](client/src/App.js))
  - Tailwind CSS ([`client/tailwind.config.js`](client/tailwind.config.js))
  - Axios
  - React Router
  - Stripe.js (for payment element in [`client/src/pages/Checkout.jsx`](client/src/pages/Checkout.jsx))

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
    Create a [`.env`](.env) file in the root directory with the following variables. Use `DATABASE_URL` *or* the individual `DB_*` variables depending on your [`src/config/db.js`](src/config/db.js) setup.
    ```dotenv
    # Option 1: Connection String
    DATABASE_URL=postgres://<username>:<password>@<host>:<port>/<database-name>

    # Option 2: Individual Variables (often preferred for flexibility)
    DB_HOST=<host>
    DB_USER=<username>
    DB_PASSWORD=<password>
    DB_NAME=<database-name>
    DB_PORT=<port> # Usually 5432

    # Required Variables
    JWT_SECRET=<your_very_strong_jwt_secret_key>
    PORT=3000 # Or another port if 3000 is taken
    NODE_ENV=development # Use 'production' in production environments

    # Required for CORS in production/deployment
    FRONTEND_URL=http://localhost:3001 # URL of your running frontend (change for deployment)
    ```
4.  **Database Setup:**
    -   Ensure PostgreSQL is installed and running.
    -   Create your database using a tool like `psql` or a GUI: `createdb <database-name>`
    -   Run migrations to create tables: `npx sequelize-cli db:migrate` ([`.sequelizerc`](.sequelizerc), [`src/migrations/`](src/migrations/))
5.  **Seed Database (Optional but Recommended):**
    Populate the database with initial product data using the import script. Ensure your [`.env`](.env) file is configured correctly for the target database (local or production).
    ```bash
    node importProducts.js
    ```
6.  **Start the server:**
    ```bash
    npm run start # Or node src/server.js
    ```
    The API should be running at `http://localhost:PORT` (e.g., `http://localhost:3000`). Access Swagger docs at `/api-docs`.

### Frontend Setup ([`client/`](client/))

1.  **Navigate to the client directory:**
    ```bash
    cd client
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Configure Environment:**
    Create a [`.env`](client/.env) file in the `client` directory:
    ```dotenv
    REACT_APP_API_URL=http://localhost:3000/api # Adjust port if backend runs elsewhere
    REACT_APP_STRIPE_PUBLIC_KEY=<your_stripe_publishable_key>
    ```
4.  **Start the client:**
    ```bash
    npm start
    ```
    The React app should open in your browser, typically at `http://localhost:3001`.

## Deployment

This application is configured for deployment on platforms like Render. Key considerations:

-   Set environment variables (`DATABASE_URL` or `DB_*`, `JWT_SECRET`, `NODE_ENV=production`, `FRONTEND_URL`, `REACT_APP_API_URL`, `REACT_APP_STRIPE_PUBLIC_KEY`) in the Render service settings.
-   Ensure the backend service's `FRONTEND_URL` correctly points to the deployed frontend URL for CORS.
-   Ensure the frontend service's `REACT_APP_API_URL` correctly points to the deployed backend API URL.
-   Use Render's PostgreSQL addon for the database.
-   Run migrations as part of the build or deploy process (`npx sequelize-cli db:migrate`).
-   Run the `importProducts.js` script against the production database (e.g., via Render's shell or by temporarily configuring your local environment) to seed initial data.

## API Endpoints

Refer to the Swagger documentation available at `/api-docs` when the backend server is running.
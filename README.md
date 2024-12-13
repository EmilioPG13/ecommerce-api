# E-commerce API

## Overview
This project is an e-commerce application REST API built using Express, Node.js, and PostgreSQL. It allows users to perform various CRUD operations related to products, user accounts, shopping carts, and orders.

## Features
- User registration and authentication
- Product management (CRUD operations)
- User account management (CRUD operations)
- Shopping cart management (CRUD operations)
- Order placement and management (CRUD operations)
- API documentation using Swagger

## Technologies Used
- Node.js
- Express
- PostgreSQL
- Swagger for API documentation
- Git for version control

## Project Structure
```
ecommerce-api
├── src
│   ├── controllers          # Contains controller files for handling requests
│   ├── models               # Contains model files for database schemas
│   ├── routes               # Contains route files for API endpoints
│   ├── middleware           # Contains middleware for authentication
│   ├── config               # Contains configuration files
│   ├── app.js               # Initializes the Express application
│   └── server.js            # Starts the server and connects to the database
├── swagger                  # Contains API documentation
├── package.json             # NPM configuration file
├── .gitignore               # Specifies files to ignore in Git
├── README.md                # Project documentation
└── .env                     # Environment variables
```

## Setup Instructions
1. Clone the repository:
   ```
   git clone <repository-url>
   cd ecommerce-api
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory and add your environment variables, such as database connection strings and secret keys.

4. Start the server:
   ```
   npm start
   ```

5. Access the API documentation at `http://localhost:<port>/api-docs` (replace `<port>` with the port number specified in your server configuration).

## API Usage
Refer to the Swagger documentation for detailed information on the available endpoints and their usage.

## Contributing
Contributions are welcome! Please submit a pull request or open an issue for any suggestions or improvements.
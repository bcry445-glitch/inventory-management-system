const swaggerDocs = {
  openapi: '3.0.0',
  info: {
    title: 'Allied Enterprise Inventory API',
    version: '1.0.0',
    description: 'REST API documentation for the Inventory & Order Management System.',
    contact: {
      name: 'Muhammad Fazeel Khan',
    },
  },
  servers: [
    {
      url: 'https://inventory-management-system-1-6tuq.onrender.com/api',
      description: 'Production Server',
    },
    {
      url: 'http://localhost:5000/api',
      description: 'Development Server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
  paths: {
    "/products": {
      "get": {
        "tags": ["Products"],
        "summary": "Get all products",
        "responses": {
          "200": { "description": "Successful operation" }
        }
      },
      "post": {
        "tags": ["Products"],
        "summary": "Create a new product",
        "responses": {
          "201": { "description": "Product created successfully" }
        }
      }
    },
    "/orders": {
      "get": {
        "tags": ["Orders"],
        "summary": "Get all orders",
        "responses": {
          "200": { "description": "Successful operation" }
        }
      },
      "post": {
        "tags": ["Orders"],
        "summary": "Place a new order",
        "responses": {
          "201": { "description": "Order placed successfully" }
        }
      }
    }
  }
};

module.exports = swaggerDocs;
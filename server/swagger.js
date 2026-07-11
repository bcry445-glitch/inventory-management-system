const swaggerJsDoc = require('swagger-jsdoc');

const swaggerOptions = {
  swaggerDefinition: {
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
  },
  // This points to where your route comments are written. 
  // Adjust the path if your routes are in a different folder structure.
  apis: ['./routes/*.js', './controllers/*.js'], 
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = swaggerDocs;
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Dish Booking System API',
      version: '1.0.0',
      description: 'A dish booking system with multi-role access and password reset functionality',
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3000}`,
        description: 'Development server',
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
      schemas: {
        User: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            id: {
              type: 'string',
              description: 'Auto-generated user ID'
            },
            name: {
              type: 'string',
              description: 'User name'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email'
            },
            password: {
              type: 'string',
              description: 'User password'
            },
            role: {
              type: 'string',
              enum: ['user', 'chef', 'admin'],
              default: 'user',
              description: 'User role'
            }
          }
        },
        Dish: {
          type: 'object',
          required: ['name', 'price', 'description'],
          properties: {
            id: {
              type: 'string',
              description: 'Auto-generated dish ID'
            },
            name: {
              type: 'string',
              description: 'Dish name'
            },
            description: {
              type: 'string',
              description: 'Dish description'
            },
            price: {
              type: 'number',
              description: 'Dish price'
            },
            category: {
              type: 'string',
              description: 'Dish category'
            },
            isAvailable: {
              type: 'boolean',
              default: true,
              description: 'Dish availability'
            }
          }
        },
        Order: {
          type: 'object',
          required: ['dishId', 'quantity'],
          properties: {
            id: {
              type: 'string',
              description: 'Auto-generated order ID'
            },
            userId: {
              type: 'string',
              description: 'User who placed the order'
            },
            dishId: {
              type: 'string',
              description: 'Ordered dish ID'
            },
            quantity: {
              type: 'number',
              minimum: 1,
              description: 'Order quantity'
            },
            status: {
              type: 'string',
              enum: ['Order Received', 'Preparing', 'Out for Delivery', 'Delivered'],
              default: 'Order Received',
              description: 'Order status'
            },
            assignedChef: {
              type: 'string',
              description: 'Chef assigned to this order'
            },
            totalAmount: {
              type: 'number',
              description: 'Total order amount'
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./src/routes/*.js'], 
}
const specs = swaggerJsdoc(options);

module.exports = specs;
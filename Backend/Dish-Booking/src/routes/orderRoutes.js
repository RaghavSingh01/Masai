const express = require('express');
const router = express.Router();
const {
  createOrder,
  getAllOrders,
  getOrder,
  updateOrderStatus,
  getMyOrders,
  getAssignedOrders
} = require('../controllers/orderController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create a new order (User only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - dish
 *               - quantity
 *             properties:
 *               dish:
 *                 type: string
 *                 description: Dish ID
 *                 example: "64f123456789abcdef123456"
 *               quantity:
 *                 type: number
 *                 minimum: 1
 *                 example: 2
 *               specialInstructions:
 *                 type: string
 *                 example: "Extra spicy please"
 *               deliveryAddress:
 *                 type: object
 *                 properties:
 *                   street:
 *                     type: string
 *                     example: "123 Main St"
 *                   city:
 *                     type: string
 *                     example: "Mumbai"
 *                   zipCode:
 *                     type: string
 *                     example: "400001"
 *                   phone:
 *                     type: string
 *                     example: "+91 9876543210"
 *     responses:
 *       201:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     order:
 *                       $ref: '#/components/schemas/Order'
 *       400:
 *         description: Bad request
 *       403:
 *         description: Access denied
 */
router.post('/', protect, authorize('user'), createOrder);

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Get all orders (Role-based access)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Order Received, Preparing, Out for Delivery, Delivered]
 *         description: Filter by status
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Items per page
 *     responses:
 *       200:
 *         description: Orders retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     orders:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Order'
 *                     pagination:
 *                       type: object
 */
router.get('/', protect, getAllOrders);

/**
 * @swagger
 * /api/orders/my-orders:
 *   get:
 *     summary: Get current user's orders
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Order Received, Preparing, Out for Delivery, Delivered]
 *         description: Filter by status
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Items per page
 *     responses:
 *       200:
 *         description: User orders retrieved successfully
 */
router.get('/my-orders', protect, authorize('user'), getMyOrders);

/**
 * @swagger
 * /api/orders/assigned-orders:
 *   get:
 *     summary: Get chef's assigned orders
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Order Received, Preparing, Out for Delivery, Delivered]
 *         description: Filter by status
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Items per page
 *     responses:
 *       200:
 *         description: Assigned orders retrieved successfully
 */
router.get('/assigned-orders', protect, authorize('chef'), getAssignedOrders);

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Get single order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     order:
 *                       $ref: '#/components/schemas/Order'
 *       403:
 *         description: Access denied
 *       404:
 *         description: Order not found
 */
router.get('/:id', protect, getOrder);

/**
 * @swagger
 * /api/orders/{id}/status:
 *   patch:
 *     summary: Update order status (Chef/Admin only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [Order Received, Preparing, Out for Delivery, Delivered]
 *                 example: "Preparing"
 *     responses:
 *       200:
 *         description: Order status updated successfully
 *       403:
 *         description: Access denied
 *       404:
 *         description: Order not found
 */
router.patch('/:id/status', protect, authorize('chef', 'admin'), updateOrderStatus);

module.exports = router;
const express = require('express');
const router = express.Router();
const {
  getAllDishes,
  getDish,
  createDish,
  updateDish,
  deleteDish,
  toggleAvailability
} = require('../controllers/dishController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');

/**
 * @swagger
 * /api/dishes:
 *   get:
 *     summary: Get all dishes
 *     tags: [Dishes]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [appetizer, main-course, dessert, beverage, salad]
 *         description: Filter by category
 *       - in: query
 *         name: available
 *         schema:
 *           type: boolean
 *         description: Filter by availability
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in name and description
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
 *         description: Dishes retrieved successfully
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
 *                     dishes:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Dish'
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         current:
 *                           type: integer
 *                         pages:
 *                           type: integer
 *                         total:
 *                           type: integer
 */
router.get('/', getAllDishes);

/**
 * @swagger
 * /api/dishes:
 *   post:
 *     summary: Create a new dish (Admin only)
 *     tags: [Dishes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - price
 *               - category
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Chicken Biryani"
 *               description:
 *                 type: string
 *                 example: "Aromatic basmati rice with tender chicken"
 *               price:
 *                 type: number
 *                 example: 299
 *               category:
 *                 type: string
 *                 enum: [appetizer, main-course, dessert, beverage, salad]
 *                 example: "main-course"
 *               ingredients:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["rice", "chicken", "spices"]
 *               preparationTime:
 *                 type: number
 *                 example: 45
 *               image:
 *                 type: string
 *                 example: "https://example.com/image.jpg"
 *     responses:
 *       201:
 *         description: Dish created successfully
 *       403:
 *         description: Access denied
 */
router.post('/', protect, authorize('admin'), createDish);

/**
 * @swagger
 * /api/dishes/{id}:
 *   get:
 *     summary: Get single dish
 *     tags: [Dishes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Dish ID
 *     responses:
 *       200:
 *         description: Dish retrieved successfully
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
 *                     dish:
 *                       $ref: '#/components/schemas/Dish'
 *       404:
 *         description: Dish not found
 */
router.get('/:id', getDish);

/**
 * @swagger
 * /api/dishes/{id}:
 *   put:
 *     summary: Update dish (Admin only)
 *     tags: [Dishes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Dish ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Dish'
 *     responses:
 *       200:
 *         description: Dish updated successfully
 *       403:
 *         description: Access denied
 *       404:
 *         description: Dish not found
 */
router.put('/:id', protect, authorize('admin'), updateDish);

/**
 * @swagger
 * /api/dishes/{id}:
 *   delete:
 *     summary: Delete dish (Admin only)
 *     tags: [Dishes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Dish ID
 *     responses:
 *       200:
 *         description: Dish deleted successfully
 *       403:
 *         description: Access denied
 *       404:
 *         description: Dish not found
 */
router.delete('/:id', protect, authorize('admin'), deleteDish);

/**
 * @swagger
 * /api/dishes/{id}/availability:
 *   patch:
 *     summary: Toggle dish availability (Admin only)
 *     tags: [Dishes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Dish ID
 *     responses:
 *       200:
 *         description: Dish availability updated successfully
 *       403:
 *         description: Access denied
 *       404:
 *         description: Dish not found
 */
router.patch('/:id/availability', protect, authorize('admin'), toggleAvailability);

module.exports = router;
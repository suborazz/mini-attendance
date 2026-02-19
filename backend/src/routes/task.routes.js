const express = require('express');
const router = express.Router();
const taskController = require('../controllers/task.controller');
const authMiddleware = require('../middleware/auth.middleware');

const { body } = require('express-validator');

router.use(authMiddleware);

router.post('/', [
    body('title').notEmpty().withMessage('Title is required')
], taskController.createTask);

router.get('/', taskController.getTasks);

router.put('/:id', [
    body('title').optional().notEmpty().withMessage('Title cannot be empty'),
    body('status').optional().isIn(['pending', 'completed']).withMessage('Invalid status')
], taskController.updateTask);

router.delete('/:id', taskController.deleteTask);

module.exports = router;

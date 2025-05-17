const express = require('express');
const router = express.Router();
const goalController = require('../controllers/goalController');
const auth = require('../middleware/auth');

// All routes are protected
router.use(auth);

// CRUD operations
router.post('/', goalController.createGoal);
router.get('/my', goalController.getUserGoals);
router.get('/public', goalController.getPublicGoals);
router.get('/:id', goalController.getGoal);
router.put('/:id', goalController.updateGoal);
router.delete('/:id', goalController.deleteGoal);

// Additional operations
router.patch('/:id/progress', goalController.updateProgress);
router.post('/:id/like', goalController.toggleLike);
router.post('/:id/notes', goalController.addNote);

module.exports = router; 
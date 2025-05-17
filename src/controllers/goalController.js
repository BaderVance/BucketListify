const Goal = require('../models/Goal');
const User = require('../models/User');

// Create new goal
exports.createGoal = async (req, res) => {
  try {
    const goal = new Goal({
      ...req.body,
      user: req.user._id
    });

    await goal.save();
    res.status(201).json(goal);
  } catch (error) {
    res.status(500).json({ message: 'Error creating goal', error: error.message });
  }
};

// Get all goals for current user
exports.getUserGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ user: req.user._id })
      .sort({ createdAt: -1 });
    res.json(goals);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching goals', error: error.message });
  }
};

// Get public goals from all users
exports.getPublicGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ isPublic: true })
      .populate('user', 'username profilePicture')
      .sort({ createdAt: -1 });
    res.json(goals);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching public goals', error: error.message });
  }
};

// Get single goal
exports.getGoal = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id)
      .populate('user', 'username profilePicture');

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    if (!goal.isPublic && goal.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this goal' });
    }

    res.json(goal);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching goal', error: error.message });
  }
};

// Update goal
exports.updateGoal = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    if (goal.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this goal' });
    }

    Object.assign(goal, req.body);
    await goal.save();

    res.json(goal);
  } catch (error) {
    res.status(500).json({ message: 'Error updating goal', error: error.message });
  }
};

// Delete goal
exports.deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    if (goal.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this goal' });
    }

    await goal.remove();
    res.json({ message: 'Goal deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting goal', error: error.message });
  }
};

// Update goal progress
exports.updateProgress = async (req, res) => {
  try {
    const { progress } = req.body;
    const goal = await Goal.findById(req.params.id);

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    if (goal.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this goal' });
    }

    await goal.updateProgress(progress);
    res.json(goal);
  } catch (error) {
    res.status(500).json({ message: 'Error updating progress', error: error.message });
  }
};

// Like/Unlike goal
exports.toggleLike = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    const likeIndex = goal.likes.indexOf(req.user._id);
    
    if (likeIndex === -1) {
      goal.likes.push(req.user._id);
    } else {
      goal.likes.splice(likeIndex, 1);
    }

    await goal.save();
    res.json(goal);
  } catch (error) {
    res.status(500).json({ message: 'Error toggling like', error: error.message });
  }
};

// Add note to goal
exports.addNote = async (req, res) => {
  try {
    const { content } = req.body;
    const goal = await Goal.findById(req.params.id);

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    if (goal.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to add notes to this goal' });
    }

    goal.notes.push({ content });
    await goal.save();

    res.json(goal);
  } catch (error) {
    res.status(500).json({ message: 'Error adding note', error: error.message });
  }
}; 
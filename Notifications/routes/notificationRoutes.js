// IMAS/Notifications/routes/notificationRoutes.js
const express = require('express');
const router = express.Router();
const Notification = require('../model/Notification');
const { jwtAuthMiddleware } = require('../../jwt');

// Get current user's notifications
router.get('/', jwtAuthMiddleware, async (req, res) => {
  const notifications = await Notification.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.json(notifications);
});

// Mark notification as read
router.patch('/:id/read', jwtAuthMiddleware, async (req, res) => {
  await Notification.findByIdAndUpdate(req.params.id, { read: true });
  res.json({ success: true });
});

module.exports = router;

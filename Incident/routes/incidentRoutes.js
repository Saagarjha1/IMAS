const express = require('express');
const router = express.Router();
const Incident = require('../models/Incident');
const { jwtAuthMiddleware } = require('../../jwt');
const rbac = require('../../rbac');

// Create Incident
router.post('/', jwtAuthMiddleware, rbac(['admin', 'engineer', 'user']), async (req, res) => {
  try {
    const incident = new Incident(req.body);
    await incident.save();
    res.status(201).json(incident);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get All Incidents
router.get('/', jwtAuthMiddleware, rbac(['admin', 'engineer']), async (req, res) => {
  const incidents = await Incident.find().populate('assignedTo', 'username');
  res.status(200).json(incidents);
});

// Update Incident
router.put('/:id', jwtAuthMiddleware, rbac(['admin', 'engineer']), async (req, res) => {
  const updated = await Incident.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.status(200).json(updated);
});

// Delete Incident
router.delete('/:id', jwtAuthMiddleware, rbac(['admin']), async (req, res) => {
  await Incident.findByIdAndDelete(req.params.id);
  res.status(204).send();
});

module.exports = router;

const express = require('express');
const router = express.Router();
const {jwtAuthMiddleware} = require('../../jwt');
const rbac = require('../../rbac');
const Record = require('../models/Record');

// Create record — only 'admin'
router.post('/records', jwtAuthMiddleware, rbac(['admin']), async (req, res) => {
  const record = new Record(req.body);
  await record.save();
  res.status(201).json(record);
});

// View records — any authenticated role
router.get('/records', jwtAuthMiddleware, rbac(['viewer', 'editor', 'admin']), async (req, res) => {
  const records = await Record.find();
  res.status(200).json(records);
});

// Update record — only 'editor' and 'admin'
router.put('/records/:id', jwtAuthMiddleware, rbac(['editor', 'admin']), async (req, res) => {
  const record = await Record.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.status(200).json(record);
});
module.exports=router;
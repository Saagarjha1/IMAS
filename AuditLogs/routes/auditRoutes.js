const express = require('express');
const router = express.Router();
const AuditLog = require('../model/AuditLog');
const { jwtAuthMiddleware } = require('../../jwt');
const rbac = require('../../rbac');

router.get('/', jwtAuthMiddleware, rbac(['admin', 'engineer']), async (req, res) => {
  const logs = await AuditLog.find().sort({ createdAt: -1 }).populate('actor', 'username role');
  res.json(logs);
});

module.exports = router;

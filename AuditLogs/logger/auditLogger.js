const AuditLog = require('../model/AuditLog');

const logAudit = async ({ action, actor, target, description }) => {
  try {
    await AuditLog.create({ action, actor, target, description });
  } catch (err) {
    console.error('❌ Failed to log audit:', err.message);
  }
};

module.exports = { logAudit };

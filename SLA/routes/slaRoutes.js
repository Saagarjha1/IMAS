const express= require('express');
const router=express.Router();

const Incident=require('../../Incident/models/Incident');
const {jwtAuthMiddleware}=require('../../jwt');
const rbac=require('../../rbac');
const { checkSlaViolations } = require('../../slaViolationChecker'); //Added import
const { addNotificationJob } = require('../../notificationQueue');
const { logAudit } = require('../../AuditLogs/logger/auditLogger');
console.log('🧪 DEBUG — typeof logAudit:', typeof logAudit);
// 📌 Assign SLA Hours Based on Priority
router.post('/assign-sla', jwtAuthMiddleware, rbac(['admin']), async (req, res) => {
  const { id, priority } = req.body;
  const slaMap = { low: 48, medium: 24, high: 4 };

  try {
    if (!slaMap[priority.toLowerCase()]) {
      return res.status(400).json({ error: 'Invalid priority value' });
    }

    const updated = await Incident.findByIdAndUpdate(
      id,
      { slaHours: slaMap[priority.toLowerCase()] },
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: 'Incident not found' });

    // ✅ Log SLA assignment
    await logAudit({
      action: 'SLA_ASSIGNED',
      actor: req.user.id,
      target: updated._id,
      description: `SLA (${slaMap[priority.toLowerCase()]} hrs) assigned to "${updated.title}"`
    });

    res.status(200).json({
      message: `SLA of ${slaMap[priority.toLowerCase()]} hours assigned.`,
      incident: updated
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

// 🚨 Get SLA Violations and Queue Notifications
router.get('/violations', jwtAuthMiddleware, rbac(['admin', 'engineer']), async (req, res) => {
  try {
    const result = await checkSlaViolations(req.user.id); // ✅ Optional: log actor

    res.status(200).json({
      message: 'SLA violations processed.',
      notified: result.notifiedCount,
      skipped: result.skippedCount,
      totalViolations: result.violations.length
    });
  } catch (err) {
    console.error('Error checking SLA violations:', err);
    res.status(500).json({ error: 'Failed to check SLA violations' });
  }
});

module.exports = router;
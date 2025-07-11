const express= require('express');
const router=express.Router();
const Incident=require('../../Incident/models/Incident');
const {jwtAuthMiddleware}=require('../../jwt');
const rbac=require('../../rbac');
const { addNotificationJob } = require('../../Notifications/notificationQueue');
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
    const now = new Date();

    const violations = await Incident.find({
      status: { $ne: 'closed' },
      slaHours: { $exists: true },
      $expr: {
        $lt: [
          { $add: ["$createdAt", { $multiply: ["$slaHours", 3600000] }] },
          now
        ]
      }
    });

    const queued = [];
    const skipped = [];

    for (let incident of violations) {
      if (incident.assignedTo) {
        console.log(`📤 Queuing SLA notification for: ${incident.title}`);

        await addNotificationJob({
          userId: incident.assignedTo,
          message: `🚨 SLA violated for incident "${incident.title}"`,
          type: 'escalation'
        });

        // ✅ Log SLA breach
        await logAudit({
          action: 'SLA_BREACH',
          actor: req.user.id,
          target: incident._id,
          description: `SLA violated for "${incident.title}"`
        });

        queued.push(incident.title);
      } else {
        console.log(`⚠️ Skipped: No assigned engineer for incident "${incident.title}"`);
        skipped.push(incident.title);
      }
    }

    res.status(200).json({
      message: 'SLA violations processed.',
      total: violations.length,
      queuedCount: queued.length,
      skippedCount: skipped.length,
      queued,
      skipped
    });
  } catch (err) {
    console.error('Error checking SLA violations:', err);
    res.status(500).json({ error: 'Failed to check SLA violations' });
  }
});

module.exports = router;
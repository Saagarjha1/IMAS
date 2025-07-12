// slaViolationChecker.js
const cron = require('node-cron');
const Incident = require('./Incident/models/Incident');
const { addNotificationJob } = require('./notificationQueue');
const { logAudit } = require('./AuditLogs/logger/auditLogger');

const checkSlaViolations = async () => {
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

    let notified = 0;
    let skipped = 0;

    for (let incident of violations) {
      if (incident.assignedTo) {
        console.log(`📤 Queuing SLA notification for: ${incident.title}`);

        await addNotificationJob({
          userId: incident.assignedTo,
          message: `🚨 SLA violated for incident "${incident.title}"`,
          type: 'escalation'
        });

        await logAudit({
          action: 'SLA_BREACH',
          actor: 'SYSTEM',
          target: incident._id,
          description: `SLA violated for "${incident.title}" (automated)`
        });

        notified++;
      } else {
        console.log(`⚠️ Skipped: No assigned engineer for incident "${incident.title}"`);
        skipped++;
      }
    }

    return {
      totalViolations: violations.length,
      notified,
      skipped
    };
  } catch (err) {
    console.error('❌ SLA check failed:', err.message);
    return { error: err.message };
  }
};
module.exports = { checkSlaViolations };
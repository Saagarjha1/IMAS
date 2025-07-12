const mongoose = require('mongoose');

const auditSchema = new mongoose.Schema({
  action: { type: String, required: true }, // e.g. "SLA_BREACH", "ESCALATION", "SLA_ASSIGNED"
  actor: { type: mongoose.Schema.Types.Mixed, ref: 'Person' }, // who did it
  target: { type: mongoose.Schema.Types.ObjectId }, // incident/user id involved
  description: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AuditLog', auditSchema);

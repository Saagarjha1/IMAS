const mongoose = require('mongoose');

const incidentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  type: { type: String, enum: ['bug', 'feature', 'task'], default: 'task' },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  status: { type: String, enum: ['open', 'in-progress', 'closed'], default: 'open' },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Person' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  slaHours: Number
});

incidentSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Incident', incidentSchema);

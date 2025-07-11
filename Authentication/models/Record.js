// IMAS/RecordManagement/models/Record.js

const mongoose = require('mongoose');

const recordSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Person',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date
  }
});

// Auto-update updatedAt field on save
recordSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

const Record = mongoose.model('Record', recordSchema);
module.exports = Record;

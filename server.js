//server.js
const express = require('express');
const app = express();
const db = require('./db'); // Ensure db.js connects to MongoDB
require('dotenv').config();
require('./notificationWorker');

app.use(express.json()); // Middleware to parse JSON

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to IMAS Module - By Sagar Jha');
});

// Import and use authentication routes
const personRoutes = require('./Authentication/routes/authRoutes');
//const recordRoutes=require('./../IMAS/Authentication/routes/recordRoutes');
const incidentRoutes = require('./Incident/routes/incidentRoutes');
const slaRoutes=require('./SLA/routes/slaRoutes');
const escalationRoutes = require('./Escalation/routes/escalation');
const notificationRoutes = require('./Notifications/routes/notificationRoutes'); 
const reportRoutes = require('./Reports/routes/reportRoutes');
const auditRoutes = require('./AuditLogs/routes/auditRoutes');





app.use('/auth', personRoutes);
//app.use('/api',recordRoutes);
app.use('/incidents', incidentRoutes);
app.use('/sla', slaRoutes);
app.use('/api/escalations', escalationRoutes);
app.use('/notifications', notificationRoutes);
app.use('/reports', reportRoutes);
app.use('/audit', auditRoutes);


// Start server on defined port or fallback to 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

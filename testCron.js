// testCron.js
const mongoose = require('mongoose');
require('dotenv').config(); // Load .env
const { checkSlaViolations } = require('./slaViolationChecker');

(async () => {
  try {
    console.log('🧪 Manually running SLA violation check...');

    // ✅ Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ MongoDB connected');

    // 🧪 Run the SLA violation logic manually
    const result = await checkSlaViolations('manual-test-user');

    console.log('✅ Manual SLA check result:', result);

    // ✅ Clean up
    await mongoose.disconnect();
    console.log('🔌 MongoDB disconnected');
  } catch (err) {
    console.error('❌ Test Cron failed:', err.message);
  }
})();

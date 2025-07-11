const { Worker } = require('bullmq');
const connection = require('../redisClient');
const Notification = require('./model/Notification'); // ✅ Required

const worker = new Worker(
  'notifications',
  async (job) => {
    console.log("📥 Job received:", job.name); // ✅ Log job received
    const { userId, message, type } = job.data;
    await Notification.create({ user: userId, message, type });
    console.log(`🔔 Notification: ${message}`);
  },
  { connection }
);

worker.on('completed', (job) => {
  console.log(`✅ Job ${job.id} completed`);
});

worker.on('failed', (job, err) => {
  console.error(`❌ Job ${job.id} failed:`, err.message);
});
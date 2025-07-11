const {Queue}=require('bullmq');
const connection=require('../redisClient');

const notificationQueue=new Queue('notifications',{connection});

const addNotificationJob = async (data) => {
  console.log("📤 Queuing notification job:", data); // ✅ Log job added
  await notificationQueue.add('notify', data);
};


module.exports={addNotificationJob};
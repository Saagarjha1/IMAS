// testJob.js
const { addNotificationJob } = require('./Notifications/notificationQueue');

addNotificationJob({
  userId: '6851316694e48f5a616dc648', // Use a valid engineer ID
  message: '📢 Manual test notification',
  type: 'info'
});

const mongoose = require('mongoose');

const { Schema } = mongoose;

const notificationSchema = new Schema({
  action: {
    type: String,
    maxLength: 60,
  },
  timestamp: {
    type: Date,
    required: true,
  },
  postID: {
    type: Schema.Types.ObjectId,
    required: true,
  },
});

const notificationListSchema = new Schema({
  _id: {
    type: String,
    maxLength: 40,
    required: true,
    unique: true,
  },
  payload: [{
    type: Schema.Types.ObjectId,
    ref: 'Notification',
  }],
});

module.exports.Notification = mongoose.model('Notification', notificationSchmea);
module.exports.NotificationList = mongoose.model('NotificaionList', notificationListSchema);

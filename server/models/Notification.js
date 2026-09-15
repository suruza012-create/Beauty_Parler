const NotificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  type: { 
    type: String, 
    enum: ['email', 'sms', 'push'], 
    required: true 
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  relatedId: { type: mongoose.Schema.Types.ObjectId },
  relatedType: { type: String, enum: ['booking', 'order', 'promotion'] },
  sentAt: { type: Date, default: Date.now },
  deliveredAt: { type: Date }
});
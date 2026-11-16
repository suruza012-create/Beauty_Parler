const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  method: {
    type: String,
    enum: ['bkash', 'nagad', 'card', 'cash', 'rocket', 'bank', 'sslcommerz'],
    required: true
  },
  mobileNumber: {
    type: String
  },
  transactionId: {
    type: String,
    unique: true
  },
  gatewaySessionKey: { type: String, default: '' },
  gatewayRedirectUrl: { type: String, default: '' },
  validationId: { type: String, default: '' },
  gatewayBankTransactionId: { type: String, default: '' },
  status: {
    type: String,
    enum: ['pending', 'success', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Payment', PaymentSchema);
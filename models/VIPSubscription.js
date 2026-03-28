const mongoose = require('mongoose');
const vipSubscriptionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    purchaseDate: { type: Date, default: Date.now },
    expiryDate: { type: Date, required: true },
    amountPaid: { type: Number, default: 130 },
    currency: { type: String, default: 'ZAR' },
    paymentMethod: { type: String, enum: ['Stripe', 'PayStack'], required: true },
    paymentId: { type: String, required: true, unique: true },
    status: { type: String, enum: ['Active', 'Expired', 'Cancelled'], default: 'Active' },
    autoRenew: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('VIPSubscription', vipSubscriptionSchema);
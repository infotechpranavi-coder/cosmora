import mongoose from 'mongoose'

const OrderItemSchema = new mongoose.Schema({
  productId: {
    type: String, // Changed from mongoose.Schema.Types.ObjectId to String
    required: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  image: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  }
})

const CustomerDetailsSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  state: {
    type: String,
    required: true,
    trim: true
  },
  zipCode: {
    type: String,
    required: true,
    trim: true
  },
  country: {
    type: String,
    required: true,
    trim: true
  }
})

const OrderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: false, // Changed from true to false since it's auto-generated
    unique: true
  },
  userId: {
    type: String,
    default: null,
    index: true,
  },
  customerDetails: {
    type: CustomerDetailsSchema,
    required: true
  },
  items: [OrderItemSchema],
  subtotal: {
    type: Number,
    required: true,
    min: 0
  },
  shipping: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
  giftFee: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
  isGift: {
    type: Boolean,
    default: false,
  },
  giftMessage: {
    type: String,
    trim: true,
    maxlength: 500,
    default: '',
  },
  tax: {
    type: Number,
    required: true,
    min: 0
  },
  total: {
    type: Number,
    required: true,
    min: 0
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['card', 'upi', 'cod', 'stripe', 'razorpay']
  },
  paymentStatus: {
    type: String,
    required: true,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  orderStatus: {
    type: String,
    required: true,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  shippingStatus: {
    type: String,
    required: true,
    enum: ['pending', 'shipped', 'delivered'],
    default: 'pending'
  },
  trackingNumber: {
    type: String,
    trim: true
  },
  stripeSessionId: {
    type: String,
    trim: true
  },
  stripePaymentIntentId: {
    type: String,
    trim: true
  },
  razorpayOrderId: {
    type: String,
    trim: true
  },
  razorpayPaymentId: {
    type: String,
    trim: true
  },
  razorpaySignature: {
    type: String,
    trim: true
  },
  notes: {
    type: String,
    trim: true,
    maxlength: 2000
  }
}, {
  timestamps: true
})

// Generate order number before saving
OrderSchema.pre('save', function(next) {
  if (!this.orderNumber) {
    const date = new Date()
    const year = date.getFullYear().toString().slice(-2)
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const day = date.getDate().toString().padStart(2, '0')
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
    this.orderNumber = `ORD${year}${month}${day}${random}`
  }
  next()
})

// Virtual for full name
OrderSchema.virtual('customerFullName').get(function() {
  return `${this.customerDetails.firstName} ${this.customerDetails.lastName}`
})

// Virtual for full address
OrderSchema.virtual('customerFullAddress').get(function() {
  return `${this.customerDetails.address}, ${this.customerDetails.city}, ${this.customerDetails.state} ${this.customerDetails.zipCode}, ${this.customerDetails.country}`
})

// Ensure virtual fields are serialized
OrderSchema.set('toJSON', { virtuals: true })
OrderSchema.set('toObject', { virtuals: true })

export default mongoose.models.Order || mongoose.model('Order', OrderSchema)

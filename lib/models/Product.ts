import mongoose from 'mongoose'

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [100, 'Product name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  keyFeatures: [{
    type: String,
    required: [true, 'At least one key feature is required'],
    maxlength: [200, 'Key feature cannot exceed 200 characters']
  }],
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative']
  },
  originalPrice: {
    type: Number,
    min: [0, 'Original price cannot be negative']
  },
  offerPercentage: {
    type: Number,
    min: [0, 'Offer percentage cannot be negative'],
    max: [100, 'Offer percentage cannot exceed 100%']
  },
  isOnSale: {
    type: Boolean,
    default: false
  },
  sizeConstraints: {
    type: String,
    maxlength: [200, 'Size constraints cannot exceed 200 characters']
  },
  colors: [{
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: [40, 'Color name cannot exceed 40 characters']
    },
    hex: {
      type: String,
      required: true,
      trim: true,
      maxlength: [7, 'Color hex cannot exceed 7 characters']
    }
  }],
  quantity: {
    type: Number,
    required: [true, 'Product quantity is required'],
    min: [0, 'Quantity cannot be negative']
  },
  category: {
    type: String,
    required: [true, 'Product category is required']
  },
  subCategory: {
    type: String,
    trim: true,
    maxlength: [50, 'Sub-category name cannot exceed 50 characters']
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    publicId: {
      type: String,
      required: true
    }
  }],
  videos: [{
    url: {
      type: String,
      required: true
    },
    publicId: {
      type: String,
      required: true
    }
  }],
  rating: {
    type: Number,
    default: 0,
    min: [0, 'Rating cannot be negative'],
    max: [5, 'Rating cannot exceed 5']
  },
  reviews: {
    type: Number,
    default: 0,
    min: [0, 'Reviews count cannot be negative']
  },
  isNew: {
    type: Boolean,
    default: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isOutOfStock: {
    type: Boolean,
    default: false
  },
  /** Which homepage section this product should appear in (empty = catalog only). */
  homeSection: {
    type: String,
    trim: true,
    default: '',
    enum: {
      values: ['', 'marquee', 'spotlight', 'rail', 'lookbook', 'bags', 'tees', 'shirts'],
      message: 'Invalid homepage section'
    }
  }
}, {
  timestamps: true,
  suppressReservedKeysWarning: true
})

// Calculate offer percentage if original price is provided
ProductSchema.pre('save', function (next) {
  if (this.originalPrice && this.originalPrice > this.price) {
    this.offerPercentage = Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100)
    this.isOnSale = true
  } else {
    this.offerPercentage = 0
    this.isOnSale = false
  }
  next()
})

// Drop cached model when schema is missing new paths (HMR / prod warm cache)
if (
  mongoose.models.Product &&
  (!mongoose.models.Product.schema.path('homeSection') ||
    !mongoose.models.Product.schema.path('colors'))
) {
  delete mongoose.models.Product
}

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema)
export default Product


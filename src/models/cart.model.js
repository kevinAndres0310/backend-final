import mongoose from 'mongoose';
import Product from './product.model.js';

const {Schema} = mongoose;

const cartItemSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: 'products',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
});

const cartSchema = new Schema({
  items: [cartItemSchema],
  totalPrice: {
    type: Number,
    required: true,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

cartSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

cartItemSchema.pre('find', function (next) {
  this.populate('product');
  next();
});

const CartModel = mongoose.model('Cart', cartSchema);

export default CartModel;

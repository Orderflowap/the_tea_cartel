


const mongoose = require('mongoose');
const menuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Menu item name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long'],
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative'],
    max: [10000, 'Price seems too high']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'Starters',
      'Main Course', 
      'Biryani',
      'Chinese',
      'Italian',
      'Desserts',
      'Beverages',
      'Specials',
      'Coffee',
      'Tea',
      'Sandwiches',
      'Salads',
      'Pastries',
      'Breakfast',
      'Lunch',
      'Dinner',
      'Appetizers',
      'Soups',
      'Snacks'
    ]
  },
  image: {
    type: String,
    trim: true
  },
  isVegetarian: {
    type: Boolean,
    default: true
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  preparationTime: {
    type: Number,
    default: 15,
    min: [1, 'Preparation time must be at least 1 minute'],
    max: [240, 'Preparation time cannot exceed 4 hours']
  },
  ingredients: [{
    type: String,
    trim: true
  }],
  tags: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
});

// ONLY create these safe indexes - remove any others
menuItemSchema.index({ name: 1 }); // Simple index on name
menuItemSchema.index({ category: 1 }); // Index on category
menuItemSchema.index({ isAvailable: 1 }); // Index on availability

// Remove any text indexes or compound indexes that might be causing issues
// menuItemSchema.index({ name: 'text', description: 'text' }); // REMOVE THIS LINE

module.exports = mongoose.model('MenuItem', menuItemSchema);



const mongoose = require('mongoose');
const MenuItem = require('../models/MenuItem'); // Adjust path as needed

const menuItems = [
  {
    name: "Margherita Pizza",
    description: "Classic pizza with tomato sauce, fresh mozzarella, and basil",
    price: 12.99,
    category: "Pizza",
    image: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=400&h=300&fit=crop",
    isAvailable: true,
    preparationTime: 15
  },
  {
    name: "Pepperoni Pizza",
    description: "Traditional pizza with pepperoni and mozzarella cheese",
    price: 14.99,
    category: "Pizza",
    image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&h=300&fit=crop",
    isAvailable: true,
    preparationTime: 15
  },
  {
    name: "Chicken Burger",
    description: "Juicy grilled chicken burger with lettuce, tomato, and mayo",
    price: 9.99,
    category: "Burgers",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
    isAvailable: true,
    preparationTime: 10
  },
  {
    name: "Veggie Burger",
    description: "Plant-based burger with fresh vegetables and special sauce",
    price: 8.99,
    category: "Burgers",
    image: "https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=400&h=300&fit=crop",
    isAvailable: true,
    preparationTime: 8
  },
  {
    name: "Caesar Salad",
    description: "Fresh romaine lettuce with Caesar dressing, croutons, and parmesan",
    price: 7.99,
    category: "Salads",
    image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop",
    isAvailable: true,
    preparationTime: 5
  },
  {
    name: "Greek Salad",
    description: "Mixed greens with feta cheese, olives, cucumbers, and olive oil",
    price: 8.49,
    category: "Salads",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=300&fit=crop",
    isAvailable: false,
    preparationTime: 5
  },
  {
    name: "Coca Cola",
    description: "Refreshing carbonated soft drink",
    price: 2.49,
    category: "Beverages",
    image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&h=300&fit=crop",
    isAvailable: true,
    preparationTime: 1
  },
  {
    name: "Chocolate Brownie",
    description: "Rich chocolate brownie with walnut pieces",
    price: 4.99,
    category: "Desserts",
    image: "https://images.unsplash.com/photo-1564355808539-22fda35bed7e?w=400&h=300&fit=crop",
    isAvailable: true,
    preparationTime: 3
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/restaurant', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Connected to MongoDB');

    // Clear existing menu items
    await MenuItem.deleteMany({});
    console.log('✅ Cleared existing menu items');

    // Insert new menu items
    await MenuItem.insertMany(menuItems);
    console.log(`✅ Inserted ${menuItems.length} menu items`);

    console.log('🎉 Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
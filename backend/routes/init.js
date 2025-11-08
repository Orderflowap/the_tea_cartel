const express = require('express');
const router = express.Router();
const MenuItem = require('../models/MenuItem');
const Table = require('../models/Table');
const Order = require('../models/Order');

// Initialize sample data
router.post('/sample-data', async (req, res) => {
  try {
    console.log('Creating sample data...');
    
    // Clear existing data
    await MenuItem.deleteMany({});
    await Table.deleteMany({});
    await Order.deleteMany({});

    // Create sample menu items
    const sampleMenuItems = [
      {
        name: "Margherita Pizza",
        description: "Classic pizza with tomato sauce and mozzarella cheese",
        price: 12.99,
        category: "Pizza",
        preparationTime: 15,
        isAvailable: true
      },
      {
        name: "Pepperoni Pizza",
        description: "Pizza with pepperoni and mozzarella cheese",
        price: 14.99,
        category: "Pizza",
        preparationTime: 15,
        isAvailable: true
      },
      {
        name: "Chicken Burger",
        description: "Grilled chicken burger with lettuce and mayo",
        price: 9.99,
        category: "Burgers",
        preparationTime: 10,
        isAvailable: true
      },
      {
        name: "Beef Burger",
        description: "Juicy beef burger with cheese and vegetables",
        price: 11.99,
        category: "Burgers",
        preparationTime: 12,
        isAvailable: true
      },
      {
        name: "Caesar Salad",
        description: "Fresh salad with caesar dressing and croutons",
        price: 8.99,
        category: "Salads",
        preparationTime: 8,
        isAvailable: true
      },
      {
        name: "French Fries",
        description: "Crispy golden fries",
        price: 4.99,
        category: "Sides",
        preparationTime: 7,
        isAvailable: true
      },
      {
        name: "Coca Cola",
        description: "Cold refreshing cola",
        price: 2.99,
        category: "Drinks",
        preparationTime: 2,
        isAvailable: true
      },
      {
        name: "Orange Juice",
        description: "Freshly squeezed orange juice",
        price: 3.99,
        category: "Drinks",
        preparationTime: 2,
        isAvailable: true
      }
    ];

    const createdMenuItems = await MenuItem.insertMany(sampleMenuItems);
    console.log('Created menu items:', createdMenuItems.length);

    // Create sample tables
    const sampleTables = [];
    for (let i = 1; i <= 6; i++) {
      sampleTables.push({
        tableNumber: i,
        qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`http://localhost:3000/order/${i}`)}`,
        isOccupied: false
      });
    }

    const createdTables = await Table.insertMany(sampleTables);
    console.log('Created tables:', createdTables.length);

    res.json({
      message: 'Sample data created successfully!',
      menuItems: createdMenuItems.length,
      tables: createdTables.length,
      data: {
        menuItems: createdMenuItems,
        tables: createdTables
      }
    });

  } catch (error) {
    console.error('Error creating sample data:', error);
    res.status(500).json({ 
      message: 'Error creating sample data',
      error: error.message 
    });
  }
});

// Get current data status
router.get('/status', async (req, res) => {
  try {
    const menuItemsCount = await MenuItem.countDocuments();
    const tablesCount = await Table.countDocuments();
    const ordersCount = await Order.countDocuments();

    res.json({
      menuItems: menuItemsCount,
      tables: tablesCount,
      orders: ordersCount
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
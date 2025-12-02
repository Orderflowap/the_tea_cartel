


const express = require('express');
const router = express.Router();
const MenuItem = require('../models/MenuItem');

// GET /api/menu - Get all menu items
router.get('/', async (req, res) => {
  try {
    const { category, available, vegetarian } = req.query;
    
    let filter = {};
    
    // Filter by category if provided
    if (category && category !== 'all') {
      filter.category = category;
    }
    
    // Filter by availability if provided
    if (available === 'true') {
      filter.isAvailable = true;
    } else if (available === 'false') {
      filter.isAvailable = false;
    }
    
    // Filter by vegetarian if provided
    if (vegetarian === 'true') {
      filter.isVegetarian = true;
    } else if (vegetarian === 'false') {
      filter.isVegetarian = false;
    }
    
    const menuItems = await MenuItem.find(filter).sort({ category: 1, name: 1 });
    
    res.json({
      success: true,
      data: menuItems,
      message: `Found ${menuItems.length} menu items`
    });
    
  } catch (error) {
    console.error('Error fetching menu items:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching menu items',
      error: error.message
    });
  }
});

// GET /api/menu/:id - Get single menu item
router.get('/:id', async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);
    
    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }
    
    res.json({
      success: true,
      data: menuItem
    });
    
  } catch (error) {
    console.error('Error fetching menu item:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching menu item',
      error: error.message
    });
  }
});

// POST /api/menu - Create new menu item
// router.post('/', async (req, res) => {
//   try {
//     console.log('Creating new menu item:', req.body);
    
//     const menuItem = new MenuItem(req.body);
//     const savedItem = await menuItem.save();
    
//     console.log('Menu item created successfully:', savedItem);
    
//     res.status(201).json({
//       success: true,
//       data: savedItem,
//       message: 'Menu item created successfully'
//     });
    
//   } catch (error) {
//     console.error('Error creating menu item:', error);
//     res.status(400).json({
//       success: false,
//       message: 'Error creating menu item',
//       error: error.message
//     });
//   }
// });

// In your backend route (menu.js)
// router.post('/', async (req, res) => {
//   try {
//     console.log('Creating new menu item:', req.body);
    
//     // Handle both isVeg and isVegetarian field names
//     const menuItemData = { ...req.body };
//     if (menuItemData.isVeg !== undefined) {
//       menuItemData.isVegetarian = menuItemData.isVeg;
//       delete menuItemData.isVeg;
//     }
    
//     const menuItem = new MenuItem(menuItemData);
//     const savedItem = await menuItem.save();
    
//     console.log('Menu item created successfully:', savedItem);
    
//     res.status(201).json({
//       success: true,
//       data: savedItem,
//       message: 'Menu item created successfully'
//     });
    
//   } catch (error) {
//     console.error('Error creating menu item:', error);
//     res.status(400).json({
//       success: false,
//       message: 'Error creating menu item',
//       error: error.message
//     });
//   }
// });

// PUT /api/menu/:id - Update menu item
// router.put('/:id', async (req, res) => {
//   try {
//     console.log('Updating menu item:', req.params.id, req.body);
    
//     const menuItem = await MenuItem.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true, runValidators: true }
//     );
    
//     if (!menuItem) {
//       return res.status(404).json({
//         success: false,
//         message: 'Menu item not found'
//       });
//     }
    
//     console.log('Menu item updated successfully:', menuItem);
    
//     res.json({
//       success: true,
//       data: menuItem,
//       message: 'Menu item updated successfully'
//     });
    
//   } catch (error) {
//     console.error('Error updating menu item:', error);
//     res.status(400).json({
//       success: false,
//       message: 'Error updating menu item',
//       error: error.message
//     });
//   }
// });

// POST /api/menu - Create new menu item
// router.post('/', async (req, res) => {
//   try {
//     console.log('🔔 CREATE MENU ITEM - Raw request body:', req.body);
    
//     // Transform data to match schema
//     const menuItemData = { 
//       name: req.body.name?.trim(),
//       description: req.body.description?.trim(),
//       price: parseFloat(req.body.price),
//       category: req.body.category,
//       // Handle both field names
//       isVegetarian: req.body.isVeg !== undefined ? req.body.isVeg : req.body.isVegetarian,
//       isAvailable: req.body.isAvailable !== undefined ? req.body.isAvailable : true,
//       image: req.body.image?.trim(),
//       preparationTime: parseInt(req.body.preparationTime) || 15
//     };

//     console.log('📝 Processed menu item data:', menuItemData);

//     // Validate required fields
//     if (!menuItemData.name || !menuItemData.price || !menuItemData.category) {
//       return res.status(400).json({
//         success: false,
//         message: 'Missing required fields: name, price, and category are required',
//         received: req.body
//       });
//     }

//     const menuItem = new MenuItem(menuItemData);
//     const savedItem = await menuItem.save();
    
//     console.log('✅ Menu item created successfully:', savedItem._id);
    
//     res.status(201).json({
//       success: true,
//       data: savedItem,
//       message: 'Menu item created successfully'
//     });
    
//   } catch (error) {
//     console.error('❌ Error creating menu item:', error);
    
//     // Mongoose validation error
//     if (error.name === 'ValidationError') {
//       const errors = Object.values(error.errors).map(err => err.message);
//       return res.status(400).json({
//         success: false,
//         message: 'Validation failed',
//         errors: errors,
//         received: req.body
//       });
//     }
    
//     // Duplicate key error
//     if (error.code === 11000) {
//       return res.status(400).json({
//         success: false,
//         message: 'Menu item with this name already exists',
//         error: error.message
//       });
//     }
    
//     res.status(500).json({
//       success: false,
//       message: 'Error creating menu item',
//       error: error.message,
//       received: req.body
//     });
//   }
// });

// POST /api/menu - Create new menu item
router.post('/', async (req, res) => {
  try {
    console.log('🔔 CREATE MENU ITEM - Raw request body:', req.body);
    
    // Transform data to match schema
    const menuItemData = { 
      name: req.body.name?.trim(),
      description: req.body.description?.trim(),
      price: parseFloat(req.body.price),
      category: req.body.category,
      isVegetarian: req.body.isVeg !== undefined ? req.body.isVeg : (req.body.isVegetarian !== undefined ? req.body.isVegetarian : true),
      isAvailable: req.body.isAvailable !== undefined ? req.body.isAvailable : true,
      image: req.body.image?.trim() || '',
      preparationTime: parseInt(req.body.preparationTime) || 15
    };

    console.log('📝 Processed menu item data:', menuItemData);

    // Validate required fields
    if (!menuItemData.name || menuItemData.name.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Name is required and must be at least 2 characters long'
      });
    }

    if (!menuItemData.price || menuItemData.price <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid price is required (greater than 0)'
      });
    }

    if (!menuItemData.category) {
      return res.status(400).json({
        success: false,
        message: 'Category is required'
      });
    }

    // Check if item with same name exists (case-insensitive)
    const existingItem = await MenuItem.findOne({ 
      name: { $regex: new RegExp(`^${menuItemData.name}$`, 'i') } 
    });

    if (existingItem) {
      return res.status(400).json({
        success: false,
        message: `Menu item "${menuItemData.name}" already exists`,
        existingItem: {
          id: existingItem._id,
          name: existingItem.name,
          category: existingItem.category
        }
      });
    }

    const menuItem = new MenuItem(menuItemData);
    const savedItem = await menuItem.save();
    
    console.log('✅ Menu item created successfully:', savedItem._id);
    
    res.status(201).json({
      success: true,
      data: savedItem,
      message: 'Menu item created successfully'
    });
    
  } catch (error) {
    console.error('❌ Error creating menu item:', error);
    
    // Handle duplicate key error specifically
    if (error.code === 11000) {
      // Extract field name from error message
      const fieldMatch = error.message.match(/index: (.+?) dup key/);
      const field = fieldMatch ? fieldMatch[1] : 'unknown field';
      
      return res.status(400).json({
        success: false,
        message: `Duplicate value error on field: ${field}`,
        error: error.message,
        suggestion: 'This might be a database index issue. Try resetting the menu collection.'
      });
    }
    
    // Mongoose validation error
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error creating menu item',
      error: error.message
    });
  }
});

// PUT /api/menu/:id - Update menu item
router.put('/:id', async (req, res) => {
  try {
    console.log('🔔 UPDATE MENU ITEM - ID:', req.params.id, 'Data:', req.body);
    
    // Check if item exists first
    const existingItem = await MenuItem.findById(req.params.id);
    if (!existingItem) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }

    // Transform data to match schema
    const updateData = { 
      name: req.body.name?.trim(),
      description: req.body.description?.trim(),
      price: parseFloat(req.body.price),
      category: req.body.category,
      isVegetarian: req.body.isVeg !== undefined ? req.body.isVeg : req.body.isVegetarian,
      isAvailable: req.body.isAvailable !== undefined ? req.body.isAvailable : existingItem.isAvailable,
      image: req.body.image?.trim(),
      preparationTime: parseInt(req.body.preparationTime) || existingItem.preparationTime
    };

    console.log('📝 Processed update data:', updateData);

    const menuItem = await MenuItem.findByIdAndUpdate(
      req.params.id,
      updateData,
      { 
        new: true, 
        runValidators: true,
        context: 'query'
      }
    );
    
    console.log('✅ Menu item updated successfully:', menuItem);
    
    res.json({
      success: true,
      data: menuItem,
      message: 'Menu item updated successfully'
    });
    
  } catch (error) {
    console.error('❌ Error updating menu item:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors
      });
    }
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid menu item ID'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error updating menu item',
      error: error.message
    });
  }
});

// PATCH /api/menu/:id - Partial update (for availability toggle)
router.patch('/:id', async (req, res) => {
  try {
    console.log('Patching menu item:', req.params.id, req.body);
    
    const menuItem = await MenuItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }
    
    console.log('Menu item patched successfully:', menuItem);
    
    res.json({
      success: true,
      data: menuItem,
      message: 'Menu item updated successfully'
    });
    
  } catch (error) {
    console.error('Error patching menu item:', error);
    res.status(400).json({
      success: false,
      message: 'Error updating menu item',
      error: error.message
    });
  }
});

// DELETE /api/menu/:id - Delete menu item
router.delete('/:id', async (req, res) => {
  try {
    console.log('Deleting menu item:', req.params.id);
    
    const menuItem = await MenuItem.findByIdAndDelete(req.params.id);
    
    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }
    
    console.log('Menu item deleted successfully:', menuItem);
    
    res.json({
      success: true,
      message: 'Menu item deleted successfully'
    });
    
  } catch (error) {
    console.error('Error deleting menu item:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting menu item',
      error: error.message
    });
  }
});

// POST /api/menu/bulk - Create multiple menu items
router.post('/bulk', async (req, res) => {
  try {
    console.log('Bulk creating menu items:', req.body.length);
    
    const menuItems = req.body;
    const results = [];
    const errors = [];
    
    for (const itemData of menuItems) {
      try {
        // Check if item already exists
        const existingItem = await MenuItem.findOne({ 
          name: { $regex: new RegExp(`^${itemData.name}$`, 'i') } 
        });
        
        if (existingItem) {
          // Update existing item
          const updatedItem = await MenuItem.findByIdAndUpdate(
            existingItem._id,
            itemData,
            { new: true, runValidators: true }
          );
          results.push({ action: 'updated', item: updatedItem });
        } else {
          // Create new item
          const newItem = new MenuItem(itemData);
          const savedItem = await newItem.save();
          results.push({ action: 'created', item: savedItem });
        }
      } catch (error) {
        errors.push({ item: itemData.name, error: error.message });
      }
    }
    
    console.log('Bulk operation completed:', {
      processed: results.length,
      errors: errors.length
    });
    
    res.json({
      success: true,
      data: {
        processed: results.length,
        created: results.filter(r => r.action === 'created').length,
        updated: results.filter(r => r.action === 'updated').length,
        errors: errors.length,
        details: results,
        errors: errors
      },
      message: `Bulk operation completed: ${results.length} items processed, ${errors.length} errors`
    });
    
  } catch (error) {
    console.error('Error in bulk operation:', error);
    res.status(400).json({
      success: false,
      message: 'Error in bulk operation',
      error: error.message
    });
  }
});

module.exports = router;
// // src/data/menuItems.js

// const menuItems = [
//   {
//     id: 1,
//     name: "Margherita Pizza",
//     category: "Main Course",
//     price: 299,
//     description: "Classic pizza with tomato sauce, mozzarella cheese, and fresh basil",
//     image: "/menu-images/pizza-margherita.jpeg",
//     ingredients: ["Tomato sauce", "Mozzarella cheese", "Fresh basil", "Olive oil"],
//     preparationTime: 15,
//     isVegetarian: true,
//     isAvailable: true
//   },
//   {
//     id: 2,
//     name: "Butter Chicken",
//     category: "Main Course",
//     price: 449,
//     description: "Tender chicken in a rich buttery tomato gravy",
//     image: "/menu-images/butter-chicken.jpeg",
//     ingredients: ["Chicken", "Butter", "Tomato", "Cream", "Spices"],
//     preparationTime: 25,
//     isVegetarian: false,
//     isAvailable: true
//   },
//   {
//     id: 3,
//     name: "Garlic Naan",
//     category: "Bread",
//     price: 89,
//     description: "Soft bread topped with garlic and butter",
//     image: "/menu-images/garlic-naan.jpg",
//     ingredients: ["Flour", "Garlic", "Butter", "Yogurt"],
//     preparationTime: 10,
//     isVegetarian: true,
//     isAvailable: true
//   },
//   {
//     id: 4,
//     name: "Paneer Tikka",
//     category: "Appetizer",
//     price: 329,
//     description: "Grilled cottage cheese cubes marinated in spices",
//     image: "/menu-images/paneer-tikka.jpg",
//     ingredients: ["Paneer", "Bell peppers", "Yogurt", "Spices"],
//     preparationTime: 20,
//     isVegetarian: true,
//     isAvailable: true
//   },
//   {
//     id: 5,
//     name: "Biryani",
//     category: "Main Course",
//     price: 399,
//     description: "Fragrant rice dish with spices and vegetables",
//     image: "/menu-images/biryani.jpg",
//     ingredients: ["Basmati rice", "Vegetables", "Spices", "Saffron"],
//     preparationTime: 30,
//     isVegetarian: true,
//     isAvailable: true
//   },
//   {
//     id: 6,
//     name: "Chocolate Brownie",
//     category: "Dessert",
//     price: 179,
//     description: "Warm chocolate brownie with vanilla ice cream",
//     image: "/menu-images/chocolate-brownie.jpg",
//     ingredients: ["Chocolate", "Flour", "Butter", "Vanilla ice cream"],
//     preparationTime: 5,
//     isVegetarian: true,
//     isAvailable: true
//   },
//   {
//     id: 7,
//     name: "Mango Lassi",
//     category: "Beverage",
//     price: 129,
//     description: "Refreshing yogurt drink with mango",
//     image: "/menu-images/mango-lassi.jpg",
//     ingredients: ["Yogurt", "Mango", "Sugar", "Cardamom"],
//     preparationTime: 5,
//     isVegetarian: true,
//     isAvailable: true
//   },
//   {
//     id: 8,
//     name: "Fish Curry",
//     category: "Main Course",
//     price: 499,
//     description: "Spicy fish curry with coconut gravy",
//     image: "/menu-images/fish-curry.jpg",
//     ingredients: ["Fish", "Coconut", "Spices", "Tamarind"],
//     preparationTime: 25,
//     isVegetarian: false,
//     isAvailable: true
//   }
// ];

// export default menuItems;


// src/data/menuItems.jsx
const menuItems = [
  // Main Course Items
  {
    id: 1,
    name: "Butter Chicken",
    category: "Main Course",
    price: 449,
    description: "Tender chicken pieces in a rich, creamy tomato and butter sauce",
    image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500&h=400&fit=crop",
    ingredients: ["Chicken", "Butter", "Tomato", "Cream", "Cashew", "Spices"],
    preparationTime: 25,
    isVegetarian: false,
    isAvailable: true
  },
  {
    id: 2,
    name: "Paneer Butter Masala",
    category: "Main Course",
    price: 389,
    description: "Soft paneer cubes in a creamy, flavorful tomato and cashew gravy",
    image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500&h=400&fit=crop",
    ingredients: ["Paneer", "Butter", "Tomato", "Cream", "Cashew", "Onion"],
    preparationTime: 20,
    isVegetarian: true,
    isAvailable: true
  },
  {
    id: 3,
    name: "Chicken Biryani",
    category: "Main Course",
    price: 399,
    description: "Fragrant basmati rice layered with spiced chicken and saffron",
    image: "https://images.unsplash.com/photo-1563379091339-03246963d96f?w=500&h=400&fit=crop",
    ingredients: ["Basmati Rice", "Chicken", "Saffron", "Spices", "Mint", "Yogurt"],
    preparationTime: 30,
    isVegetarian: false,
    isAvailable: true
  },

  // Pizza Items
  {
    id: 4,
    name: "Margherita Pizza",
    category: "Pizza",
    price: 299,
    description: "Classic pizza with tomato sauce, fresh mozzarella, and basil leaves",
    image: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=500&h=400&fit=crop",
    ingredients: ["Pizza Dough", "Tomato Sauce", "Mozzarella", "Basil", "Olive Oil"],
    preparationTime: 15,
    isVegetarian: true,
    isAvailable: true
  },
  {
    id: 5,
    name: "Pepperoni Pizza",
    category: "Pizza",
    price: 399,
    description: "Crispy pizza topped with spicy pepperoni and melted cheese",
    image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500&h=400&fit=crop",
    ingredients: ["Pizza Dough", "Tomato Sauce", "Mozzarella", "Pepperoni", "Oregano"],
    preparationTime: 18,
    isVegetarian: false,
    isAvailable: true
  },
  {
    id: 6,
    name: "Veg Supreme Pizza",
    category: "Pizza",
    price: 349,
    description: "Loaded with fresh vegetables and mozzarella cheese on tomato base",
    image: "https://images.unsplash.com/photo-1595708684082-a173bb3a06c5?w=500&h=400&fit=crop",
    ingredients: ["Pizza Dough", "Tomato Sauce", "Mozzarella", "Bell Peppers", "Olives", "Onions", "Mushrooms"],
    preparationTime: 20,
    isVegetarian: true,
    isAvailable: true
  },

  // Bread Items
  {
    id: 7,
    name: "Garlic Naan",
    category: "Bread",
    price: 89,
    description: "Soft leavened bread topped with fresh garlic and butter",
    image: "https://images.unsplash.com/photo-1636312563763-d1c5b7663d1e?w=500&h=400&fit=crop",
    ingredients: ["Flour", "Garlic", "Butter", "Yogurt", "Yeast"],
    preparationTime: 10,
    isVegetarian: true,
    isAvailable: true
  },
  {
    id: 8,
    name: "Butter Naan",
    category: "Bread",
    price: 79,
    description: "Classic soft naan brushed with generous amount of butter",
    image: "https://images.unsplash.com/photo-1709317912145-43e0c49c0f5c?w=500&h=400&fit=crop",
    ingredients: ["Flour", "Butter", "Yogurt", "Yeast", "Salt"],
    preparationTime: 8,
    isVegetarian: true,
    isAvailable: true
  },
  {
    id: 9,
    name: "Laccha Paratha",
    category: "Bread",
    price: 99,
    description: "Flaky, layered whole wheat bread perfect with curries",
    image: "https://images.unsplash.com/photo-1645111328429-64cd062b1a6c?w=500&h=400&fit=crop",
    ingredients: ["Whole Wheat Flour", "Butter", "Oil", "Salt"],
    preparationTime: 12,
    isVegetarian: true,
    isAvailable: true
  },

  // Beverage Items
  {
    id: 10,
    name: "Mango Lassi",
    category: "Beverage",
    price: 129,
    description: "Refreshing yogurt-based drink with sweet mango pulp",
    image: "https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=500&h=400&fit=crop",
    ingredients: ["Yogurt", "Mango Pulp", "Sugar", "Cardamom", "Ice"],
    preparationTime: 5,
    isVegetarian: true,
    isAvailable: true
  },
  {
    id: 11,
    name: "Masala Chai",
    category: "Beverage",
    price: 59,
    description: "Traditional Indian spiced tea with milk and aromatic spices",
    image: "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=500&h=400&fit=crop",
    ingredients: ["Tea Leaves", "Milk", "Ginger", "Cardamom", "Cloves", "Sugar"],
    preparationTime: 8,
    isVegetarian: true,
    isAvailable: true
  },
  {
    id: 12,
    name: "Fresh Lime Soda",
    category: "Beverage",
    price: 89,
    description: "Zesty lime with soda - perfect refreshing drink for any meal",
    image: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=500&h=400&fit=crop",
    ingredients: ["Fresh Lime", "Soda", "Sugar", "Salt", "Mint Leaves"],
    preparationTime: 3,
    isVegetarian: true,
    isAvailable: true
  },

  // Additional items for variety
  {
    id: 13,
    name: "Dal Makhani",
    category: "Main Course",
    price: 279,
    description: "Creamy black lentils slow-cooked with butter and spices",
    image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500&h=400&fit=crop",
    ingredients: ["Black Lentils", "Butter", "Cream", "Tomato", "Ginger", "Garlic"],
    preparationTime: 35,
    isVegetarian: true,
    isAvailable: true
  },
  {
    id: 14,
    name: "Chicken Tikka",
    category: "Main Course",
    price: 359,
    description: "Succulent chicken pieces marinated in spices and grilled to perfection",
    image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=500&h=400&fit=crop",
    ingredients: ["Chicken", "Yogurt", "Spices", "Lemon", "Butter"],
    preparationTime: 22,
    isVegetarian: false,
    isAvailable: true
  },
  {
    id: 15,
    name: "Cold Coffee",
    category: "Beverage",
    price: 149,
    description: "Chilled coffee blended with ice cream and chocolate",
    image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=500&h=400&fit=crop",
    ingredients: ["Coffee", "Milk", "Ice Cream", "Chocolate", "Ice"],
    preparationTime: 6,
    isVegetarian: true,
    isAvailable: true
  },
  {
    id: 16,
    name: "Ayushman Special",
    category: "Cold Shakes",
    price: 149,
    description: "Chilled coffee blended with ice cream and chocolate",
    image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=500&h=400&fit=crop",
    ingredients: ["Coffee", "Milk", "Ice Cream", "Chocolate", "Ice"],
    preparationTime: 6,
    isVegetarian: true,
    isAvailable: true
  },
  {
    id: 17,
    name: "Pranjal Special",
    category: "chilled",
    price: 149,
    description: "Chilled coffee blended with ice cream and chocolate",
    image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=500&h=400&fit=crop",
    ingredients: ["Coffee", "Milk", "Ice Cream", "Chocolate", "Ice"],
    preparationTime: 6,
    isVegetarian: true,
    isAvailable: true
  }
];

export default menuItems;
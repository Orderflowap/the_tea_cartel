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

// const menuItems = [
//   // Main Course Items
//   {
//     id: 1,
//     name: "Butter Chicken",
//     category: "Main Course",
//     price: 449,
//     description: "Tender chicken pieces in a rich, creamy tomato and butter sauce",
//     image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500&h=400&fit=crop",
//     ingredients: ["Chicken", "Butter", "Tomato", "Cream", "Cashew", "Spices"],
//     preparationTime: 25,
//     isVegetarian: false,
//     isAvailable: true
//   },
//   {
//     id: 2,
//     name: "Paneer Butter Masala",
//     category: "Main Course",
//     price: 389,
//     description: "Soft paneer cubes in a creamy, flavorful tomato and cashew gravy",
//     image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500&h=400&fit=crop",
//     ingredients: ["Paneer", "Butter", "Tomato", "Cream", "Cashew", "Onion"],
//     preparationTime: 20,
//     isVegetarian: true,
//     isAvailable: true
//   },
//   {
//     id: 3,
//     name: "Chicken Biryani",
//     category: "Main Course",
//     price: 399,
//     description: "Fragrant basmati rice layered with spiced chicken and saffron",
//     image: "https://images.unsplash.com/photo-1563379091339-03246963d96f?w=500&h=400&fit=crop",
//     ingredients: ["Basmati Rice", "Chicken", "Saffron", "Spices", "Mint", "Yogurt"],
//     preparationTime: 30,
//     isVegetarian: false,
//     isAvailable: true
//   },

//   // Pizza Items
//   {
//     id: 4,
//     name: "Margherita Pizza",
//     category: "Pizza",
//     price: 299,
//     description: "Classic pizza with tomato sauce, fresh mozzarella, and basil leaves",
//     image: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=500&h=400&fit=crop",
//     ingredients: ["Pizza Dough", "Tomato Sauce", "Mozzarella", "Basil", "Olive Oil"],
//     preparationTime: 15,
//     isVegetarian: true,
//     isAvailable: true
//   },
//   {
//     id: 5,
//     name: "Pepperoni Pizza",
//     category: "Pizza",
//     price: 399,
//     description: "Crispy pizza topped with spicy pepperoni and melted cheese",
//     image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500&h=400&fit=crop",
//     ingredients: ["Pizza Dough", "Tomato Sauce", "Mozzarella", "Pepperoni", "Oregano"],
//     preparationTime: 18,
//     isVegetarian: false,
//     isAvailable: true
//   },
//   {
//     id: 6,
//     name: "Veg Supreme Pizza",
//     category: "Pizza",
//     price: 349,
//     description: "Loaded with fresh vegetables and mozzarella cheese on tomato base",
//     image: "https://images.unsplash.com/photo-1595708684082-a173bb3a06c5?w=500&h=400&fit=crop",
//     ingredients: ["Pizza Dough", "Tomato Sauce", "Mozzarella", "Bell Peppers", "Olives", "Onions", "Mushrooms"],
//     preparationTime: 20,
//     isVegetarian: true,
//     isAvailable: true
//   },

//   // Bread Items
//   {
//     id: 7,
//     name: "Garlic Naan",
//     category: "Bread",
//     price: 89,
//     description: "Soft leavened bread topped with fresh garlic and butter",
//     image: "https://images.unsplash.com/photo-1636312563763-d1c5b7663d1e?w=500&h=400&fit=crop",
//     ingredients: ["Flour", "Garlic", "Butter", "Yogurt", "Yeast"],
//     preparationTime: 10,
//     isVegetarian: true,
//     isAvailable: true
//   },
//   {
//     id: 8,
//     name: "Butter Naan",
//     category: "Bread",
//     price: 79,
//     description: "Classic soft naan brushed with generous amount of butter",
//     image: "https://images.unsplash.com/photo-1709317912145-43e0c49c0f5c?w=500&h=400&fit=crop",
//     ingredients: ["Flour", "Butter", "Yogurt", "Yeast", "Salt"],
//     preparationTime: 8,
//     isVegetarian: true,
//     isAvailable: true
//   },
//   {
//     id: 9,
//     name: "Laccha Paratha",
//     category: "Bread",
//     price: 99,
//     description: "Flaky, layered whole wheat bread perfect with curries",
//     image: "https://images.unsplash.com/photo-1645111328429-64cd062b1a6c?w=500&h=400&fit=crop",
//     ingredients: ["Whole Wheat Flour", "Butter", "Oil", "Salt"],
//     preparationTime: 12,
//     isVegetarian: true,
//     isAvailable: true
//   },

//   // Beverage Items
//   {
//     id: 10,
//     name: "Mango Lassi",
//     category: "Beverage",
//     price: 129,
//     description: "Refreshing yogurt-based drink with sweet mango pulp",
//     image: "https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=500&h=400&fit=crop",
//     ingredients: ["Yogurt", "Mango Pulp", "Sugar", "Cardamom", "Ice"],
//     preparationTime: 5,
//     isVegetarian: true,
//     isAvailable: true
//   },
//   {
//     id: 11,
//     name: "Masala Chai",
//     category: "Beverage",
//     price: 59,
//     description: "Traditional Indian spiced tea with milk and aromatic spices",
//     image: "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=500&h=400&fit=crop",
//     ingredients: ["Tea Leaves", "Milk", "Ginger", "Cardamom", "Cloves", "Sugar"],
//     preparationTime: 8,
//     isVegetarian: true,
//     isAvailable: true
//   },
//   {
//     id: 12,
//     name: "Fresh Lime Soda",
//     category: "Beverage",
//     price: 89,
//     description: "Zesty lime with soda - perfect refreshing drink for any meal",
//     image: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=500&h=400&fit=crop",
//     ingredients: ["Fresh Lime", "Soda", "Sugar", "Salt", "Mint Leaves"],
//     preparationTime: 3,
//     isVegetarian: true,
//     isAvailable: true
//   },

//   // Additional items for variety
//   {
//     id: 13,
//     name: "Dal Makhani",
//     category: "Main Course",
//     price: 279,
//     description: "Creamy black lentils slow-cooked with butter and spices",
//     image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500&h=400&fit=crop",
//     ingredients: ["Black Lentils", "Butter", "Cream", "Tomato", "Ginger", "Garlic"],
//     preparationTime: 35,
//     isVegetarian: true,
//     isAvailable: true
//   },
//   {
//     id: 14,
//     name: "Chicken Tikka",
//     category: "Main Course",
//     price: 359,
//     description: "Succulent chicken pieces marinated in spices and grilled to perfection",
//     image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=500&h=400&fit=crop",
//     ingredients: ["Chicken", "Yogurt", "Spices", "Lemon", "Butter"],
//     preparationTime: 22,
//     isVegetarian: false,
//     isAvailable: true
//   },
//   {
//     id: 15,
//     name: "Cold Coffee",
//     category: "Beverage",
//     price: 149,
//     description: "Chilled coffee blended with ice cream and chocolate",
//     image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=500&h=400&fit=crop",
//     ingredients: ["Coffee", "Milk", "Ice Cream", "Chocolate", "Ice"],
//     preparationTime: 6,
//     isVegetarian: true,
//     isAvailable: true
//   },
//   {
//     id: 16,
//     name: "Ayushman Special",
//     category: "Cold Shakes",
//     price: 149,
//     description: "Chilled coffee blended with ice cream and chocolate",
//     image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=500&h=400&fit=crop",
//     ingredients: ["Coffee", "Milk", "Ice Cream", "Chocolate", "Ice"],
//     preparationTime: 6,
//     isVegetarian: true,
//     isAvailable: true
//   },
//   {
//     id: 17,
//     name: "Pranjal Special",
//     category: "chilled",
//     price: 149,
//     description: "Chilled coffee blended with ice cream and chocolate",
//     image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=500&h=400&fit=crop",
//     ingredients: ["Coffee", "Milk", "Ice Cream", "Chocolate", "Ice"],
//     preparationTime: 6,
//     isVegetarian: true,
//     isAvailable: true
//   }
// ];

// export default menuItems;

// const menuItems = [
//   // Main Course Items
  
// ];

// export default menuItems;

const menuItems = [
  // THE CHAI CARTEL – REGULAR TEAS
  {
    id: 1,
    name: "Masala Tea",
    category: "Regular Teas",
    price: 20,
    description: "Aromatic Indian tea brewed with a blend of traditional spices.",
    image: "https://images.unsplash.com/photo-1564410267841-915c8b83c0b6?q=80&w=500&h=400&fit=crop&crop=center",
    ingredients: ["black tea leaves", "milk", "sugar", "cardamom", "cloves", "cinnamon", "ginger", "black pepper"],
    preparationTime: 7,
    isVegetarian: true,
    isAvailable: true
  },
  {
    id: 2,
    name: "Adrak Tea",
    category: "Regular Teas",
    price: 20,
    description: "Strong tea infused with fresh ginger for a warming sensation.",
    image: "https://images.unsplash.com/photo-1604055787602-0f43e5246eb7?q=80&w=500&h=400&fit=crop&crop=center",
    ingredients: ["black tea leaves", "milk", "sugar", "fresh ginger", "cardamom"],
    preparationTime: 7,
    isVegetarian: true,
    isAvailable: true
  },
  {
    id: 3,
    name: "Bombay Cutting",
    category: "Regular Teas",
    price: 20,
    description: "Half-glass strong Mumbai style street tea, perfect quick energy boost.",
    image: "https://images.unsplash.com/photo-1609873532451-0a1acd5c8e6c?q=80&w=500&h=400&fit=crop&crop=center",
    ingredients: ["black tea leaves", "milk", "sugar", "cardamom", "ginger"],
    preparationTime: 5,
    isVegetarian: true,
    isAvailable: true
  },

  // THE CHAI CARTEL – SPECIAL TEAS
  {
    id: 4,
    name: "Chocolate Tea",
    category: "Special Teas",
    price: 25,
    description: "Rich milk tea infused with cocoa and chocolate flavors.",
    image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?q=80&w=500&h=400&fit=crop&crop=center",
    ingredients: ["black tea leaves", "milk", "sugar", "cocoa powder", "chocolate syrup", "vanilla"],
    preparationTime: 8,
    isVegetarian: true,
    isAvailable: true
  },
  {
    id: 5,
    name: "Rose Tea",
    category: "Special Teas",
    price: 30,
    description: "Fragrant tea with delicate rose essence and petals.",
    image: "https://images.unsplash.com/photo-1566944851615-25e0b6c82b1c?q=80&w=500&h=400&fit=crop&crop=center",
    ingredients: ["black tea leaves", "milk", "sugar", "rose syrup", "dried rose petals", "cardamom"],
    preparationTime: 8,
    isVegetarian: true,
    isAvailable: true
  },
  {
    id: 6,
    name: "Paan Tea",
    category: "Special Teas",
    price: 35,
    description: "Unique tea blend with traditional paan flavors.",
    image: "https://images.unsplash.com/photo-1615482267537-66c76bcd6d43?q=80&w=500&h=400&fit=crop&crop=center",
    ingredients: ["black tea leaves", "milk", "sugar", "paan essence", "cardamom", "fennel seeds", "rose water"],
    preparationTime: 8,
    isVegetarian: true,
    isAvailable: true
  },
  {
    id: 7,
    name: "Kesar Elaichi Tea",
    category: "Special Teas",
    price: 40,
    description: "Premium saffron and cardamom infused royal tea.",
    image: "https://images.unsplash.com/photo-1626248801371-0088d9297c3c?q=80&w=500&h=400&fit=crop&crop=center",
    ingredients: ["black tea leaves", "milk", "sugar", "saffron strands", "cardamom", "almonds"],
    preparationTime: 10,
    isVegetarian: true,
    isAvailable: true
  },

  // NON MILK BASE TEAS
  {
    id: 8,
    name: "Green Tea",
    category: "Non Milk Teas",
    price: 45,
    description: "Light and refreshing antioxidant-rich green tea.",
    image: "https://images.unsplash.com/photo-1615201577210-a9d0c0e8c34a?q=80&w=500&h=400&fit=crop&crop=center",
    ingredients: ["green tea leaves", "hot water", "lemon slice", "honey (optional)"],
    preparationTime: 4,
    isVegetarian: true,
    isAvailable: true
  },
  {
    id: 9,
    name: "Darjeeling Tea",
    category: "Non Milk Teas",
    price: 45,
    description: "Aromatic black tea from Darjeeling hills, served without milk.",
    image: "https://images.unsplash.com/photo-1601085482161-2ac6132e2971?q=80&w=500&h=400&fit=crop&crop=center",
    ingredients: ["Darjeeling tea leaves", "hot water", "sugar (optional)", "lemon (optional)"],
    preparationTime: 4,
    isVegetarian: true,
    isAvailable: true
  },
  {
    id: 10,
    name: "Ginger Honey Tea",
    category: "Non Milk Teas",
    price: 50,
    description: "Soothing herbal infusion with ginger and natural honey.",
    image: "https://images.unsplash.com/photo-1558769132-cb2e3c9c79e2?q=80&w=500&h=400&fit=crop&crop=center",
    ingredients: ["ginger", "honey", "hot water", "lemon juice", "cinnamon"],
    preparationTime: 6,
    isVegetarian: true,
    isAvailable: true
  },
  {
    id: 11,
    name: "Turmeric Tea",
    category: "Non Milk Teas",
    price: 50,
    description: "Golden turmeric latte with black pepper for enhanced absorption.",
    image: "https://images.unsplash.com/photo-1608036677345-b3e62c67d5f0?q=80&w=500&h=400&fit=crop&crop=center",
    ingredients: ["turmeric", "black pepper", "honey", "hot water", "lemon", "ginger"],
    preparationTime: 6,
    isVegetarian: true,
    isAvailable: true
  },

  // COLD COFFEE
  {
    id: 12,
    name: "Cold Coffee",
    category: "Cold Coffee",
    price: 169,
    description: "Classic blended iced coffee with milk and sugar.",
    image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?q=80&w=500&h=400&fit=crop&crop=center",
    ingredients: ["instant coffee", "chilled milk", "sugar", "ice cubes", "vanilla essence"],
    preparationTime: 8,
    isVegetarian: true,
    isAvailable: true
  },
  {
    id: 13,
    name: "Cold Coffee with Ice Cream",
    category: "Cold Coffee",
    price: 169,
    description: "Rich cold coffee topped with a scoop of vanilla ice cream.",
    image: "https://images.unsplash.com/photo-1572490646361-c58d5f5c5f6d?q=80&w=500&h=400&fit=crop&crop=center",
    ingredients: ["instant coffee", "chilled milk", "sugar", "vanilla ice cream", "ice cubes", "chocolate syrup"],
    preparationTime: 10,
    isVegetarian: true,
    isAvailable: true
  },
  {
    id: 14,
    name: "Hazelnut Cold Coffee",
    category: "Cold Coffee",
    price: 179,
    description: "Iced coffee blended with rich hazelnut flavor.",
    image: "https://images.unsplash.com/photo-1536227661368-deef0ac38b57?q=80&w=500&h=400&fit=crop&crop=center",
    ingredients: ["instant coffee", "chilled milk", "hazelnut syrup", "sugar", "ice cubes"],
    preparationTime: 8,
    isVegetarian: true,
    isAvailable: true
  },
  {
    id: 15,
    name: "Caramel Cold Coffee",
    category: "Cold Coffee",
    price: 169,
    description: "Smooth cold coffee with creamy caramel swirl.",
    image: "https://images.unsplash.com/photo-1570197788417-0e82375c9371?q=80&w=500&h=400&fit=crop&crop=center",
    ingredients: ["instant coffee", "chilled milk", "caramel syrup", "sugar", "ice cubes", "whipped cream"],
    preparationTime: 8,
    isVegetarian: true,
    isAvailable: true
  },
  {
    id: 16,
    name: "Green Apple Cold Coffee",
    category: "Cold Coffee",
    price: 179,
    description: "Unique fusion of cold coffee with green apple flavor.",
    image: "https://images.unsplash.com/photo-1612299273048-8d4d2c4a42e5?q=80&w=500&h=400&fit=crop&crop=center",
    ingredients: ["instant coffee", "chilled milk", "green apple syrup", "sugar", "ice cubes"],
    preparationTime: 8,
    isVegetarian: true,
    isAvailable: true
  },

  // HOT COFFEE
  {
    id: 17,
    name: "Cappuccino",
    category: "Hot Coffee",
    price: 70,
    description: "Espresso with steamed milk and thick milk foam.",
    image: "https://images.unsplash.com/photo-1510707577719-ae7c9b788690?q=80&w=500&h=400&fit=crop&crop=center",
    ingredients: ["espresso", "steamed milk", "milk foam", "cocoa powder"],
    preparationTime: 6,
    isVegetarian: true,
    isAvailable: true
  },
  {
    id: 18,
    name: "Latte",
    category: "Hot Coffee",
    price: 70,
    description: "Smooth coffee with more steamed milk and light foam.",
    image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?q=80&w=500&h=400&fit=crop&crop=center",
    ingredients: ["espresso", "steamed milk", "light milk foam"],
    preparationTime: 6,
    isVegetarian: true,
    isAvailable: true
  },
  {
    id: 19,
    name: "Espresso",
    category: "Hot Coffee",
    price: 80,
    description: "Strong single shot of pure coffee essence.",
    image: "https://images.unsplash.com/photo-1518057111178-44a106bad636?q=80&w=500&h=400&fit=crop&crop=center",
    ingredients: ["finely ground coffee beans", "hot water"],
    preparationTime: 4,
    isVegetarian: true,
    isAvailable: true
  },
  {
    id: 20,
    name: "Americano",
    category: "Hot Coffee",
    price: 80,
    description: "Espresso diluted with hot water for milder flavor.",
    image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?q=80&w=500&h=400&fit=crop&crop=center",
    ingredients: ["espresso", "hot water"],
    preparationTime: 4,
    isVegetarian: true,
    isAvailable: true
  },
  {
    id: 21,
    name: "Red Eye",
    category: "Hot Coffee",
    price: 90,
    description: "Regular coffee with an extra shot of espresso for kick.",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=500&h=400&fit=crop&crop=center",
    ingredients: ["brewed coffee", "espresso shot"],
    preparationTime: 5,
    isVegetarian: true,
    isAvailable: true
  },

  // SUMMER COOLERS
  {
    id: 22,
    name: "Lemonade Tea",
    category: "Summer Coolers",
    price: 80,
    description: "Refreshing iced tea with tangy lemon flavor.",
    image: "https://images.unsplash.com/photo-1623334044303-241021148842?q=80&w=500&h=400&fit=crop&crop=center",
    ingredients: ["black tea", "lemon juice", "sugar syrup", "ice cubes", "mint leaves"],
    preparationTime: 7,
    isVegetarian: true,
    isAvailable: true
  },
  {
    id: 23,
    name: "Green Apple Tea",
    category: "Summer Coolers",
    price: 80,
    description: "Fruity iced tea with crisp green apple flavor.",
    image: "https://images.unsplash.com/photo-1508254629620-aa815b3f6e36?q=80&w=500&h=400&fit=crop&crop=center",
    ingredients: ["black tea", "green apple syrup", "sugar syrup", "ice cubes", "apple slices"],
    preparationTime: 7,
    isVegetarian: true,
    isAvailable: true
  },
  {
    id: 24,
    name: "Mango Tea",
    category: "Summer Coolers",
    price: 80,
    description: "Sweet and tropical mango flavored iced tea.",
    image: "https://images.unsplash.com/photo-1515586000433-45406d8e6662?q=80&w=500&h=400&fit=crop&crop=center",
    ingredients: ["black tea", "mango pulp", "sugar syrup", "ice cubes", "mint"],
    preparationTime: 7,
    isVegetarian: true,
    isAvailable: true
  },
  {
    id: 25,
    name: "Peach Tea",
    category: "Summer Coolers",
    price: 80,
    description: "Delicate peach flavored refreshing iced tea.",
    image: "https://images.unsplash.com/photo-1559253664-ca249d4608c6?q=80&w=500&h=400&fit=crop&crop=center",
    ingredients: ["black tea", "peach syrup", "sugar syrup", "ice cubes", "peach slices"],
    preparationTime: 7,
    isVegetarian: true,
    isAvailable: true
  },
  {
    id: 26,
    name: "Watermelon Tea",
    category: "Summer Coolers",
    price: 80,
    description: "Hydrating iced tea with fresh watermelon juice.",
    image: "https://images.unsplash.com/photo-1596591601815-4d6d4ce79e02?q=80&w=500&h=400&fit=crop&crop=center",
    ingredients: ["black tea", "watermelon juice", "sugar syrup", "ice cubes", "mint"],
    preparationTime: 7,
    isVegetarian: true,
    isAvailable: true
  },

  // BURGERS
  {
    id: 27,
    name: "Veg Crunch",
    category: "Burgers",
    price: 99,
    description: "Crispy vegetable patty burger with fresh greens.",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=500&h=400&fit=crop&crop=center",
    ingredients: ["burger bun", "crispy veg patty", "lettuce", "tomato", "onion", "mayonnaise", "burger sauce"],
    preparationTime: 12,
    isVegetarian: true,
    isAvailable: true
  },
  {
    id: 28,
    name: "Mr. Spicy",
    category: "Burgers",
    price: 139,
    description: "Fiery veg burger with spicy patty and jalapeños.",
    image: "https://images.unsplash.com/photo-1561758033-48d52648ae8b?q=80&w=500&h=400&fit=crop&crop=center",
    ingredients: ["burger bun", "spicy veg patty", "cheese slice", "jalapeños", "lettuce", "spicy mayo", "onion"],
    preparationTime: 12,
    isVegetarian: true,
    isAvailable: true
  },
  {
    id: 29,
    name: "Veg Supreme",
    category: "Burgers",
    price: 139,
    description: "Loaded vegetable burger with extra cheese and sauces.",
    image: "https://images.unsplash.com/photo-1571091717375-efb43343a416?q=80&w=500&h=400&fit=crop&crop=center",
    ingredients: ["burger bun", "veg patty", "cheese", "lettuce", "tomato", "onion", "pickles", "special sauce"],
    preparationTime: 12,
    isVegetarian: true,
    isAvailable: true
  },
  {
    id: 30,
    name: "Juicy Hell",
    category: "Burgers",
    price: 159,
    description: "Extra saucy and spicy burger for heat lovers.",
    image: "https://images.unsplash.com/photo-1553979459-d2229ba7433c?q=80&w=500&h=400&fit=crop&crop=center",
    ingredients: ["burger bun", "spicy veg patty", "double cheese", "onion rings", "lettuce", "hell sauce", "mayo"],
    preparationTime: 13,
    isVegetarian: true,
    isAvailable: true
  },
  {
    id: 31,
    name: "The God Father",
    category: "Burgers",
    price: 179,
    description: "Signature loaded burger with double patty and special sauce.",
    image: "https://images.unsplash.com/photo-1610447847416-40bac442fbe6?q=80&w=500&h=400&fit=crop&crop=center",
    ingredients: ["burger bun", "veg patty x2", "cheese slices x2", "lettuce", "tomato", "onion", "pickles", "godfather sauce"],
    preparationTime: 15,
    isVegetarian: true,
    isAvailable: true
  },

  // SANDWICH
  {
    id: 32,
    name: "Veg Grilled Sandwich",
    category: "Sandwich",
    price: 99,
    description: "Classic grilled sandwich with fresh vegetable filling.",
    image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?q=80&w=500&h=400&fit=crop&crop=center",
    ingredients: ["bread slices", "butter", "capsicum", "onion", "tomato", "cucumber", "green chutney"],
    preparationTime: 10,
    isVegetarian: true,
    isAvailable: true
  },
  {
    id: 33,
    name: "Tandoori Paneer Sandwich",
    category: "Sandwich",
    price: 129,
    description: "Grilled sandwich with spicy tandoori marinated paneer.",
    image: "https://images.unsplash.com/photo-1550259979-02140d01b591?q=80&w=500&h=400&fit=crop&crop=center",
    ingredients: ["bread slices", "butter", "tandoori paneer", "onion", "capsicum", "cheese", "tandoori mayo"],
    preparationTime: 12,
    isVegetarian: true,
    isAvailable: true
  },
  {
    id: 34,
    name: "Butter Veggi Sandwich",
    category: "Sandwich",
    price: 149,
    description: "Buttery soft sandwich loaded with mixed vegetables.",
    image: "https://images.unsplash.com/photo-1481070555726-e2fe8357725c?q=80&w=500&h=400&fit=crop&crop=center",
    ingredients: ["bread slices", "butter", "mixed vegetables", "mayonnaise", "cheese", "herbs"],
    preparationTime: 10,
    isVegetarian: true,
    isAvailable: true
  },
  {
    id: 35,
    name: "Corn 'n' Mushroom Sandwich",
    category: "Sandwich",
    price: 139,
    description: "Creamy corn and sautéed mushroom sandwich.",
    image: "https://images.unsplash.com/photo-1525540810550-4dcb49f7c6ff?q=80&w=500&h=400&fit=crop&crop=center",
    ingredients: ["bread slices", "butter", "sweet corn", "mushrooms", "cheese", "white sauce", "herbs"],
    preparationTime: 12,
    isVegetarian: true,
    isAvailable: true
  },
  {
    id: 36,
    name: "Creamy Veggi Sandwich",
    category: "Sandwich",
    price: 159,
    description: "Extra creamy vegetable and cheese loaded sandwich.",
    image: "https://images.unsplash.com/photo-1554520735-0a6b8b6ce8b7?q=80&w=500&h=400&fit=crop&crop=center",
    ingredients: ["bread slices", "butter", "mixed vegetables", "cream cheese", "mayonnaise", "cheddar cheese", "herbs"],
    preparationTime: 12,
    isVegetarian: true,
    isAvailable: true
  },

  // VADA PAV
  {
    id: 37,
    name: "Vada Pav Single",
    category: "Vada Pav",
    price: 40,
    description: "Classic Mumbai street food - spicy potato vada in bread.",
    image: "https://images.unsplash.com/photo-1642073050059-961a5a97e173?q=80&w=500&h=400&fit=crop&crop=center",
    ingredients: ["pav", "batata vada", "green chutney", "tamarind chutney", "garlic chutney", "fried green chilli"],
    preparationTime: 8,
    isVegetarian: true,
    isAvailable: true
  },
  {
    id: 38,
    name: "Vada Pav Double",
    category: "Vada Pav",
    price: 60,
    description: "Double the vada for extra satisfaction.",
    image: "https://images.unsplash.com/photo-1642073050059-961a5a97e173?q=80&w=500&h=400&fit=crop&crop=center",
    ingredients: ["pav", "batata vada x2", "green chutney", "tamarind chutney", "garlic chutney", "fried green chilli"],
    preparationTime: 9,
    isVegetarian: true,
    isAvailable: true
  },
  {
    id: 39,
    name: "Vada Pav with Cheese Single",
    category: "Vada Pav",
    price: 60,
    description: "Classic vada pav with melted cheese topping.",
    image: "https://images.unsplash.com/photo-1563379091339-03246963d9d6?q=80&w=500&h=400&fit=crop&crop=center",
    ingredients: ["pav", "batata vada", "cheese slice", "green chutney", "tamarind chutney", "garlic chutney"],
    preparationTime: 9,
    isVegetarian: true,
    isAvailable: true
  },
  {
    id: 40,
    name: "Vada Pav with Cheese Double",
    category: "Vada Pav",
    price: 80,
    description: "Double vada with cheese for cheese lovers.",
    image: "https://images.unsplash.com/photo-1563379091339-03246963d9d6?q=80&w=500&h=400&fit=crop&crop=center",
    ingredients: ["pav", "batata vada x2", "cheese slice", "green chutney", "tamarind chutney", "garlic chutney"],
    preparationTime: 10,
    isVegetarian: true,
    isAvailable: true
  },
  {
    id: 41,
    name: "Grilled Vada Pav Single",
    category: "Vada Pav",
    price: 70,
    description: "Vada pav grilled to perfection with butter.",
    image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?q=80&w=500&h=400&fit=crop&crop=center",
    ingredients: ["pav", "batata vada", "butter", "green chutney", "tamarind chutney", "garlic chutney"],
    preparationTime: 10,
    isVegetarian: true,
    isAvailable: true
  },
  {
    id: 42,
    name: "Grilled Vada Pav Double",
    category: "Vada Pav",
    price: 90,
    description: "Double vada pav grilled with butter.",
    image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?q=80&w=500&h=400&fit=crop&crop=center",
    ingredients: ["pav", "batata vada x2", "butter", "green chutney", "tamarind chutney", "garlic chutney"],
    preparationTime: 11,
    isVegetarian: true,
    isAvailable: true
  },

  // BUN MASKA
  {
    id: 43,
    name: "Bun Maska",
    category: "Bun Maska",
    price: 30,
    description: "Soft bun generously slathered with butter.",
    image: "https://images.unsplash.com/photo-1555507036-ab794f27d2e9?q=80&w=500&h=400&fit=crop&crop=center",
    ingredients: ["soft bun", "butter", "herbs (optional)"],
    preparationTime: 5,
    isVegetarian: true,
    isAvailable: true
  },
  {
    id: 44,
    name: "Fun on the Bun",
    category: "Bun Maska",
    price: 70,
    description: "Special bun with exciting toppings and spreads.",
    image: "https://images.unsplash.com/photo-1587749095556-ee93f6b4c8f8?q=80&w=500&h=400&fit=crop&crop=center",
    ingredients: ["soft bun", "butter", "cheese spread", "herbs", "special seasoning"],
    preparationTime: 8,
    isVegetarian: true,
    isAvailable: true
  },
  {
    id: 45,
    name: "Chocolaty Bun Maska",
    category: "Bun Maska",
    price: 90,
    description: "Sweet bun with chocolate spread and butter.",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=500&h=400&fit=crop&crop=center",
    ingredients: ["soft bun", "butter", "chocolate spread", "nuts", "sprinkles"],
    preparationTime: 8,
    isVegetarian: true,
    isAvailable: true
  },

  // MOMOS
  {
    id: 46,
    name: "Steamed Momos",
    category: "Momos",
    price: 80,
    description: "Healthy steamed vegetable dumplings.",
    image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?q=80&w=500&h=400&fit=crop&crop=center",
    ingredients: ["dumpling wrapper", "mixed vegetables", "cabbage", "carrot", "onion", "garlic", "ginger"],
    preparationTime: 15,
    isVegetarian: true,
    isAvailable: true
  },
  {
    id: 47,
    name: "Fried Momos",
    category: "Momos",
    price: 90,
    description: "Crispy fried vegetable dumplings.",
    image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?q=80&w=500&h=400&fit=crop&crop=center",
    ingredients: ["dumpling wrapper", "mixed vegetables", "cabbage", "carrot", "onion", "garlic", "ginger"],
    preparationTime: 15,
    isVegetarian: true,
    isAvailable: true
  },
  {
    id: 48,
    name: "Kurkure Momos",
    category: "Momos",
    price: 100,
    description: "Crunchy momos with special crispy coating.",
    image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?q=80&w=500&h=400&fit=crop&crop=center",
    ingredients: ["dumpling wrapper", "mixed vegetables", "crispy coating", "special spices", "herbs"],
    preparationTime: 18,
    isVegetarian: true,
    isAvailable: true
  },
  {
    id: 49,
    name: "Tandoori Momos",
    category: "Momos",
    price: 149,
    description: "Momos marinated in tandoori spices and grilled.",
    image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?q=80&w=500&h=400&fit=crop&crop=center",
    ingredients: ["dumpling wrapper", "mixed vegetables", "tandoori marinade", "yogurt", "spices"],
    preparationTime: 20,
    isVegetarian: true,
    isAvailable: true
  },
  {
    id: 50,
    name: "Afghani Momos",
    category: "Momos",
    price: 159,
    description: "Creamy white sauce coated momos.",
    image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?q=80&w=500&h=400&fit=crop&crop=center",
    ingredients: ["dumpling wrapper", "mixed vegetables", "afghani sauce", "cream", "cashew paste", "spices"],
    preparationTime: 20,
    isVegetarian: true,
    isAvailable: true
  },

  // GARLIC BREAD
  {
    id: 51,
    name: "Plain Garlic Bread",
    category: "Garlic Bread",
    price: 89,
    description: "Classic garlic bread with butter and herbs.",
    image: "https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?q=80&w=500&h=400&fit=crop&crop=center",
    ingredients: ["bread", "butter", "garlic", "parsley", "herbs"],
    preparationTime: 10,
    isVegetarian: true,
    isAvailable: true
  },
  {
    id: 52,
    name: "Cheesy Garlic Bread",
    category: "Garlic Bread",
    price: 99,
    description: "Garlic bread loaded with melted cheese.",
    image: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?q=80&w=500&h=400&fit=crop&crop=center",
    ingredients: ["bread", "butter", "garlic", "mozzarella cheese", "cheddar cheese", "herbs"],
    preparationTime: 12,
    isVegetarian: true,
    isAvailable: true
  },
  {
    id: 53,
    name: "Corn Capsicum Garlic Bread",
    category: "Garlic Bread",
    price: 109,
    description: "Garlic bread topped with corn and capsicum.",
    image: "https://images.unsplash.com/photo-1585937421612-70ca003675ed?q=80&w=500&h=400&fit=crop&crop=center",
    ingredients: ["bread", "butter", "garlic", "sweet corn", "capsicum", "cheese", "herbs"],
    preparationTime: 12,
    isVegetarian: true,
    isAvailable: true
  },
  {
    id: 54,
    name: "Paneer Onion Garlic Bread",
    category: "Garlic Bread",
    price: 119,
    description: "Garlic bread with paneer and onion topping.",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=500&h=400&fit=crop&crop=center",
    ingredients: ["bread", "butter", "garlic", "paneer", "onion", "cheese", "herbs"],
    preparationTime: 12,
    isVegetarian: true,
    isAvailable: true
  },
  {
    id: 55,
    name: "BBQ Veggi Garlic Bread",
    category: "Garlic Bread",
    price: 129,
    description: "Garlic bread with BBQ vegetable topping.",
    image: "https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?q=80&w=500&h=400&fit=crop&crop=center",
    ingredients: ["bread", "butter", "garlic", "mixed vegetables", "BBQ sauce", "cheese", "herbs"],
    preparationTime: 15,
    isVegetarian: true,
    isAvailable: true
  },

  // PASTA/MACARONI
  {
    id: 56,
    name: "Penne Arrabbiata",
    category: "Pasta/Macaroni",
    price: 145,
    description: "Spicy penne pasta in tangy tomato sauce.",
    image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?q=80&w=500&h=400&fit=crop&crop=center",
    ingredients: ["penne pasta", "tomato sauce", "garlic", "chilli flakes", "olive oil", "parsley"],
    preparationTime: 15,
    isVegetarian: true,
    isAvailable: true
  },
  {
    id: 57,
    name: "Penne Alfredo",
    category: "Pasta/Macaroni",
    price: 155,
    description: "Creamy white sauce penne pasta.",
    image: "https://images.unsplash.com/photo-1598866594230-a7c12756260f?q=80&w=500&h=400&fit=crop&crop=center",
    ingredients: ["penne pasta", "cream", "butter", "garlic", "parmesan cheese", "parsley"],
    preparationTime: 15,
    isVegetarian: true,
    isAvailable: true
  },
  {
    id: 58,
    name: "Primavera Penne",
    category: "Pasta/Macaroni",
    price: 165,
    description: "Penne pasta with fresh spring vegetables.",
    image: "https://images.unsplash.com/photo-1563379091339-03246963d9d6?q=80&w=500&h=400&fit=crop&crop=center",
    ingredients: ["penne pasta", "mixed vegetables", "tomato sauce", "herbs", "olive oil", "garlic"],
    preparationTime: 15,
    isVegetarian: true,
    isAvailable: true
  },
  {
    id: 59,
    name: "Penne Pesto",
    category: "Pasta/Macaroni",
    price: 155,
    description: "Penne pasta in fresh basil pesto sauce.",
    image: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?q=80&w=500&h=400&fit=crop&crop=center",
    ingredients: ["penne pasta", "basil pesto", "pine nuts", "parmesan cheese", "garlic", "olive oil"],
    preparationTime: 15,
    isVegetarian: true,
    isAvailable: true
  },
  {
    id: 60,
    name: "Mac 'n' Cheese",
    category: "Pasta/Macaroni",
    price: 189,
    description: "Creamy macaroni with cheesy goodness.",
    image: "https://images.unsplash.com/photo-1599298060674-2d6a0c49c3ad?q=80&w=500&h=400&fit=crop&crop=center",
    ingredients: ["macaroni", "cheddar cheese", "mozzarella cheese", "cream", "butter", "herbs"],
    preparationTime: 18,
    isVegetarian: true,
    isAvailable: true
  },

  // MAGGI
  {
    id: 61,
    name: "Plain Maggi",
    category: "Maggi",
    price: 79,
    description: "Classic instant noodles with basic spices.",
    image: "https://images.unsplash.com/photo-1612927601601-6638404737ce?q=80&w=500&h=400&fit=crop&crop=center",
    ingredients: ["maggi noodles", "maggi masala", "vegetables", "water"],
    preparationTime: 10,
    isVegetarian: true,
    isAvailable: true
  },
  {
    id: 62,
    name: "Double Masala Maggi",
    category: "Maggi",
    price: 99,
    description: "Extra spicy maggi with double masala.",
    image: "https://images.unsplash.com/photo-1612927601601-6638404737ce?q=80&w=500&h=400&fit=crop&crop=center",
    ingredients: ["maggi noodles", "double maggi masala", "extra spices", "vegetables", "water"],
    preparationTime: 10,
    isVegetarian: true,
    isAvailable: true
  },
  {
    id: 63,
    name: "Tandoori Masala Maggi",
    category: "Maggi",
    price: 109,
    description: "Maggi with tandoori spice twist.",
    image: "https://images.unsplash.com/photo-1612927601601-6638404737ce?q=80&w=500&h=400&fit=crop&crop=center",
    ingredients: ["maggi noodles", "tandoori masala", "vegetables", "butter", "herbs"],
    preparationTime: 12,
    isVegetarian: true,
    isAvailable: true
  },
  {
    id: 64,
    name: "Butter Masala Maggi",
    category: "Maggi",
    price: 120,
    description: "Creamy buttery maggi with rich masala.",
    image: "https://images.unsplash.com/photo-1612927601601-6638404737ce?q=80&w=500&h=400&fit=crop&crop=center",
    ingredients: ["maggi noodles", "butter", "cream", "maggi masala", "vegetables", "herbs"],
    preparationTime: 12,
    isVegetarian: true,
    isAvailable: true
  },
  {
    id: 65,
    name: "Creamy Maggi",
    category: "Maggi",
    price: 129,
    description: "Extra creamy and rich maggi preparation.",
    image: "https://images.unsplash.com/photo-1612927601601-6638404737ce?q=80&w=500&h=400&fit=crop&crop=center",
    ingredients: ["maggi noodles", "cream", "cheese", "maggi masala", "vegetables", "butter"],
    preparationTime: 12,
    isVegetarian: true,
    isAvailable: true
  },

  // FRENCH FRIES
  {
    id: 66,
    name: "Classic Fries",
    category: "French Fries",
    price: 80,
    description: "Crispy golden potato fries.",
    image: "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?q=80&w=500&h=400&fit=crop&crop=center",
    ingredients: ["potatoes", "salt", "oil"],
    preparationTime: 10,
    isVegetarian: true,
    isAvailable: true
  },
  {
    id: 67,
    name: "Peri Peri Fries",
    category: "French Fries",
    price: 99,
    description: "Fries tossed in spicy peri peri seasoning.",
    image: "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?q=80&w=500&h=400&fit=crop&crop=center",
    ingredients: ["potatoes", "peri peri seasoning", "salt", "oil", "herbs"],
    preparationTime: 10,
    isVegetarian: true,
    isAvailable: true
  },
  {
    id: 68,
    name: "Cheesy Fries",
    category: "French Fries",
    price: 119,
    description: "Fries loaded with melted cheese.",
    image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?q=80&w=500&h=400&fit=crop&crop=center",
    ingredients: ["potatoes", "cheddar cheese", "mozzarella cheese", "salt", "oil", "herbs"],
    preparationTime: 12,
    isVegetarian: true,
    isAvailable: true
  },
  {
    id: 69,
    name: "West Coast Fries",
    category: "French Fries",
    price: 129,
    description: "Special fries with West Coast seasoning.",
    image: "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?q=80&w=500&h=400&fit=crop&crop=center",
    ingredients: ["potatoes", "special seasoning", "herbs", "salt", "oil", "spices"],
    preparationTime: 10,
    isVegetarian: true,
    isAvailable: true
  },
  {
    id: 70,
    name: "Sunset District",
    category: "French Fries",
    price: 139,
    description: "Fries with unique Sunset District flavor profile.",
    image: "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?q=80&w=500&h=400&fit=crop&crop=center",
    ingredients: ["potatoes", "special sauce", "seasoning", "herbs", "salt", "oil"],
    preparationTime: 12,
    isVegetarian: true,
    isAvailable: true
  },
  {
    id: 71,
    name: "Punjabi in Downtown",
    category: "French Fries",
    price: 149,
    description: "Fries with Indian Punjabi spice twist.",
    image: "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?q=80&w=500&h=400&fit=crop&crop=center",
    ingredients: ["potatoes", "punjabi spices", "chaat masala", "salt", "oil", "herbs"],
    preparationTime: 12,
    isVegetarian: true,
    isAvailable: true
  },

  // QUESADILLAS
  {
    id: 72,
    name: "Veg Quesadilla",
    category: "Quesadillas",
    price: 99,
    description: "Mexican style tortilla with vegetable filling.",
    image: "https://images.unsplash.com/photo-1618040996337-56904b7850b9?q=80&w=500&h=400&fit=crop&crop=center",
    ingredients: ["tortilla", "mixed vegetables", "cheese", "bell peppers", "onion", "salsa"],
    preparationTime: 12,
    isVegetarian: true,
    isAvailable: true
  },
  {
    id: 73,
    name: "Paneer Quesadilla",
    category: "Quesadillas",
    price: 129,
    description: "Quesadilla with spicy paneer filling.",
    image: "https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?q=80&w=500&h=400&fit=crop&crop=center",
    ingredients: ["tortilla", "paneer", "cheese", "bell peppers", "onion", "spices", "salsa"],
    preparationTime: 15,
    isVegetarian: true,
    isAvailable: true
  },
  {
    id: 74,
    name: "Tandoori Quesadilla",
    category: "Quesadillas",
    price: 149,
    description: "Quesadilla with tandoori spiced vegetable filling.",
    image: "https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?q=80&w=500&h=400&fit=crop&crop=center",
    ingredients: ["tortilla", "tandoori vegetables", "cheese", "yogurt marinade", "onion", "salsa"],
    preparationTime: 15,
    isVegetarian: true,
    isAvailable: true
  },
  {
    id: 75,
    name: "Mexican Quesadilla",
    category: "Quesadillas",
    price: 189,
    description: "Authentic Mexican style loaded quesadilla.",
    image: "https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?q=80&w=500&h=400&fit=crop&crop=center",
    ingredients: ["tortilla", "mixed vegetables", "cheese", "beans", "corn", "jalapeños", "salsa", "guacamole"],
    preparationTime: 18,
    isVegetarian: true,
    isAvailable: true
  },

  // SHAKES
  {
    id: 76,
    name: "Mango Shake",
    category: "Shakes",
    price: 129,
    description: "Creamy mango milkshake with fresh mango pulp.",
    image: "https://images.unsplash.com/photo-1571575173700-afb9492e6a50?q=80&w=500&h=400&fit=crop&crop=center",
    ingredients: ["mango pulp", "milk", "sugar", "ice cream", "ice"],
    preparationTime: 8,
    isVegetarian: true,
    isAvailable: true
  },
  {
    id: 77,
    name: "Banana Shake",
    category: "Shakes",
    price: 129,
    description: "Thick and creamy banana milkshake.",
    image: "https://images.unsplash.com/photo-1571575173700-afb9492e6a50?q=80&w=500&h=400&fit=crop&crop=center",
    ingredients: ["banana", "milk", "sugar", "ice cream", "ice"],
    preparationTime: 8,
    isVegetarian: true,
    isAvailable: true
  },
  {
    id: 78,
    name: "Strawberry Shake",
    category: "Shakes",
    price: 129,
    description: "Fresh strawberry flavored milkshake.",
    image: "https://images.unsplash.com/photo-1571575173700-afb9492e6a50?q=80&w=500&h=400&fit=crop&crop=center",
    ingredients: ["strawberries", "milk", "sugar", "ice cream", "ice"],
    preparationTime: 8,
    isVegetarian: true,
    isAvailable: true
  },
  {
    id: 79,
    name: "KitKat Shake",
    category: "Shakes",
    price: 129,
    description: "Chocolatey milkshake with KitKat chunks.",
    image: "https://images.unsplash.com/photo-1571575173700-afb9492e6a50?q=80&w=500&h=400&fit=crop&crop=center",
    ingredients: ["KitKat", "milk", "chocolate syrup", "ice cream", "ice"],
    preparationTime: 8,
    isVegetarian: true,
    isAvailable: true
  },
  {
    id: 80,
    name: "Vanilla Shake",
    category: "Shakes",
    price: 129,
    description: "Classic vanilla flavored milkshake.",
    image: "https://images.unsplash.com/photo-1571575173700-afb9492e6a50?q=80&w=500&h=400&fit=crop&crop=center",
    ingredients: ["vanilla ice cream", "milk", "sugar", "vanilla essence", "ice"],
    preparationTime: 8,
    isVegetarian: true,
    isAvailable: true
  },
  {
    id: 81,
    name: "Oreo Mint Shake",
    category: "Shakes",
    price: 129,
    description: "Refreshing mint shake with Oreo cookies.",
    image: "https://images.unsplash.com/photo-1571575173700-afb9492e6a50?q=80&w=500&h=400&fit=crop&crop=center",
    ingredients: ["Oreo cookies", "mint syrup", "milk", "ice cream", "ice"],
    preparationTime: 8,
    isVegetarian: true,
    isAvailable: true
  },

  // MOCKTAILS
  {
    id: 82,
    name: "Classic Mojito",
    category: "Mocktails",
    price: 109,
    description: "Refreshing mint and lime mocktail.",
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=500&h=400&fit=crop&crop=center",
    ingredients: ["lime", "mint leaves", "soda", "sugar syrup", "ice"],
    preparationTime: 7,
    isVegetarian: true,
    isAvailable: true
  },
  {
    id: 83,
    name: "Watermelon Mojito",
    category: "Mocktails",
    price: 109,
    description: "Mojito with fresh watermelon juice.",
    image: "https://images.unsplash.com/photo-1553555326-7795d603b7c9?q=80&w=500&h=400&fit=crop&crop=center",
    ingredients: ["watermelon juice", "lime", "mint leaves", "soda", "sugar syrup", "ice"],
    preparationTime: 8,
    isVegetarian: true,
    isAvailable: true
  },
  {
    id: 84,
    name: "Kiwi Mojito",
    category: "Mocktails",
    price: 109,
    description: "Mojito with fresh kiwi fruit.",
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=500&h=400&fit=crop&crop=center",
    ingredients: ["kiwi fruit", "lime", "mint leaves", "soda", "sugar syrup", "ice"],
    preparationTime: 8,
    isVegetarian: true,
    isAvailable: true
  },
  {
    id: 85,
    name: "Green Apple Mojito",
    category: "Mocktails",
    price: 109,
    description: "Mojito with crisp green apple flavor.",
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=500&h=400&fit=crop&crop=center",
    ingredients: ["green apple syrup", "lime", "mint leaves", "soda", "sugar syrup", "ice"],
    preparationTime: 7,
    isVegetarian: true,
    isAvailable: true
  },
  {
    id: 86,
    name: "Blue Lagoon Mojito",
    category: "Mocktails",
    price: 109,
    description: "Beautiful blue colored refreshing mocktail.",
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=500&h=400&fit=crop&crop=center",
    ingredients: ["blue curacao syrup", "lime", "mint leaves", "soda", "sugar syrup", "ice"],
    preparationTime: 7,
    isVegetarian: true,
    isAvailable: true
  },
  {
    id: 87,
    name: "Fruit Punch Mojito",
    category: "Mocktails",
    price: 109,
    description: "Mixed fruit flavored refreshing mocktail.",
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=500&h=400&fit=crop&crop=center",
    ingredients: ["mixed fruit juice", "lime", "mint leaves", "soda", "sugar syrup", "ice"],
    preparationTime: 8,
    isVegetarian: true,
    isAvailable: true
  },

  // DESSERT
  {
    id: 88,
    name: "Hot Chocolate Brownie",
    category: "Dessert",
    price: 99,
    description: "Warm chocolate brownie served with hot chocolate sauce.",
    image: "https://images.unsplash.com/photo-1570145820259-b5b80c5c8bd6?q=80&w=500&h=400&fit=crop&crop=center",
    ingredients: ["chocolate brownie", "hot chocolate sauce", "chocolate chips", "icing sugar"],
    preparationTime: 10,
    isVegetarian: true,
    isAvailable: true
  },
  {
    id: 89,
    name: "Brownie with Nut & Ice Cream",
    category: "Dessert",
    price: 129,
    description: "Chocolate brownie with nuts and vanilla ice cream.",
    image: "https://images.unsplash.com/photo-1564355808539-22fda35bed7e?q=80&w=500&h=400&fit=crop&crop=center",
    ingredients: ["chocolate brownie", "mixed nuts", "vanilla ice cream", "chocolate sauce"],
    preparationTime: 8,
    isVegetarian: true,
    isAvailable: true
  },
  {
    id: 90,
    name: "Brownie Sundae",
    category: "Dessert",
    price: 119,
    description: "Brownie pieces with ice cream and toppings.",
    image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?q=80&w=500&h=400&fit=crop&crop=center",
    ingredients: ["brownie pieces", "vanilla ice cream", "chocolate sauce", "whipped cream", "cherry"],
    preparationTime: 8,
    isVegetarian: true,
    isAvailable: true
  }
];

export default menuItems;

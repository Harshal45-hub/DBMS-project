const mongoose = require('mongoose');
const ClothingItem = require('./models/ClothingItem');
const Challenge = require('./models/Challenge');
require('dotenv').config();

const seedClothingItems = [
  {
    name: "Classic White T-Shirt",
    imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
    category: "upperwear",
    subCategory: "t-shirt",
    color: "white",
    occasion: ["casual", "sport"],
    tags: ["basic", "essential"],
    price: 25,
    dripScore: 85,
    timesWorn: 12
  },
  {
    name: "Black Denim Jacket",
    imageUrl: "https://images.unsplash.com/photo-1551537482-f2075a1d41f2",
    category: "upperwear",
    subCategory: "shirt",
    color: "black",
    occasion: ["casual", "date"],
    tags: ["streetwear", "edgy"],
    price: 65,
    dripScore: 90,
    timesWorn: 8
  },
  {
    name: "Slim Fit Jeans",
    imageUrl: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246",
    category: "lowerwear",
    subCategory: "jeans",
    color: "blue",
    occasion: ["casual", "work", "date"],
    tags: ["denim", "classic"],
    price: 55,
    dripScore: 88,
    timesWorn: 15
  },
  {
    name: "Formal Blazer",
    imageUrl: "https://images.unsplash.com/photo-1507679799987-c73779587ccf",
    category: "upperwear",
    subCategory: "shirt",
    color: "navy",
    occasion: ["formal", "work"],
    tags: ["professional", "sophisticated"],
    price: 120,
    dripScore: 92,
    timesWorn: 5
  },
  {
    name: "Casual Hoodie",
    imageUrl: "https://images.unsplash.com/photo-1556821840-3a63f95609a7",
    category: "upperwear",
    subCategory: "t-shirt",
    color: "gray",
    occasion: ["casual", "sport"],
    tags: ["comfortable", "streetwear"],
    price: 45,
    dripScore: 82,
    timesWorn: 20
  },
  {
    name: "Leather Boots",
    imageUrl: "https://images.unsplash.com/photo-1549298916-b41d501d3772",
    category: "lowerwear",
    subCategory: "pants",
    color: "brown",
    occasion: ["casual", "formal"],
    tags: ["footwear", "stylish"],
    price: 95,
    dripScore: 87,
    timesWorn: 10
  }
];

const seedChallenges = [
  {
    title: "Monochrome Magic",
    description: "Create an outfit using only one color family",
    type: "weekly",
    requirements: {
      color: "monochrome"
    },
    startDate: new Date(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    active: true,
    participants: []
  },
  {
    title: "Vintage Vibes",
    description: "Show off your best vintage-inspired outfit",
    type: "special",
    requirements: {
      occasion: "vintage"
    },
    startDate: new Date(),
    endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    active: true,
    participants: []
  },
  {
    title: "Sustainable Style",
    description: "Create an outfit using at least 3 items you've worn before",
    type: "daily",
    requirements: {},
    startDate: new Date(),
    endDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    active: true,
    participants: []
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Clear existing data
    await ClothingItem.deleteMany({});
    await Challenge.deleteMany({});
    
    // Insert seed data
    await ClothingItem.insertMany(seedClothingItems);
    await Challenge.insertMany(seedChallenges);
    
    console.log('Database seeded successfully!');
    console.log(`Added ${seedClothingItems.length} clothing items`);
    console.log(`Added ${seedChallenges.length} challenges`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
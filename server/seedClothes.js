require('dotenv').config();
const mongoose = require('mongoose');
const Clothing = require('./models/Clothing');

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("MONGODB_URI is not defined in .env");
  process.exit(1);
}

const clothes = [
  { name: "Classic White Shirt", category: "shirt", imageUrl: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=400", publicId: "mock_public_id_1" },
  { name: "Black T-Shirt", category: "tshirt", imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400", publicId: "mock_public_id_2" },
  { name: "Blue Denim Jacket", category: "jacket", imageUrl: "https://images.unsplash.com/photo-1601333144130-8cbb312386b6?w=400", publicId: "mock_public_id_3" },
  { name: "Traditional Kurta", category: "kurta", imageUrl: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400", publicId: "mock_public_id_4" },
  { name: "Grey Hoodie", category: "hoodie", imageUrl: "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=400", publicId: "mock_public_id_5" },
  { name: "Floral Dress", category: "dress", imageUrl: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400", publicId: "mock_public_id_6" },
  { name: " Dress", category: "dress", imageUrl: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400", publicId: "mock_public_id_7" }
]

const seedDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    await Clothing.deleteMany();
    console.log('Cleared existing clothing items');

    await Clothing.insertMany(clothes);
    console.log('Clothing items seeded successfully');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedDB();

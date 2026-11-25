require('dotenv').config();
const mongoose = require('mongoose');
const Clothing = require('./models/Clothing');

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("MONGODB_URI is not defined in .env");
  process.exit(1);
}

const clothes = [
  // --- T-Shirts ---
  {
    name: "Classic Black Crewneck Tee",
    category: "tshirt",
    imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80",
    publicId: "seed_tshirt_1"
  },
  {
    name: "Minimalist Pure White Tee",
    category: "tshirt",
    imageUrl: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=600&q=80",
    publicId: "seed_tshirt_2"
  },
  {
    name: "Vintage Graphic Streetwear Tee",
    category: "tshirt",
    imageUrl: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=600&q=80",
    publicId: "seed_tshirt_3"
  },
  {
    name: "Heather Grey Athletic Tee",
    category: "tshirt",
    imageUrl: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=600&q=80",
    publicId: "seed_tshirt_4"
  },

  // --- Shirts ---
  {
    name: "Classic White Crisp Formal Shirt",
    category: "shirt",
    imageUrl: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=600&q=80",
    publicId: "seed_shirt_1"
  },
  {
    name: "Blue Oxford Button-Down Shirt",
    category: "shirt",
    imageUrl: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80",
    publicId: "seed_shirt_2"
  },
  {
    name: "Casual Red Checkered Flannel Shirt",
    category: "shirt",
    imageUrl: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=600&q=80",
    publicId: "seed_shirt_3"
  },
  {
    name: "Navy Blue Linen Casual Shirt",
    category: "shirt",
    imageUrl: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=600&q=80",
    publicId: "seed_shirt_4"
  },

  // --- Kurtas ---
  {
    name: "Traditional Royal Blue Kurta",
    category: "kurta",
    imageUrl: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80",
    publicId: "seed_kurta_1"
  },
  {
    name: "Classic White Cotton Festive Kurta",
    category: "kurta",
    imageUrl: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80",
    publicId: "seed_kurta_2"
  },
  {
    name: "Mustard Embroidered Ethnic Kurta",
    category: "kurta",
    imageUrl: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=600&q=80",
    publicId: "seed_kurta_3"
  },

  // --- Jackets ---
  {
    name: "Vintage Blue Denim Jacket",
    category: "jacket",
    imageUrl: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=600&q=80",
    publicId: "seed_jacket_1"
  },
  {
    name: "Classic Black Leather Biker Jacket",
    category: "jacket",
    imageUrl: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=600&q=80",
    publicId: "seed_jacket_2"
  },
  {
    name: "Olive Green Military Bomber Jacket",
    category: "jacket",
    imageUrl: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&w=600&q=80",
    publicId: "seed_jacket_3"
  },

  // --- Hoodies ---
  {
    name: "Essential Heather Grey Hoodie",
    category: "hoodie",
    imageUrl: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=600&q=80",
    publicId: "seed_hoodie_1"
  },
  {
    name: "Black Oversized Streetwear Hoodie",
    category: "hoodie",
    imageUrl: "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=600&q=80",
    publicId: "seed_hoodie_2"
  },
  {
    name: "Pastel Pink Fleece Pullover Hoodie",
    category: "hoodie",
    imageUrl: "https://images.unsplash.com/photo-1578768079052-aa76e520036c?auto=format&fit=crop&w=600&q=80",
    publicId: "seed_hoodie_3"
  },

  // --- Dresses ---
  {
    name: "Summer Floral Midi Dress",
    category: "dress",
    imageUrl: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=600&q=80",
    publicId: "seed_dress_1"
  },
  {
    name: "Elegant Red Evening Gala Dress",
    category: "dress",
    imageUrl: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=600&q=80",
    publicId: "seed_dress_2"
  },
  {
    name: "Classic Black Satin Slip Dress",
    category: "dress",
    imageUrl: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=600&q=80",
    publicId: "seed_dress_3"
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB successfully.');

    await Clothing.deleteMany({});
    console.log('Cleared existing clothing items from database.');

    const inserted = await Clothing.insertMany(clothes);
    console.log(`Successfully seeded ${inserted.length} clothing items across all categories!`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedDB();

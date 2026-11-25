require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("MONGODB_URI is not defined in .env");
  process.exit(1);
}

const seedAdmin = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // 1. Backfill existing users (ensure non-admins explicitly max to 2 credits to be safe)
    await User.updateMany(
      { isAdmin: { $ne: true } },
      { $set: { credits: 2, isAdmin: false } }
    );
    console.log('Existing users backfilled with 2 credits and fixed roles');

    // 2. Create or update the admin user
    const adminEmail = "admin@outfitoracle.com";
    const existingAdmin = await User.findOne({ email: adminEmail });
    
    if (existingAdmin) {
      existingAdmin.isAdmin = true;
      existingAdmin.credits = 999;
      await existingAdmin.save();
      console.log('Admin user updated');
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash("admin123", salt);
      
      await User.create({
        name: "Admin",
        email: adminEmail,
        password: hashedPassword,
        isAdmin: true,
        credits: 999
      });
      console.log('Admin user created successfully');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();

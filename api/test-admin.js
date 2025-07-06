const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User.model");
require("dotenv").config();

const mongoUrl = process.env.MONGO_URL || process.env.DB_URL;

async function createAdmin() {
  try {
    await mongoose.connect(mongoUrl, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    
    console.log("Connected to MongoDB");
    
    // Check if admin exists
    const existingAdmin = await User.findOne({ email: "admin@admin.com" });
    if (existingAdmin) {
      console.log("Admin already exists:", existingAdmin.email);
      console.log("Is admin:", existingAdmin.isAdmin);
    } else {
      // Create admin user
      const hashedPassword = await bcrypt.hash("123456", 10);
      const admin = await User.create({
        fullname: "Admin User",
        email: "admin@admin.com", 
        password: hashedPassword,
        isAdmin: true
      });
      console.log("Admin created:", admin.email);
    }
    
    // Also create test user
    const existingUser = await User.findOne({ email: "user@user.com" });
    if (!existingUser) {
      const hashedPassword = await bcrypt.hash("123456", 10);
      await User.create({
        fullname: "Test User",
        email: "user@user.com",
        password: hashedPassword,
        isAdmin: false
      });
      console.log("Test user created: user@user.com");
    }
    
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

createAdmin();

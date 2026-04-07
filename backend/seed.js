import mongoose from 'mongoose';
import Admin from './src/models/Admin.js';
import dotenv from 'dotenv';

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("DB Connected for seeding...");

    const adminExists = await Admin.findOne({ username: 'admin' });
    if (adminExists) {
      console.log("Admin user already exists. Updating password...");
      adminExists.password = 'admin123';
      await adminExists.save();
    } else {
      const newAdmin = new Admin({
        username: 'admin',
        password: 'admin123'
      });
      await newAdmin.save();
      console.log("Admin user created successfully!");
    }

    mongoose.disconnect();
    console.log("Done.");
  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  }
};

seedAdmin();

import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true } // Professional apps mein ise hash karte hain
});

export default mongoose.model('Admin', adminSchema);
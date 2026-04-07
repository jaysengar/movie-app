import mongoose from 'mongoose';

const requestSchema = new mongoose.Schema({
  movieName: { type: String, required: true },
  status: { type: String, default: 'Pending' }, // Pending/Added
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Request', requestSchema);
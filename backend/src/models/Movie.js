import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  year: String,
  poster: String,
  rating: Number,
  plot: String,
  tmdbID: { type: Number, unique: true },
  downloadLink: { type: String, required: true }, 
  trailerLink: String,// Admin manual link dalega
  createdAt: { type: Date, default: Date.now }
});

// Search fast karne ke liye title par index lagaya hai
movieSchema.index({ title: 'text' });

export default mongoose.model('Movie', movieSchema);
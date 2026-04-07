import Fastify from 'fastify';
import fastifyIO from 'fastify-socket.io';
import cors from '@fastify/cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import movieRoutes from './routes/movieRoutes.js';
import Movie from './models/Movie.js';

dotenv.config();
const fastify = Fastify({ logger: true });

// 1. CORS Fix: Explicitly allow DELETE method
fastify.register(cors, { 
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'] // DELETE ko allow karna zaroori hai
});

fastify.register(fastifyIO, { 
  cors: { 
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  } 
});

// Routes
fastify.register(movieRoutes, { prefix: '/api/movies' });

// Socket.io Real-time Search Logic
fastify.ready((err) => {
  if (err) throw err;

  fastify.io.on('connection', (socket) => {
    console.log('User Connected:', socket.id);

    socket.on('search-movie', async ({ query, page = 1 }) => {
  try {
    const limit = 16; // Ek page par 16 movies
    const skip = (page - 1) * limit;

    const searchQuery = { title: { $regex: query, $options: 'i' } };

    // 1. Total movies count karo taaki pata chale kitne pages banane hain
    const totalMovies = await Movie.countDocuments(searchQuery);
    const totalPages = Math.ceil(totalMovies / limit);

    // 2. Sirf current page ka data nikalo
    const results = await Movie.find(searchQuery)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    // Result aur totalPages dono bhejo
    socket.emit('filtered-results', { 
      results, 
      totalPages, 
      currentPage: page 
    });
  } catch (error) {
    console.error("Pagination Error:", error);
  }
});
  });
});

// Database & Server Start
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    // Port fix: process.env.PORT ko number mein convert karna better rehta hai
    const port = parseInt(process.env.PORT) || 5000;
    fastify.listen({ port: port, host: '0.0.0.0' }, (err) => {
      if (err) { 
        fastify.log.error(err); 
        process.exit(1); 
      }
      console.log(`🚀 Server running on port ${port}`);
    });
  })
  .catch(err => console.log("DB Connection Error:", err));
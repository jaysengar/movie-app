import { 
  fetchFromTMDB, 
  addMovie, 
  getAllMovies,
  getRequests, deleteRequest, // Naya import
  deleteMovie   // Naya import
} from '../controllers/movieController.js';
import Request from '../models/Request.js';
import { adminLogin } from '../controllers/movieController.js';

async function movieRoutes(fastify) {
  fastify.get('/fetch-tmdb', fetchFromTMDB);
  fastify.post('/add', addMovie);
  
  // Inventory fetch karne ke liye (Search support ke saath)
  fastify.get('/all', getAllMovies); 
  
  // Movie delete karne ke liye
  fastify.delete('/delete/:id', deleteMovie);

  fastify.get('/requests', getRequests);
  fastify.delete('/requests/:id', deleteRequest);

  // Naya Request Route
  fastify.post('/request', async (request, reply) => {
    try {
      const { movieName } = request.body;
      if (!movieName) return reply.status(400).send({ error: "Naam toh likho bhai!" });
      
      const newRequest = new Request({ movieName });
      await newRequest.save();
      
      return { message: "Request received!" };
    } catch (err) {
      reply.status(500).send({ error: "Request fail ho gayi" });
    }
  });
  fastify.post('/login', adminLogin);
}

export default movieRoutes;
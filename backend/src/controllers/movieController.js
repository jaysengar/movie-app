import axios from 'axios';
import Movie from '../models/Movie.js';
import Request from '../models/Request.js';
import Admin from '../models/Admin.js';

// 1. TMDB se movie fetch karna (Admin Search ke liye)
export const fetchFromTMDB = async (request, reply) => {
  const { movieName } = request.query;
  const API_KEY = process.env.TMDB_API_KEY;

  try {
    const res = await axios.get(
      `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${movieName}`
    );

    if (res.data.results.length === 0) return reply.status(404).send({ error: "Movie not found!" });

    const m = res.data.results[0];
    return {
      title: m.title,
      year: m.release_date?.split('-')[0],
      poster: `https://image.tmdb.org/t/p/w500${m.poster_path}`,
      rating: m.vote_average,
      plot: m.overview,
      tmdbID: m.id
    };
  } catch (error) {
    return reply.status(500).send({ error: "TMDB Fetch Failed" });
  }
};

// 2. Database mein Movie save karna (Admin Action)
export const addMovie = async (request, reply) => {
  try {
    const movie = new Movie(request.body);
    await movie.save();
    return { success: true, message: "Movie added to platform!" };
  } catch (error) {
    return reply.status(400).send({ error: "Movie already exists or data missing" });
  }
};
export const getAllMovies = async (request, reply) => {
  try {
    const { q } = request.query;
    let query = {};
    if (q) {
      query = { title: { $regex: q, $options: "i" } };
    }
    // Latest upload sabse upar dikhane ke liye sort
    const movies = await Movie.find(query).sort({ createdAt: -1 });
    return movies;
  } catch (err) {
    reply.status(500).send({ error: "Inventory fetch failed" });
  }
};

// 2. Movie delete karne ka logic
export const deleteMovie = async (request, reply) => {
  try {
    const { id } = request.params;
    console.log("Deleting Movie with ID:", id); // Ye terminal mein check karna

    if (!id) {
      return reply.status(400).send({ error: "ID missing hai bhai!" });
    }

    const deletedMovie = await Movie.findByIdAndDelete(id);

    if (!deletedMovie) {
      return reply.status(404).send({ error: "Movie database mein nahi mili!" });
    }

    return { message: "Movie deleted successfully" };
  } catch (err) {
    console.error("Delete Error:", err);
    reply.status(500).send({ error: "Internal Server Error" });
  }
};
export const getRequests = async (request, reply) => {
  try {
    const requests = await Request.find().sort({ createdAt: -1 });
    return requests;
  } catch (err) {
    reply.status(500).send({ error: "Requests fetch failed" });
  }
};

// 2. Request puri hone par delete karne ke liye
export const deleteRequest = async (request, reply) => {
  try {
    const { id } = request.params;
    await Request.findByIdAndDelete(id);
    return { message: "Request deleted" };
  } catch (err) {
    reply.status(500).send({ error: "Delete failed" });
  }
};
export const adminLogin = async (request, reply) => {
  try {
    const { username, password } = request.body;
    
    // Database mein admin ko dhundo
    const admin = await Admin.findOne({ username, password });

    if (admin) {
      return { success: true, message: "Login Successful" };
    } else {
      reply.status(401).send({ success: false, message: "Invalid Credentials" });
    }
  } catch (err) {
    reply.status(500).send({ error: "Server Error" });
  }
};
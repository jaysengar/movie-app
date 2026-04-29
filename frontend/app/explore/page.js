"use client";

import { useState, useEffect } from "react";
import { socket } from "../lib/socket"; 
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import Navbar from "../components/Navbar";
import MovieCard from "../components/MovieCard";
import MovieModal from "../components/MovieModal";

export default function ExplorePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  
  // --- PAGINATION STATES ---
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // 1. Socket Connection & Logic
  useEffect(() => {
    socket.connect();

    // Backend se paginated data receive karna
    socket.on("filtered-results", (data) => {
      // Data format: { results: [], totalPages: 10 }
      const movieResults = data.results || data; 
      const sortedByUpload = movieResults.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      setMovies(sortedByUpload);
      if (data.totalPages) setTotalPages(data.totalPages);
    });

    // Initial load: Page 1 mangwane ke liye
    socket.emit("search-movie", { query: "", page: 1 });

    return () => {
      socket.off("filtered-results");
      socket.disconnect();
    };
  }, []);

  // 2. Search Handler (Hamesha Page 1 par reset karega)
  const handleSearch = (e) => {
    const val = e.target.value;
    setSearchTerm(val);
    setCurrentPage(1);
    socket.emit("search-movie", { query: val, page: 1 });
  };

  // 3. Page Change Handler
  const changePage = (pageNumber) => {
    setCurrentPage(pageNumber);
    socket.emit("search-movie", { query: searchTerm, page: pageNumber });
    // Page badalne par smoothly upar scroll karega
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="min-h-screen bg-[#020202] text-white selection:bg-indigo-500/30">
      <Navbar />

      {/* --- MOVIE DETAIL MODAL --- */}
      <MovieModal 
        movie={selectedMovie} 
        isOpen={!!selectedMovie} 
        onClose={() => setSelectedMovie(null)} 
      />

      {/* --- FIXED SEARCH CAPSULE --- */}
      <div className="fixed top-24 left-0 w-full z-40 flex justify-center px-6 pointer-events-none">
        <motion.div 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="relative w-full max-w-md pointer-events-auto group"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 rounded-full blur-md opacity-20 group-focus-within:opacity-60 transition duration-700" />
          
          <div className="relative flex items-center bg-black/40 backdrop-blur-2xl border border-white/10 rounded-full px-6 py-3.5">
            <Search className="w-5 h-5 text-gray-500 group-focus-within:text-indigo-400 transition-colors" />
            <input
              type="text"
              placeholder="Search cinematic magic..."
              className="w-full bg-transparent border-none p-2 ml-3 text-sm font-medium focus:outline-none placeholder:text-gray-600"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
        </motion.div>
      </div>

      {/* --- MAIN MOVIE GRID --- */}
      <div className="max-w-7xl mx-auto px-6 pt-52 pb-10">
        <motion.div 
          layout 
          className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-10"
        >
          <AnimatePresence mode="popLayout">
            {movies.length > 0 ? (
              movies.map((movie) => (
                <motion.div
                  key={movie._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  onClick={() => setSelectedMovie(movie)}
                  className="cursor-pointer"
                >
                  <MovieCard movie={movie} />
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-40">
                <p className="text-gray-700 text-[10px] font-black uppercase tracking-[1.5em] animate-pulse">
                  Scanning Deep Space...
                </p>
              </div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* --- GOOGLE STYLE PAGINATION --- */}
        {totalPages > 1 && (
          <div className="mt-24 mb-20 flex flex-col items-center gap-8">
            {/* Cinematic Logo Pagination Text */}
            <div className="flex items-center text-3xl md:text-4xl font-black italic tracking-tighter">
              <span className="text-indigo-500">C</span>
              <span className="text-purple-500">l</span>
              {[...Array(Math.min(totalPages, 5))].map((_, i) => (
                <span key={i} className="text-indigo-400">i</span>
              ))}
              <span className="text-indigo-500">p</span>
              <span className="text-purple-500">I</span>
              <span className="text-indigo-600">t</span>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center gap-3">
              <button 
                disabled={currentPage === 1}
                onClick={() => changePage(currentPage - 1)}
                className="p-3 bg-white/5 rounded-full disabled:opacity-20 hover:bg-white/10 transition-all"
              >
                <ChevronLeft size={20} />
              </button>

              <div className="flex gap-2">
                {[...Array(totalPages)].map((_, i) => {
                  const pageNum = i + 1;
                  // Show limited pages if there are too many (Optional logic can be added here)
                  return (
                    <button
                      key={pageNum}
                      onClick={() => changePage(pageNum)}
                      className={`w-10 h-10 md:w-12 md:h-12 rounded-full font-black text-xs md:text-sm transition-all duration-300 ${
                        currentPage === pageNum 
                        ? "bg-indigo-600 text-white shadow-[0_0_25px_rgba(79,70,229,0.5)] border border-indigo-400" 
                        : "bg-white/5 text-gray-500 hover:bg-white/10 hover:text-gray-300"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button 
                disabled={currentPage === totalPages}
                onClick={() => changePage(currentPage + 1)}
                className="p-3 bg-white/5 rounded-full disabled:opacity-20 hover:bg-white/10 transition-all"
              >
                <ChevronRight size={20} />
              </button>
            </div>
            
            <p className="text-[9px] uppercase tracking-[0.4em] text-gray-600 font-bold">
              Displaying Page {currentPage} of {totalPages}
            </p>
          </div>
        )}
      </div>

      <div className="fixed inset-0 z-[-1] pointer-events-none bg-[radial-gradient(circle_at_top,rgba(79,70,229,0.05)_0%,transparent_50%)]" />
    </main>
  );
}
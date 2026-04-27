// frontend/app/components/MovieCard.js
"use client";
import { motion } from "framer-motion";
import { Star, Download } from 'lucide-react'; // Import icons for better UI

export default function MovieCard({ movie }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
      whileHover={{ 
        y: -10, // Lift effect
        boxShadow: "0 20px 40px rgba(79, 70, 229, 0.4)", // Stronger indigo shadow for depth
        transition: { duration: 0.3 } 
      }}
      className="relative group bg-black/20 rounded-3xl overflow-hidden border border-white/5 hover:border-indigo-500/50 shadow-xl"
    >
      {/* Poster with Overlay */}
      <div className="relative aspect-[2/3] overflow-hidden">
        <img 
          src={movie.poster} 
          alt={movie.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
        />
        {/* Darker overlay on hover to make text pop more */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90 group-hover:from-black/90 transition-opacity duration-300" />
        
        {/* Badge */}
        <div className="absolute top-4 left-4 bg-indigo-600/20 backdrop-blur-md border border-indigo-500/30 px-3 py-1 rounded-full text-[10px] font-black text-indigo-400">
          HD QUALITY
        </div>
      </div>

      {/* Info Section */}
      <div className="p-6">
        <h3 className="text-xl font-black text-white truncate leading-tight mb-1">
          {movie.title}
        </h3>
        <div className="flex items-center gap-3 mt-2 text-xs text-gray-500 font-bold uppercase tracking-tighter">
          <span>{movie.year}</span>
          {/* Enhanced rating display */}
          <span className="flex items-center gap-1 text-yellow-400 bg-white/10 px-2 py-0.5 rounded-md">
            <Star size={12} fill="currentColor" /> {movie.rating}
          </span>
        </div>

        <motion.a
          href={movie.downloadLink}
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.02 }} // Subtle scale for the button itself
          className="mt-6 flex items-center justify-center w-full py-4 bg-white text-black text-sm font-black rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300"
        >
          <Download size={16} className="mr-2" /> DOWNLOAD NOW
        </motion.a>
      </div>
      
      {/* Hover Glow Effect (remains the same, complements new boxShadow) */}
      <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl blur opacity-0 group-hover:opacity-20 transition duration-500 pointer-events-none" />
    </motion.div>
  );
}
"use client";
import { motion } from "framer-motion";

export default function MovieCard({ movie }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
      whileHover={{ y: -15, transition: { duration: 0.3 } }}
      className="relative group bg-[#0a0a0a] rounded-3xl overflow-hidden border border-white/5 hover:border-indigo-500/50 shadow-2xl"
    >
      {/* Poster with Overlay */}
      <div className="relative aspect-[2/3] overflow-hidden">
        <img 
          src={movie.poster} 
          alt={movie.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90" />
        
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
        <div className="flex justify-between items-center text-xs text-gray-500 font-bold uppercase tracking-tighter">
          <span>{movie.year}</span>
          <span className="text-indigo-400">⭐ {movie.rating}</span>
        </div>

        <motion.a
          href={movie.downloadLink}
          whileTap={{ scale: 0.95 }}
          className="mt-6 flex items-center justify-center w-full py-4 bg-white text-black text-sm font-black rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-all"
        >
          DOWNLOAD NOW
        </motion.a>
      </div>
      
      {/* Hover Glow Effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl blur opacity-0 group-hover:opacity-20 transition duration-500 pointer-events-none" />
    </motion.div>
  );
}
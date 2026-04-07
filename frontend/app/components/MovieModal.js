"use client";
import { motion, AnimatePresence } from "framer-motion";
import { X, Star, Calendar, Download } from "lucide-react";

export default function MovieModal({ movie, isOpen, onClose }) {
  if (!movie) return null;

  // YouTube ID nikalne ka logic
  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}?autoplay=1&mute=1` : null;
  };

  const embedUrl = getYouTubeEmbedUrl(movie.trailerLink);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-2 md:p-4">
          {/* Background Overlay */}
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            onClick={onClose} 
            className="absolute inset-0 bg-black/95 backdrop-blur-md" 
          />

          {/* Modal Container */}
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }} 
            animate={{ scale: 1, opacity: 1, y: 0 }} 
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-5xl max-h-[95vh] bg-[#0a0a0a] border border-white/10 rounded-2xl md:rounded-[2.5rem] overflow-y-auto no-scrollbar shadow-2xl flex flex-col"
          >
            {/* --- VIDEO SECTION --- */}
            <div className="relative w-full aspect-video bg-black shrink-0">
              {embedUrl ? (
                <iframe
                  src={embedUrl}
                  title="Trailer"
                  className="absolute inset-0 w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : (
                <div className="w-full h-full relative">
                    <img src={movie.poster} className="w-full h-full object-cover opacity-40 blur-sm" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">No Trailer Available</p>
                    </div>
                </div>
              )}
              
              {/* Close Button - Mobile optimized position */}
              <button 
                onClick={onClose} 
                className="absolute top-3 right-3 md:top-6 md:right-6 z-50 p-2 md:p-3 bg-black/60 backdrop-blur-md rounded-full hover:bg-white/10 border border-white/10"
              >
                <X className="text-white w-5 h-5 md:w-6 md:h-6" />
              </button>
            </div>

            {/* --- DETAILS SECTION --- */}
            <div className="p-6 md:p-10 flex flex-col md:flex-row gap-6 md:gap-10">
               {/* Hidden on small phones for more space */}
               <div className="hidden md:block w-32 lg:w-40 shrink-0">
                  <img src={movie.poster} className="w-full rounded-2xl shadow-2xl border border-white/5" />
               </div>

               <div className="flex-1 space-y-4">
                  <div>
                    <h2 className="text-2xl md:text-5xl font-black text-white leading-tight italic uppercase tracking-tighter">
                        {movie.title}
                    </h2>
                    <div className="flex items-center gap-4 mt-2 text-[10px] md:text-xs font-bold text-indigo-400 uppercase tracking-[0.2em]">
                        <span className="flex items-center gap-1 bg-indigo-500/10 px-2 py-1 rounded">
                            <Star size={12} fill="currentColor"/> {movie.rating}
                        </span>
                        <span className="bg-white/5 px-2 py-1 rounded text-gray-400">
                            {movie.year}
                        </span>
                    </div>
                  </div>

                  <p className="text-gray-400 text-sm md:text-base leading-relaxed font-light line-clamp-4 md:line-clamp-none">
                    {movie.plot || "No description available for this cinematic experience."}
                  </p>

                  <div className="pt-4">
                    <motion.a 
                        whileTap={{ scale: 0.95 }}
                        href={movie.downloadLink} 
                        target="_blank" 
                        className="flex items-center justify-center gap-3 w-full md:w-fit md:px-12 py-4 bg-indigo-600 hover:bg-white hover:text-black text-white rounded-xl md:rounded-2xl font-black text-sm md:text-lg transition-all duration-500 shadow-[0_10px_40px_rgba(79,70,229,0.3)]"
                    >
                        <Download size={20} /> DOWNLOAD NOW
                    </motion.a>
                  </div>
               </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
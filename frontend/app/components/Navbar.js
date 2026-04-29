"use client";
import { useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquarePlus, Send, X } from 'lucide-react';

export default function Navbar() {
  const [isRequestOpen, setIsRequestOpen] = useState(false);
  const [movieName, setMovieName] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success

  const handleQuickRequest = async (e) => {
    e.preventDefault();
    if (!movieName) return;
    
    setStatus('loading');
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/movies/request`, { movieName });
      setStatus('success');
      setMovieName('');
      setTimeout(() => {
        setStatus('idle');
        setIsRequestOpen(false);
      }, 2000);
    } catch (err) {
      alert("Error sending request");
      setStatus('idle');
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-[100] px-4 md:px-6 py-4 bg-black/40 backdrop-blur-xl border-b border-white/5 shadow-2xl">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        {/* Logo */}
        <Link href="/" className="text-xl md:text-2xl font-black tracking-tighter text-white uppercase group shrink-0">
          ClipIt<span className="text-indigo-500 transition-colors group-hover:text-white">Bollywood</span>
        </Link>

        {/* Right Side Actions */}
        <div className="flex items-center gap-3 md:gap-8">
          
          {/* Quick Request Toggle */}
          <div className="relative flex items-center">
            <AnimatePresence mode="wait">
              {!isRequestOpen ? (
                <motion.button
                  key="open-btn"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={() => setIsRequestOpen(true)}
                  className="flex items-center gap-2 bg-indigo-600/10 hover:bg-indigo-600 border border-indigo-500/20 px-3 py-1.5 md:px-4 md:py-2 rounded-full text-indigo-400 hover:text-white transition-all duration-300"
                >
                  <MessageSquarePlus size={16} />
                  <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">Request</span>
                </motion.button>
              ) : (
                <motion.div
                  key="request-form"
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: typeof window !== 'undefined' && window.innerWidth < 640 ? '180px' : '300px', opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  className="flex items-center bg-black/60 border border-indigo-500/50 rounded-full px-3 py-1 md:py-1.5"
                >
                  <form onSubmit={handleQuickRequest} className="flex items-center w-full">
                    <input 
                      autoFocus
                      type="text"
                      placeholder={status === 'success' ? "BHEJ DIYA!" : "Movie Name..."}
                      className="bg-transparent border-none outline-none text-[10px] md:text-xs text-white placeholder:text-gray-500 w-full px-2"
                      value={movieName}
                      onChange={(e) => setMovieName(e.target.value)}
                      disabled={status === 'success'}
                    />
                    <button type="submit" className="text-indigo-400 hover:text-white p-1">
                      {status === 'loading' ? (
                        <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Send size={14} />
                      )}
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setIsRequestOpen(false)}
                      className="ml-1 text-gray-500 hover:text-red-400"
                    >
                      <X size={14} />
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex gap-8 text-[10px] font-black uppercase tracking-widest text-gray-400">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <Link href="/explore" className="hover:text-white transition-colors text-indigo-400">Explore</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
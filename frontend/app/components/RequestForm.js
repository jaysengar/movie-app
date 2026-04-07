"use client";
import { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';

export default function RequestForm() {
  const [movieName, setMovieName] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  const handleRequest = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/movies/request`, { movieName });
      setStatus('SUCCESS');
      setMovieName('');
      setTimeout(() => setStatus(''), 3000);
    } catch (err) {
      setStatus('ERROR');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto my-20 px-6">
      <div className="bg-[#0a0a0a] border border-white/5 p-8 rounded-[2.5rem] text-center shadow-2xl relative overflow-hidden">
        <h3 className="text-2xl font-black italic uppercase mb-2 tracking-tighter">Movie Nahi Mili?</h3>
        <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.3em] mb-8">Humein batao, hum 24 ghante mein add kar denge!</p>
        
        <form onSubmit={handleRequest} className="relative group">
          <input 
            type="text" 
            placeholder="Movie ka naam likho..." 
            className="w-full bg-black border border-white/10 p-5 rounded-2xl outline-none focus:border-indigo-500 transition-all text-sm pr-32"
            value={movieName}
            onChange={(e) => setMovieName(e.target.value)}
            required
          />
          <button 
            type="submit"
            disabled={loading}
            className="absolute right-2 top-2 bottom-2 px-6 bg-white text-black font-black rounded-xl hover:bg-indigo-600 hover:text-white transition-all text-xs flex items-center gap-2"
          >
            {loading ? "..." : status === 'SUCCESS' ? "SENT!" : <><Send size={14}/> SEND</>}
          </button>
        </form>

        {status === 'ERROR' && <p className="text-red-500 text-[10px] mt-4 font-bold uppercase">Kuch gadbad ho gayi, firse try karo!</p>}
      </div>
    </div>
  );
}
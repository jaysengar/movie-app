"use client";
import Navbar from './components/Navbar';
import ThreeScene from './components/ThreeScene';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <main className="relative min-h-screen w-full bg-black overflow-hidden flex flex-col items-center justify-center">
      <Navbar />
      <ThreeScene />

      {/* Decorative Scanning Line Effect */}
      <div className="absolute inset-0 z-10 pointer-events-none bg-[linear-gradient(to_bottom,transparent_50%,rgba(99,102,241,0.05)_50%)] bg-[length:100%_4px]" />

      <div className="relative z-20 text-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          {/* Subheading with glow */}
          <p className="text-indigo-500 font-bold tracking-[0.8em] text-[10px] md:text-xs mb-4 uppercase drop-shadow-[0_0_10px_rgba(99,102,241,1)]">
            Now Streaming the Future
          </p>

          {/* Main Massive Title */}
          <h1 className="text-[12vw] md:text-[8vw] font-black leading-none tracking-tighter text-white uppercase italic">
            CLIPIT <br />
            <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-2xl">
              BOLLYWOOD
            </span>
          </h1>

          <div className="mt-12 space-y-8 flex flex-col items-center">
            {/* Minimalist Description */}
            <p className="max-w-md text-gray-500 text-sm md:text-base font-light tracking-wide leading-relaxed">
              Experience ultra-fast movie indexing and high-performance streaming with our real-time portal.
            </p>
            
            {/* Neon Portal Button */}
            <Link href="/explore" className="group relative inline-flex items-center justify-center px-16 py-6 overflow-hidden bg-white/5 border border-indigo-500/30 rounded-full transition-all duration-500 hover:border-indigo-500 hover:shadow-[0_0_40px_rgba(99,102,241,0.4)]">
              <span className="relative z-10 text-white font-black tracking-widest text-lg group-hover:scale-110 transition-transform">
                ENTER PORTAL
              </span>
              <div className="absolute inset-0 bg-indigo-600 opacity-0 group-hover:opacity-10 blur-xl transition-opacity" />
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Deep Vignette */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,black_100%)] opacity-90" />
    </main>
  );
}
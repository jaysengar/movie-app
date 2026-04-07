"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Save, Trash2, Database, ExternalLink, 
  Film, Youtube, MessageSquare, CheckCircle, Lock, LogOut,
  ChevronLeft, ChevronRight 
} from 'lucide-react';
import Navbar from '../components/Navbar';

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [query, setQuery] = useState('');
  const [movieData, setMovieData] = useState(null);
  const [downloadLink, setDownloadLink] = useState('');
  const [trailerLink, setTrailerLink] = useState('');
  const [loading, setLoading] = useState(false);

  const [allMovies, setAllMovies] = useState([]);
  const [requests, setRequests] = useState([]);
  const [manageSearch, setManageSearch] = useState('');

  // --- NEW PAGINATION STATES ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  useEffect(() => {
    const savedAuth = localStorage.getItem('isAdmin');
    if (savedAuth === 'true') {
      setIsLoggedIn(true);
      refreshDashboard();
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/movies/login`, { username, password });
      if (res.data.success) {
        localStorage.setItem('isAdmin', 'true');
        setIsLoggedIn(true);
        refreshDashboard();
      }
    } catch (err) { alert("Bhai, credentials check kar!"); }
  };

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    setIsLoggedIn(false);
  };

  const refreshDashboard = () => {
    fetchAllMovies();
    fetchRequests();
  };

  const fetchAllMovies = async (search = '') => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/movies/all?q=${search}`);
      setAllMovies(res.data);
      setCurrentPage(1); // Search par hamesha page 1 par reset karega
    } catch (err) { console.error("Inventory error"); }
  };

  const fetchRequests = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/movies/requests`);
      setRequests(res.data);
    } catch (err) { console.error("Requests error"); }
  };

  const fetchTMDB = async () => {
    if (!query) return;
    setLoading(true);
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/movies/fetch-tmdb?movieName=${query}`);
      setMovieData(res.data);
    } catch (err) { alert("Movie not found!"); }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!downloadLink) return alert("Download link missing!");
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/movies/add`, { ...movieData, downloadLink, trailerLink });
      setMovieData(null); setQuery(''); setDownloadLink(''); setTrailerLink('');
      fetchAllMovies();
      alert("Movie Uploaded!");
    } catch (err) { alert("Save failed"); }
  };

  const handleDeleteMovie = async (id) => {
    if (window.confirm("Movie uda dein?")) {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/movies/delete/${id}`);
      setAllMovies(allMovies.filter(m => m._id !== id));
    }
  };

  const handleDeleteRequest = async (id) => {
    await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/movies/requests/${id}`);
    setRequests(requests.filter(r => r._id !== id));
  };

  // --- PAGINATION LOGIC ---
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMovies = allMovies.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(allMovies.length / itemsPerPage);

  if (!isLoggedIn) {
    return (
      <main className="min-h-screen bg-[#050505] flex items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md bg-[#0a0a0a] border border-white/10 p-10 rounded-[2.5rem] shadow-2xl text-center">
          <div className="w-16 h-16 bg-indigo-600/20 text-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-6"><Lock size={32} /></div>
          <h2 className="text-3xl font-black italic uppercase mb-8 tracking-tighter text-white">Admin <span className="text-indigo-500">Secure</span></h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="text" placeholder="Username" className="w-full bg-black border border-white/10 p-4 rounded-xl outline-none focus:border-indigo-500 transition-all text-white" value={username} onChange={(e)=>setUsername(e.target.value)} />
            <input type="password" placeholder="Password" className="w-full bg-black border border-white/10 p-4 rounded-xl outline-none focus:border-indigo-500 transition-all text-white" value={password} onChange={(e)=>setPassword(e.target.value)} />
            <button className="w-full py-4 bg-white text-black font-black rounded-xl hover:bg-indigo-600 hover:text-white transition-all">ENTER SYSTEM</button>
          </form>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white pt-28 pb-20 px-4 md:px-6 font-sans">
      <Navbar />
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-end mb-16">
          <div>
            <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase">Command <span className="text-indigo-500">Center</span></h1>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.4em] mt-2">Manage your cinematic empire</p>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 bg-red-600/10 text-red-500 rounded-full border border-red-500/20 text-[10px] font-black uppercase hover:bg-red-600 hover:text-white transition-all"><LogOut size={14} /> Logout</button>
        </div>

        {/* --- SECTION 1: REQUESTS --- */}
        <section className="mb-20">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-amber-500 rounded-2xl text-black"><MessageSquare size={24}/></div>
            <h2 className="text-2xl font-black italic uppercase tracking-tighter">User <span className="text-amber-500">Requests</span></h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {requests.map((req) => (
                <motion.div key={req._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-[#0a0a0a] border border-white/5 p-5 rounded-2xl flex justify-between items-center group">
                  <div className="truncate pr-4"><h4 className="font-bold text-white uppercase text-sm truncate">{req.movieName}</h4><p className="text-[9px] text-gray-600 font-bold uppercase mt-1">Pending</p></div>
                  <button onClick={() => handleDeleteRequest(req._id)} className="p-2.5 bg-white/5 hover:bg-green-600 text-gray-500 hover:text-white rounded-xl transition-all"><CheckCircle size={18}/></button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </section>

        {/* --- SECTION 2: ADD MOVIE --- */}
        <section className="mb-20 pt-16 border-t border-white/5">
          {/* ... Add Movie UI Remains Same ... */}
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-indigo-600 rounded-2xl"><Save size={24}/></div>
            <h2 className="text-2xl font-black italic uppercase tracking-tighter">New <span className="text-indigo-500">Upload</span></h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8 bg-[#0a0a0a] border border-white/5 p-6 md:p-10 rounded-[2.5rem]">
            <div className="space-y-6">
              <div className="relative">
                <input className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-indigo-500 pr-24" placeholder="Fetch movie..." value={query} onChange={(e)=>setQuery(e.target.value)} />
                <button onClick={fetchTMDB} className="absolute right-2 top-2 bottom-2 px-4 bg-indigo-600 font-bold rounded-lg text-[10px]">{loading ? "..." : "FETCH"}</button>
              </div>
              {movieData && (
                <div className="space-y-4 pt-4 border-t border-white/5">
                  <input className="w-full bg-black border border-indigo-500/30 p-4 rounded-xl outline-none text-xs" placeholder="Download Link" value={downloadLink} onChange={(e)=>setDownloadLink(e.target.value)} />
                  <input className="w-full bg-black border border-red-500/30 p-4 rounded-xl outline-none text-xs" placeholder="Trailer Link" value={trailerLink} onChange={(e)=>setTrailerLink(e.target.value)} />
                  <button onClick={handleSave} className="w-full py-5 bg-white text-black font-black rounded-2xl hover:bg-indigo-600 hover:text-white transition-all">SAVE</button>
                </div>
              )}
            </div>
            <div className="flex items-center justify-center border-l border-white/5">
              {movieData ? <div className="flex gap-4 p-4"><img src={movieData.poster} className="w-24 rounded-xl shadow-2xl" /><div><h3 className="font-black text-xl italic uppercase leading-none">{movieData.title}</h3><p className="text-gray-500 text-xs mt-2">{movieData.year} • ⭐ {movieData.rating}</p></div></div> : <p className="text-gray-800 uppercase text-[10px] font-black tracking-widest italic">Live Preview Area</p>}
            </div>
          </div>
        </section>

        {/* --- SECTION 3: INVENTORY WITH PAGINATION --- */}
        <section className="pt-16 border-t border-white/5">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-pink-600 rounded-2xl"><Database size={24}/></div>
              <h2 className="text-2xl font-black italic uppercase tracking-tighter">Live <span className="text-pink-500">Inventory</span></h2>
            </div>
            <div className="relative w-full md:w-80">
              <input className="w-full bg-[#0a0a0a] border border-white/10 p-3 pl-10 rounded-full text-xs outline-none focus:border-pink-500" placeholder="Search database..." value={manageSearch} onChange={(e)=>{setManageSearch(e.target.value); fetchAllMovies(e.target.value);}} />
              <Search className="absolute left-4 top-3.5 text-gray-700" size={14} />
            </div>
          </div>

          <div className="bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] overflow-hidden">
            <table className="hidden md:table w-full text-left">
              <thead>
                <tr className="bg-white/5 text-gray-500 text-[10px] uppercase tracking-widest font-black">
                  <th className="p-6">Movie</th>
                  <th className="p-6">Info</th>
                  <th className="p-6">Links</th>
                  <th className="p-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence mode='wait'>
                  {currentMovies.map((m) => (
                    <motion.tr key={m._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="border-b border-white/5 hover:bg-white/[0.01] transition-colors group">
                      <td className="p-6 flex items-center gap-4"><img src={m.poster} className="w-10 h-14 object-cover rounded-lg" /><span className="font-bold text-sm">{m.title}</span></td>
                      <td className="p-6 text-[10px] font-bold text-gray-500 uppercase">{m.year} • ⭐ {m.rating}</td>
                      <td className="p-6"><div className="flex gap-3">{m.trailerLink && <Youtube size={16} className="text-red-500" />}<ExternalLink size={16} className="text-indigo-500" /></div></td>
                      <td className="p-6 text-right"><button onClick={()=>handleDeleteMovie(m._id)} className="p-2 text-red-500 group-hover:opacity-100 transition-opacity"><Trash2 size={18}/></button></td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-white/5">
              {currentMovies.map((m) => (
                <div key={m._id} className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3"><img src={m.poster} className="w-12 h-16 rounded-lg object-cover" /><div><h4 className="font-bold text-sm text-white truncate w-32">{m.title}</h4><p className="text-[10px] text-gray-500 uppercase">{m.year} • ⭐ {m.rating}</p></div></div>
                  <button onClick={()=>handleDeleteMovie(m._id)} className="p-3 text-red-500"><Trash2 size={18}/></button>
                </div>
              ))}
            </div>

            {/* --- ADMIN PAGINATION BAR --- */}
            {totalPages > 1 && (
              <div className="p-6 bg-white/[0.02] flex justify-between items-center border-t border-white/5">
                <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">
                  Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, allMovies.length)} of {allMovies.length}
                </p>
                <div className="flex gap-2">
                  <button 
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => prev - 1)}
                    className="p-2 bg-white/5 rounded-lg disabled:opacity-20 hover:bg-white/10 transition-all"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <div className="flex gap-1">
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`w-8 h-8 rounded-lg text-[10px] font-black transition-all ${currentPage === i + 1 ? "bg-indigo-600 text-white" : "bg-white/5 text-gray-500 hover:bg-white/10"}`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                  <button 
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    className="p-2 bg-white/5 rounded-lg disabled:opacity-20 hover:bg-white/10 transition-all"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
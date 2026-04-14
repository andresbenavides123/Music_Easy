import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { 
  Play, Pause, SkipForward, SkipBack, Plus, Music, 
  Search, ListMusic, Volume2, LayoutGrid, ChevronLeft, Disc
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Track {
  id: string;
  title: string;
  artist: string;
  albumCover: string;
  previewUrl: string;
}

const API = 'https://tu-backend.up.railway.app/api/playlist';

export default function App() {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState<Track[]>([]);
  const [playlistNames, setPlaylistNames] = useState<string[]>(['Favoritos']);
  const [activePlaylist, setActivePlaylist] = useState('Favoritos');
  const [currentSongs, setCurrentSongs] = useState<Track[]>([]);
  const [view, setView] = useState<'search' | 'playlist'>('search'); // <-- Control de navegación
  
  const [playing, setPlaying] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => { loadData(); }, [activePlaylist]);

  const loadData = async () => {
    try {
      const names = await axios.get(`${API}/names`);
      const songs = await axios.get(`${API}/songs/${activePlaylist}`);
      setPlaylistNames(names.data);
      setCurrentSongs(songs.data);
    } catch (e) { console.error("Error en conexión"); }
  };

  const handleSearch = async () => {
    if (!search) return;
    const res = await axios.get(`${API}/search?q=${search}`);
    setResults(res.data);
    setView('search'); // Cambia a vista de búsqueda al buscar
  };

  const addTo = async (track: Track) => {
    await axios.post(`${API}/add/${activePlaylist}`, track);
    loadData();
  };

  const createNew = async () => {
    const name = prompt("Nombre de la nueva playlist:");
    if (name) {
      await axios.post(`${API}/create`, { name });
      loadData();
    }
  };

  const playSong = (track: Track) => {
    setPlaying(track);
    setIsPlaying(true);
  };

  const togglePlay = () => {
    if (!playing) return;
    if (isPlaying) audioRef.current?.pause();
    else audioRef.current?.play();
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="flex h-screen bg-[#050505] text-zinc-100 font-sans overflow-hidden">
      <audio ref={audioRef} src={playing?.previewUrl} onEnded={() => {}} autoPlay={isPlaying} />

      {/* --- SIDEBAR IZQUIERDO --- */}
      <aside className="w-72 bg-black flex flex-col border-r border-white/5">
        <div className="p-8 pb-4">
          <div className="flex items-center gap-3 text-emerald-400 font-black text-2xl tracking-tighter mb-10">
            <div className="bg-emerald-500/20 p-2 rounded-xl border border-emerald-500/30">
              <Disc size={28} className="animate-spin-slow" />
            </div>
            <span>MusicEasy</span>
          </div>
          
          <nav className="space-y-2">
            <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-[2px] mb-4">Menú</p>
            <button 
              onClick={() => setView('search')}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all ${view === 'search' ? 'bg-zinc-800 text-white shadow-xl' : 'text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900/50'}`}
            >
              <LayoutGrid size={20} /> <span className="text-sm font-bold">Discovery</span>
            </button>
          </nav>
        </div>

        <div className="p-8 pt-4 flex-1 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-[2px]">Tus Playlists</p>
            <button onClick={createNew} className="text-emerald-500 hover:scale-110 transition"><Plus size={18}/></button>
          </div>
          <div className="space-y-1">
            {playlistNames.map(name => (
              <button 
                key={name}
                onClick={() => { setActivePlaylist(name); setView('playlist'); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${activePlaylist === name && view === 'playlist' ? 'bg-emerald-600/10 text-emerald-400 border border-emerald-500/20' : 'text-zinc-500 hover:text-white hover:bg-zinc-900'}`}
              >
                <ListMusic size={18} /> <span className="text-sm font-semibold truncate">{name}</span>
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* --- CONTENIDO PRINCIPAL --- */}
      <main className="flex-1 overflow-y-auto relative bg-gradient-to-b from-emerald-950/20 via-[#050505] to-[#050505]">
        
        {/* Header con Buscador */}
        <header className="sticky top-0 z-10 p-8 flex justify-between items-center bg-[#050505]/80 backdrop-blur-md">
          <div className="relative w-full max-w-xl">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-600" size={20} />
            <input 
              className="w-full bg-zinc-900/80 border border-white/5 py-4 pl-14 pr-6 rounded-3xl focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all placeholder:text-zinc-700 font-medium"
              placeholder="Busca artistas, álbumes o canciones..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <div className="flex items-center gap-4 pl-8">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold">Andres UCC</p>
              <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider">Ingeniería</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-700 rounded-2xl rotate-3 shadow-lg shadow-emerald-900/20" />
          </div>
        </header>

        <div className="p-8 pt-0">
          <AnimatePresence mode="wait">
            {view === 'search' ? (
              /* VISTA DE BÚSQUEDA */
              <motion.div 
                key="search"
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -20 }}
              >
                <h2 className="text-4xl font-black mb-10 tracking-tighter">Explorar música</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                  {results.map((t) => (
                    <motion.div 
                      key={t.id} 
                      whileHover={{ y: -8 }}
                      className="bg-zinc-900/40 p-5 rounded-[2.5rem] border border-white/5 hover:bg-zinc-800/60 transition-all group relative"
                    >
                      <img src={t.albumCover} className="w-full aspect-square rounded-[2rem] object-cover mb-4 shadow-2xl" alt="" />
                      <button 
                        onClick={() => addTo(t)}
                        className="absolute right-8 top-8 p-3 bg-emerald-500 rounded-full text-black shadow-xl scale-0 group-hover:scale-100 transition-transform duration-300 hover:bg-white"
                      >
                        <Plus size={20} />
                      </button>
                      <h3 className="font-bold truncate px-1">{t.title}</h3>
                      <p className="text-xs text-zinc-500 font-bold uppercase tracking-wide mt-1 px-1">{t.artist}</p>
                      <button 
                        onClick={() => playSong(t)}
                        className="mt-4 w-full py-3 bg-white/5 hover:bg-emerald-500 hover:text-black rounded-2xl text-xs font-black transition-colors"
                      >
                        REPRODUCIR
                      </button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ) : (
              /* VISTA DE PLAYLIST (Con el botón Volver) */
              <motion.div 
                key="playlist"
                initial={{ opacity: 0, x: 20 }} 
                animate={{ opacity: 1, x: 0 }}
              >
                <button 
                  onClick={() => setView('search')}
                  className="flex items-center gap-2 text-zinc-500 hover:text-emerald-400 font-bold text-xs uppercase tracking-widest mb-6 transition-colors"
                >
                  <ChevronLeft size={16} /> Volver a Discovery
                </button>

                <div className="flex items-end gap-8 mb-12">
                  <div className="w-64 h-64 bg-emerald-600 rounded-[3rem] shadow-3xl flex items-center justify-center relative overflow-hidden group">
                     <ListMusic size={80} className="text-white/20" />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-emerald-500 uppercase tracking-[4px] mb-2">Playlist Pública</p>
                    <h1 className="text-7xl font-black tracking-tighter mb-4">{activePlaylist}</h1>
                    <p className="text-zinc-400 font-medium">Personalizada para <span className="text-white">Andres UCC</span> • {currentSongs.length} canciones</p>
                  </div>
                </div>

                <div className="bg-zinc-900/30 rounded-[3rem] p-4 border border-white/5">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-[10px] text-zinc-600 uppercase tracking-widest border-b border-white/5">
                        <th className="p-4 font-bold">#</th>
                        <th className="p-4 font-bold">Título</th>
                        <th className="p-4 font-bold">Artista</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentSongs.map((s, idx) => (
                        <tr 
                          key={idx} 
                          onClick={() => playSong(s)}
                          className={`group cursor-pointer hover:bg-white/5 transition-all ${playing?.id === s.id ? 'text-emerald-400' : ''}`}
                        >
                          <td className="p-4 text-xs font-bold text-zinc-600">{idx + 1}</td>
                          <td className="p-4 font-bold text-sm">{s.title}</td>
                          <td className="p-4 text-xs text-zinc-500 group-hover:text-zinc-300 font-bold uppercase">{s.artist}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* --- REPRODUCTOR (Fijo abajo) --- */}
      <footer className="fixed bottom-0 w-full bg-black/60 backdrop-blur-3xl border-t border-white/5 p-5 px-10 flex items-center justify-between z-20">
        <div className="w-1/3 flex items-center gap-5">
          {playing ? (
            <motion.div initial={{ x: -20 }} animate={{ x: 0 }} className="flex items-center gap-4">
              <img src={playing.albumCover} className="w-16 h-16 rounded-2xl shadow-2xl border border-white/10" alt="" />
              <div className="min-w-0">
                <p className="font-black text-sm truncate">{playing.title}</p>
                <p className="text-[10px] text-emerald-500 font-black uppercase tracking-widest mt-1 truncate">{playing.artist}</p>
              </div>
            </motion.div>
          ) : (
            <div className="flex items-center gap-4 text-zinc-800">
               <div className="w-16 h-16 bg-zinc-900/50 rounded-2xl flex items-center justify-center border border-dashed border-zinc-800"><Music size={24} /></div>
               <p className="text-xs font-bold uppercase tracking-[2px]">Elige una joya</p>
            </div>
          )}
        </div>

        <div className="flex flex-col items-center gap-4 w-1/3">
          <div className="flex items-center gap-10">
            <button className="text-zinc-600 hover:text-white transition-colors"><SkipBack size={24} /></button>
            <button 
              onClick={togglePlay} 
              className="bg-white text-black p-4 rounded-[1.5rem] hover:scale-110 active:scale-95 transition-all shadow-2xl shadow-white/10"
            >
              {isPlaying ? <Pause fill="black" size={24} /> : <Play fill="black" size={24} />}
            </button>
            <button className="text-zinc-600 hover:text-white transition-colors"><SkipForward size={24} /></button>
          </div>
          <div className="w-full max-w-lg flex items-center gap-3">
             <span className="text-[10px] font-bold text-zinc-600">0:00</span>
             <div className="flex-1 h-1 bg-zinc-800 rounded-full overflow-hidden">
                <motion.div animate={{ width: isPlaying ? '100%' : '10%' }} transition={{ duration: 30 }} className="h-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
             </div>
             <span className="text-[10px] font-bold text-zinc-600">0:30</span>
          </div>
        </div>

        <div className="w-1/3 flex justify-end items-center gap-4 text-zinc-600">
          <Volume2 size={20} />
          <div className="w-24 h-1.5 bg-zinc-800 rounded-full relative overflow-hidden">
             <div className="absolute inset-0 bg-emerald-500 w-2/3 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
          </div>
        </div>
      </footer>
    </div>
  );
}
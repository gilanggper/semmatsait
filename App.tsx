import React, { useState, useEffect } from 'react';
import { getTickets, saveTicket, deleteTicket } from './services/storageService';
import { generateExecutiveSummary } from './services/geminiService';
import { Ticket, Status, Priority } from './types';
import TicketCard from './components/TicketCard';
import TicketForm from './components/TicketForm';
import { 
  LayoutDashboard, 
  Lock, 
  Plus, 
  Search, 
  LogOut, 
  Sparkles, 
  Filter,
  Moon,
  Sun,
  Code2,
  Building2,
  AlertCircle,
  Menu,
  Activity
} from 'lucide-react';

const COMPANY_CONFIG = {
  logoLeft: "https://i.postimg.cc/DyTXq0CB/Logo-Bulat-9.png",
  logoRight: "https://i.postimg.cc/mkRgFzbw/pin-45.jpg", 
  appName: "IT Operations Dashboard",
  companyName: "SEMBILAN GRUOP"
};

const App: React.FC = () => {
  const [view, setView] = useState<'public' | 'login' | 'admin'>('public');
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Theme State
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark';
  });
  
  // Admin logic
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  // AI Summary
  const [aiSummary, setAiSummary] = useState<string>('');
  const [generatingSummary, setGeneratingSummary] = useState(false);

  useEffect(() => {
    // Simulate fetching data
    const data = getTickets();
    setTickets(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple password for demo
    if (password === 'itadmin' || password === 'admin') {
      setView('admin');
      setPassword('');
      setLoginError('');
    } else {
      setLoginError('Password salah. Coba hubungi Supervisor.');
    }
  };

  const handleSaveTicket = (ticket: Ticket) => {
    saveTicket(ticket);
    setTickets(getTickets()); // Refresh
    setShowForm(false);
    setEditingTicket(null);
  };

  const handleDeleteTicket = (id: string) => {
    if (window.confirm('Yakin ingin menghapus laporan ini?')) {
      deleteTicket(id);
      setTickets(getTickets());
    }
  };

  const handleGenerateSummary = async () => {
    setGeneratingSummary(true);
    const summary = await generateExecutiveSummary(tickets);
    setAiSummary(summary);
    setGeneratingSummary(false);
  };

  const filteredTickets = tickets.filter(t => {
    const matchesSearch = t.issue.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          t.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          t.pic.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'ALL' || t.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Sort: High Priority Pending first, then date
  filteredTickets.sort((a, b) => {
    if (a.priority === Priority.HIGH && a.status !== Status.DONE && b.priority !== Priority.HIGH) return -1;
    if (b.priority === Priority.HIGH && b.status !== Status.DONE && a.priority !== Priority.HIGH) return 1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const stats = {
    total: tickets.length,
    pending: tickets.filter(t => t.status === Status.PENDING).length,
    process: tickets.filter(t => t.status === Status.PROCESS).length,
    done: tickets.filter(t => t.status === Status.DONE).length,
  };

  if (loading) return <div className="flex h-screen items-center justify-center text-gray-500">Memuat Laporan...</div>;

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen pb-16 bg-gray-50 text-gray-900 dark:bg-[#0f172a] dark:text-gray-100 transition-colors duration-200">
        
        {/* Modern Glassmorphism Header */}
        <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-md shadow-sm transition-all duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              
              {/* Left Side: Brand Identity */}
              <div className="flex items-center gap-4">
                 {/* Logo Pill */}
                 <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-full px-1 py-1 border border-gray-200 dark:border-gray-700 shadow-inner">
                    <div className="bg-white rounded-full p-0.5 overflow-hidden w-8 h-8 flex items-center justify-center">
                        <img 
                          src={COMPANY_CONFIG.logoLeft} 
                          alt="Sembilan" 
                          className="w-full h-full object-cover"
                          onError={(e) => (e.target as HTMLImageElement).src = "https://placehold.co/100x100?text=S"}
                        />
                    </div>
                    <div className="bg-white rounded-full p-0.5 overflow-hidden w-8 h-8 flex items-center justify-center -ml-2 border-2 border-gray-100 dark:border-gray-800">
                        <img 
                          src={COMPANY_CONFIG.logoRight} 
                          alt="PJA" 
                          className="w-full h-full object-cover"
                          onError={(e) => (e.target as HTMLImageElement).style.display = 'none'}
                        />
                    </div>
                 </div>

                 <div className="hidden md:flex flex-col">
                    <h1 className="text-sm font-bold text-gray-900 dark:text-white leading-none tracking-tight">
                      {COMPANY_CONFIG.companyName}
                    </h1>
                    <div className="flex items-center mt-1 space-x-2">
                        <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-1.5 py-0.5 rounded border border-blue-100 dark:border-blue-800 flex items-center">
                           <LayoutDashboard className="w-2.5 h-2.5 mr-1" />
                           {COMPANY_CONFIG.appName}
                        </span>
                        <span className="flex h-2 w-2 relative">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                    </div>
                 </div>
              </div>

              {/* Right Side: Actions */}
              <div className="flex items-center space-x-2 md:space-x-4">
                
                {/* Theme Toggle */}
                <button 
                  onClick={toggleTheme} 
                  className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Toggle Theme"
                >
                  {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                </button>

                <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-2"></div>

                {view === 'admin' ? (
                  <button 
                    onClick={() => setView('public')} 
                    className="group flex items-center space-x-2 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 border border-red-200 dark:border-red-800"
                  >
                    <span>KELUAR</span>
                    <LogOut className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" /> 
                  </button>
                ) : view === 'public' ? (
                  <button 
                    onClick={() => setView('login')} 
                    className="group flex items-center space-x-2 bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 shadow-md hover:shadow-lg transform active:scale-95"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>IT STAFF LOGIN</span>
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          {/* LOGIN VIEW */}
          {view === 'login' && (
            <div className="flex justify-center items-center h-[60vh] animate-in fade-in zoom-in duration-300">
              <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
                
                <div className="flex justify-center mb-6">
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-full">
                        <Lock className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-center mb-2 text-gray-900 dark:text-white">
                    Akses Teknisi
                </h2>
                <p className="text-center text-gray-500 dark:text-gray-400 text-sm mb-6">
                    Masukkan kode otorisasi untuk mengelola tiket.
                </p>

                <form onSubmit={handleLogin}>
                  <div className="mb-5">
                    <label className="block text-gray-700 dark:text-gray-300 text-xs font-bold mb-2 uppercase tracking-wide">Password</label>
                    <input 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all text-sm"
                      placeholder="••••••••"
                      autoFocus
                    />
                  </div>
                  {loginError && <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg text-xs font-medium mb-4 border border-red-100 dark:border-red-900/30 flex items-center"><AlertCircle className="w-3.5 h-3.5 mr-2"/>{loginError}</div>}
                  <div className="flex flex-col space-y-3">
                      <button type="submit" className="w-full bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition shadow-lg transform active:scale-[0.98]">
                      MASUK DASHBOARD
                      </button>
                      <button type="button" onClick={() => setView('public')} className="w-full text-gray-500 dark:text-gray-400 text-xs hover:text-gray-800 dark:hover:text-gray-200 font-medium py-2">
                      Kembali ke Monitor
                      </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* DASHBOARD (PUBLIC & ADMIN) */}
          {view !== 'login' && (
            <>
              {/* Stats Summary - Updated Visuals */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 relative overflow-hidden group hover:shadow-md transition-all">
                      <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                          <Activity size={40} className="text-gray-500 dark:text-white" />
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider">Total Tiket</p>
                      <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{stats.total}</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border-l-4 border-red-500 dark:border-red-500 relative overflow-hidden hover:shadow-md transition-all">
                      <p className="text-xs text-red-500 dark:text-red-400 uppercase font-bold tracking-wider">Pending</p>
                      <p className="text-3xl font-bold text-red-600 dark:text-red-400 mt-1">{stats.pending}</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border-l-4 border-yellow-500 dark:border-yellow-500 relative overflow-hidden hover:shadow-md transition-all">
                      <p className="text-xs text-yellow-600 dark:text-yellow-400 uppercase font-bold tracking-wider">Sedang Proses</p>
                      <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mt-1">{stats.process}</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border-l-4 border-green-500 dark:border-green-500 relative overflow-hidden hover:shadow-md transition-all">
                      <p className="text-xs text-green-600 dark:text-green-400 uppercase font-bold tracking-wider">Selesai</p>
                      <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-1">{stats.done}</p>
                  </div>
              </div>

              {/* AI Summary Section */}
              <div className="bg-gradient-to-br from-indigo-50 to-white dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl border border-indigo-100 dark:border-gray-700 shadow-sm mb-8 relative">
                  <div className="absolute top-0 right-0 p-4 opacity-5">
                      <Sparkles size={80} />
                  </div>
                  <div className="flex justify-between items-start mb-4 relative z-10">
                      <div>
                          <h3 className="text-lg font-bold text-indigo-900 dark:text-indigo-200 flex items-center">
                              <Sparkles className="w-5 h-5 mr-2 text-indigo-500 dark:text-indigo-400 animate-pulse" />
                              AI Supervisor Summary
                          </h3>
                          <p className="text-sm text-indigo-600 dark:text-indigo-300 mt-1">Analisis performa & prioritas otomatis.</p>
                      </div>
                      <button 
                          onClick={handleGenerateSummary} 
                          disabled={generatingSummary}
                          className="text-xs font-semibold bg-white dark:bg-gray-700 border border-indigo-200 dark:border-gray-600 text-indigo-700 dark:text-indigo-300 px-4 py-2 rounded-full hover:bg-indigo-50 dark:hover:bg-gray-600 disabled:opacity-50 transition-colors shadow-sm"
                      >
                          {generatingSummary ? 'Sedang Menulis Laporan...' : 'Update Ringkasan'}
                      </button>
                  </div>
                  
                  {aiSummary ? (
                      <div className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed bg-white/50 dark:bg-gray-800/50 p-4 rounded-lg border border-indigo-50 dark:border-gray-700 backdrop-blur-sm relative z-10">
                          {aiSummary.split('\n').map((line, i) => <p key={i} className="mb-2 last:mb-0">{line}</p>)}
                      </div>
                  ) : (
                      <div className="text-sm text-gray-400 italic bg-white/30 p-4 rounded border border-dashed border-indigo-100">
                          Tekan tombol update di atas untuk meminta AI membuat laporan ringkas hari ini.
                      </div>
                  )}
              </div>

              {/* Controls */}
              <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
                  <div className="flex space-x-2 w-full md:w-auto">
                      <div className="relative w-full md:w-72">
                          <Search className="absolute left-3 top-2.5 text-gray-400 dark:text-gray-500 w-4 h-4" />
                          <input 
                              type="text" 
                              placeholder="Cari kendala, nama, atau PT..." 
                              className="pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl w-full text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 shadow-sm transition-shadow focus:shadow-md"
                              value={searchTerm}
                              onChange={e => setSearchTerm(e.target.value)}
                          />
                      </div>
                      <div className="relative">
                           <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Filter className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                          </div>
                          <select 
                              className="pl-9 pr-8 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none font-medium bg-white dark:bg-gray-800 text-gray-900 dark:text-white cursor-pointer shadow-sm appearance-none transition-shadow focus:shadow-md"
                              value={filterStatus}
                              onChange={(e) => setFilterStatus(e.target.value)}
                          >
                              <option value="ALL">Semua Status</option>
                              <option value={Status.PENDING}>Pending</option>
                              <option value={Status.PROCESS}>Proses</option>
                              <option value={Status.DONE}>Selesai</option>
                          </select>
                      </div>
                  </div>

                  {view === 'admin' && (
                      <button 
                          onClick={() => { setEditingTicket(null); setShowForm(true); }}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center shadow-lg hover:shadow-blue-500/30 transition-all transform hover:-translate-y-0.5"
                      >
                          <Plus className="w-4 h-4 mr-2" /> Buat Laporan Baru
                      </button>
                  )}
              </div>

              {/* Ticket List */}
              <div className="space-y-4">
                  {filteredTickets.length > 0 ? (
                      filteredTickets.map(ticket => (
                          <TicketCard 
                              key={ticket.id} 
                              ticket={ticket} 
                              isAdmin={view === 'admin'}
                              onEdit={(t) => { setEditingTicket(t); setShowForm(true); }}
                              onDelete={handleDeleteTicket}
                          />
                      ))
                  ) : (
                      <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-700 text-center">
                          <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-full mb-4">
                            <Sparkles className="w-8 h-8 text-gray-400" />
                          </div>
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Tidak ada tiket ditemukan</h3>
                          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Coba ubah filter atau kata kunci pencarian Anda.</p>
                      </div>
                  )}
              </div>
            </>
          )}
        </main>

        {/* Modals */}
        {showForm && (
          <TicketForm 
              initialData={editingTicket}
              onClose={() => setShowForm(false)}
              onSave={handleSaveTicket}
          />
        )}
        
        {/* Modern Professional Footer */}
        <footer className="fixed bottom-0 w-full bg-white/90 dark:bg-[#0f172a]/90 backdrop-blur-md border-t border-gray-200 dark:border-gray-800 py-3 px-6 z-40 transition-colors duration-200">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2">
            <div className="text-xs text-gray-500 dark:text-gray-400 font-medium flex items-center">
               <span className="font-bold text-gray-700 dark:text-gray-200 mr-1">&copy; 2026 {COMPANY_CONFIG.companyName}.</span> 
               <span>Internal IT Operations System.</span>
            </div>
            
            <div className="flex items-center space-x-2">
                <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">System by</span>
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm flex items-center">
                    <Code2 className="w-3 h-3 mr-1.5" />
                    Gilang Permana
                </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default App;
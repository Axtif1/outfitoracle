import { useState, useEffect } from 'react';
import { Upload, Trash2, Plus, Users, Tag, History, Check, BarChart3, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import api from '../api/axios';

const AdminPage = () => {
  const { user: currentUser } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const [stats, setStats] = useState({ totalUsers: 0, totalClothes: 0, totalTryOns: 0, totalCreditsGiven: 0 });
  const [clothes, setClothes] = useState([]);
  const [users, setUsers] = useState([]);
  const [tryons, setTryons] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({ name: '', category: 'tshirt', image: null });
  
  const [creditModalOpen, setCreditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [creditsToAdd, setCreditsToAdd] = useState('');
  const [givingCredit, setGivingCredit] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [clothesRes, usersRes, tryonsRes, statsRes] = await Promise.all([
        api.get('/api/clothes'),
        api.get('/api/admin/users'),
        api.get('/api/admin/tryons'),
        api.get('/api/admin/stats')
      ]);
      setClothes(clothesRes.data);
      setUsers(usersRes.data);
      setTryons(tryonsRes.data);
      setStats(statsRes.data);
    } catch (error) {
      toast.error('Failed to fetch admin data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, image: e.target.files[0] });
    }
  };

  const handleClothingSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.image) return toast.error('Please fill all fields');
    const data = new FormData();
    data.append('name', formData.name);
    data.append('category', formData.category);
    data.append('image', formData.image);

    try {
      setUploading(true);
      await api.post('/api/clothes', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Clothing item added successfully');
      setFormData({ name: '', category: 'tshirt', image: null });
      setUploadModalOpen(false);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add item');
    } finally {
      setUploading(false);
    }
  };

  const handleClothingDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      await api.delete(`/api/clothes/${id}`);
      toast.success('Clothing item deleted');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete item');
    }
  };

  const handleOpenCreditModal = (user) => {
    setSelectedUser(user);
    setCreditsToAdd('');
    setCreditModalOpen(true);
  };

  const handleAddCredits = async () => {
    const amount = parseInt(creditsToAdd);
    if (!selectedUser || !amount || amount <= 0) return toast.error('Please enter a valid amount');
    try {
      setGivingCredit(true);
      await api.post('/api/admin/credits', {
        userId: selectedUser._id,
        credits: amount
      });
      toast.success('Credits added!');
      setCreditModalOpen(false);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add credits');
    } finally {
      setGivingCredit(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-80px)] border-t border-white/10">
      {/* LEFT SIDEBAR */}
      <div className="w-64 glass border-r border-white/10 hidden md:block flex-shrink-0">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-2 text-[var(--color-accent-violet)] text-xl font-display font-bold">
            <Sparkles size={20} />
            OutfitOracle Admin
          </div>
        </div>
        <div className="p-4 flex flex-col gap-2">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'dashboard' ? 'bg-[var(--color-accent-violet)] text-white shadow-lg shadow-[var(--color-accent-violet)]/20' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
          >
            <BarChart3 size={20} /> Dashboard
          </button>
          <button 
            onClick={() => setActiveTab('clothing')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'clothing' ? 'bg-[var(--color-accent-violet)] text-white shadow-lg shadow-[var(--color-accent-violet)]/20' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
          >
            <Tag size={20} /> Clothing Manager
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'users' ? 'bg-[var(--color-accent-violet)] text-white shadow-lg shadow-[var(--color-accent-violet)]/20' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
          >
            <Users size={20} /> User Manager
          </button>
          <button 
            onClick={() => setActiveTab('tryons')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'tryons' ? 'bg-[var(--color-accent-violet)] text-white shadow-lg shadow-[var(--color-accent-violet)]/20' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
          >
            <History size={20} /> Try-On History
          </button>
        </div>
      </div>

      {/* MOBILE TABS (visible only on small screens) */}
      <div className="md:hidden flex overflow-x-auto p-4 gap-2 border-b border-white/10 bg-[#0a0a0a]">
        <button onClick={() => setActiveTab('dashboard')} className={`px-4 py-2 rounded-lg whitespace-nowrap ${activeTab === 'dashboard' ? 'bg-[var(--color-accent-violet)]' : 'glass'}`}>Dashboard</button>
        <button onClick={() => setActiveTab('clothing')} className={`px-4 py-2 rounded-lg whitespace-nowrap ${activeTab === 'clothing' ? 'bg-[var(--color-accent-violet)]' : 'glass'}`}>Clothing</button>
        <button onClick={() => setActiveTab('users')} className={`px-4 py-2 rounded-lg whitespace-nowrap ${activeTab === 'users' ? 'bg-[var(--color-accent-violet)]' : 'glass'}`}>Users</button>
        <button onClick={() => setActiveTab('tryons')} className={`px-4 py-2 rounded-lg whitespace-nowrap ${activeTab === 'tryons' ? 'bg-[var(--color-accent-violet)]' : 'glass'}`}>History</button>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 p-6 md:p-10 overflow-y-auto">
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <div className="w-10 h-10 rounded-full border-4 border-[var(--color-accent-violet)] border-t-transparent animate-spin"/>
          </div>
        ) : (
          <>
            {/* TAB 1: Dashboard Stats */}
            {activeTab === 'dashboard' && (
              <div className="max-w-5xl">
                <h2 className="text-3xl font-display mb-8">Dashboard Overview</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="glass p-6 rounded-3xl border border-white/10 glow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="bg-[var(--color-accent-violet)]/20 p-3 rounded-xl text-[var(--color-accent-violet)]">
                        <Users size={24} />
                      </div>
                    </div>
                    <p className="text-4xl font-display font-bold text-white mb-1">{stats?.totalUsers || 0}</p>
                    <h3 className="text-white/60 text-sm font-medium">Total Users</h3>
                  </div>
                  
                  <div className="glass p-6 rounded-3xl border border-white/10 glow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="bg-[var(--color-accent-violet)]/20 p-3 rounded-xl text-[var(--color-accent-violet)]">
                        <Tag size={24} />
                      </div>
                    </div>
                    <p className="text-4xl font-display font-bold text-white mb-1">{stats?.totalClothes || 0}</p>
                    <h3 className="text-white/60 text-sm font-medium">Total Outfits</h3>
                  </div>
                  
                  <div className="glass p-6 rounded-3xl border border-white/10 glow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="bg-[var(--color-accent-violet)]/20 p-3 rounded-xl text-[var(--color-accent-violet)]">
                        <History size={24} />
                      </div>
                    </div>
                    <p className="text-4xl font-display font-bold text-white mb-1">{stats?.totalTryOns || 0}</p>
                    <h3 className="text-white/60 text-sm font-medium">Total Try-Ons</h3>
                  </div>
                  
                  <div className="glass p-6 rounded-3xl border border-[#F59E0B]/30 glow relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                      <Sparkles size={80} />
                    </div>
                    <div className="flex items-start justify-between mb-4 relative z-10">
                      <div className="bg-[#F59E0B]/20 p-3 rounded-xl text-[#F59E0B]">
                        <Sparkles size={24} />
                      </div>
                    </div>
                    <p className="text-4xl font-display font-bold text-[#F59E0B] mb-1 relative z-10">{stats?.totalCreditsGiven || 0}</p>
                    <h3 className="text-[#F59E0B]/80 text-sm font-medium relative z-10">Total Credits Given</h3>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: Clothing Manager */}
            {activeTab === 'clothing' && (
              <div className="max-w-6xl">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-3xl font-display">Clothing Manager</h2>
                  <button 
                    onClick={() => setUploadModalOpen(true)}
                    className="bg-[var(--color-accent-violet)] hover:bg-[#6D28D9] text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(124,58,237,0.3)]"
                  >
                    <Plus size={18} /> Add Clothing
                  </button>
                </div>
                
                <div className="glass rounded-3xl border border-white/10 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-white/5 border-b border-white/10">
                        <tr>
                          <th className="p-4 font-medium text-white/70">Thumbnail</th>
                          <th className="p-4 font-medium text-white/70">Name</th>
                          <th className="p-4 font-medium text-white/70">Category</th>
                          <th className="p-4 font-medium text-white/70">Date Added</th>
                          <th className="p-4 font-medium text-white/70 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {clothes.map((item) => (
                          <tr key={item._id} className="hover:bg-white/[0.02] transition-colors">
                            <td className="p-4"><img src={item.imageUrl} alt={item.name} className="w-12 h-16 object-cover rounded-lg border border-white/10" /></td>
                            <td className="p-4 font-medium">{item.name}</td>
                            <td className="p-4">
                              <span className="bg-white/10 text-white/80 px-3 py-1 rounded-full text-xs capitalize">{item.category}</span>
                            </td>
                            <td className="p-4 text-sm text-white/50">{new Date(item.createdAt).toLocaleDateString()}</td>
                            <td className="p-4 text-right">
                              <button onClick={() => handleClothingDelete(item._id)} className="text-red-400 hover:text-red-300 hover:bg-red-400/10 p-2 rounded-lg transition-colors">
                                <Trash2 size={18} />
                              </button>
                            </td>
                          </tr>
                        ))}
                        {clothes.length === 0 && <tr><td colSpan="5" className="text-center py-12 text-white/50">No clothing items found</td></tr>}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: User Manager */}
            {activeTab === 'users' && (
              <div className="max-w-6xl">
                <h2 className="text-3xl font-display mb-8">User Manager</h2>
                <div className="glass rounded-3xl border border-white/10 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-white/5 border-b border-white/10">
                        <tr>
                          <th className="p-4 font-medium text-white/70">Name</th>
                          <th className="p-4 font-medium text-white/70">Email</th>
                          <th className="p-4 font-medium text-white/70">Credits</th>
                          <th className="p-4 font-medium text-white/70">Joined Date</th>
                          <th className="p-4 font-medium text-white/70 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {users.map((u) => (
                          <tr key={u._id} className="hover:bg-white/[0.02] transition-colors">
                            <td className="p-4 font-medium flex items-center gap-2">
                              {u.name}
                              {u.isAdmin && <span className="bg-red-500/20 text-red-300 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">Admin</span>}
                            </td>
                            <td className="p-4 text-sm text-white/60">{u.email}</td>
                            <td className="p-4">
                              <span className="bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/30 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-max">
                                ✨ {u.credits}
                              </span>
                            </td>
                            <td className="p-4 text-sm text-white/50">{new Date(u.createdAt).toLocaleDateString()}</td>
                            <td className="p-4 text-right">
                              <button 
                                onClick={() => handleOpenCreditModal(u)} 
                                disabled={u._id === currentUser?._id && currentUser?.isAdmin}
                                className={`text-xs px-4 py-2 rounded-lg font-medium transition-colors ${
                                  u._id === currentUser?._id && currentUser?.isAdmin 
                                  ? 'bg-white/5 text-white/30 cursor-not-allowed' 
                                  : 'bg-white/10 hover:bg-white/20 text-white'
                                }`}
                              >
                                Add Credits
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: Try-On History */}
            {activeTab === 'tryons' && (
              <div className="max-w-6xl">
                <h2 className="text-3xl font-display mb-8">Try-On History</h2>
                <div className="glass rounded-3xl border border-white/10 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-white/5 border-b border-white/10">
                        <tr>
                          <th className="p-4 font-medium text-white/70">User</th>
                          <th className="p-4 font-medium text-white/70">Result Image</th>
                          <th className="p-4 font-medium text-white/70">Clothing Used</th>
                          <th className="p-4 font-medium text-white/70">Date Generated</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {tryons.map((tryon) => (
                          <tr key={tryon._id} className="hover:bg-white/[0.02] transition-colors">
                            <td className="p-4">
                              {tryon.userId ? (
                                <div>
                                  <div className="font-medium">{tryon.userId.name}</div>
                                  <div className="text-sm text-white/50">{tryon.userId.email}</div>
                                </div>
                              ) : <span className="text-white/40 italic">Account Deleted</span>}
                            </td>
                            <td className="p-4">
                               <a href={tryon.resultImage} target="_blank" rel="noreferrer">
                                 <img src={tryon.resultImage} alt="Result" className="w-16 h-20 object-cover rounded-lg border border-white/20 hover:border-[var(--color-accent-violet)] transition-colors cursor-pointer" />
                               </a>
                            </td>
                            <td className="p-4">
                              {tryon.clothingId ? (
                                 <div className="flex items-center gap-3">
                                   <div className="bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                                     <div className="text-sm font-medium">{tryon.clothingId.name}</div>
                                     <div className="text-[10px] text-white/50 uppercase tracking-widest">{tryon.clothingId.category}</div>
                                   </div>
                                 </div>
                              ) : <span className="text-red-400/80 text-sm bg-red-400/10 px-3 py-1 rounded-lg">Clothing Deleted</span>}
                            </td>
                            <td className="p-4 text-sm text-white/50">{new Date(tryon.createdAt).toLocaleString()}</td>
                          </tr>
                        ))}
                        {tryons.length === 0 && <tr><td colSpan="4" className="text-center py-12 text-white/50">No try-ons recorded yet</td></tr>}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* MODALS */}
      
      {/* Upload Clothing Modal */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="glass w-full max-w-md rounded-3xl p-8 border border-white/10 glow">
            <h3 className="font-display text-2xl mb-6">Add New Clothing</h3>
            <form onSubmit={handleClothingSubmit} className="flex flex-col gap-5">
              <div>
                <label className="block text-sm text-white/70 mb-2">Item Name</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[var(--color-accent-violet)] transition-colors" placeholder="e.g. Classic Denim Jacket" />
              </div>
              <div>
                <label className="block text-sm text-white/70 mb-2">Category</label>
                <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[var(--color-accent-violet)] transition-colors">
                  <option value="tshirt">T-Shirt</option>
                  <option value="shirt">Shirt</option>
                  <option value="kurta">Kurta</option>
                  <option value="jacket">Jacket</option>
                  <option value="hoodie">Hoodie</option>
                  <option value="dress">Dress</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-white/70 mb-2">Image Upload</label>
                <div className="border-2 border-dashed border-white/20 rounded-xl p-4 text-center hover:border-[var(--color-accent-violet)]/50 transition-colors bg-white/5">
                  <input type="file" accept="image/*" onChange={handleFileChange} className="w-full text-sm text-white/50 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-[var(--color-accent-violet)] file:text-white hover:file:bg-[#6D28D9] transition-colors cursor-pointer" />
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                <button type="button" onClick={() => setUploadModalOpen(false)} className="flex-1 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors font-medium">Cancel</button>
                <button type="submit" disabled={uploading} className="flex-1 py-3 rounded-xl bg-[var(--color-accent-violet)] hover:bg-[#6D28D9] text-white disabled:opacity-50 transition-colors font-medium flex items-center justify-center gap-2">
                  {uploading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"/> : <><Upload size={18} /> Upload</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Credits Modal */}
      {creditModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="glass w-full max-w-sm rounded-3xl p-8 border border-white/10 glow">
            <div className="w-16 h-16 bg-[#F59E0B]/20 rounded-full flex items-center justify-center text-[#F59E0B] mx-auto mb-4">
              <Sparkles size={32} />
            </div>
            <h3 className="font-display text-2xl mb-2 text-center">Add Credits</h3>
            <div className="text-white/60 text-center mb-6 text-sm">
              Current Balance: <span className="text-[#F59E0B] font-bold">{selectedUser?.credits}</span>
              <br/>
              Granting to <span className="text-white">{selectedUser?.name}</span>
            </div>
            <input 
               type="number" 
               min="1" 
               placeholder="Enter amount..."
               value={creditsToAdd} 
               onChange={(e) => setCreditsToAdd(e.target.value)} 
               className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 focus:outline-none focus:border-[#F59E0B] text-center text-xl font-medium mb-6 text-[#F59E0B] placeholder-white/20" 
            />
            <div className="flex gap-3">
              <button 
                onClick={() => setCreditModalOpen(false)} 
                className="flex-1 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 transition-colors font-medium"
              >
                Cancel
              </button>
              <button 
                onClick={handleAddCredits}
                disabled={givingCredit}
                className="flex-1 py-3.5 rounded-xl bg-[#F59E0B] hover:bg-[#D97706] text-white disabled:opacity-50 transition-colors font-medium flex justify-center items-center gap-2"
              >
                {givingCredit ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"/> : <><Plus size={18} /> Add</>}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminPage;

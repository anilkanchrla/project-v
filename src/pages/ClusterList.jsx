import React, { useState } from 'react';
import { Search, MapPin, MoreVertical, X, Building, Users, UserPlus, Edit3 } from 'lucide-react';

const ClusterList = () => {
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [openMenuId, setOpenMenuId] = useState(null);
    const [selectedCluster, setSelectedCluster] = useState(null);
    const [clusters, setClusters] = useState(() => {
        const saved = localStorage.getItem('digitalv_clusters');
        return saved ? JSON.parse(saved) : [
            { id: 'CL-001', name: 'North Cluster', incharge: 'Amit Shah', wards: 12, status: 'Active' },
            { id: 'CL-002', name: 'South Cluster', incharge: 'Rajesh G', wards: 8, status: 'Active' },
            { id: 'CL-003', name: 'East Cluster', incharge: 'Suresh K', wards: 15, status: 'Active' },
        ];
    });

    React.useEffect(() => {
        localStorage.setItem('digitalv_clusters', JSON.stringify(clusters));
    }, [clusters]);

    const [newCluster, setNewCluster] = useState({ name: '', incharge: '', wards: '' });
    const [editCluster, setEditCluster] = useState({ name: '', incharge: '', wards: '' });

    const handleAppoint = (e) => {
        e.preventDefault();
        const id = `CL-${Math.floor(100 + Math.random() * 900)}`;
        setClusters([...clusters, { ...newCluster, id, status: 'Active' }]);
        setNewCluster({ name: '', incharge: '', wards: '' });
        setShowAddModal(false);
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        setClusters(clusters.map(c => c.id === selectedCluster.id ? { ...c, ...editCluster } : c));
        setShowEditModal(false);
        setOpenMenuId(null);
    };

    const handleRemove = (id) => {
        setClusters(clusters.filter(c => c.id !== id));
        setOpenMenuId(null);
    };

    const openEdit = (cluster) => {
        setSelectedCluster(cluster);
        setEditCluster({ name: cluster.name, incharge: cluster.incharge, wards: cluster.wards });
        setShowEditModal(true);
        setOpenMenuId(null);
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-5 duration-700 relative" onClick={() => setOpenMenuId(null)}>
            <header className="flex justify-between items-end mb-12">
                <div>
                    <h2 className="text-4xl font-extrabold tracking-tight text-white mb-2">Cluster Intelligence</h2>
                    <p className="text-lg text-slate-400 font-medium">Managing regional administrative clusters and their respective incharges.</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black shadow-lg shadow-emerald-500/30 transition-all active:scale-95"
                >
                    <UserPlus size={18} /> Appoint Cluster Incharge
                </button>
            </header>

            <div className="glass rounded-[32px] overflow-hidden">
                <div className="p-8 border-b border-white/5 bg-white/5">
                    <div className="relative group">
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search clusters..."
                            className="w-full bg-slate-950 border border-white/5 rounded-2xl py-3.5 pl-12 pr-6 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white/5">
                                <th className="px-8 py-5 text-xs font-black text-slate-500 uppercase tracking-widest">Cluster ID</th>
                                <th className="px-8 py-5 text-xs font-black text-slate-500 uppercase tracking-widest">Cluster Detail</th>
                                <th className="px-8 py-5 text-xs font-black text-slate-500 uppercase tracking-widest">Incharge</th>
                                <th className="px-8 py-5 text-xs font-black text-slate-500 uppercase tracking-widest">Total Wards</th>
                                <th className="px-8 py-5 text-xs font-black text-slate-500 uppercase tracking-widest">Status</th>
                                <th className="px-8"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {clusters.map((cluster) => (
                                <tr key={cluster.id} className="hover:bg-white/[0.03] transition-colors group">
                                    <td className="px-8 py-6 font-black text-emerald-400 tracking-tighter text-lg underline decoration-emerald-400/30 underline-offset-4">{cluster.id}</td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500">
                                                <Building size={20} />
                                            </div>
                                            <span className="font-black text-white">{cluster.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-slate-400 font-bold">{cluster.incharge}</td>
                                    <td className="px-8 py-6 text-white font-black">{cluster.wards}</td>
                                    <td className="px-8 py-6">
                                        <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                                            {cluster.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right relative">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setOpenMenuId(openMenuId === cluster.id ? null : cluster.id);
                                            }}
                                            className="p-2.5 rounded-xl hover:bg-white/10 text-slate-500 hover:text-white transition-all shadow-sm active:scale-90"
                                        >
                                            <MoreVertical size={20} />
                                        </button>

                                        {openMenuId === cluster.id && (
                                            <div className="absolute right-8 top-16 w-56 glass rounded-2xl shadow-2xl border border-white/20 z-[60] overflow-hidden animate-in fade-in zoom-in duration-200">
                                                <div className="p-2 space-y-1">
                                                    <button
                                                        onClick={() => openEdit(cluster)}
                                                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-300 hover:bg-white/10 hover:text-white rounded-xl transition-all"
                                                    >
                                                        <Edit3 size={16} />
                                                        <span>Edit Cluster Details</span>
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="glass w-full max-w-lg rounded-[40px] p-10 relative overflow-hidden shadow-2xl border-white/20">
                        <button onClick={() => setShowAddModal(false)} className="absolute top-8 right-8 text-slate-400 hover:text-white transition-colors">
                            <X size={24} />
                        </button>
                        <div className="mb-8">
                            <h3 className="text-3xl font-black text-white tracking-tight mb-2">Appoint Cluster Incharge</h3>
                            <p className="text-slate-400 font-medium text-sm">Designating a new regional administrative incharge.</p>
                        </div>
                        <form onSubmit={handleAppoint} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Incharge Name</label>
                                <input required type="text" placeholder="Enter full name..." value={newCluster.incharge} onChange={(e) => setNewCluster({ ...newCluster, incharge: e.target.value })} className="w-full bg-slate-950 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all font-bold placeholder:text-slate-700" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Cluster Region</label>
                                <input required type="text" placeholder="e.g. North Cluster, Sector B..." value={newCluster.name} onChange={(e) => setNewCluster({ ...newCluster, name: e.target.value })} className="w-full bg-slate-950 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all font-bold placeholder:text-slate-700" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Allocated Wards</label>
                                <input required type="number" placeholder="Number of wards..." value={newCluster.wards} onChange={(e) => setNewCluster({ ...newCluster, wards: e.target.value })} className="w-full bg-slate-950 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all font-bold placeholder:text-slate-700" />
                            </div>
                            <div className="pt-4 flex gap-4">
                                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-black transition-all border border-white/5">Cancel</button>
                                <button type="submit" className="flex-1 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black shadow-lg shadow-emerald-500/30 transition-all">Confirm Appointment</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {showEditModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="glass w-full max-w-lg rounded-[40px] p-10 relative overflow-hidden shadow-2xl border-white/20">
                        <button onClick={() => setShowEditModal(false)} className="absolute top-8 right-8 text-slate-400 hover:text-white transition-colors">
                            <X size={24} />
                        </button>
                        <div className="mb-8">
                            <h3 className="text-3xl font-black text-white tracking-tight mb-2">Edit Cluster</h3>
                            <p className="text-slate-400 font-medium text-sm">Modifying administrative details for {selectedCluster?.id}.</p>
                        </div>
                        <form onSubmit={handleUpdate} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Incharge Name</label>
                                <input required type="text" value={editCluster.incharge} onChange={(e) => setEditCluster({ ...editCluster, incharge: e.target.value })} className="w-full bg-slate-950 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all font-bold" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Cluster Region</label>
                                <input required type="text" value={editCluster.name} onChange={(e) => setEditCluster({ ...editCluster, name: e.target.value })} className="w-full bg-slate-950 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all font-bold" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Allocated Wards</label>
                                <input required type="number" value={editCluster.wards} onChange={(e) => setEditCluster({ ...editCluster, wards: e.target.value })} className="w-full bg-slate-950 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all font-bold" />
                            </div>
                            <div className="pt-4 flex gap-4">
                                <button type="button" onClick={() => {
                                    if (window.confirm('Are you sure you want to remove this cluster?')) {
                                        handleRemove(selectedCluster.id);
                                        setShowEditModal(false);
                                    }
                                }} className="px-6 py-4 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-2xl font-black transition-all border border-red-500/20 flex items-center gap-2">
                                    <X size={18} /> Delete
                                </button>
                                <div className="flex-1 flex gap-4">
                                    <button type="button" onClick={() => setShowEditModal(false)} className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-black transition-all border border-white/5">Cancel</button>
                                    <button type="submit" className="flex-1 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black shadow-lg shadow-emerald-500/30 transition-all">Save Changes</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClusterList;

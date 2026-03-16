import React, { useState } from 'react';
import { Search, UserPlus, MoreVertical, Smartphone, MapPin, X, Edit3 } from 'lucide-react';

const AgentList = () => {
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [openMenuId, setOpenMenuId] = useState(null);
    const [selectedAgent, setSelectedAgent] = useState(null);
    const [agents, setAgents] = useState(() => {
        const saved = localStorage.getItem('digitalv_agents');
        return saved ? JSON.parse(saved) : [
            { id: 'BA-902', name: 'Zia Ahmed', area: 'Sector 4', performance: '98%', status: 'Active' },
            { id: 'BA-815', name: 'Rahul Sharma', area: 'Unit 2', performance: '92%', status: 'On Field' },
            { id: 'BA-792', name: 'Priya Verma', area: 'Sector 9', performance: '99%', status: 'Active' },
            { id: 'BA-612', name: 'Suresh Raina', area: 'Booth 14', performance: '85%', status: 'Inactive' },
        ];
    });

    React.useEffect(() => {
        localStorage.setItem('digitalv_agents', JSON.stringify(agents));
    }, [agents]);

    const [newAgent, setNewAgent] = useState({ name: '', area: '', phone: '' });
    const [editAgent, setEditAgent] = useState({ name: '', area: '', phone: '' });

    const handleDeploy = (e) => {
        e.preventDefault();
        const id = `BA-${Math.floor(100 + Math.random() * 900)}`;
        setAgents([...agents, { ...newAgent, id, performance: '0%', status: 'Active' }]);
        setNewAgent({ name: '', area: '', phone: '' });
        setShowAddModal(false);
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        setAgents(agents.map(a => a.id === selectedAgent.id ? { ...a, ...editAgent } : a));
        setShowEditModal(false);
        setOpenMenuId(null);
    };

    const handleRemove = (id) => {
        setAgents(agents.filter(agent => agent.id !== id));
        setOpenMenuId(null);
    };

    const openEdit = (agent) => {
        setSelectedAgent(agent);
        setEditAgent({ name: agent.name, area: agent.area, phone: agent.phone || '' });
        setShowEditModal(true);
        setOpenMenuId(null);
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-5 duration-700 relative" onClick={() => setOpenMenuId(null)}>
            <header className="flex justify-between items-end mb-12">
                <div>
                    <h2 className="text-4xl font-extrabold tracking-tight text-white mb-2">Booth Intelligence</h2>
                    <p className="text-lg text-slate-400 font-medium">Monitoring system-wide booth agent deployment and performance.</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black shadow-lg shadow-indigo-500/30 transition-all active:scale-95"
                >
                    <UserPlus size={18} /> Deploy Booth Agent
                </button>
            </header>

            <div className="glass rounded-[32px] overflow-hidden">
                <div className="p-8 border-b border-white/5 bg-white/5 flex gap-4">
                    <div className="relative flex-1 group">
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search booth agents by ID, name, or operational area..."
                            className="w-full bg-slate-950 border border-white/5 rounded-2xl py-3.5 pl-12 pr-6 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white/5">
                                <th className="px-8 py-5 text-xs font-black text-slate-500 uppercase tracking-widest">ID</th>
                                <th className="px-8 py-5 text-xs font-black text-slate-500 uppercase tracking-widest">Booth Agent Detail</th>
                                <th className="px-8 py-5 text-xs font-black text-slate-500 uppercase tracking-widest">Operational Zone</th>
                                <th className="px-8 py-5 text-xs font-black text-slate-500 uppercase tracking-widest">Efficiency</th>
                                <th className="px-8 py-5 text-xs font-black text-slate-500 uppercase tracking-widest">Live Status</th>
                                <th className="px-8"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {agents.map((agent) => (
                                <tr key={agent.id} className="hover:bg-white/[0.03] transition-colors group">
                                    <td className="px-8 py-6 font-black text-indigo-400 tracking-tighter text-lg underline decoration-indigo-400/30 underline-offset-4">{agent.id}</td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-11 h-11 rounded-2xl bg-indigo-600/20 border border-indigo-600/30 flex items-center justify-center font-black text-indigo-400">
                                                {agent.name.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div>
                                                <p className="font-black text-white">{agent.name}</p>
                                                <p className="text-xs font-bold text-slate-500">Booth Operative</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2 text-slate-400 font-bold">
                                            <MapPin size={16} /> {agent.area}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xl font-black text-white">{agent.performance}</span>
                                            <div className="h-1.5 w-16 bg-white/10 rounded-full overflow-hidden">
                                                <div className="h-full bg-emerald-500 rounded-full" style={{ width: agent.performance }}></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`
                                            px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/5
                                            ${agent.status === 'Inactive' ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'}
                                        `}>
                                            {agent.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right relative">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setOpenMenuId(openMenuId === agent.id ? null : agent.id);
                                            }}
                                            className="p-2.5 rounded-xl hover:bg-white/10 text-slate-500 hover:text-white transition-all shadow-sm active:scale-90"
                                        >
                                            <MoreVertical size={20} />
                                        </button>

                                        {openMenuId === agent.id && (
                                            <div className="absolute right-8 top-16 w-56 glass rounded-2xl shadow-2xl border border-white/20 z-[60] overflow-hidden animate-in fade-in zoom-in duration-200">
                                                <div className="p-2 space-y-1">
                                                    <button
                                                        onClick={() => openEdit(agent)}
                                                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-300 hover:bg-white/10 hover:text-white rounded-xl transition-all"
                                                    >
                                                        <Edit3 size={16} />
                                                        <span>Edit Booth Agent</span>
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
                            <h3 className="text-3xl font-black text-white tracking-tight mb-2">Deploy Booth Agent</h3>
                            <p className="text-slate-400 font-medium text-sm">Deploying a new tactical booth operative to the field.</p>
                        </div>
                        <form onSubmit={handleDeploy} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Operative Name</label>
                                <input required type="text" placeholder="Enter full name..." value={newAgent.name} onChange={(e) => setNewAgent({ ...newAgent, name: e.target.value })} className="w-full bg-slate-950 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-bold placeholder:text-slate-700" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Tactical Zone</label>
                                <input required type="text" placeholder="e.g. Sector 4, Unit 2..." value={newAgent.area} onChange={(e) => setNewAgent({ ...newAgent, area: e.target.value })} className="w-full bg-slate-950 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-bold placeholder:text-slate-700" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Phone Link</label>
                                <input required type="tel" placeholder="+91 XXXXX XXXXX" value={newAgent.phone} onChange={(e) => setNewAgent({ ...newAgent, phone: e.target.value })} className="w-full bg-slate-950 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-bold placeholder:text-slate-700" />
                            </div>
                            <div className="pt-4 flex gap-4">
                                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-black transition-all border border-white/5">Cancel</button>
                                <button type="submit" className="flex-1 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black shadow-lg shadow-indigo-500/30 transition-all">Confirm Deployment</button>
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
                            <h3 className="text-3xl font-black text-white tracking-tight mb-2">Edit Booth Agent</h3>
                            <p className="text-slate-400 font-medium text-sm">Modifying tactical details for {selectedAgent?.id}.</p>
                        </div>
                        <form onSubmit={handleUpdate} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Operative Name</label>
                                <input required type="text" value={editAgent.name} onChange={(e) => setEditAgent({ ...editAgent, name: e.target.value })} className="w-full bg-slate-950 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-bold" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Tactical Zone</label>
                                <input required type="text" value={editAgent.area} onChange={(e) => setEditAgent({ ...editAgent, area: e.target.value })} className="w-full bg-slate-950 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-bold" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Phone Link</label>
                                <input required type="tel" value={editAgent.phone} onChange={(e) => setEditAgent({ ...editAgent, phone: e.target.value })} className="w-full bg-slate-950 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-bold" />
                            </div>
                            <div className="pt-4 flex gap-4">
                                <button type="button" onClick={() => {
                                    if (window.confirm('Are you sure you want to remove this booth agent?')) {
                                        handleRemove(selectedAgent.id);
                                        setShowEditModal(false);
                                    }
                                }} className="px-6 py-4 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-2xl font-black transition-all border border-red-500/20 flex items-center gap-2">
                                    <X size={18} /> Delete
                                </button>
                                <div className="flex-1 flex gap-4">
                                    <button type="button" onClick={() => setShowEditModal(false)} className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-black transition-all border border-white/5">Cancel</button>
                                    <button type="submit" className="flex-1 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black shadow-lg shadow-indigo-500/30 transition-all">Save Changes</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AgentList;

import React from 'react';
import { Search, Filter, Download, CheckCircle, Clock, Hash } from 'lucide-react';
import { supabase } from '../supabaseClient';

const VoterList = () => {
    const [voters, setVoters] = React.useState([]);
    const [searchTerm, setSearchTerm] = React.useState('');
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);

    React.useEffect(() => {
        const fetchVoters = async () => {
            try {
                setLoading(true);
                const { data, error } = await supabase
                    .from('voter_surveys')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (error) throw error;

                const dbVoters = data.map(v => ({
                    id: `V-${v.id.toString().padStart(5, '0').slice(-5)}`,
                    name: v.voter_name,
                    mobile: v.mobile_number,
                    gender: v.gender,
                    dob: v.date_of_birth,
                    house_number: v.house_number,
                    house_type: v.house_type,
                    status: 'Verified',
                    timestamp: v.created_at
                }));

                setVoters(dbVoters);
                setError(null);
            } catch (err) {
                console.error('Error fetching voters:', err.message);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchVoters();
    }, []);

    const filteredVoters = voters.filter(voter =>
        (voter.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (voter.id?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (voter.house_number?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (voter.mobile?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );


    return (
        <div className="animate-in fade-in slide-in-from-bottom-5 duration-700">
            <header className="flex justify-between items-end mb-12">
                <div>
                    <h2 className="text-4xl font-extrabold tracking-tight text-white mb-2">Voter Registry</h2>
                    <p className="text-lg text-slate-400 font-medium">Digital V master database for household verification.</p>
                </div>
                <button className="flex items-center gap-2 px-6 py-3.5 bg-white/5 hover:bg-white/10 border border-white/5 text-white rounded-2xl font-black transition-all">
                    <Download size={18} /> Export CSV
                </button>
            </header>

            <div className="glass rounded-[32px] overflow-hidden">
                <div className="p-8 border-b border-white/5 bg-white/5 flex gap-4">
                    <div className="relative flex-1 group">
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search by ID, house number, mobile, or name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-950 border border-white/5 rounded-2xl py-3.5 pl-12 pr-6 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white/5">
                                <th className="px-6 py-5 text-xs font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">ID</th>
                                <th className="px-6 py-5 text-xs font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">Name</th>
                                <th className="px-6 py-5 text-xs font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">Mobile</th>
                                <th className="px-6 py-5 text-xs font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">Gender</th>
                                <th className="px-6 py-5 text-xs font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">DOB</th>
                                <th className="px-6 py-5 text-xs font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">House No</th>
                                <th className="px-6 py-5 text-xs font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">House Type</th>
                                <th className="px-6 py-5 text-xs font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                <tr>
                                    <td colSpan="8" className="px-8 py-12 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-8 h-8 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                                            <span className="text-slate-500 font-bold">Synchronizing with database...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : error ? (
                                <tr>
                                    <td colSpan="8" className="px-8 py-12 text-center">
                                        <div className="inline-flex flex-col items-center gap-2 px-6 py-4 bg-red-500/10 border border-red-500/20 rounded-2xl">
                                            <span className="text-red-400 font-black text-sm uppercase tracking-widest">Database Error</span>
                                            <p className="text-slate-400 text-sm font-medium">{error}</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredVoters.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="px-8 py-12 text-center text-slate-500 font-bold">
                                        No voter records found in the database.
                                    </td>
                                </tr>
                            ) : (
                                filteredVoters.map((voter) => (
                                    <tr key={voter.id} className="hover:bg-white/[0.03] transition-colors group">
                                        <td className="px-6 py-6">
                                            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
                                                <Hash size={14} className="text-indigo-400" />
                                                <span className="font-black text-indigo-400 text-sm tracking-tighter">{voter.id}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6 font-black text-white text-base">
                                            {voter.name}
                                        </td>
                                        <td className="px-6 py-6 text-sm font-bold text-slate-400 whitespace-nowrap">
                                            {voter.mobile}
                                        </td>
                                        <td className="px-6 py-6 text-sm font-bold text-slate-400">
                                            {voter.gender}
                                        </td>
                                        <td className="px-6 py-6 text-sm font-bold text-slate-400 whitespace-nowrap">
                                            {voter.dob}
                                        </td>
                                        <td className="px-6 py-6 text-sm font-bold text-indigo-400">
                                            {voter.house_number}
                                        </td>
                                        <td className="px-6 py-6 text-xs font-black text-slate-500 uppercase tracking-widest">
                                            {voter.house_type}
                                        </td>
                                        <td className="px-6 py-6 text-sm font-bold">
                                            <div className="flex items-center gap-2">
                                                {voter.status === 'Verified' ? (
                                                    <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full border border-emerald-500/20">
                                                        <CheckCircle size={14} />
                                                        <span className="text-[10px] font-black uppercase tracking-widest">{voter.status}</span>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-2 px-3 py-1 bg-amber-500/10 text-amber-500 rounded-full border border-amber-500/20">
                                                        <Clock size={14} />
                                                        <span className="text-[10px] font-black uppercase tracking-widest">{voter.status}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>

                    </table>
                </div>
            </div>
        </div>
    );
};

export default VoterList;

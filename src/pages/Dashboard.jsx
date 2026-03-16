import React from 'react';
import { Home, Users, CheckCircle, Activity, TrendingUp, Building, MapPin, Layers } from 'lucide-react';
import { Line, Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, Filler
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, Filler);

const Dashboard = ({ userRole }) => {
    const roleLabels = {
        'MLA': 'MLA',
        'CLUSTER_INCHARGE': 'Cluster Incharge',
        'WARD_INCHARGE': 'Ward Incharge',
        'UNIT_INCHARGE': 'Unit Incharge',
        'BOOTH_AGENT': 'Booth Agent'
    };
    const currentRoleLabel = roleLabels[userRole] || 'Administrative';

    const counts = {
        clusters: JSON.parse(localStorage.getItem('digitalv_clusters') || '[]').length || 3,
        wards: JSON.parse(localStorage.getItem('digitalv_wards') || '[]').length || 3,
        units: JSON.parse(localStorage.getItem('digitalv_units') || '[]').length || 3,
        agents: JSON.parse(localStorage.getItem('digitalv_agents') || '[]').length || 4,
    };

    const stats = [
        { title: 'Total Houses Under the Constitution', value: '12,480', icon: Home, color: 'text-indigo-500', trend: '+12%', roles: ['MLA', 'CLUSTER_INCHARGE', 'WARD_INCHARGE', 'UNIT_INCHARGE', 'BOOTH_AGENT'] },
        { title: 'Total Voters Under the Constitution', value: '45,920', icon: Users, color: 'text-emerald-500', trend: '+5.4%', roles: ['MLA', 'CLUSTER_INCHARGE', 'WARD_INCHARGE', 'UNIT_INCHARGE', 'BOOTH_AGENT'] },
        { title: 'Ward Incharge', value: counts.wards.toString(), icon: MapPin, color: 'text-amber-500', trend: 'Live', roles: ['MLA', 'CLUSTER_INCHARGE'] },
        { title: 'Unit Incharge', value: counts.units.toString(), icon: Layers, color: 'text-purple-500', trend: 'Live', roles: ['MLA', 'CLUSTER_INCHARGE', 'WARD_INCHARGE'] },
        { title: 'Active Booth Agents', value: counts.agents.toString(), icon: Activity, color: 'text-sky-500', trend: '+24', roles: ['MLA', 'CLUSTER_INCHARGE', 'WARD_INCHARGE', 'UNIT_INCHARGE', 'BOOTH_AGENT'] },
        { title: 'Compliance', value: '98.2%', icon: CheckCircle, color: 'text-indigo-500', trend: 'Solid', roles: ['MLA', 'CLUSTER_INCHARGE', 'WARD_INCHARGE', 'UNIT_INCHARGE', 'BOOTH_AGENT'] },
    ];

    const filteredStats = stats.filter(stat => stat.roles.includes(userRole));
    const gridCols = filteredStats.length === 6 ? 'xl:grid-cols-6' : 'xl:grid-cols-4';

    return (
        <div className="animate-in fade-in slide-in-from-bottom-5 duration-700">
            <header className="mb-10">
                <h2 className="text-4xl font-extrabold tracking-tight mb-2 text-white">{currentRoleLabel} Dashboard</h2>
                <p className="text-lg text-slate-400 font-medium">Monitoring {currentRoleLabel} analytics for Digital V infrastructure.</p>
            </header>

            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ${gridCols} gap-4 mb-10`}>
                {filteredStats.map((stat, i) => (
                    <div key={i} className="glass card hover:bg-white/[0.07] transition-all cursor-pointer group !p-5">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-2.5 rounded-xl bg-white/5 group-hover:bg-white/10 transition-colors ${stat.color}`}>
                                <stat.icon size={22} />
                            </div>
                            <span className="text-[10px] font-black px-1.5 py-0.5 bg-white/5 rounded-md text-slate-400 tracking-widest uppercase">{stat.trend}</span>
                        </div>
                        <h3 className="text-slate-500 font-bold text-[10px] uppercase tracking-wider mb-1 leading-tight">{stat.title}</h3>
                        <p className="text-xl font-black text-white">{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 glass card h-[450px]">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-xl font-black tracking-tight text-white">Voter Survey Velocity</h3>
                        <span className="flex items-center gap-2 text-xs font-bold text-emerald-500 px-3 py-1 bg-emerald-500/10 rounded-full">
                            <TrendingUp size={14} /> +12.5% vs Last Period
                        </span>
                    </div>
                    <div className="h-[300px]">
                        <Line
                            data={{
                                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
                                datasets: [{
                                    label: 'Surveys',
                                    data: [120, 420, 240, 890, 1100, 1500],
                                    borderColor: '#6366f1',
                                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                                    tension: 0.4,
                                    fill: true,
                                    pointBackgroundColor: '#6366f1',
                                    pointBorderWidth: 4,
                                    pointRadius: 6,
                                }]
                            }}
                            options={{
                                maintainAspectRatio: false,
                                plugins: { legend: { display: false } },
                                scales: {
                                    y: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, border: { display: false }, ticks: { color: '#64748b' } },
                                    x: { grid: { display: false }, ticks: { color: '#64748b' } }
                                }
                            }}
                        />
                    </div>
                </div>

                <div className="glass card flex flex-col">
                    <h3 className="text-xl font-black mb-8 text-white">Target Status</h3>
                    <div className="h-[260px] relative mb-8">
                        <Doughnut
                            data={{
                                labels: ['Verified', 'Pending'],
                                datasets: [{
                                    data: [85, 15],
                                    backgroundColor: ['#6366f1', 'rgba(255, 255, 255, 0.05)'],
                                    borderWidth: 0,
                                    hoverOffset: 10
                                }]
                            }}
                            options={{ maintainAspectRatio: false, cutout: '80%', plugins: { legend: { display: false } } }}
                        />
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <p className="text-5xl font-black text-white">85%</p>
                            <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Achieved</p>
                        </div>
                    </div>
                    <div className="mt-auto space-y-4">
                        <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl">
                            <span className="text-sm font-bold text-slate-400">Total Households</span>
                            <span className="font-black text-white">12,480</span>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-indigo-600/20 border border-indigo-600/30 rounded-2xl">
                            <span className="text-sm font-bold text-indigo-400">Verified Voters</span>
                            <span className="font-black text-indigo-400">45,920</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

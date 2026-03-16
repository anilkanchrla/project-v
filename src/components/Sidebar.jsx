import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Map, Users, Layers, UserCheck, LogOut, Shield, ClipboardList } from 'lucide-react';

const Sidebar = ({ userRole, onLogout }) => {
    const navItems = [
        { name: 'Dashboard', path: '/', icon: LayoutDashboard, roles: ['MLA', 'CLUSTER_INCHARGE', 'WARD_INCHARGE', 'UNIT_INCHARGE', 'BOOTH_AGENT'] },
        { name: 'Cluster Incharge', path: '/clusters', icon: Map, roles: ['MLA'] },
        { name: 'Ward Incharge', path: '/wards', icon: Users, roles: ['MLA', 'CLUSTER_INCHARGE'] },
        { name: 'Unit Incharge', path: '/units', icon: Layers, roles: ['MLA', 'CLUSTER_INCHARGE', 'WARD_INCHARGE'] },
        { name: 'Booth Agents', path: '/agents', icon: UserCheck, roles: ['MLA', 'CLUSTER_INCHARGE', 'WARD_INCHARGE', 'UNIT_INCHARGE', 'BOOTH_AGENT'] },
        { name: 'Voter List', path: '/voters', icon: UserCheck, roles: ['MLA', 'CLUSTER_INCHARGE', 'WARD_INCHARGE', 'UNIT_INCHARGE', 'BOOTH_AGENT'] },
        { name: 'Voter Survey', path: '/survey', icon: ClipboardList, roles: ['MLA', 'CLUSTER_INCHARGE', 'WARD_INCHARGE', 'UNIT_INCHARGE', 'BOOTH_AGENT'] },
    ];

    const filteredItems = navItems.filter(item => item.roles.includes(userRole));

    return (
        <aside className="fixed left-0 top-0 w-72 h-screen glass m-0 rounded-none border-r border-white/5 flex flex-col p-6 z-50">
            <div className="flex items-center gap-3 mb-12 px-2">
                <div className="p-2 bg-indigo-600 rounded-lg">
                    <Shield className="text-white" size={24} />
                </div>
                <h1 className="text-2xl font-black tracking-tighter text-white">DIGITAL V</h1>
            </div>

            <nav className="flex-1 space-y-2">
                {filteredItems.map((item) => (
                    <NavLink
                        key={item.name}
                        to={item.path}
                        className={({ isActive }) => `
                            flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300
                            ${isActive ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'text-slate-400 hover:bg-white/5 hover:text-white'}
                        `}
                    >
                        <item.icon size={20} />
                        <span className="font-bold tracking-tight">{item.name}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="mt-auto border-t border-white/10 pt-6">
                <button
                    onClick={onLogout}
                    className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-500 transition-all font-bold"
                >
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;

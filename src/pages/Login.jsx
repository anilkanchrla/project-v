import React, { useState } from 'react';
import { Shield, User, Lock, Unlock, ArrowRight, Loader2, Users, Map, UserCheck, UserPlus, LogIn, Layers } from 'lucide-react';

const Login = ({ onLogin }) => {
    const [isSignup, setIsSignup] = useState(false);
    const [credentials, setCredentials] = useState({ username: '', password: '', confirmPassword: '', fullName: '', phone: '' });
    const [selectedRole, setSelectedRole] = useState('MLA');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const roles = [
        { id: 'MLA', title: 'MLA', subtitle: 'Main Admin', icon: Shield, color: 'text-indigo-500' },
        { id: 'CLUSTER_INCHARGE', title: 'Cluster', subtitle: 'Regional', icon: Map, color: 'text-emerald-500' },
        { id: 'WARD_INCHARGE', title: 'Ward Incharge', subtitle: 'Division', icon: Users, color: 'text-amber-500' },
        { id: 'UNIT_INCHARGE', title: 'Unit Incharge', subtitle: 'Sub-Division', icon: Layers, color: 'text-purple-500' },
        { id: 'BOOTH_AGENT', title: 'Booth Agent', subtitle: 'Field', icon: UserCheck, color: 'text-sky-500' },
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);

        if (isSignup) {
            // Simulate Sign Up Handshake
            setTimeout(() => {
                setIsSignup(false);
                setIsLoading(false);
                setCredentials({ ...credentials, password: '', confirmPassword: '' });
                // Reset to login after successful signup
            }, 1500);
        } else {
            // Simulate Login Handshake
            setTimeout(() => {
                onLogin(selectedRole);
                setIsLoading(false);
            }, 1200);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950 to-slate-950 font-sans">
            <div className="w-full max-w-5xl animate-in fade-in zoom-in duration-700">

                <div className="flex flex-col items-center mb-8">
                    <div className="w-14 h-14 bg-indigo-600 rounded-[22px] flex items-center justify-center shadow-2xl shadow-indigo-500/40 mb-3 rotate-2 transition-transform hover:rotate-0 duration-500">
                        <Shield className="text-white" size={28} />
                    </div>
                    <h1 className="text-3xl font-black tracking-tighter text-white mb-0.5 italic">DIGITAL V</h1>
                    <p className="text-slate-500 font-bold uppercase tracking-[0.25em] text-[9px]">Secured Infrastructure v2.5</p>
                </div>

                <div className="grid lg:grid-cols-[1fr_450px] gap-8">
                    {/* Role Selection Side */}
                    <div className="space-y-4">
                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-black text-white mb-1">Administrative Cluster</h2>
                                <p className="text-slate-400 text-sm font-medium">Select tier to {isSignup ? 'register' : 'authorize'}.</p>
                            </div>
                            <button
                                onClick={() => setIsSignup(!isSignup)}
                                className="px-4 py-2 rounded-xl bg-indigo-600/10 border border-indigo-500/30 text-indigo-400 text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600/20 transition-all flex items-center gap-2"
                            >
                                {isSignup ? <LogIn size={14} /> : <UserPlus size={14} />}
                                {isSignup ? 'Switch to Login' : 'Need Signup?'}
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {roles.map((role) => (
                                <button
                                    key={role.id}
                                    onClick={() => setSelectedRole(role.id)}
                                    className={`
                                        p-6 rounded-[32px] border transition-all duration-500 text-left relative overflow-hidden group
                                        ${selectedRole === role.id
                                            ? 'bg-indigo-600/10 border-indigo-500/50 shadow-2xl shadow-indigo-500/10'
                                            : 'bg-white/[0.02] border-white/5 hover:bg-white/5 hover:border-white/10'}
                                    `}
                                >
                                    <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-4 transition-transform duration-500 group-hover:scale-110 ${role.color}`}>
                                        <role.icon size={22} />
                                    </div>
                                    <div>
                                        <p className={`text-sm font-black uppercase tracking-widest mb-1 ${selectedRole === role.id ? 'text-white' : 'text-slate-400'}`}>
                                            {role.title}
                                        </p>
                                        <p className="text-xs font-bold text-slate-500 leading-tight">{role.subtitle} Interface</p>
                                    </div>
                                    {selectedRole === role.id && (
                                        <div className="absolute top-6 right-6 w-2 h-2 bg-indigo-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Dynamic Auth Form */}
                    <div className={`glass rounded-[40px] p-10 border-white/10 relative overflow-hidden h-fit transition-all duration-500 ${isSignup ? 'bg-indigo-900/5' : ''}`}>
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-30"></div>

                        <div className="mb-8">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                                <h3 className="text-lg font-black text-white uppercase tracking-wider">
                                    {selectedRole.replace('_', ' ')} {isSignup ? 'SIGNUP' : 'LOGIN'}
                                </h3>
                            </div>
                            <p className="text-slate-400 text-xs font-bold tracking-tight">
                                {isSignup ? 'Create your secure administrative profile' : 'Enter your secure credentials below'}
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {isSignup && (
                                <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
                                    <div className="space-y-1.5 group/input">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 group-focus-within/input:text-indigo-500 transition-colors">Full Name</label>
                                        <div className="relative">
                                            <User size={14} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within/input:text-indigo-400 transition-colors" />
                                            <input
                                                required
                                                type="text"
                                                placeholder="Enter full name..."
                                                className="w-full bg-slate-950 border border-white/5 rounded-2xl py-3.5 pl-12 pr-6 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-bold placeholder:text-slate-800 text-sm tracking-wide"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="space-y-1.5 group/input">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 group-focus-within/input:text-indigo-500 transition-colors">Username</label>
                                <div className="relative">
                                    <User size={14} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within/input:text-indigo-400 transition-colors" />
                                    <input
                                        required
                                        type="text"
                                        value={credentials.username}
                                        onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                                        placeholder="Enter username..."
                                        className="w-full bg-slate-950 border border-white/5 rounded-2xl py-3.5 pl-12 pr-6 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-bold placeholder:text-slate-800 text-sm tracking-wide"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5 group/input relative">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 group-focus-within/input:text-indigo-500 transition-colors">Password</label>
                                <div className="relative">
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-indigo-400 group-focus-within/input:text-indigo-400 transition-colors z-10"
                                    >
                                        {showPassword ? <Unlock size={14} /> : <Lock size={14} />}
                                    </button>
                                    <input
                                        required
                                        type={showPassword ? "text" : "password"}
                                        value={credentials.password}
                                        onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                                        placeholder="••••••••"
                                        className="w-full bg-slate-950 border border-white/5 rounded-2xl py-3.5 pl-12 pr-6 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-bold placeholder:text-slate-800 text-sm tracking-widest"
                                    />
                                </div>
                            </div>

                            {isSignup && (
                                <div className="space-y-1.5 group/input animate-in slide-in-from-top-2 duration-300">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 group-focus-within/input:text-indigo-500 transition-colors">Confirm Password</label>
                                    <div className="relative">
                                        <Lock size={14} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within/input:text-indigo-400 transition-colors" />
                                        <input
                                            required
                                            type="password"
                                            placeholder="••••••••"
                                            className="w-full bg-slate-950 border border-white/5 rounded-2xl py-3.5 pl-12 pr-6 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-bold placeholder:text-slate-800 text-sm tracking-widest"
                                        />
                                    </div>
                                </div>
                            )}

                            <button
                                disabled={isLoading}
                                type="submit"
                                className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black shadow-xl shadow-indigo-500/30 transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100 mt-2"
                            >
                                {isLoading ? (
                                    <Loader2 className="animate-spin" size={20} />
                                ) : (
                                    <>
                                        <span className="text-xs tracking-widest font-black uppercase">
                                            {isSignup ? 'Complete Registration' : 'Secure Login'}
                                        </span>
                                        <ArrowRight size={18} />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-8 pt-6 border-t border-white/5 text-center">
                            <p className="text-[10px] text-slate-600 font-bold uppercase tracking-[0.2em] leading-relaxed">
                                {isSignup
                                    ? 'Registration subjects user to system vetting'
                                    : 'Authorized Access Only • Session Monitoring Active'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;

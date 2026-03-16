import React, { useState, useEffect } from 'react';
import { ClipboardList, Home, Users, Building2, FileText, Send, CheckCircle2, MapPin, MapPinned, X, RefreshCw } from 'lucide-react';
import { supabase } from '../supabaseClient';

const VoterSurvey = () => {
    const [formData, setFormData] = useState({
        voterName: '',
        headOfHouse: '',
        mobileNumber: '',
        gender: 'Male',
        dob: '',
        houseNumber: '',
        houseType: 'Individual House',
        residentCount: '',
        residenceType: 'Own',
        remarks: '',
        latitude: '',
        longitude: ''
    });
    const [submitted, setSubmitted] = useState(false);
    const [isLocating, setIsLocating] = useState(false);

    // Nearest House Feature State
    const [existingHouses, setExistingHouses] = useState([]);
    const [suggestedHouse, setSuggestedHouse] = useState(null);
    const [showSuggestion, setShowSuggestion] = useState(false);
    const [dismissedSuggestions, setDismissedSuggestions] = useState([]);

    // 1. Geolocation Tracking
    const updateLocationFields = (position) => {
        setFormData(prev => ({
            ...prev,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }));
    };

    const fetchCurrentLocation = () => {
        if ("geolocation" in navigator) {
            setIsLocating(true);
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    updateLocationFields(position);
                    setIsLocating(false);
                },
                (error) => {
                    console.error("Error getting current position:", error.message);
                    setIsLocating(false);
                    alert("Location Error: " + error.message + "\nPlease ensure GPS is ON and location permissions are granted.");
                },
                { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
            );
        } else {
            alert("Geolocation is not supported by your browser.");
        }
    };

    useEffect(() => {
        // Initial exact fetch using getCurrentPosition
        fetchCurrentLocation();

        // Continuous tracking using watchPosition for movement
        let watchId;
        if ("geolocation" in navigator) {
            watchId = navigator.geolocation.watchPosition(
                (position) => {
                    updateLocationFields(position);
                },
                (error) => {
                    console.error("Error watching position:", error.message);
                },
                { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
            );
        }

        return () => {
            if (watchId !== undefined) {
                navigator.geolocation.clearWatch(watchId);
            }
        };
    }, []);

    // 2. Fetch previously surveyed houses to find the nearest
    useEffect(() => {
        const fetchExistingHouses = async () => {
            const { data, error } = await supabase
                .from('voter_surveys')
                .select('house_number, latitude, longitude')
                .not('latitude', 'is', null)
                .not('longitude', 'is', null);

            if (!error && data) {
                setExistingHouses(data.filter(h => h.latitude && h.longitude));
            }
        };
        fetchExistingHouses();
    }, []);

    // Haversine formula to calculate distance in meters
    const getDistanceFromLatLonInM = (lat1, lon1, lat2, lon2) => {
        const R = 6371e3; // Radius of the earth in m
        const dLat = (lat2 - lat1) * (Math.PI / 180);
        const dLon = (lon2 - lon1) * (Math.PI / 180);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    // 3. Nearest House Suggestion Logic
    useEffect(() => {
        if (formData.latitude && formData.longitude && existingHouses.length > 0) {
            let nearestDist = Infinity;
            let nearestHouseNumber = null;

            for (const house of existingHouses) {
                const dist = getDistanceFromLatLonInM(formData.latitude, formData.longitude, house.latitude, house.longitude);
                if (dist < nearestDist) {
                    nearestDist = dist;
                    nearestHouseNumber = house.house_number;
                }
            }

            // Suggest if within 10 meters, not dismissed, and not already filled in
            if (nearestDist <= 10 && nearestHouseNumber && !dismissedSuggestions.includes(nearestHouseNumber) && formData.houseNumber !== nearestHouseNumber) {
                setSuggestedHouse(nearestHouseNumber);
                setShowSuggestion(true);
            } else {
                setShowSuggestion(false);
            }
        }
    }, [formData.latitude, formData.longitude, formData.houseNumber, existingHouses, dismissedSuggestions]);

    const acceptSuggestion = () => {
        setFormData(prev => ({ ...prev, houseNumber: suggestedHouse }));
        setDismissedSuggestions(prev => [...prev, suggestedHouse]);
        setShowSuggestion(false);
    };

    const dismissSuggestion = () => {
        setDismissedSuggestions(prev => [...prev, suggestedHouse]);
        setShowSuggestion(false);
    };

    const saveSurveyData = async (data) => {
        try {
            const { error } = await supabase
                .from('voter_surveys')
                .insert([{
                    voter_name: data.voterName,
                    mobile_number: data.mobileNumber,
                    date_of_birth: data.dob,
                    gender: data.gender,
                    head_of_household: data.headOfHouse,
                    house_number: data.houseNumber,
                    family_members: parseInt(data.residentCount) || 0,
                    house_type: data.houseType,
                    residence_ownership: data.residenceType,
                    remarks: data.remarks,
                    latitude: data.latitude ? parseFloat(data.latitude) : null,
                    longitude: data.longitude ? parseFloat(data.longitude) : null
                }]);

            if (error) throw error;
            return true;
        } catch (error) {
            console.error('Error saving survey:', error.message);
            alert('Failed to save survey: ' + error.message);
            return false;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await saveSurveyData(formData);

        if (success) {
            setSubmitted(true);
            setTimeout(() => setSubmitted(false), 3000);
            setDismissedSuggestions([]);
            setFormData({
                voterName: '',
                headOfHouse: '',
                mobileNumber: '',
                gender: 'Male',
                dob: '',
                houseNumber: '',
                houseType: 'Individual House',
                residentCount: '',
                residenceType: 'Own',
                remarks: '',
                latitude: '',
                longitude: ''
            });
        }
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-5 duration-700 max-w-5xl mx-auto">
            <header className="mb-10 text-center lg:text-left">
                <h2 className="text-4xl font-extrabold tracking-tight mb-2 text-white">Household Voter Survey</h2>
                <p className="text-lg text-slate-400 font-medium">Collect and verify detailed voter and household information.</p>
            </header>

            <div className="glass rounded-[32px] p-8 lg:p-12 relative overflow-hidden">
                {submitted && (
                    <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center z-10 animate-in fade-in duration-300">
                        <div className="p-4 bg-emerald-500/20 rounded-full mb-4 border border-emerald-500/30">
                            <CheckCircle2 size={48} className="text-emerald-500" />
                        </div>
                        <h3 className="text-2xl font-black text-white mb-2">Survey Submitted Successfully</h3>
                        <p className="text-slate-400 font-medium">The data has been queued for verification.</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-10">
                    {/* Basic Info Section */}
                    <div className="space-y-6">
                        <h3 className="text-sm font-black text-indigo-400 uppercase tracking-[0.2em] border-b border-white/5 pb-4">Personal Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-xs font-black text-slate-500 uppercase tracking-widest ml-1">
                                    <Users size={14} className="text-indigo-400" /> Voter Name
                                </label>
                                <input
                                    required
                                    type="text"
                                    placeholder="Full Name"
                                    value={formData.voterName}
                                    onChange={(e) => setFormData({ ...formData, voterName: e.target.value })}
                                    className="w-full bg-slate-950 border border-white/5 rounded-2xl py-3.5 px-6 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-bold placeholder:text-slate-800 shadow-inner"
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-xs font-black text-slate-500 uppercase tracking-widest ml-1">
                                    <Send size={14} className="text-indigo-400" /> Mobile Number
                                </label>
                                <input
                                    required
                                    type="tel"
                                    placeholder="10-digit number"
                                    value={formData.mobileNumber}
                                    onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                                    className="w-full bg-slate-950 border border-white/5 rounded-2xl py-3.5 px-6 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-bold placeholder:text-slate-800 shadow-inner"
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-xs font-black text-slate-500 uppercase tracking-widest ml-1">
                                    <FileText size={14} className="text-indigo-400" /> Date of Birth
                                </label>
                                <input
                                    required
                                    type="date"
                                    value={formData.dob}
                                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                                    className="w-full bg-slate-950 border border-white/5 rounded-2xl py-3.5 px-6 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-bold shadow-inner [color-scheme:dark]"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-xs font-black text-slate-500 uppercase tracking-widest ml-1">
                                    <Users size={14} className="text-indigo-400" /> Gender
                                </label>
                                <div className="grid grid-cols-3 gap-3">
                                    {['Male', 'Female', 'Other'].map((g) => (
                                        <button
                                            key={g}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, gender: g })}
                                            className={`py-3 rounded-xl font-black transition-all border text-sm ${formData.gender === g
                                                ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-500/20'
                                                : 'bg-slate-950 text-slate-500 border-white/5 hover:border-white/10'
                                                }`}
                                        >
                                            {g}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-xs font-black text-slate-500 uppercase tracking-widest ml-1">
                                    <Users size={14} className="text-indigo-400" /> Head of Household
                                </label>
                                <input
                                    required
                                    type="text"
                                    placeholder="Head Name"
                                    value={formData.headOfHouse}
                                    onChange={(e) => setFormData({ ...formData, headOfHouse: e.target.value })}
                                    className="w-full bg-slate-950 border border-white/5 rounded-2xl py-3.5 px-6 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-bold placeholder:text-slate-800 shadow-inner"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Household Section */}
                    <div className="space-y-6">
                        <h3 className="text-sm font-black text-indigo-400 uppercase tracking-[0.2em] border-b border-white/5 pb-4">Household Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <label className="flex items-center gap-2 text-xs font-black text-slate-500 uppercase tracking-widest ml-1">
                                        <Home size={14} className="text-indigo-400" /> House Number
                                    </label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="e.g. 12-4/A"
                                        value={formData.houseNumber}
                                        onChange={(e) => setFormData({ ...formData, houseNumber: e.target.value })}
                                        className="w-full bg-slate-950 border border-white/5 rounded-2xl py-3.5 px-6 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-bold placeholder:text-slate-800 shadow-inner"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="flex items-center gap-2 text-xs font-black text-slate-500 uppercase tracking-widest ml-1">
                                        <Building2 size={14} className="text-indigo-400" /> House Type
                                    </label>
                                    <div className="grid grid-cols-2 gap-4">
                                        {['Individual House', 'Flat'].map((type) => (
                                            <button
                                                key={type}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, houseType: type })}
                                                className={`py-3.5 rounded-2xl font-black transition-all border text-sm ${formData.houseType === type
                                                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-500/20'
                                                    : 'bg-slate-950 text-slate-500 border-white/5 hover:border-white/10'
                                                    }`}
                                            >
                                                {type === 'Individual House' ? 'INDIVIDUAL' : 'FLAT'}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <label className="flex items-center gap-2 text-xs font-black text-slate-500 uppercase tracking-widest ml-1">
                                        <Users size={14} className="text-indigo-400" /> Family Members
                                    </label>
                                    <input
                                        required
                                        type="number"
                                        placeholder="0"
                                        min="1"
                                        value={formData.residentCount}
                                        onChange={(e) => setFormData({ ...formData, residentCount: e.target.value })}
                                        className="w-full bg-slate-950 border border-white/5 rounded-2xl py-3.5 px-6 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-bold placeholder:text-slate-800 shadow-inner"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="flex items-center gap-2 text-xs font-black text-slate-500 uppercase tracking-widest ml-1">
                                        <Building2 size={14} className="text-indigo-400" /> Residence Ownership
                                    </label>
                                    <div className="grid grid-cols-2 gap-4">
                                        {['Own', 'Rent'].map((type) => (
                                            <button
                                                key={type}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, residenceType: type })}
                                                className={`py-3.5 rounded-2xl font-black transition-all border text-sm ${formData.residenceType === type
                                                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-500/20'
                                                    : 'bg-slate-950 text-slate-500 border-white/5 hover:border-white/10'
                                                    }`}
                                            >
                                                {type.toUpperCase()}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Location Section */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between border-b border-white/5 pb-4">
                            <h3 className="text-sm font-black text-indigo-400 uppercase tracking-[0.2em]">Location Details</h3>
                            <button
                                type="button"
                                onClick={fetchCurrentLocation}
                                disabled={isLocating}
                                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest px-4 py-2 bg-indigo-600/10 text-indigo-400 rounded-full border border-indigo-500/20 hover:bg-indigo-600/20 transition-all active:scale-95 disabled:opacity-50"
                            >
                                <RefreshCw size={12} className={isLocating ? 'animate-spin' : ''} />
                                {isLocating ? 'Locating...' : 'Refresh Location'}
                            </button>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <label className="flex items-center gap-2 text-xs font-black text-slate-500 uppercase tracking-widest ml-1">
                                        <MapPin size={14} className="text-indigo-400" /> Latitude
                                    </label>
                                    <input
                                        type="number"
                                        step="any"
                                        readOnly
                                        placeholder="Fetching latitude..."
                                        value={formData.latitude}
                                        className="w-full bg-slate-900 border border-white/5 rounded-2xl py-3.5 px-6 text-slate-400 cursor-not-allowed font-bold placeholder:text-slate-600 shadow-inner"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="flex items-center gap-2 text-xs font-black text-slate-500 uppercase tracking-widest ml-1">
                                        <MapPin size={14} className="text-indigo-400" /> Longitude
                                    </label>
                                    <input
                                        type="number"
                                        step="any"
                                        readOnly
                                        placeholder="Fetching longitude..."
                                        value={formData.longitude}
                                        className="w-full bg-slate-900 border border-white/5 rounded-2xl py-3.5 px-6 text-slate-400 cursor-not-allowed font-bold placeholder:text-slate-600 shadow-inner"
                                    />
                                </div>
                            </div>

                            {/* Google Map Section */}
                            <div className="space-y-3 lg:mt-0 mt-2">
                                <label className="flex items-center gap-2 text-xs font-black text-slate-500 uppercase tracking-widest ml-1">
                                    <MapPin size={14} className="text-indigo-400" /> Map Preview
                                </label>
                                <div className="w-full h-48 lg:h-full min-h-[220px] bg-slate-900 border border-white/5 rounded-2xl overflow-hidden relative shadow-inner">
                                    {formData.latitude && formData.longitude ? (
                                        <iframe
                                            key={`${formData.latitude}-${formData.longitude}`}
                                            title="Google Map Preview"
                                            width="100%"
                                            height="100%"
                                            style={{ border: 0 }}
                                            loading="lazy"
                                            referrerPolicy="no-referrer-when-downgrade"
                                            src={`https://maps.google.com/maps?q=${formData.latitude},${formData.longitude}&z=16&output=embed`}
                                            className="absolute inset-0 w-full h-full"
                                        ></iframe>
                                    ) : (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-600 px-4 text-center">
                                            <MapPin size={32} className="mb-3 opacity-50 animate-pulse" />
                                            <p className="text-sm font-bold">Waiting for GPS signal...</p>
                                            <p className="text-xs mt-1 opacity-70">Ensure location services are enabled</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Remarks Section */}
                    <div className="space-y-3">
                        <label className="flex items-center gap-2 text-xs font-black text-slate-500 uppercase tracking-widest ml-1">
                            <FileText size={14} className="text-indigo-400" /> Additional Remarks
                        </label>
                        <textarea
                            rows="3"
                            placeholder="Any specific detailed observations..."
                            value={formData.remarks}
                            onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                            className="w-full bg-slate-950 border border-white/5 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-bold placeholder:text-slate-800 shadow-inner resize-none"
                        ></textarea>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4">
                        <button
                            type="submit"
                            className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-[24px] font-black text-xl tracking-tight transition-all shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-3 active:scale-[0.98]"
                        >
                            <Send size={24} /> Submit Survey Details
                        </button>
                    </div>
                </form>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 opacity-50">
                <div className="p-6 bg-white/5 rounded-3xl border border-white/5 flex items-center gap-4">
                    <div className="p-3 bg-indigo-500/10 rounded-2xl text-indigo-400">
                        <ClipboardList size={20} />
                    </div>
                    <div>
                        <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Survey ID</p>
                        <p className="text-white font-bold font-mono">SRV-{(Math.random() * 10000).toFixed(0)}</p>
                    </div>
                </div>
                <div className="p-6 bg-white/5 rounded-3xl border border-white/5 flex items-center gap-4">
                    <div className="p-3 bg-indigo-500/10 rounded-2xl text-indigo-400">
                        <CheckCircle2 size={20} />
                    </div>
                    <div>
                        <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Status</p>
                        <p className="text-white font-bold uppercase tracking-tighter">Draft Mode</p>
                    </div>
                </div>
            </div>

            {/* Nearest House Suggestion Popup */}
            {showSuggestion && suggestedHouse && (
                <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
                    <div className="bg-slate-900 border border-indigo-500/30 rounded-2xl shadow-2xl p-5 max-w-sm flex flex-col gap-3 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                        <div className="flex justify-between items-start gap-4 relative z-10 w-full min-w-[280px]">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-indigo-500/20 rounded-xl text-indigo-400">
                                    <MapPinned size={20} />
                                </div>
                                <div>
                                    <h4 className="text-white font-extrabold text-sm mb-0.5">Nearby House Found</h4>
                                    <p className="text-slate-400 text-xs font-medium">Are you at <span className="text-indigo-400 font-black">{suggestedHouse}</span>?</p>
                                </div>
                            </div>
                            <button type="button" onClick={dismissSuggestion} className="text-slate-500 hover:text-white transition-colors" title="Dismiss">
                                <X size={16} />
                            </button>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mt-2 relative z-10 w-full">
                            <button
                                type="button"
                                onClick={dismissSuggestion}
                                className="py-2 inline-flex justify-center rounded-xl font-bold text-xs bg-slate-800/80 text-slate-300 hover:bg-slate-700 transition-all border border-white/5 hover:border-white/10"
                            >
                                No, Dismiss
                            </button>
                            <button
                                type="button"
                                onClick={acceptSuggestion}
                                className="py-2 inline-flex justify-center rounded-xl font-bold text-xs bg-indigo-600 text-white hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
                            >
                                Yes, Accept
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VoterSurvey;

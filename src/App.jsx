import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AgentList from './pages/AgentList';
import VoterList from './pages/VoterList';
import ClusterList from './pages/ClusterList';
import VoterSurvey from './pages/VoterSurvey';
import './index.css';

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = React.useState(false);
    const [userRole, setUserRole] = React.useState(null);

    const handleLogin = (role) => {
        setUserRole(role);
        setIsAuthenticated(true);
    };

    if (!isAuthenticated) return <Login onLogin={handleLogin} />;

    return (
        <Router>
            <div className="flex min-h-screen bg-slate-950">
                <Sidebar userRole={userRole} onLogout={() => setIsAuthenticated(false)} />
                <main className="flex-1 p-8 ml-72 overflow-auto">
                    <Routes>
                        <Route path="/" element={<Dashboard userRole={userRole} />} />
                        <Route path="/clusters" element={<ClusterList userRole={userRole} />} />
                        <Route path="/agents" element={<AgentList userRole={userRole} />} />
                        <Route path="/voters" element={<VoterList userRole={userRole} />} />
                        <Route path="/survey" element={<VoterSurvey userRole={userRole} />} />
                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
};

export default App;

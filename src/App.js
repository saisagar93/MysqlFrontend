import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import LoginPage from './components/LoginPage';
import Signup from './components/Signup';
import MainPage from './components/MainPage';
import AddRecord from './components/AddRecord';
import Dashboard from './components/Dashboard';
import ModifyRecords from './components/ModifyRecords';
import DeleteRecord from './components/DeleteRecord';
import Logout from './components/Logout';
import useDeviceDetect from './hooks/useDeviceDetect';
import './App.css';


const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const { isMobile } = useDeviceDetect();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const decoded = jwtDecode(token);
                    // Optionally check for token expiration
                    const isExpired = decoded.exp < Date.now() / 1000;
                    setIsAuthenticated(!isExpired);
                } catch (error) {
                    console.error("Error decoding token:", error);
                    setIsAuthenticated(false);
                }
            }
            setLoading(false);
        };

        checkAuth(); // Check authentication on initial render
    }, []);

    const ProtectedRoute = ({ element }) => {
        return isAuthenticated ? element : <Navigate to="/" />;
    };

    if (loading) {
        return <div>Loading...</div>; // Show a loading state while checking auth
    }

    return (
        <Router>
            <div className={`app-container ${isMobile ? 'mobile' : 'desktop'}`}>
                <Routes>
                    <Route path="/" element={<LoginPage setIsAuthenticated={setIsAuthenticated} />} />
                    <Route path="/Signup" element={<Signup element={<Signup />} />} />
                    <Route path="/main" element={<ProtectedRoute element={<MainPage />} />} />
                    <Route path="/add-record" element={<ProtectedRoute element={<AddRecord />} />} />
                    <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
                    <Route path="/modify-records" element={<ProtectedRoute element={<ModifyRecords />} />} />
                    <Route path="/delete-records" element={<ProtectedRoute element={<DeleteRecord />} />} />
                    <Route path="/logout" element={<Logout setIsAuthenticated={setIsAuthenticated} />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;

import React, { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const logoutUser = async () => {
            try {
                await axios.post(`${process.env.REACT_APP_BASE_API_URL}/logout`, {}, { withCredentials: true });
                navigate('/'); // Redirect to login page after logout
            } catch (error) {
                console.error('Error during logout:', error);
            }
        };
        logoutUser();
    }, [navigate]);

    return <p>Logging out...</p>; // Simple message while logging out
};

export default Logout;

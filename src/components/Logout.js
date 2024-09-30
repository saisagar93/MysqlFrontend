import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const logoutUser = async () => {
            try {
                await axios.post(`${process.env.REACT_APP_BASE_API_URL}/logout`, {}, { withCredentials: true });
                localStorage.removeItem('token'); // Clear the token from local storage
                navigate('/'); // Redirect to login page after logout
            } catch (error) {
                console.error('Error during logout:', error);
                setLoading(false); // Stop loading on error
            }
        };
        logoutUser();
    }, [navigate]);

    return (
        <div className="logout-container">
            {loading ? <p>Logging out...</p> : <p>Error during logout. Please try again.</p>}
        </div>
    );
};

export default Logout;

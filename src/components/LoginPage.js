import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const LoginPage = ({ setIsAuthenticated }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${process.env.REACT_APP_BASE_API_URL}/login`, { username, password }, { withCredentials: true });
            setMessage(response.data.message);
            if (response.data.user) {
                setIsAuthenticated(true);
                navigate('/main');
            }
        } catch (error) {
            setMessage(error.response ? error.response.data.message : 'Error logging in.');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'username') {
            setUsername(value);
        } else if (name === 'password') {
            setPassword(value);
        }
        setMessage(''); // Clear message on input change
    };

    return (
        <div className="containerlogin">
            <form className='loginform' onSubmit={handleSubmit}>
    <div className="mb-3 logo-container">
        <img src='almadinalogo.jpeg' alt="Logo" className="logo" /> {/* Logo before username */}
    </div>
    <div className="mb-3">
        <label className="labellogin">Login/User Id</label>
        <input
            type="text"
            className="input-fieldlogin"
            name="username"
            value={username}
            onChange={handleInputChange}
            required
            autoComplete="username"
        />
    </div>
    <div className="mb-3">
        <label className="labellogin">Password</label>
        <input
            type="password"
            className="input-fieldlogin"
            name="password"
            value={password}
            onChange={handleInputChange}
            required
            autoComplete="current-password"
        />
    </div>
    <button type="submit" className="login-button">Login</button>
    <div className="logo-container">
        <h5> Powered by </h5>
        <img src='bayanat.png' alt="Powered by" className="powered-by" /> {/* Small powered by image */}     
    </div>
</form>
    {message && <p className="message">{message}</p>}
        </div>
    );
};

export default LoginPage;

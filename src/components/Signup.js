import React, { useState } from "react";
import axios from "axios";
import "./Signup.css";
import { useNavigate } from "react-router-dom";
 
const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_API_URL}/Signup`,
        formData
      );
      setMessage(response.data.message);
      setTimeout(() => {
        setMessage('');
      }, 3000);
 
      // Check if the response message indicates success
      if (response.data.message === "Record added successfully!") {
        navigate("/"); // Navigate to the login page
      }
 
      // Optionally reset the form
      setFormData({
        username: "",
        email: "",
        password: "",
      });
    } catch (error) {
      console.error(
        "Error details:",
        error.response ? error.response.data : error.message
      );
      setMessage(
        "Error signing up: " +
          (error.response ? error.response.data.message : "Network error.")
      );
    }
  };
 
  return (
    <div className="signup-container">
      <form onSubmit={handleSubmit} className="signup-form">
        <div className="mb-3 logo-container">
          <img src="almadinalogo.jpeg" alt="Logo" className="logo" />
        </div>
        <div className="signup-input-box">
          <label>
            Username <span className="required">*</span>
          </label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="signup-input-box">
          <label>
            Email <span className="required">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="signup-input-box">
          <label>
            Password <span className="required">*</span>
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="login-button">
          Create account
        </button>
 
        <div className="logo-container">
          <h5> Powered by </h5>
          <img src="bayanat.png" alt="Powered by" className="powered-by" />
        </div>
      </form>
      {message && <div className="signup-message">{message}</div>}
    </div>
  );
};
 
export default Signup;
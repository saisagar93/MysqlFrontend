// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate } from 'react-router-dom'
// //import "./Signup.css";

// const Signup = () => {
//   const [formData, setFormData] = useState({
//     username: "",
//     email: "",
//     password: "",
//   });
//   const [message, setMessage] = useState("");

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post(
//         `${process.env.REACT_APP_BASE_API_URL}/Signup`,
//         formData
//       );
//       setMessage(response.data.message);
//       // Optionally reset the form
//       setFormData({
//         username: "",
//         email: "",
//         password: "",
//       });
//     } catch (error) {
//       console.error(
//         "Error details:",
//         error.response ? error.response.data : error.message
//       );
//       setMessage(
//         "Error signing up: " +
//           (error.response ? error.response.data.message : "Network error.")
//       );
//     }
//   };

//   return (
//     <div className="container-signup">
//       <header>Sign Up</header>
//       <form onSubmit={handleSubmit} className="form">
//         <div className="input-box">
//           <label>
//             Username <span className="required">*</span>
//           </label>
//           <input
//             type="text"
//             name="username"
//             value={formData.username}
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <div className="input-box">
//           <label>
//             Email <span className="required">*</span>
//           </label>
//           <input
//             type="email"
//             name="email"
//             value={formData.email}
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <div className="input-box">
//           <label>
//             Password <span className="required">*</span>
//           </label>
//           <input
//             type="password"
//             name="password"
//             value={formData.password}
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <button type="submit" className="submit-button-signup">
//           Sign Up
//         </button>
//         {message && <div className="message-signup">{message}</div>}
//       </form>
//     </div>
//   );
// };

// export default Signup;

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
 
      // Check if the response message indicates success
      if (response.data.message === "Record added successfully!") {
        // Show alert and navigate after user clicks "OK"
        window.alert(response.data.message);
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
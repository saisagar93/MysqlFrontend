// import React, { useState, useEffect } from 'react';
// import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
// import LoginPage from './components/LoginPage';
// import MainPage from './components/MainPage';
// import AddRecord from './components/AddRecord';
// import Dashboard from './components/Dashboard';
// import Logout from './components/Logout';
// import useDeviceDetect from './hooks/useDeviceDetect';
// import './App.css';

// const App = () => {
//     const [isAuthenticated, setIsAuthenticated] = useState(false);
//     const { isMobile } = useDeviceDetect();

//     useEffect(() => {
//         const checkAuth = () => {
//             const cookie = document.cookie.match(/connect\.sid/);
//             setIsAuthenticated(!!cookie);
//         };
        
//         checkAuth(); // Check on initial render

//         // You may also want to set an interval or similar to recheck authentication if needed
//     }, []);

//     const ProtectedRoute = ({ element }) => {
//         return isAuthenticated ? element : <Navigate to="/" />;
//     };

//     return (
//         <Router>
//             <div className={`app-container ${isMobile ? 'mobile' : 'desktop'}`}>
//                 <Routes>
//                     <Route path="/" element={<LoginPage setIsAuthenticated={setIsAuthenticated} />} />
//                     <Route path="/main" element={<ProtectedRoute element={<MainPage />} />} />
//                     <Route path="/add-record" element={<ProtectedRoute element={<AddRecord />} />} />
//                     <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
//                     <Route path="/logout" element={<Logout setIsAuthenticated={setIsAuthenticated} />} />
//                 </Routes>
//             </div>
//         </Router>
//     );
// };

// export default App; sse below ss
// import React, { useState, useEffect } from 'react';
// import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
// import LoginPage from './components/LoginPage';
// import MainPage from './components/MainPage';
// import AddRecord from './components/AddRecord';
// import Dashboard from './components/Dashboard';
// import Logout from './components/Logout';
// import useDeviceDetect from './hooks/useDeviceDetect';
// import './App.css';

// const App = () => {
//     const [isAuthenticated, setIsAuthenticated] = useState(false);
//     const { isMobile } = useDeviceDetect();

//     useEffect(() => {
//         const checkAuth = () => {
//             const cookie = document.cookie.match(/connect\.sid/);
//             setIsAuthenticated(!!cookie);
//         };
        
//         checkAuth(); // Check on initial render

//         // Optional: Use a timer to recheck authentication status
//         const interval = setInterval(checkAuth, 60000); // Check every minute

//         return () => clearInterval(interval); // Clean up on unmount
//     }, []);

//     const ProtectedRoute = ({ element }) => {
//         return isAuthenticated ? element : <Navigate to="/" />;
//     };

//     return (
//         <Router>
//             <div className={`app-container ${isMobile ? 'mobile' : 'desktop'}`}>
//                 <Routes>
//                     <Route path="/" element={<LoginPage setIsAuthenticated={setIsAuthenticated} />} />
//                     <Route path="/main" element={<ProtectedRoute element={<MainPage />} />} />
//                     <Route path="/add-record" element={<ProtectedRoute element={<AddRecord />} />} />
//                     <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
//                     <Route path="/logout" element={<Logout setIsAuthenticated={setIsAuthenticated} />} />
//                 </Routes>
//             </div>
//         </Router>
//     );
// };

// export default App;
// import React, { useState, useEffect } from 'react';
// import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
// import LoginPage from './components/LoginPage';
// import MainPage from './components/MainPage';
// import AddRecord from './components/AddRecord';
// import Dashboard from './components/Dashboard';
// import Logout from './components/Logout';
// import useDeviceDetect from './hooks/useDeviceDetect';
// import './App.css';

// const App = () => {
//     const [isAuthenticated, setIsAuthenticated] = useState(false);
//     const { isMobile } = useDeviceDetect();
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         const checkAuth = () => {
//             try {
//                 const cookie = document.cookie.match(/connect\.sid/);
//                 setIsAuthenticated(!!cookie);
//             } catch (error) {
//                 console.error("Error checking authentication:", error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         checkAuth(); // Check authentication on initial render
//     }, []);

//     const ProtectedRoute = ({ element }) => {
//         return isAuthenticated ? element : <Navigate to="/" />;
//     };

//     if (loading) {
//         return <div>Loading...</div>; // Show a loading state while checking auth
//     }

//     return (
//         <Router>
//             <div className={`app-container ${isMobile ? 'mobile' : 'desktop'}`}>
//                 <Routes>
//                     <Route path="/" element={<LoginPage setIsAuthenticated={setIsAuthenticated} />} />
//                     <Route path="/main" element={<ProtectedRoute element={<MainPage />} />} />
//                     <Route path="/add-record" element={<ProtectedRoute element={<AddRecord />} />} />
//                     <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
//                     <Route path="/logout" element={<Logout setIsAuthenticated={setIsAuthenticated} />} />
//                 </Routes>
//             </div>
//         </Router>
//     );
// };

// export default App;
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import MainPage from './components/MainPage';
import AddRecord from './components/AddRecord';
import Dashboard from './components/Dashboard';
import ModifyRecords from './components/ModifyRecords';
import Logout from './components/Logout';
import useDeviceDetect from './hooks/useDeviceDetect';
import './App.css';

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const { isMobile } = useDeviceDetect();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = () => {
            try {
                const cookie = document.cookie.match(/connect\.sid/);
                setIsAuthenticated(!!cookie);
            } catch (error) {
                console.error("Error checking authentication:", error);
            } finally {
                setLoading(false);
            }
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
                    <Route path="/main" element={<ProtectedRoute element={<MainPage />} />} />
                    <Route path="/add-record" element={<ProtectedRoute element={<AddRecord />} />} />
                    <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
                    <Route path="/modify-records" element={<ProtectedRoute element={<ModifyRecords />} />} /> {/* New route */}
                    <Route path="/logout" element={<Logout setIsAuthenticated={setIsAuthenticated} />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;

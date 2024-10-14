import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Mainpage.css';

const MainPage = () => {
    const navigate = useNavigate();

    // Function to handle navigation to Add Components form
    const goToAddComponents = () => {
        navigate('/add-record'); // Navigate to AddRecord form
    };

    // Function to handle navigation to Dashboard
    const goToDashboard = () => {
        navigate('/dashboard'); // Navigate to Dashboard
    };

    // Function to handle navigation to Modify Records
    const goToModifyRecords = () => {
        navigate('/modify-records'); // Navigate to Modify Records component
    };

    const goToDeleteRecord = () => {
        navigate('/delete-records'); // Navigate to Modify Records component
    };

    // Function to handle logout
    const handleLogout = () => {
        localStorage.removeItem('token'); // Remove token from localStorage
        navigate('/'); // Redirect to the login page after logout
    };

    return (
        <div className="containermainpage">
            <div className="row">
                <div className="col">
                    <button className="btn btn-primarymain" onClick={goToAddComponents}>
                        Add Record
                    </button>
                </div>
                <div className="col">
                    <button className="btn btn-secondarymain" onClick={goToDashboard}>
                        Dashboard
                    </button>
                </div>
                <div className="col">
                    <button className="btn btn-infomain" onClick={goToModifyRecords}>
                        Modify Records
                    </button>
                </div>
                <div className="col">
                    <button className="btn btn-delete" onClick={goToDeleteRecord}>
                        Delete Records
                    </button>
                </div>
                <div className="col">
                    <button className="btn btn-dangermain" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MainPage;

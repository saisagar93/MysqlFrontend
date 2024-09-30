import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment-timezone';
import { useNavigate } from 'react-router-dom';
import './ModifyRecords.css';

const ModifyRecords = () => {
    const navigate = useNavigate();
    const [filteredRecords, setFilteredRecords] = useState([]);
    const [formData, setFormData] = useState({
        tracker: '',
        sjm: '',
        journey_Plane_No: '',
        journey_Plane_Date: '',
        scheduled_Vehicle: '',
        carrier: '',
        jp_Status: '',
        next_Arrival_Date: '',
        next_Point: '',
        ivms_Check_Date: '',
        ivms_Point: '',
        destination: '',
        offload_Point: '',
        driver_Name: '',
        remarks: '',
        accommodation: '',
        jm: '',
        item_Type: '',
    });
    const [message, setMessage] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const statusOptions = [
        { value: 'In Transit', label: 'In Transit' },
        { value: 'CLOSED', label: 'CLOSED' },
    ];

    useEffect(() => {
        fetchRecords();
    }, []);

    const fetchRecords = async () => {
        try {
            setIsLoading(true);
            const token = localStorage.getItem("token");
            const response = await axios.get(`${process.env.REACT_APP_BASE_API_URL}/dashboard`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const filtered = response.data.filter(item => item.JP_STATUS !== 'CLOSED');
            setFilteredRecords(filtered);
            setMessage('Records fetched successfully!');
        } catch (error) {
            console.error('Error fetching records:', error);
            setMessage('Error fetching records. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSelect = (record) => {
        setFormData({
            tracker: record.TRACKER || '',
            sjm: record.SJM || '',
            journey_Plane_No: record.JOURNEY_PLANE_NO || '',
            journey_Plane_Date: formatDateForInput(record.JOURNEY_PLANE_DATE),
            scheduled_Vehicle: record.SCHEDULED_VEHICLE || '',
            carrier: record.CARRIER || '',
            jp_Status: record.JP_STATUS || '',
            next_Arrival_Date: formatDateForInput(record.NEXT_ARRIVAL_DATE),
            next_Point: record.NEXT_POINT || '',
            ivms_Check_Date: formatDateForInput(record.IVMS_CHECK_DATE),
            ivms_Point: record.IVMS_POINT || '',
            destination: record.DESTINATION || '',
            offload_Point: record.OFFLOAD_POINT || '',
            driver_Name: record.DRIVER_NAME || '',
            remarks: record.REMARKS || '',
            accommodation: record.ACCOMMODATION || '',
            jm: record.JM || '',
            item_Type: record.ITEM_TYPE || '',
        });
        setIsEditing(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value.toUpperCase(), // Maintain uppercase formatting
        }));
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            if (!formData.journey_Plane_No) {
                setMessage('Journey Plane No is required for updating.');
                return;
            }
            const token = localStorage.getItem("token");
            await axios.put(`${process.env.REACT_APP_BASE_API_URL}/modifyRecord/${formData.journey_Plane_No}`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage('Record updated successfully!');
            
            await fetchRecords(); // Ensure the latest data is fetched
            
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating record:', error);
            setMessage('Error updating record. Please try again.');
        }
    };
    
    const handleDelete = async () => {
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`${process.env.REACT_APP_BASE_API_URL}/deleteRecord/${formData.journey_Plane_No}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage('Record deleted successfully!');
    
            await fetchRecords(); // Ensure the latest data is fetched
            
            setIsEditing(false);
        } catch (error) {
            console.error('Error deleting record:', error);
            setMessage('Error deleting record. Please try again.');
        }
    };
    
    const handleGoToMain = () => {
        navigate('/main');
    };

    const formatDateForInput = (dateString) => {
        if (!dateString) return '';
        return moment(dateString).format('YYYY-MM-DDTHH:mm');
    };

    const formatDateTime = (dateString) => {
        if (!dateString) return 'N/A';
        return moment(dateString).format('DD/MM/YYYY HH:mm:ss');
    };

    return (
        <div className="modify-records-wrapper">
            <header className="modify-records-header">
                <div className="modify-button-group">
                    <button className="modify-btn modify-btn-primary" onClick={handleGoToMain}>
                        Main Page
                    </button>
                </div>
            </header>
            {isLoading ? (
                <p>Loading records...</p>
            ) : isEditing ? (
                <form onSubmit={handleUpdate} className="modify-edit-form">
                    <h4>Edit Record</h4>
                    {Object.keys(formData).map(key => (
                        <div className="modify-form-group" key={key}>
                            <label className="modify-form-label">{key.replace(/_/g, ' ').toUpperCase()}</label>
                            {key === 'jp_Status' ? (
                                <select
                                    className="modify-form-control"
                                    name={key}
                                    value={formData[key] || ''}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select Status</option>
                                    {statusOptions.map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <input
                                    type={key.includes('Date') ? 'datetime-local' : 'text'}
                                    className="modify-form-control"
                                    name={key}
                                    value={formData[key] || ''}
                                    onChange={handleChange}
                                    autoComplete="off"
                                    required={key === 'journey_Plane_No'}
                                    style={{ textTransform: 'uppercase' }}
                                />
                            )}
                        </div>
                    ))}
                    <div className="modify-button-group-main">
                        <button type="submit" className="modify-btn modify-btn-primary">Update Record</button>
                        <button type="button" className="modify-btn modify-btn-danger" onClick={handleDelete}>Delete Record</button>
                        <button type="button" className="modify-btn modify-btn-secondary" onClick={() => setIsEditing(false)}>Cancel</button>
                    </div>
                </form>
            ) : (
                <div className="modify-record-table-container">
                    <table className="modify-record-table">
                        <thead>
                            <tr>
                                <th>Journey Plan No</th>
                                <th>Journey Manager</th>
                                <th>Tracker</th>
                                <th>Truck</th>
                                <th>Driver Name</th>
                                <th>Last IVMS POINT</th>
                                <th>Last Check Time</th>
                                <th>Next Point</th>
                                <th>Next Arrival Time</th>
                                <th>OFFLOAD POINT</th>
                                <th>EDIT</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRecords.map((record) => (
                                <tr key={record.JOURNEY_PLANE_NO}>
                                    <td>{record.JOURNEY_PLANE_NO}</td>
                                    <td>{record.SJM}</td>
                                    <td>{record.TRACKER}</td>
                                    <td>{record.SCHEDULED_VEHICLE}</td>
                                    <td>{record.DRIVER_NAME}</td>
                                    <td>{record.IVMS_POINT}</td>
                                    <td>{formatDateTime(record.IVMS_CHECK_DATE)}</td>
                                    <td>{record.NEXT_POINT}</td>
                                    <td>{formatDateTime(record.NEXT_ARRIVAL_DATE)}</td>
                                    <td>{record.OFFLOAD_POINT}</td>
                                    <td>
                                        <button onClick={() => handleSelect(record)} className="modify-btn modify-btn-info">Edit</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            {message && <p className="modify-message">{message}</p>}
        </div>
    );
};

export default ModifyRecords;

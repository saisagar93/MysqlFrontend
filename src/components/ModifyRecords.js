// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import moment from 'moment-timezone';
// import { useNavigate } from 'react-router-dom';
// import './ModifyRecords.css';

// const ModifyRecords = () => {
//     const navigate = useNavigate();
//     const [filteredRecords, setFilteredRecords] = useState([]);
//     const [formData, setFormData] = useState({
//         tracker: '',
//         sjm: '',
//         journey_Plane_No: '',
//         journey_Plane_Date: '',
//         scheduled_Vehicle: '',
//         carrier: '',
//         jp_Status: '',
//         next_Arrival_Date: '',
//         next_Point: '',
//         ivms_Check_Date: '',
//         ivms_Point: '',
//         destination: '',
//         offload_Point: '',
//         driver_Name: '',
//         remarks: '',
//         accommodation: '',
//         jm: '',
//         item_Type: '',
//     });
//     const [message, setMessage] = useState('');
//     const [isEditing, setIsEditing] = useState(false);
//     const [isLoading, setIsLoading] = useState(true);

//     const statusOptions = [
//         { value: 'In Transit', label: 'In Transit' },
//         { value: 'CLOSED', label: 'CLOSED' },
//     ];

//     useEffect(() => {
//         fetchRecords();
//     }, []);

//     const fetchRecords = async () => {
//         try {
//             setIsLoading(true);
//             const token = localStorage.getItem("token");
//             const response = await axios.get(`${process.env.REACT_APP_BASE_API_URL}/dashboard`, {
//                 headers: { Authorization: `Bearer ${token}` }
//             });
//             const filtered = response.data.filter(item => item.JP_STATUS !== 'CLOSED');
//             setFilteredRecords(filtered);
//             setMessage('Records fetched successfully!');
//         } catch (error) {
//             console.error('Error fetching records:', error);
//             setMessage('Error fetching records. Please try again.');
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const handleSelect = (record) => {
//         setFormData({
//             tracker: record.TRACKER || '',
//             sjm: record.SJM || '',
//             journey_Plane_No: record.JOURNEY_PLANE_NO || '',
//             journey_Plane_Date: formatDateForInput(record.JOURNEY_PLANE_DATE),
//             scheduled_Vehicle: record.SCHEDULED_VEHICLE || '',
//             carrier: record.CARRIER || '',
//             jp_Status: record.JP_STATUS || '',
//             next_Arrival_Date: formatDateForInput(record.NEXT_ARRIVAL_DATE),
//             next_Point: record.NEXT_POINT || '',
//             ivms_Check_Date: formatDateForInput(record.IVMS_CHECK_DATE),
//             ivms_Point: record.IVMS_POINT || '',
//             destination: record.DESTINATION || '',
//             offload_Point: record.OFFLOAD_POINT || '',
//             driver_Name: record.DRIVER_NAME || '',
//             remarks: record.REMARKS || '',
//             accommodation: record.ACCOMMODATION || '',
//             jm: record.JM || '',
//             item_Type: record.ITEM_TYPE || '',
//         });
//         setIsEditing(true);
//     };

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData(prevData => ({
//             ...prevData,
//             [name]: value.toUpperCase(), // Maintain uppercase formatting
//         }));
//     };

//     const handleUpdate = async (e) => {
//         e.preventDefault();
//         try {
//             if (!formData.journey_Plane_No) {
//                 setMessage('Journey Plane No is required for updating.');
//                 return;
//             }
//             const token = localStorage.getItem("token");
//             await axios.put(`${process.env.REACT_APP_BASE_API_URL}/modifyRecord/${formData.journey_Plane_No}`, formData, {
//                 headers: { Authorization: `Bearer ${token}` }
//             });
//             setMessage('Record updated successfully!');
            
//             await fetchRecords(); // Ensure the latest data is fetched
            
//             setIsEditing(false);
//         } catch (error) {
//             console.error('Error updating record:', error);
//             setMessage('Error updating record. Please try again.');
//         }
//     };
    
    // const handleDelete = async () => {
    //     try {
    //         const token = localStorage.getItem("token");
    //         await axios.delete(`${process.env.REACT_APP_BASE_API_URL}/deleteRecord/${formData.journey_Plane_No}`, {
    //             headers: { Authorization: `Bearer ${token}` }
    //         });
    //         setMessage('Record deleted successfully!');
    
    //         await fetchRecords(); // Ensure the latest data is fetched
            
    //         setIsEditing(false);
    //     } catch (error) {
    //         console.error('Error deleting record:', error);
    //         setMessage('Error deleting record. Please try again.');
    //     }
    // };
    
//     const handleGoToMain = () => {
//         navigate('/main');
//     };

//     const formatDateForInput = (dateString) => {
//         if (!dateString) return '';
//         return moment(dateString).format('YYYY-MM-DDTHH:mm');
//     };

//     const formatDateTime = (dateString) => {
//         if (!dateString) return 'N/A';
//         return moment(dateString).format('DD/MM/YYYY HH:mm:ss');
//     };

//     return (
//         <div className="modify-records-wrapper">
//             <header className="modify-records-header">
//                 <div className="modify-button-group">
//                     <button className="modify-btn modify-btn-primary" onClick={handleGoToMain}>
//                         Main Page
//                     </button>
//                 </div>
//             </header>
//             {isLoading ? (
//                 <p>Loading records...</p>
//             ) : isEditing ? (
//                 <form onSubmit={handleUpdate} className="modify-edit-form">
//                     <h4>Edit Record</h4>
//                     {Object.keys(formData).map(key => (
//                         <div className="modify-form-group" key={key}>
//                             <label className="modify-form-label">{key.replace(/_/g, ' ').toUpperCase()}</label>
//                             {key === 'jp_Status' ? (
//                                 <select
//                                     className="modify-form-control"
//                                     name={key}
//                                     value={formData[key] || ''}
//                                     onChange={handleChange}
//                                     required
//                                 >
//                                     <option value="">Select Status</option>
//                                     {statusOptions.map(option => (
//                                         <option key={option.value} value={option.value}>
//                                             {option.label}
//                                         </option>
//                                     ))}
//                                 </select>
//                             ) : (
//                                 <input
//                                     type={key.includes('Date') ? 'datetime-local' : 'text'}
//                                     className="modify-form-control"
//                                     name={key}
//                                     value={formData[key] || ''}
//                                     onChange={handleChange}
//                                     autoComplete="off"
//                                     required={key === 'journey_Plane_No'}
//                                     style={{ textTransform: 'uppercase' }}
//                                 />
//                             )}
//                         </div>
//                     ))}
//                     <div className="modify-button-group-main">
//                         <button type="submit" className="modify-btn modify-btn-primary">Update Record</button>
//                         <button type="button" className="modify-btn modify-btn-danger" onClick={handleDelete}>Delete Record</button>
//                         <button type="button" className="modify-btn modify-btn-secondary" onClick={() => setIsEditing(false)}>Cancel</button>
//                     </div>
//                 </form>
//             ) : (
//                 <div className="modify-record-table-container">
//                     <table className="modify-record-table">
//                         <thead>
//                             <tr>
//                                 <th>Journey Plan No</th>
//                                 <th>Journey Manager</th>
//                                 <th>Tracker</th>
//                                 <th>Truck</th>
//                                 <th>Driver Name</th>
//                                 <th>Last IVMS POINT</th>
//                                 <th>Last Check Time</th>
//                                 <th>Next Point</th>
//                                 <th>Next Arrival Time</th>
//                                 <th>Offload Point</th>
//                                 <th>Edit</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {filteredRecords.map((record) => (
//                                 <tr key={record.JOURNEY_PLANE_NO}>
//                                     <td>{record.JOURNEY_PLANE_NO}</td>
//                                     <td>{record.SJM}</td>
//                                     <td>{record.TRACKER}</td>
//                                     <td>{record.SCHEDULED_VEHICLE}</td>
//                                     <td>{record.DRIVER_NAME}</td>
//                                     <td>{record.IVMS_POINT}</td>
//                                     <td>{formatDateTime(record.IVMS_CHECK_DATE)}</td>
//                                     <td>{record.NEXT_POINT}</td>
//                                     <td>{formatDateTime(record.NEXT_ARRIVAL_DATE)}</td>
//                                     <td>{record.OFFLOAD_POINT}</td>
//                                     <td>
//                                         <button onClick={() => handleSelect(record)} className="modify-btn modify-btn-info">Edit</button>
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>
//             )}
//             {message && <p className="modify-message">{message}</p>}
//         </div>
//     );
// };

// export default ModifyRecords;   old well code 

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import moment from 'moment-timezone';
// import { useNavigate } from 'react-router-dom';
// import './ModifyRecords.css';

// const ModifyRecords = () => {
//     const navigate = useNavigate();
//     const [filteredRecords, setFilteredRecords] = useState([]);
//     const [formData, setFormData] = useState({
//         tracker: '',
//         sjm: '',
//         journey_Plane_No: '',
//         journey_Plane_Date: '',
//         scheduled_Vehicle: '',
//         carrier: '',
//         jp_Status: '',
//         next_Arrival_Date: '',
//         next_Point: '',
//         ivms_Check_Date: '',
//         ivms_Point: '',
//         destination: '',
//         offload_Point: '',
//         driver_Name: '',
//         remarks: '',
//         accommodation: '',
//         jm: '',
//         item_Type: '',
//     });
//     const [message, setMessage] = useState('');
//     const [isEditing, setIsEditing] = useState(false);
//     const [isLoading, setIsLoading] = useState(true);
//     const [selectedStatus, setSelectedStatus] = useState('IN TRANSIT'); // Default status

//     const statusOptions = [
//         { value: 'IN TRANSIT', label: 'IN TRANSIT' },
//         { value: 'CLOSED', label: 'CLOSED' },
//         // Add more options as needed
//     ];

//     useEffect(() => {
//         fetchRecords();
//     }, [selectedStatus]); // Fetch records when selectedStatus changes

//     const fetchRecords = async () => {
//         try {
//             setIsLoading(true);
//             const token = localStorage.getItem("token");
//             const response = await axios.get(`${process.env.REACT_APP_BASE_API_URL}/dashboard`, {
//                 headers: { Authorization: `Bearer ${token}` }
//             });
//             const filtered = response.data.filter(item => item.JP_STATUS === selectedStatus);
//             setFilteredRecords(filtered);
//         } catch (error) {
//             console.error('Error fetching records:', error);
//             setMessage('Error fetching records. Please try again.');
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const handleSelect = (record) => {
//         setFormData({
//             tracker: record.TRACKER || '',
//             sjm: record.SJM || '',
//             journey_Plane_No: record.JOURNEY_PLANE_NO || '',
//             journey_Plane_Date: formatDateForInput(record.JOURNEY_PLANE_DATE),
//             scheduled_Vehicle: record.SCHEDULED_VEHICLE || '',
//             carrier: record.CARRIER || '',
//             jp_Status: record.JP_STATUS || '',
//             next_Arrival_Date: formatDateForInput(record.NEXT_ARRIVAL_DATE),
//             next_Point: record.NEXT_POINT || '',
//             ivms_Check_Date: formatDateForInput(record.IVMS_CHECK_DATE),
//             ivms_Point: record.IVMS_POINT || '',
//             destination: record.DESTINATION || '',
//             offload_Point: record.OFFLOAD_POINT || '',
//             driver_Name: record.DRIVER_NAME || '',
//             remarks: record.REMARKS || '',
//             accommodation: record.ACCOMMODATION || '',
//             jm: record.JM || '',
//             item_Type: record.ITEM_TYPE || '',
//         });
//         setIsEditing(true);
//     };

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData(prevData => ({
//             ...prevData,
//             [name]: value.toUpperCase(), // Maintain uppercase formatting
//         }));
//     };

//     const handleStatusChange = (e) => {
//         setSelectedStatus(e.target.value); // Update selected status
//     };

//     const handleUpdate = async (e) => {
//         e.preventDefault();
//         try {
//             if (!formData.journey_Plane_No) {
//                 setMessage('Journey Plane No is required for updating.');
//                 return;
//             }
//             const token = localStorage.getItem("token");
//             await axios.put(`${process.env.REACT_APP_BASE_API_URL}/modifyRecord/${formData.journey_Plane_No}`, formData, {
//                 headers: { Authorization: `Bearer ${token}` }
//             });
//             setMessage('Record updated successfully!');
            
//             await fetchRecords(); // Ensure the latest data is fetched
            
//             setIsEditing(false);
//         } catch (error) {
//             console.error('Error updating record:', error);
//             setMessage('Error updating record. Please try again.');
//         }
//     };
    
//     const handleDelete = async () => {
//         try {
//             const token = localStorage.getItem("token");
//             await axios.delete(`${process.env.REACT_APP_BASE_API_URL}/deleteRecord/${formData.journey_Plane_No}`, {
//                 headers: { Authorization: `Bearer ${token}` }
//             });
//             setMessage('Record deleted successfully!');
    
//             await fetchRecords(); // Ensure the latest data is fetched
            
//             setIsEditing(false);
//         } catch (error) {
//             console.error('Error deleting record:', error);
//             setMessage('Error deleting record. Please try again.');
//         }
//     };
    
//     const handleGoToMain = () => {
//         navigate('/main');
//     };

//     const formatDateForInput = (dateString) => {
//         if (!dateString) return '';
//         return moment(dateString).format('YYYY-MM-DDTHH:mm');
//     };

//     const formatDateTime = (dateString) => {
//         if (!dateString) return 'N/A';
//         return moment(dateString).format('DD/MM/YYYY HH:mm:ss');
//     };

//     return (
//         <div className="modify-records-wrapper">
//             <header className="modify-records-header">
//                 <div className="modify-button-group">
//                     <button className="modify-btn modify-btn-primary" onClick={handleGoToMain}>
//                         Main Page
//                     </button>
//                 </div>
//                 <div className="status-filter">
//                     <label htmlFor="statusSelect">Filter by Status:</label>
//                     <select id="statusSelect" value={selectedStatus} onChange={handleStatusChange}>
//                         {statusOptions.map(option => (
//                             <option key={option.value} value={option.value}>
//                                 {option.label}
//                             </option>
//                         ))}
//                     </select>
//                 </div>
//             </header>
//             {isLoading ? (
//                 <p>Loading records...</p>
//             ) : isEditing ? (
//                 <form onSubmit={handleUpdate} className="form-grid mannual_form_grid">
//                     <h4>Edit Record</h4>
//                     {Object.keys(formData).map(key => (
//                         <div className="modify-form-group" key={key}>
//                             <label className="form-label-addrecord">{key.replace(/_/g, ' ').toUpperCase()}</label>
//                             {key === 'jp_Status' ? (
//                                 <select
//                                     className="form-input-addrecord"
//                                     name={key}
//                                     value={formData[key] || ''}
//                                     onChange={handleChange}
//                                     required
//                                 >
//                                     <option value="">Select Status</option>
//                                     {statusOptions.map(option => (
//                                         <option key={option.value} value={option.value}>
//                                             {option.label}
//                                         </option>
//                                     ))}
//                                 </select>
//                             ) : (
//                                 <input
//                                     type={key.includes('Date') ? 'datetime-local' : 'text'}
//                                     className="form-input-addrecord"
//                                     name={key}
//                                     value={formData[key] || ''}
//                                     onChange={handleChange}
//                                     autoComplete="off"
//                                     required={key === 'journey_Plane_No'}
//                                     style={{ textTransform: 'uppercase' }}
//                                 />
//                             )}
//                         </div>
//                     ))}
//                     <div className="modify-button-group-main">
//                         <button type="submit" className="modify-btn modify-btn-primary">Update Record</button>
//                         <button type="button" className="modify-btn modify-btn-danger" onClick={handleDelete}>Delete Record</button>
//                         <button type="button" className="modify-btn modify-btn-secondary" onClick={() => setIsEditing(false)}>Cancel</button>
//                     </div>
//                 </form>
//             ) : (
//                 <div className="modify-record-table-container">
//                     <table className="modify-record-table">
//                         <thead>
//                             <tr>
//                                 <th>Journey Plan No</th>
//                                 <th>Journey Manager</th>
//                                 <th>Tracker</th>
//                                 <th>Truck</th>
//                                 <th>Driver Name</th>
//                                 <th>Last IVMS POINT</th>
//                                 <th>Last Check Time</th>
//                                 <th>Next Point</th>
//                                 <th>Next Arrival Time</th>
//                                 <th>Offload Point</th>
//                                 <th>Edit</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {filteredRecords.map((record) => (
//                                 <tr key={record.JOURNEY_PLANE_NO}>
//                                     <td>{record.JOURNEY_PLANE_NO}</td>
//                                     <td>{record.SJM}</td>
//                                     <td>{record.TRACKER}</td>
//                                     <td>{record.SCHEDULED_VEHICLE}</td>
//                                     <td>{record.DRIVER_NAME}</td>
//                                     <td>{record.IVMS_POINT}</td>
//                                     <td>{formatDateTime(record.IVMS_CHECK_DATE)}</td>
//                                     <td>{record.NEXT_POINT}</td>
//                                     <td>{formatDateTime(record.NEXT_ARRIVAL_DATE)}</td>
//                                     <td>{record.OFFLOAD_POINT}</td>
//                                     <td>
//                                         <button onClick={() => handleSelect(record)} className="modify-btn modify-btn-edit">
//                                             Edit
//                                         </button>
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                     {filteredRecords.length === 0 && <p>No records found for the selected status.</p>}
//                 </div>
//             )}
//             {message && <div className="modify-message">{message}</div>}
//         </div>
//     );
// };

// export default ModifyRecords;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment-timezone';
import { useNavigate } from 'react-router-dom';
import './ModifyRecords.css';

const ModifyRecords = () => {
    const navigate = useNavigate();
    const [filteredRecords, setFilteredRecords] = useState([]);
    const [formData, setFormData] = useState({
        journey_Plane_No: '',
        journey_Plane_Date: '',
        jp_Status: '',
        scheduled_Vehicle: '',
        carrier: '',
        next_Point: '',
        next_Arrival_Date: '',
        ivms_Point: '',
        ivms_Check_Date: '',
        offload_Point: '',
        destination: '',
        driver_Name: '',
        accommodation: '',
        jm: '',
        sjm: '',
        tracker: '',
        remarks: '',
    });
    const [dropdownData, setDropdownData] = useState({
        journeyPlaneNos: [],
        scheduledVehicles: [],
        carriers: [],
        nextPoints: [],
        ivmsPoints: [],
        offloadPoints: [],
        destinations: [],
        driverNames: [],
        sjms: [],
        trackers: [],
    });
    const [message, setMessage] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedStatus, setSelectedStatus] = useState('IN TRANSIT');

    useEffect(() => {
        fetchRecords();
        fetchDropdownData();
    }, [selectedStatus]);

    const fetchRecords = async () => {
        try {
            setIsLoading(true);
            const token = localStorage.getItem("token");
            const response = await axios.get(`${process.env.REACT_APP_BASE_API_URL}/dashboard`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const filtered = response.data.filter(item => item.JP_STATUS === selectedStatus);
            setFilteredRecords(filtered);
        } catch (error) {
            console.error('Error fetching records:', error);
            setMessage('Error fetching records. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchDropdownData = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`${process.env.REACT_APP_BASE_API_URL}/dashboarddropdown`, {
                headers: { Authorization: `Bearer ${token}` }
            });
    
            console.log('dropdown data', response.data);   
    
            const results = response.data; // Store the fetched data
    
            // Set the dropdown data based on the results
            setDropdownData({
                trackers: [...new Set(results.map((item) => item.tracker))],
                sjms: [...new Set(results.map((item) => item.sjm))],
                journeyPlaneNos: [...new Set(results.map((item) => item.journey_Plane_No))],
                scheduledVehicles: [...new Set(results.map((item) => item.scheduled_Vehicle))],
                carriers: [...new Set(results.map((item) => item.carrier))],
                nextPoints: [...new Set(results.map((item) => item.next_Point))],
                ivmsPoints: [...new Set(results.map((item) => item.ivms_Point))],
                destinations: [...new Set(results.map((item) => item.destination))],
                offloadPoints: [...new Set(results.map((item) => item.offload_Point))],
                driverNames: [...new Set(results.map((item) => item.driver_Name))],
            });
            
        } catch (error) {
            console.error('Error fetching dropdown data:', error);
        }
    };
    

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value.toUpperCase(),
        }));
    };

    const handleStatusChange = (e) => {
        setSelectedStatus(e.target.value);
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
            alert('Record updated successfully!'); // Alert for success
            await fetchRecords();
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
            alert('Record deleted successfully!'); // Alert for success
            await fetchRecords(); // Ensure the latest data is fetched
            
            setIsEditing(false);
        } catch (error) {
            console.error('Error deleting record:', error);
            setMessage('Error deleting record. Please try again.');
        }
    };

    const handleSelect = (record) => {
        setFormData({
            journey_Plane_No: record.JOURNEY_PLANE_NO || '',
            journey_Plane_Date: formatDateForInput(record.JOURNEY_PLANE_DATE),
            jp_Status: record.JP_STATUS || '',
            scheduled_Vehicle: record.SCHEDULED_VEHICLE || '',
            carrier: record.CARRIER || '',
            next_Point: record.NEXT_POINT || '',
            next_Arrival_Date: formatDateForInput(record.NEXT_ARRIVAL_DATE),
            ivms_Point: record.IVMS_POINT || '',
            ivms_Check_Date: formatDateForInput(record.IVMS_CHECK_DATE),
            offload_Point: record.OFFLOAD_POINT || '',
            destination: record.DESTINATION || '',
            driver_Name: record.DRIVER_NAME || '',
            accommodation: record.ACCOMMODATION || '',
            jm: record.JM || '',
            sjm: record.SJM || '',
            tracker: record.TRACKER || '',
            remarks: record.REMARKS || '',
        });
        setIsEditing(true);
    };

    const formatDateForInput = (dateString) => {
        if (!dateString) return '';
        return moment(dateString).format('YYYY-MM-DDTHH:mm');
    };

    const formatDateTime = (dateString) => {
        if (!dateString) return '';
        return moment(dateString).format('YYYY-MM-DD HH:mm');
    };

    return (
        <div className="modify-records-wrapper">
            <header className="modify-records-header">
                <div className="modify-button-group">
                    <button className="modify-btn modify-btn-primary" onClick={() => navigate('/main')}>
                        Main Page
                    </button>
                </div>
                {!isEditing && (
                    <div className="status-filter">
                        <label htmlFor="statusSelect">Filter By Status:</label>
                        <select id="statusSelect" value={selectedStatus} onChange={handleStatusChange}>
                            <option value="IN TRANSIT">IN TRANSIT</option>
                            <option value="CLOSED">CLOSED</option>
                        </select>
                    </div>
                )}
            </header>
            {isLoading ? (
                <p>Loading records...</p>
            ) : isEditing ? (
                <form onSubmit={handleUpdate} className="form-grid mannual_form_grid">
                    {/* Form Fields */}
                    <div className="block-display">
                        <label className="form-label-addrecord">
                            Journey Plan No <span className="required">*</span>
                        </label>
                        <input
                            type="text"
                            className="form-input-addrecord"
                            name="journey_Plane_No"
                            value={formData.journey_Plane_No}
                            list="journey-list"
                            required
                            readOnly
                        />
                    </div>

                    <div>
                        <label className="form-label-addrecord">
                            Journey Plan Date & Time <span className="required">*</span>
                        </label>
                        <input
                            type="datetime-local"
                            className="form-input-addrecord"
                            name="journey_Plane_Date"
                            value={formData.journey_Plane_Date}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div>
                        <label className="form-label-addrecord">Journey Plan Status</label>
                        <select
                            className="form-input-addrecord form-select-addrecord"
                            name="jp_Status"
                            value={formData.jp_Status}
                            onChange={handleChange}
                        >
                            <option value="">Select Status</option>
                            <option value="IN TRANSIT">IN TRANSIT</option>
                            <option value="CLOSED">CLOSED</option>
                        </select>
                    </div>

                    <div>
                        <label className="form-label-addrecord">
                            Scheduled Vehicle <span className="required">*</span>
                        </label>
                        <input
                            type="text"
                            className="form-input-addrecord"
                            name="scheduled_Vehicle"
                            value={formData.scheduled_Vehicle}
                            onChange={handleChange}
                            list="vehicle-list"
                            required
                        />
                        <datalist id="vehicle-list">
                            {dropdownData.scheduledVehicles.map((vehicle, index) => (
                                <option key={index} value={vehicle} />
                            ))}
                        </datalist>
                    </div>

                    <div>
                        <label className="form-label-addrecord">
                            Carrier <span className="required">*</span>
                        </label>
                        <input
                            type="text"
                            className="form-input-addrecord"
                            name="carrier"
                            value={formData.carrier}
                            onChange={handleChange}
                            list="carrier-list"
                            required
                        />
                        <datalist id="carrier-list">
                            {dropdownData.carriers.map((carrier, index) => (
                                <option key={index} value={carrier} />
                            ))}
                        </datalist>
                    </div>

                    <div>
                        <label className="form-label-addrecord">Next Point</label>
                        <input
                            type="text"
                            className="form-input-addrecord"
                            name="next_Point"
                            value={formData.next_Point}
                            onChange={handleChange}
                            list="next-point-list"
                        />
                        <datalist id="next-point-list">
                            {dropdownData.nextPoints.map((point, index) => (
                                <option key={index} value={point} />
                            ))}
                        </datalist>
                    </div>

                    <div>
                        <label className="form-label-addrecord">Next Arrival Date & Time</label>
                        <input
                            type="datetime-local"
                            className="form-input-addrecord"
                            name="next_Arrival_Date"
                            value={formData.next_Arrival_Date}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div>
                        <label className="form-label-addrecord">IVMS Point</label>
                        <input
                            type="text"
                            className="form-input-addrecord"
                            name="ivms_Point"
                            value={formData.ivms_Point}
                            onChange={handleChange}
                            list="ivms-point-list"
                        />
                        <datalist id="ivms-point-list">
                            {dropdownData.ivmsPoints.map((point, index) => (
                                <option key={index} value={point} />
                            ))}
                        </datalist>
                    </div>

                    <div>
                        <label className="form-label-addrecord">IVMS Check Date & Time</label>
                        <input
                            type="datetime-local"
                            className="form-input-addrecord"
                            name="ivms_Check_Date"
                            value={formData.ivms_Check_Date}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div>
                        <label className="form-label-addrecord">Offload Point</label>
                        <input
                            type="text"
                            className="form-input-addrecord"
                            name="offload_Point"
                            value={formData.offload_Point}
                            onChange={handleChange}
                            list="offload-point-list"
                        />
                        <datalist id="offload-point-list">
                            {dropdownData.offloadPoints.map((point, index) => (
                                <option key={index} value={point} />
                            ))}
                        </datalist>
                    </div>

                    <div>
                        <label className="form-label-addrecord">Destination</label>
                        <input
                            type="text"
                            className="form-input-addrecord"
                            name="destination"
                            value={formData.destination}
                            onChange={handleChange}
                            list="destination-list"
                        />
                        <datalist id="destination-list">
                            {dropdownData.destinations.map((dest, index) => (
                                <option key={index} value={dest} />
                            ))}
                        </datalist>
                    </div>

                    <div>
                        <label className="form-label-addrecord">Driver Name</label>
                        <input
                            type="text"
                            className="form-input-addrecord"
                            name="driver_Name"
                            value={formData.driver_Name}
                            onChange={handleChange}
                            list="driver-name-list"
                        />
                        <datalist id="driver-name-list">
                            {dropdownData.driverNames.map((driver, index) => (
                                <option key={index} value={driver} />
                            ))}
                        </datalist>
                    </div>

                    <div>
                        <label className="form-label-addrecord">Accommodation</label>
                        <input
                            type="text"
                            className="form-input-addrecord"
                            name="accommodation"
                            value={formData.accommodation}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label className="form-label-addrecord">Journey Manager</label>
                        <input
                            type="text"
                            className="form-input-addrecord"
                            name="jm"
                            value={formData.jm}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label className="form-label-addrecord">
                            Sr. Journey Manager <span className="required">*</span>
                        </label>
                        <input
                            type="text"
                            className="form-input-addrecord"
                            name="sjm"
                            value={formData.sjm}
                            onChange={handleChange}
                            list="sjm-list"
                            required
                        />
                        <datalist id="sjm-list">
                            {dropdownData.sjms.map((sjm, index) => (
                                <option key={index} value={sjm} />
                            ))}
                        </datalist>
                    </div>

                    <div className="block-display">
                        <label className="form-label-addrecord">Tracker</label>
                        <input
                            type="text"
                            className="form-input-addrecord"
                            name="tracker"
                            value={formData.tracker}
                            onChange={handleChange}
                            list="tracker-list"
                        />
                        <datalist id="tracker-list">
                            {dropdownData.trackers.map((tracker, index) => (
                                <option key={index} value={tracker} />
                            ))}
                        </datalist>
                    </div>
                    <div className="block-display">
                        <label className="form-label-addrecord">Remarks</label>
                        <input type="text"
                        className="form-input-addrecord"
                        name="remarks"
                        value={formData.remarks}
                        onChange={handleChange}
                        list="remarks-list" // Link to the datalist
                        />
                        <datalist id="remarks-list">
                            <option value="Live" />
                            <option value="Last Point" />
                            <option value="Ready to Close" />
                            <option value="GOING TO" />
                            <option value="BACK FROM" />
                            <option value="Breakdown" />
                            <option value="IN RIG" />
                            <option value="Done" />
                        </datalist>
                    </div>
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
                                <th>Offload Point</th>
                                <th>Edit</th>
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
                                    <button onClick={() => handleSelect(record)} className="modify-btn modify-btn-edit">
                                        Edit
                                    </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredRecords.length === 0 && <p>No records found for the selected status.</p>}
                </div>
            )}
            {message && <div className="modify-message">{message}</div>}
        </div>
    );
};

export default ModifyRecords;



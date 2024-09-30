import React, { useState} from 'react';
import axios from 'axios';
import useDeviceDetect from '../hooks/useDeviceDetect';
import './Add.css';

const AddRecord = () => {
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
        item_Type: ''
    });
    const [message, setMessage] = useState('');
    const { isMobile } = useDeviceDetect();

    const handleChange = (e) => {
        const { name, value } = e.target;
        const newValue = ['tracker', 'sjm', 'journey_Plane_No', 'scheduled_Vehicle', 'carrier', 'remarks', 'next_Point', 'ivms_Point', 'destination', 'offload_Point', 'driver_Name', 'accommodation', 'jm', 'item_Type'].includes(name)
            ? value.toUpperCase()
            : value;

        setFormData({ ...formData, [name]: newValue });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        if (!token) {
            setMessage('Unauthorized: Please log in.');
            return;
        }

        try {
            const response = await axios.post(`${process.env.REACT_APP_BASE_API_URL}/addRecord`, formData, {
                headers: { Authorization: `Bearer ${token}` } // Include the token in the headers
            });
            setMessage(response.data.message);
            setFormData({
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
                item_Type: ''
            });
        } catch (error) {
            console.error('Error details:', error.response ? error.response.data : error.message);
            setMessage('Error adding record: ' + (error.response ? error.response.data.message : 'Network error.'));
        }
    };

    return (
        <div className={`containeradd ${isMobile ? 'mobile' : 'desktop'}`}>
            <form onSubmit={handleSubmit} className="form-grid mannual_form_grid">
                <div >
                    <label className="form-label-addrecord">Tracker <span className="required">*</span></label>
                    <input
                        type="text"
                        className="form-input-addrecord"
                        name="tracker"
                        value={formData.tracker}
                        onChange={handleChange}
                        autoComplete="off"
                        required
                    />
                </div>
                <div>
                    <label className="form-label-addrecord">SJM <span className="required">*</span></label>
                    <input
                        type="text"
                        className="form-input-addrecord"
                        name="sjm"
                        value={formData.sjm}
                        onChange={handleChange}
                        autoComplete="off"
                        required
                    />
                </div>
                <div>
                    <label className="form-label-addrecord">Journey Plan No <span className="required">*</span></label>
                    <input
                        type="text"
                        className="form-input-addrecord"
                        name="journey_Plane_No"
                        value={formData.journey_Plane_No}
                        onChange={handleChange}
                        autoComplete="off"
                        required
                    />
                </div>
                <div>
                    <label className="form-label-addrecord">Journey Plan Date & Time <span className="required">*</span></label>
                    <input
                        type="datetime-local"
                        className="form-input-addrecord"
                        name="journey_Plane_Date"
                        value={formData.journey_Plane_Date}
                        onChange={handleChange}
                        autoComplete="off"
                        required
                    />
                </div>
                <div>
                    <label className="form-label-addrecord">Scheduled Vehicle <span className="required">*</span></label>
                    <input
                        type="text"
                        className="form-input-addrecord"
                        name="scheduled_Vehicle"
                        value={formData.scheduled_Vehicle}
                        onChange={handleChange}
                        autoComplete="off"
                        required
                    />
                </div>
                <div>
                    <label className="form-label-addrecord">Carrier <span className="required">*</span></label>
                    <input
                        type="text"
                        className="form-input-addrecord"
                        name="carrier"
                        value={formData.carrier}
                        onChange={handleChange}
                        autoComplete="off"
                        required
                    />
                </div>
                <div>
                    <label className="form-label-addrecord">JP Status <span className="required">*</span></label>
                    <select
                        className="form-input-addrecord form-select-addrecord"
                        name="jp_Status"
                        value={formData.jp_Status}
                        onChange={handleChange}
                        autoComplete="off"
                        required
                    >
                        <option value="">Select Status</option>
                        <option value="In Transit">In Transit</option>
                        <option value="CLOSED">CLOSED</option>
                    </select>
                </div>
                <div>
                    <label className="form-label-addrecord">Next Arrival Date & Time <span className="required">*</span></label>
                    <input
                        type="datetime-local"
                        className="form-input-addrecord"
                        name="next_Arrival_Date"
                        value={formData.next_Arrival_Date}
                        onChange={handleChange}
                        autoComplete="off"
                        required
                    />
                </div>
                <div>
                    <label className="form-label-addrecord">Next Point <span className="required">*</span></label>
                    <input
                        type="text"
                        className="form-input-addrecord"
                        name="next_Point"
                        value={formData.next_Point}
                        onChange={handleChange}
                        autoComplete="off"
                        required
                    />
                </div>
                <div>
                    <label className="form-label-addrecord">IVMS Check Date & Time <span className="required">*</span></label>
                    <input
                        type="datetime-local"
                        className="form-input-addrecord"
                        name="ivms_Check_Date"
                        value={formData.ivms_Check_Date}
                        onChange={handleChange}
                        autoComplete="off"
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
                        autoComplete="off"
                    />
                </div>
                <div>
                    <label className="form-label-addrecord">Destination <span className="required">*</span></label>
                    <input
                        type="text"
                        className="form-input-addrecord"
                        name="destination"
                        value={formData.destination}
                        onChange={handleChange}
                        autoComplete="off"
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
                        autoComplete="off"
                    />
                </div>
                <div>
                    <label className="form-label-addrecord">Driver Name <span className="required">*</span></label>
                    <input
                        type="text"
                        className="form-input-addrecord"
                        name="driver_Name"
                        value={formData.driver_Name}
                        onChange={handleChange}
                        autoComplete="off"
                        required
                    />
                </div>
                <div>
                    <label className="form-label-addrecord">Remarks<span className="required">*</span></label>
                    <textarea
                        className="form-input-addrecord form-textarea-addrecord"
                        name="remarks"
                        value={formData.remarks}
                        onChange={handleChange}
                        autoComplete="off"
                        required
                    />
                </div>
                <div>
                    <label className="form-label-addrecord">Accommodation</label>
                    <input
                        type="text"
                        className="form-input-addrecord"
                        name="accommodation"
                        value={formData.accommodation}
                        onChange={handleChange}
                        autoComplete="off"
                    />
                </div>
                <div>
                    <label className="form-label-addrecord">JM</label>
                    <input
                        type="text"
                        className="form-input-addrecord"
                        name="jm"
                        value={formData.jm}
                        onChange={handleChange}
                        autoComplete="off"
                    />
                </div>
                <div>
                    <label className="form-label-addrecord">Item Type</label>
                    <input
                        type="text"
                        className="form-input-addrecord"
                        name="item_Type"
                        value={formData.item_Type}
                        onChange={handleChange}
                        autoComplete="off"
                    />
                </div>
                <button type="submit" className="submit-button-addrecord">Add Record</button>
                {message && <div className="message-addrecord">{message}</div>}
            </form>
        </div>
    );
};

export default AddRecord;


import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import useDeviceDetect from "../hooks/useDeviceDetect";
import "./Add.css";

const AddRecord = () => {
  const [formData, setFormData] = useState({
    tracker: "FRESH",
    sjm: "",
    journey_Plane_No: "",
    journey_Plane_Date: "",
    scheduled_Vehicle: "",
    carrier: "",
    jp_Status: "IN TRANSIT",
    next_Arrival_Date: "",
    next_Point: "",
    ivms_Check_Date: "",
    ivms_Point: "",
    destination: "",
    offload_Point: "",
    driver_Name: "",
    remarks: "",
    accommodation: "",
    jm: "",
    item_Type: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true); // Loading state for dropdowns
  const [Submitting, setSubmitting] = useState(false); // Loading state for form submission
  const navigate = useNavigate();
  const { isMobile } = useDeviceDetect();

  const [dropdownData, setDropdownData] = useState({
    trackers: [],
    sjms: [],
    scheduledVehicles: [],
    carriers: [],
    nextPoints: [],
    ivmsPoints: [],
    destinations: [],
    offloadPoints: [],
    driverNames: [],
  });

  // Function to get current Oman time formatted as required
  const getCurrentOmanDateTime = () => {
    const options = {
      timeZone: 'Asia/Muscat',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    };
    
    const dateTimeFormat = new Intl.DateTimeFormat('en-GB', options);
    const formattedDateTime = dateTimeFormat.format(new Date());

    const [date, time] = formattedDateTime.split(', ');
    const [day, month, year] = date.split('/');
    const [hour, minute, second, period] = time.split(/:| /);

    return {
      dateISO: `${year}-${month}-${day}T${hour}:${minute}`,
      formatted: `${day}/${month}/${year} ${hour}:${minute}:${second} ${period}`,
    };
  };

  // Fetch dropdown data on component mount
  useEffect(() => {
    const fetchDropdownData = async () => {
      setLoading(true); // Start loading
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_API_URL}/dashboarddropdown`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const results = response.data;

        if (Array.isArray(results)) {
          setDropdownData({
            trackers: [...new Set(results.map((item) => item.tracker))],
            sjms: [...new Set(results.map((item) => item.sjm))],
            scheduledVehicles: [...new Set(results.map((item) => item.scheduled_Vehicle))],
            carriers: [...new Set(results.map((item) => item.carrier))],
            nextPoints: [...new Set(results.map((item) => item.next_Point))],
            ivmsPoints: [...new Set(results.map((item) => item.ivms_Point))],
            destinations: [...new Set(results.map((item) => item.destination))],
            offloadPoints: [...new Set(results.map((item) => item.offload_Point))],
            driverNames: [...new Set(results.map((item) => item.driver_Name))],
          });

          // Set initial date and time in Oman format
          const { dateISO } = getCurrentOmanDateTime();
          setFormData(prevState => ({
            ...prevState,
            journey_Plane_Date: dateISO,
            next_Arrival_Date: dateISO,
            ivms_Check_Date: dateISO,
          }));
        } else {
          console.error('Unexpected response structure:', results);
        }
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchDropdownData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value.toUpperCase() }); // Convert to uppercase
  };

  // Function to convert local date to UTC
  const convertToUTC = (localDateTime) => {
    const date = new Date(localDateTime);
    return date.toISOString(); // Converts to UTC
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("Unauthorized: Please log in.");
      return;
    }

    setSubmitting(true); // Start submission loading

    const dataToSubmit = {
      ...formData,
      journey_Plane_Date: convertToUTC(formData.journey_Plane_Date),
      next_Arrival_Date: convertToUTC(formData.next_Arrival_Date),
      ivms_Check_Date: convertToUTC(formData.ivms_Check_Date),
    };

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_API_URL}/addRecord`,
        dataToSubmit,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessage(response.data.message);
      alert("Record added successfully!");

      // Reset form to current Oman date and time
      const { dateISO } = getCurrentOmanDateTime();
      setFormData({
        tracker: "FRESH",
        sjm: "",
        journey_Plane_No: "",
        journey_Plane_Date: dateISO,
        scheduled_Vehicle: "",
        carrier: "",
        jp_Status: "IN TRANSIT",
        next_Arrival_Date: dateISO,
        next_Point: "",
        ivms_Check_Date: dateISO,
        ivms_Point: "",
        destination: "",
        offload_Point: "",
        driver_Name: "",
        remarks: "",
        accommodation: "",
        jm: "",
        item_Type: "",
      });
    } catch (error) {
      console.error("Error details:", error.response ? error.response.data : error.message);
      setMessage("Error adding record: " + (error.response ? error.response.data.message : "Network error."));
    } finally {
      setSubmitting(false); // Stop submission loading
    }
  };

  return (
    <div className={`containeradd ${isMobile ? "mobile" : "desktop"}`}>
      <header className="addrecord-header">
        <button className="addrecord-button primary" onClick={() => navigate('/main')}>
          Main Page
        </button>
      </header>
      {loading ? (
        <div>Loading dropdown data...</div>
      ) : (
        <form onSubmit={handleSubmit} className="form-grid mannual_form_grid">
<div className="block-display">
<label className="form-label-addrecord">
  Journey Plan No <span className="required">*</span>
</label>
<input
  type="text"
  className="form-input-addrecord"
  name="journey_Plane_No"
  value={formData.journey_Plane_No}
  onChange={handleChange}
  list="journey-list"
  required
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
<label className="form-label-addrecord">
  Journey Plan Status 
</label>
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
<label className="form-label-addrecord">
  Next Point 
</label>
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
<label className="form-label-addrecord">
  Next Arrival Date & Time 
</label>
<input
  type="datetime-local"
  className="form-input-addrecord"
  name="next_Arrival_Date"
  value={formData.next_Arrival_Date}
  onChange={handleChange}
/>
</div>

<div>
<label className="form-label-addrecord">
  IVMS Point 
</label>
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
<label className="form-label-addrecord">
  IVMS Check Date & Time 
</label>
<input
  type="datetime-local"
  className="form-input-addrecord"
  name="ivms_Check_Date"
  value={formData.ivms_Check_Date}
  onChange={handleChange}
/>
</div>

<div>
<label className="form-label-addrecord">
  Offload Point 
</label>
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
<label className="form-label-addrecord">
  Destination 
</label>
<input
  type="text"
  className="form-input-addrecord"
  name="destination"
  value={formData.destination}
  onChange={handleChange}
  list="destination-list"
/>
<datalist id="destination-list">
  {dropdownData.destinations.map((destination, index) => (
    <option key={index} value={destination} />
  ))}
</datalist>
</div>



<div>
<label className="form-label-addrecord">
  Driver Name 
</label>
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
<label className="form-label-addrecord">
  Accommodation 
</label>
<input
  type="text"
  className="form-input-addrecord"
  name="accommodation"
  value={formData.accommodation}
  onChange={handleChange}
/>
</div>

<div>
<label className="form-label-addrecord">
  Journey Manager 
</label>
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
<input type="text"
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
            <textarea
                className="form-input-addrecord"
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
            />
        </div>
<button type="submit" className="submit-button-addrecord">
Add Record
</button>
{message && <div className="message-addrecord">{message}</div>}
</form>
)}
</div>
);
};

export default AddRecord;
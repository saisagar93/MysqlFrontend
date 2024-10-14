import React, { useState, useEffect, useCallback, useMemo } from 'react';   
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import useDeviceDetect from '../hooks/useDeviceDetect';
import moment from 'moment-timezone';
import './Dashboard.css'; 

const SERVER_URL = `${process.env.REACT_APP_BASE_API_URL}/dashboard`;

// Function to format date and time
const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return moment(date).format('DD/MM/YYYY HH:mm:ss');
};

// Helper function to normalize strings
const normalizeString = (str) => {
    return str ? str.trim().toLowerCase() : '';
};

const Dashboard = () => {
    const [records, setRecords] = useState([]);
    const [error, setError] = useState('');
    const [filteredRecords, setFilteredRecords] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [cardCounts, setCardCounts] = useState({
        liveJourneys: 0,
        criticalCheck: 0,
        dueForChecking: 0,
        stoppedTrucks: 0,
    });
    const [timer, setTimer] = useState(180);
    const navigate = useNavigate();
    const { isMobile } = useDeviceDetect();

    const calculateMinutesSinceLastCheck = useCallback((ivmsCheckDate) => {
        if (!ivmsCheckDate) return Infinity;
        const currentTime = moment.tz("Asia/Muscat");
        const checkTime = moment(ivmsCheckDate);
        return currentTime.diff(checkTime, 'minutes');
    }, []);

    const calculateCardCounts = useCallback((data) => {
        let counts = { 
            liveJourneys: 0, 
            criticalCheck: 0, 
            dueForChecking: 0, 
            stoppedTrucks: 0 
        };

        data.forEach(item => {
            const minutesSinceLastCheck = calculateMinutesSinceLastCheck(item.IVMS_CHECK_DATE);
            const normalizedJPStatus = normalizeString(item.JP_STATUS);
            const normalizedRemarks = normalizeString(item.REMARKS);

            if (!['closed'].includes(normalizedJPStatus)) counts.liveJourneys++;
            if (minutesSinceLastCheck > 120 && !['done'].includes(normalizedRemarks) && !['closed'].includes(normalizedJPStatus)) {
                counts.criticalCheck++;
            }
            const isValidHours = (minutesSinceLastCheck > 60 && minutesSinceLastCheck < 120) || isNaN(minutesSinceLastCheck);
            const isValidStatus = !['closed'].includes(normalizedJPStatus) && !['done'].includes(normalizedRemarks);
            if (isValidHours && isValidStatus) counts.dueForChecking++;
            if (['done'].includes(normalizedRemarks) && !['closed'].includes(normalizedJPStatus)) {
                counts.stoppedTrucks++;
            }
        });

        setCardCounts(counts);
    }, [calculateMinutesSinceLastCheck]);

    const fetchData = useCallback(async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(SERVER_URL, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setRecords(response.data);
            const filtered = response.data.filter(item => !['closed'].includes(normalizeString(item.JP_STATUS)));
            setFilteredRecords(filtered);
            setError('');
            calculateCardCounts(filtered);
            setTimer(180);
        } catch (error) {
            handleFetchError(error);
        }
    }, [calculateCardCounts]);

    const handleFetchError = (error) => {
        console.error('Fetch error:', error);
        setError('Error fetching dashboard data');
    };

    useEffect(() => {
        fetchData();

        const intervalId = setInterval(() => {
            fetchData();
        }, 180000); // Fetch every 3 minutes

        return () => {
            clearInterval(intervalId);
        };
    }, [fetchData]);

    useEffect(() => {
        const timerId = setInterval(() => {
            setTimer(prevTimer => {
                if (prevTimer <= 0) {
                    fetchData();
                    return 180;
                }
                return prevTimer - 1;
            });
        }, 1000);

        return () => clearInterval(timerId);
    }, [fetchData]);

    const handleCardClick = (type) => {
        const filtered = records.filter(item => {
            const minutesSinceLastCheck = calculateMinutesSinceLastCheck(item.IVMS_CHECK_DATE);
            const normalizedJPStatus = normalizeString(item.JP_STATUS);
            const normalizedRemarks = normalizeString(item.REMARKS);

            const isValidHours = 
                (minutesSinceLastCheck > 60 && minutesSinceLastCheck < 120) || 
                isNaN(minutesSinceLastCheck);
            
            const isValidStatus = 
                !['closed'].includes(normalizedJPStatus) && 
                !['done'].includes(normalizedRemarks);
            
            switch (type) {
                case 'live':
                    return !['closed'].includes(normalizedJPStatus);
                case 'critical':
                    return minutesSinceLastCheck > 120 && 
                           !['done'].includes(normalizedRemarks) && 
                           !['closed'].includes(normalizedJPStatus);
                case 'due':
                    return isValidHours && isValidStatus;
                case 'stopped':
                    return ['done'].includes(normalizedRemarks) && 
                           !['closed'].includes(normalizedJPStatus);
                default:
                    return true;
            }
        });
        setFilteredRecords(filtered);
    };

    const handleSearch = (event) => {
        const value = event.target.value.toLowerCase();
        setSearchTerm(value);
        setFilteredRecords(records.filter(record =>
            Object.values(record).some(val =>
                val !== null && normalizeString(val).includes(value)
            ) && !['closed'].includes(normalizeString(record.JP_STATUS))
        ));
    };

    const journeyPlaneDateCounts = useMemo(() => {
        return filteredRecords.reduce((acc, record) => {
            const date = formatDateTime(record.JOURNEY_PLANE_DATE).split(' ')[0];
            acc[date] = (acc[date] || 0) + 1;
            return acc;
        }, {});
    }, [filteredRecords]);

    const trackersCount = useMemo(() => {
        return records.reduce((acc, record) => {
            const tracker = record.TRACKER?.trim().toLowerCase(); 
            if (!tracker || ['closed'].includes(normalizeString(record.JP_STATUS))) return acc;
    
            acc[tracker] = acc[tracker] || { liveJPS: 0, criticalCheck: 0, dueForChecking: 0 };
    
            // Calculate minutes since last check once
            const minutesSinceLastCheck = calculateMinutesSinceLastCheck(record.IVMS_CHECK_DATE);
    
            // Increment live journeys if JP_STATUS is not closed
            if (!['closed'].includes(normalizeString(record.JP_STATUS))) {
                acc[tracker].liveJPS++;
            }
    
            // Check for critical condition
            if (minutesSinceLastCheck > 120 && !['done'].includes(normalizeString(record.REMARKS))) {
                acc[tracker].criticalCheck++;
            }
    
            // Check for due for checking condition
            if (
                (minutesSinceLastCheck > 60 && minutesSinceLastCheck < 120) || 
                (isNaN(minutesSinceLastCheck) && !['done'].includes(normalizeString(record.REMARKS)))
            ) {
                acc[tracker].dueForChecking++;
            }
    
            return acc;
        }, {});
    }, [records, calculateMinutesSinceLastCheck]);
    
    return (
        
        <div className={`dashboard-container ${isMobile ? 'mobile' : 'desktop'}`}>
            <header className="dashboard-header">
                <img src="almadinalogo1.png" alt="Left Logo" className="logoleft" />
                <img src="pdo.png" alt="Right Logo" className="logoright" />     
            </header>
            <button className="navigate-button" onClick={() => navigate('/main')}>
                Main Page
            </button>
            <h1 className="dashboard-title">JMCC Dashboard</h1>
            {error ? (
                <p className="text-center text-danger">{error}</p>
            ) : (
                <div>
                    <div className="search-container">
                        <input 
                            type="text" 
                            className="search-input" 
                            placeholder="Search..." 
                            value={searchTerm}
                            onChange={handleSearch} 
                        />
                    </div>
                    <div className="card-container">
                        <div onClick={() => handleCardClick('live')} className="card card live">Live Journeys: {cardCounts.liveJourneys}</div>
                        <div onClick={() => handleCardClick('critical')} className="card card critical">Critical Check: {cardCounts.criticalCheck}</div>
                        <div onClick={() => handleCardClick('due')} className="card card due">Due For Checking: {cardCounts.dueForChecking}</div>
                        <div onClick={() => handleCardClick('stopped')} className="card card stopped">Stopped Trucks: {cardCounts.stoppedTrucks}</div>
                    </div>
                    <div className="tables-container">
                        <div className="main-table table-scroll">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Journey Plan No</th>
                                        <th>Journey Manager</th>
                                        <th>Tracker</th>
                                        <th>Truck</th>
                                        <th>Driver Name</th>
                                        <th>Last IVMS POINT</th>
                                        <th>Last Check Time</th>
                                        <th>Minutes Since Last Check</th>
                                        <th>Next Point</th>
                                        <th>Next Arrival Time</th>
                                        <th>OFFLOAD_POINT</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredRecords.map((record, index) => {
                                        const minutesSinceLastCheck = calculateMinutesSinceLastCheck(record.IVMS_CHECK_DATE);
                                        let minutesStyle = {};

                                        const normalizedRemarks = normalizeString(record.REMARKS);
                                        const normalizedJPStatus = normalizeString(record.JP_STATUS);

                                        const isValidHours = (minutesSinceLastCheck > 60 && minutesSinceLastCheck < 120) || isNaN(minutesSinceLastCheck);
                                        const isValidStatus = !['closed'].includes(normalizedJPStatus) && !['done'].includes(normalizedRemarks);

                                        if (minutesSinceLastCheck > 120 && !['done'].includes(normalizedRemarks) && !['closed'].includes(normalizedJPStatus))
                                        {
                                            minutesStyle = { backgroundColor: '#efb5b5' }; 
                                        } else if (['done'].includes(normalizedRemarks) && !['closed'].includes(normalizedJPStatus)) {
                                            minutesStyle = { backgroundColor: '#DEEFFF' }; 
                                        } else if (isValidHours && isValidStatus) {
                                            minutesStyle = { backgroundColor: '#e6e6e6' };
                                        }

                                        return (
                                            <tr key={index}>
                                                <td>{record.JOURNEY_PLANE_NO}</td>
                                                <td>{record.SJM}</td>
                                                <td>{record.TRACKER}</td>
                                                <td>{record.SCHEDULED_VEHICLE}</td>
                                                <td>{record.DRIVER_NAME}</td>
                                                <td>{record.IVMS_POINT}</td>
                                                <td>{formatDateTime(record.IVMS_CHECK_DATE)}</td>
                                                <td style={minutesStyle}>{minutesSinceLastCheck}</td>
                                                <td>{record.NEXT_POINT}</td>
                                                <td>{formatDateTime(record.NEXT_ARRIVAL_DATE)}</td>
                                                <td>{record.OFFLOAD_POINT}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                        <div className="aggregate-tables">
                            <div className="table-scroll1">
                                <table className="aggregate1" id="sub1">
                                    <thead>
                                        <tr>
                                            <th>Journey Plane Date</th>
                                            <th>Count</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Object.entries(journeyPlaneDateCounts).map(([date, count], index) => (
                                            <tr key={index}>
                                                <td>{date}</td>
                                                <td>{count}</td>
                                            </tr>
                                        ))}
                                        <tr>
                                            <td>Total</td>
                                            <td>{Object.values(journeyPlaneDateCounts).reduce((a, b) => a + b, 0)}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div className="table-scroll1">
                                <table className="aggregate2" id="sub2">
                                    <thead>
                                        <tr>
                                            <th>Tracker</th>
                                            <th>Live JPS</th>
                                            <th>Critical Check</th>
                                            <th>Due For Checking</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Object.entries(trackersCount).map(([tracker, counts]) => (
                                            <tr key={tracker}>
                                                <td>{tracker.toUpperCase()}</td>
                                                <td>{counts.liveJPS}</td>
                                                <td>{counts.criticalCheck}</td>
                                                <td>{counts.dueForChecking}</td>
                                            </tr>
                                        ))}
                                        <tr>
                                            <td>Total</td>
                                            <td>{Object.values(trackersCount).reduce((sum, item) => sum + item.liveJPS, 0)}</td>
                                            <td>{Object.values(trackersCount).reduce((sum, item) => sum + item.criticalCheck, 0)}</td>
                                            <td>{Object.values(trackersCount).reduce((sum, item) => sum + item.dueForChecking, 0)}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <div className="timer">Next Fetch: {Math.floor(timer / 60)}:{('0' + (timer % 60)).slice(-2)}</div>
        </div>
    );
};

export default Dashboard;


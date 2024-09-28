import React, { useState, useEffect, useCallback, useMemo } from 'react'; 
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import useDeviceDetect from '../hooks/useDeviceDetect';
import moment from 'moment-timezone';
import './Dashboard.css'; 

const SERVER_URL = `${process.env.REACT_APP_BASE_API_URL}/dashboard`;
const SEND_EMAIL_URL = `${process.env.REACT_APP_BASE_API_URL}/sendEmail`;

const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return moment(date).format('DD/MM/YYYY HH:mm:ss');
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
    const [timer, setTimer] = useState(180); // Timer starts at 180 seconds (3 minutes)
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

            if (!["closed", "CLOSED", "Closed"].includes(item.JP_STATUS)) counts.liveJourneys++;
            if (minutesSinceLastCheck > 120 && !["Done", "DONE", "done"].includes(item.REMARKS) && !["closed", "CLOSED", "Closed"].includes(item.JP_STATUS)) {
                counts.criticalCheck++;
            }
            const isValidHours = (minutesSinceLastCheck > 60 && minutesSinceLastCheck < 120) || isNaN(minutesSinceLastCheck);
            const isValidStatus = !["closed", "CLOSED", "Closed"].includes(item.JP_STATUS) && !["Done", "DONE", "done"].includes(item.REMARKS);
            if (isValidHours && isValidStatus) counts.dueForChecking++;
            if (["Done", "DONE", "done"].includes(item.REMARKS) && !["closed", "CLOSED", "Closed"].includes(item.JP_STATUS)) {
                counts.stoppedTrucks++;
            }
        });

        setCardCounts(counts);
    }, [calculateMinutesSinceLastCheck]);

    const fetchData = async () => {
        try {
            const response = await axios.get(SERVER_URL, { withCredentials: true });
            setRecords(response.data);
            const filtered = response.data.filter(item => !["closed", "CLOSED", "Closed"].includes(item.JP_STATUS));
            setFilteredRecords(filtered);
            setError('');
            calculateCardCounts(filtered);
            setTimer(180); // Reset timer after fetching new data
        } catch (error) {
            handleFetchError(error);
        }
    };

    const handleFetchError = (error) => {
        if (error.response && error.response.status === 401) {
            navigate('/'); // Redirect to login on unauthorized access
        } else {
            setError('Error fetching dashboard data');
            console.error('Fetch error:', error);
        }
    };

    const sendEmailNotification = async (message) => {
        try {
            await axios.post(SEND_EMAIL_URL, { message }, { withCredentials: true });
            console.log('Email sent successfully');
        } catch (error) {
            console.error('Error sending email:', error);
        }
    };

    useEffect(() => {
        fetchData();

        const intervalId = setInterval(() => {
            fetchData();
        }, 180000); 

        return () => {
            clearInterval(intervalId);
        };
    }, [navigate, calculateCardCounts,fetchData]);

    useEffect(() => {
        const timerId = setInterval(() => {
            setTimer(prevTimer => {
                if (prevTimer <= 0) {
                    fetchData(); // Fetch data when timer reaches zero
                    return 180; // Reset timer to 180 seconds
                }
                return prevTimer - 1;
            });
        }, 1000); // Decrease timer every second

        return () => clearInterval(timerId);
    }, [fetchData]);

    useEffect(() => {
        const journeyDetails = filteredRecords;

        if (cardCounts.criticalCheck > 0) {
            const criticalJourneyDetails = journeyDetails.filter(item => {
                const minutesSinceLastCheck = calculateMinutesSinceLastCheck(item.IVMS_CHECK_DATE);
                return minutesSinceLastCheck > 120 && !["Done", "DONE", "done"].includes(item.REMARKS);
            });

            const emailContent = criticalJourneyDetails.map(item => 
                `JOURNEY PLANE NO: ${item.JOURNEY_PLANE_NO}`
            ).join('\n');

            sendEmailNotification(`Below journeys in the critical check:\n${emailContent}`);
        }

        if (cardCounts.dueForChecking > cardCounts.liveJourneys / 2) {
            sendEmailNotification('More than half of live journeys are due for checking.');
        }

        if (cardCounts.liveJourneys === cardCounts.stoppedTrucks && cardCounts.liveJourneys > 0) {
            const liveJourneys = filteredRecords;
            const stoppedTrucks = filteredRecords.filter(item => 
                ["Done", "DONE", "done"].includes(item.REMARKS)
            );

            if (liveJourneys.length === stoppedTrucks.length) {
                const liveJourneyIds = new Set(liveJourneys.map(item => item.JOURNEY_PLANE_NO));
                const stoppedTruckIds = new Set(stoppedTrucks.map(item => item.JOURNEY_PLANE_NO));

                const hasSameItems = [...liveJourneyIds].every(id => stoppedTruckIds.has(id)) &&
                                     [...stoppedTruckIds].every(id => liveJourneyIds.has(id));

                if (hasSameItems) {
                    sendEmailNotification('Live journeys and stopped trucks counts are equal, with matching items.');
                }
            }
        }

        const sjmCounts = {};
        filteredRecords.forEach(item => {
            if (item.SJM) {
                sjmCounts[item.SJM] = (sjmCounts[item.SJM] || 0) + 1;
            }
        });

        for (const [sjmName, count] of Object.entries(sjmCounts)) {
            if (count > 30) {
                sendEmailNotification(`SJM ${sjmName} has more than 30 live journeys.`);
            }
        }
    }, [cardCounts, filteredRecords, calculateMinutesSinceLastCheck]);

    const handleCardClick = (type) => {
        const filtered = records.filter(item => {
            const minutesSinceLastCheck = calculateMinutesSinceLastCheck(item.IVMS_CHECK_DATE);
            switch (type) {
                case 'live':
                    return !["closed", "CLOSED", "Closed"].includes(item.JP_STATUS);
                case 'critical':
                    return minutesSinceLastCheck > 120 && !["Done", "DONE", "done"].includes(item.REMARKS) && !["closed", "CLOSED", "Closed"].includes(item.JP_STATUS);
                case 'due':
                    return (minutesSinceLastCheck > 60 && minutesSinceLastCheck < 120) && !["closed", "CLOSED", "Closed"].includes(item.JP_STATUS) && !["Done", "DONE", "done"].includes(item.REMARKS);
                case 'stopped':
                    return ["Done", "DONE", "done"].includes(item.REMARKS) && !["closed", "CLOSED", "Closed"].includes(item.JP_STATUS);
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
                val !== null && val.toString().toLowerCase().includes(value)
            ) && !["closed", "CLOSED", "Closed"].includes(record.JP_STATUS)
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
            if (!tracker || ["closed", "CLOSED", "Closed"].includes(record.JP_STATUS)) return acc;

            acc[tracker] = acc[tracker] || { liveJPS: 0, criticalCheck: 0, dueForChecking: 0 };

            if (!["closed", "CLOSED", "Closed"].includes(record.JP_STATUS)) acc[tracker].liveJPS++;
            if (calculateMinutesSinceLastCheck(record.IVMS_CHECK_DATE) > 120 && !["Done", "DONE", "done"].includes(record.REMARKS) && !["closed", "CLOSED", "Closed"].includes(record.JP_STATUS)) {
                acc[tracker].criticalCheck++;
            }
            if ((calculateMinutesSinceLastCheck(record.IVMS_CHECK_DATE) > 60 && calculateMinutesSinceLastCheck(record.IVMS_CHECK_DATE) < 120) || isNaN(calculateMinutesSinceLastCheck(record.IVMS_CHECK_DATE))) {
                acc[tracker].dueForChecking++;
            }

            return acc;
        }, {}); 
    }, [records, calculateMinutesSinceLastCheck]);

    return (
        <div className={`dashboard-container ${isMobile ? 'mobile' : 'desktop'}`}>
            <header className="dashboard-header">
                <button className="dashboard-button primary" onClick={() => navigate('/main')}>
                    Main Page
                </button>
                {/* <button className="dashboard-button danger" onClick={() => navigate('/logout')}>
                    Logout
                </button> */}
            </header>

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
                                    {filteredRecords.map((record, index) => (
                                        <tr key={index}>
                                            <td>{record.JOURNEY_PLANE_NO}</td>
                                            <td>{record.SJM}</td>
                                            <td>{record.TRACKER}</td>
                                            <td>{record.SCHEDULED_VEHICLE}</td>
                                            <td>{record.DRIVER_NAME}</td>
                                            <td>{record.IVMS_POINT}</td>
                                            <td>{formatDateTime(record.IVMS_CHECK_DATE)}</td>
                                            <td>{calculateMinutesSinceLastCheck(record.IVMS_CHECK_DATE)}</td>
                                            <td>{record.NEXT_POINT}</td>
                                            <td>{formatDateTime(record.NEXT_ARRIVAL_DATE)}</td>
                                            <td>{record.OFFLOAD_POINT}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="aggregate-tables">
                            <div className="table-scroll1">
                                <table>
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
                                <table>
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
                                                <td>{tracker}</td>
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
            <div className="timer">Time until next fetch: {Math.floor(timer / 60)}:{('0' + (timer % 60)).slice(-2)}</div>
        </div>
    );
};

export default Dashboard;



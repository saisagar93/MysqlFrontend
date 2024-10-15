import React, { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { ReactGrid } from "@silevis/reactgrid";
import "@silevis/reactgrid/styles.css";
import './ModifyRecords.css';

const ModifyRecords = () => {
    const navigate = useNavigate();
    const [filteredRecords, setFilteredRecords] = useState([]);
    const [originalRecords, setOriginalRecords] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState('IN TRANSIT');
    const [isLoading, setIsLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [pendingChanges, setPendingChanges] = useState([]);
    const [page, setPage] = useState(1);
    const [pageSize] = useState(100);
    const [selectedFilterColumn, setSelectedFilterColumn] = useState('JOURNEY_PLANE_NO');
    const [filterValue, setFilterValue] = useState('');

    useEffect(() => {
        fetchRecords();
    }, [selectedStatus, page]);

    useEffect(() => {
        setFilterValue('');
    }, [selectedFilterColumn]);

    const fetchRecords = async () => {
        try {
            setIsLoading(true);
            const token = localStorage.getItem("token");
            const response = await axios.get(`${process.env.REACT_APP_BASE_API_URL}/dashboard`, {
                headers: { Authorization: `Bearer ${token}` },
                params: { page, pageSize },
            });

            setOriginalRecords(response.data);
            applyFilters(response.data);
        } catch (error) {
            console.error('Error fetching records:', error);
            setMessage('Error fetching records. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const applyFilters = (records) => {
        const statusFiltered = records.filter(record => 
            record.JP_STATUS.toLowerCase() === selectedStatus.toLowerCase()
        );

        const finalFiltered = statusFiltered.filter(record => {
            const valueToCompare = record[selectedFilterColumn] || '';
            return valueToCompare.toString().toLowerCase().includes(filterValue.toLowerCase());
        });

        setFilteredRecords(finalFiltered);
    };

    const handleChanges = (changes) => {
        const updatedRecords = [...filteredRecords];

        changes.forEach((change) => {
            const rowId = parseInt(change.rowId);
            const columnId = change.columnId.toUpperCase();
            const newCell = change.newCell;

            if (columnId === 'JOURNEY_PLANE_NO') return;

            if (!newCell || typeof newCell.text === 'undefined') {
                console.warn(`newCell or newCell.text is undefined for rowId: ${rowId}`);
                return;
            }

            let updatedRecord = {
                ...updatedRecords[rowId],
                [columnId]: newCell.text,
            };

            if (['JOURNEY_PLANE_DATE', 'NEXT_ARRIVAL_DATE', 'IVMS_CHECK_DATE'].includes(columnId)) {
                const dateValue = newCell.text;
                if (dateValue) {
                    updatedRecord[columnId] = moment(dateValue, 'DD/MM/YYYY HH:mm').utc().format();
                }
            }

            updatedRecords[rowId] = updatedRecord;

            const originalIndex = originalRecords.findIndex(record => record.JOURNEY_PLANE_NO === updatedRecords[rowId].JOURNEY_PLANE_NO);
            if (originalIndex !== -1) {
                originalRecords[originalIndex] = {
                    ...originalRecords[originalIndex],
                    [columnId]: updatedRecord[columnId],
                };
            }
        });

        setFilteredRecords(updatedRecords);
        setPendingChanges([...pendingChanges, ...changes]);
    };

    const handleBatchUpdate = async (e) => {
        e.preventDefault();
        try {
            if (!filteredRecords.length) {
                setMessage('No records to update.');
                return;
            }

            const dataToUpdate = pendingChanges.map((change) => {
                const originalRecord = originalRecords.find(record => record.JOURNEY_PLANE_NO === filteredRecords[change.rowId].JOURNEY_PLANE_NO);
                const updatedRecord = {
                    ...originalRecord,
                    [change.columnId]: change.newCell.text,
                    id: originalRecord.id,
                };

                if (['JOURNEY_PLANE_DATE', 'NEXT_ARRIVAL_DATE', 'IVMS_CHECK_DATE'].includes(change.columnId)) {
                    const dateValue = change.newCell.text;
                    if (dateValue) {
                        updatedRecord[change.columnId] = moment(dateValue, 'DD/MM/YYYY HH:mm').utc().format();
                    }
                }

                return updatedRecord;
            });

            const token = localStorage.getItem("token");
            await axios.patch(`${process.env.REACT_APP_BASE_API_URL}/modifyRecordsBatch`, dataToUpdate, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setMessage('Data update successful!');
            setPendingChanges([]);

            setTimeout(() => {
                setMessage('');
            }, 3000);

            await fetchRecords();
        } catch (error) {
            console.error('Error during batch update:', error);
            setMessage(error.response?.data?.message || 'Error during batch update. Please try again.');
        }
    };

    const resetFilters = () => {
        setFilterValue('');
        setSelectedFilterColumn('JOURNEY_PLANE_NO');
        setSelectedStatus('IN TRANSIT'); // Reset to "IN TRANSIT" status
        setFilteredRecords(originalRecords);
        applyFilters(originalRecords); // Reapply filters to show the correct records
    };

    const formatDateTime = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return moment(date).format('DD/MM/YYYY HH:mm');
    };

    const getRows = (records) => {
        const headerRow = {
            rowId: "header",
            cells: [
                { type: "header", text: "Journey Plan No" },
                { type: "header", text: "Tracker" },
                { type: "header", text: "SJM" },
                { type: "header", text: "Journey Plan Date"},
                { type: "header", text: "Driver Name" },
                { type: "header", text: "Scheduled Vehicle" },
                { type: "header", text: "Carrier" },
                { type: "header", text: "Remarks" },
                { type: "header", text: "JP STATUS" },
                { type: "header", text: "Next Arrival Time" },
                { type: "header", text: "Next Point" },
                { type: "header", text: "IVMS Check Date" },
                { type: "header", text: "IVMS Point" },
                { type: "header", text: "Destination" },
                { type: "header", text: "Offload Point" },
                { type: "header", text: "Accommodation" }     
            ]
        };

        return [
            headerRow,
            ...records.map((record, idx) => ({
                rowId: idx.toString(),
                cells: [
                    { type: "text", text: record.JOURNEY_PLANE_NO || '' },
                    { type: "text", text: record.TRACKER || '' },
                    { type: "text", text: record.SJM || '' },
                    { type: "text", text: formatDateTime(record.JOURNEY_PLANE_DATE) || '' },
                    { type: "text", text: record.DRIVER_NAME || '' },
                    { type: "text", text: record.SCHEDULED_VEHICLE || '' },
                    { type: "text", text: record.CARRIER || '' },
                    { type: "text", text: record.REMARKS || '' },
                    { type: "text", text: record.JP_STATUS || '' },
                    { type: "text", text: formatDateTime(record.NEXT_ARRIVAL_DATE) || '' },
                    { type: "text", text: record.NEXT_POINT || '' },
                    { type: "text", text: formatDateTime(record.IVMS_CHECK_DATE) || '' },
                    { type: "text", text: record.IVMS_POINT || '' },
                    { type: "text", text: record.DESTINATION || '' },
                    { type: "text", text: record.OFFLOAD_POINT || '' },
                    { type: "text", text: record.ACCOMMODATION || '' },
                ]
            }))
        ];
    };

    const columns = () => [
        { columnId: 'JOURNEY_PLANE_NO', title: 'Journey Plan No', width: 94, resizable: true, editable: false },
        { columnId: 'TRACKER', title: 'Tracker', width: 110, resizable: true },
        { columnId: 'SJM', title: 'Journey Manager', width: 110, resizable: true },
        { columnId: 'JOURNEY_PLANE_DATE', title: 'Journey Plan Date', width: 114, resizable: false },
        { columnId: 'DRIVER_NAME', title: 'Driver Name', width: 130, resizable: true },
        { columnId: 'SCHEDULED_VEHICLE', title: 'Scheduled Vehicle', width: 110, resizable: true },
        { columnId: 'CARRIER', title: 'Carrier', width: 60, resizable: true },
        { columnId: 'REMARKS', title: 'Remarks', width: 70, resizable: true },
        { columnId: 'JP_STATUS', title: 'JP STATUS', width: 90, resizable: true },
        { columnId: 'NEXT_ARRIVAL_DATE', title: 'Next Arrival Time', width: 108, resizable: true },
        { columnId: 'NEXT_POINT', title: 'Next Point', width: 70, resizable: true },
        { columnId: 'IVMS_CHECK_DATE', title: 'Last Check Time', width: 120, resizable: true },
        { columnId: 'IVMS_POINT', title: 'Last IVMS Point', width: 80, resizable: true },
        { columnId: 'DESTINATION', title: 'Destination', width: 70, resizable: true },
        { columnId: 'OFFLOAD_POINT', title: 'Offload Point', width: 90, resizable: true },
        { columnId: 'ACCOMMODATION', title: 'Accommodation', width: 90, resizable: true },   
    ];

    const rows = getRows(filteredRecords);

    return (
        <>
            <header className="modify-records-header1">
                <button className="modify-btn modify-btn-primary" onClick={() => navigate('/main')}>
                    Main Page
                </button>
                <div className="filter-section">
                    <label htmlFor="filterColumnSelect">Filter By:</label>
                    <select
                        id="filterColumnSelect"
                        value={selectedFilterColumn}
                        onChange={(e) => {
                            setSelectedFilterColumn(e.target.value);
                            setFilterValue(''); // Reset filter value when changing column
                            applyFilters(originalRecords); // Reapply filters
                        }}
                    >
                        <option value="JOURNEY_PLANE_NO">Journey Plan No</option>
                        <option value="TRACKER">Tracker</option>
                        <option value="SJM">SJM</option>
                        <option value="DRIVER_NAME">Driver Name</option>
                        <option value="SCHEDULED_VEHICLE">Scheduled Vehicle</option>
                        <option value="CARRIER">Carrier</option>
                        <option value="REMARKS">Remarks</option>
                        <option value="NEXT_POINT">Next Point</option>
                        <option value="IVMS_POINT">IVMS Point</option>
                        <option value="DESTINATION">Destination</option>
                        <option value="OFFLOAD_POINT">Offload Point</option>
                        <option value="ACCOMMODATION">Accommodation</option>
                    </select>
                    <input
                        type="text"
                        placeholder={`${selectedFilterColumn}`}
                        value={filterValue}
                        onChange={(e) => {
                            setFilterValue(e.target.value);
                            applyFilters(originalRecords); // Reapply filters as user types
                        }}
                        className="filter-input"
                    />
                </div>

                <div className="status-filter1">
                    <label htmlFor="statusSelect">Filter By Status:</label>
                    <select id="statusSelect" value={selectedStatus} onChange={(e) => {
                        setSelectedStatus(e.target.value);
                        applyFilters(originalRecords); // Reapply filters
                    }}>
                        <option value="IN TRANSIT">IN TRANSIT</option>
                        <option value="CLOSED">CLOSED</option>
                    </select>
                </div>

                <div className="modify-records-footer">
                    <button onClick={handleBatchUpdate}>Save Changes</button>
                    <button onClick={resetFilters} className="reset-btn">Reset Filters</button> 
                </div>
            </header>
            {isLoading ? (
                <p>Loading records...</p>
            ) : (
                <div className="grid-container">
                    <ReactGrid
                        columns={columns()}
                        rows={rows}
                        onCellsChanged={handleChanges}
                        enableClipboard={true}
                    />
                </div>
            )}
            {message && <div className="modify-message">{message}</div>}
        </>
    );
};

export default ModifyRecords;

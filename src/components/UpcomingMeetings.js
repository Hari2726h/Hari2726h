import React, { useState } from 'react';
import axios from 'axios';
import './UpcomingMeetings.css';

const UpcomingMeetings = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [meetings, setMeetings] = useState([]); // Fetch from JSON server on component load
    const [showPopup, setShowPopup] = useState(false);
    const [newMeeting, setNewMeeting] = useState({
        date: '',
        time: '',
        meetingName: '',
        collegeName: '',
        organizer: '',
    });

    // Fetch meetings from JSON server
    React.useEffect(() => {
        axios.get('http://localhost:5000/meetings')
            .then(response => {
                setMeetings(response.data);
            })
            .catch(error => {
                console.error('Error fetching meetings:', error);
            });
    }, []);

    // Filter meetings based on the search term
    const filteredMeetings = meetings.filter(meeting =>
        meeting.meetingName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        meeting.collegeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        meeting.organizer.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Reset the search term
    const resetSearch = () => {
        setSearchTerm('');
    };

    // Open the popup
    const openPopup = () => {
        setShowPopup(true);
    };

    // Close the popup
    const closePopup = () => {
        setShowPopup(false);
    };

    // Handle the input changes in the popup form
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewMeeting((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    // Add new meeting to the JSON server and update the UI
    const addMeeting = () => {
        axios.post('http://localhost:5000/meetings', newMeeting)
            .then(response => {
                setMeetings((prevMeetings) => [...prevMeetings, response.data]);
                closePopup(); // Close the popup after adding the meeting
            })
            .catch(error => {
                console.error('Error adding meeting:', error);
            });
    };

    return (
        <div className="upcoming-meetings">
            {/* Header Section */}
            <header className="header">
                <img
                    src="https://tse3.mm.bing.net/th?id=OIP.yp98A8KaJnzV1Ha8xYnduAAAAA&pid=Api&P=0&h=180"
                    alt="Logo"
                    className="logo"
                />
                <h1>Upcoming Meetings</h1>
            </header>

            {/* Search Field Below Header */}
            <div className="search-container">
                <input
                    type="text"
                    placeholder="Search by Meeting Name, College, or Organizer"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button onClick={resetSearch} className="reset-button">Search</button>
            </div>

            {/* Schedule Button */}
            <div className="schedule-container">
                <button className="schedule-button" onClick={openPopup}>
                    Schedule a New Meeting
                </button>
            </div>

            {/* Meetings Table */}
            <table className="meetings-table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Meeting Name</th>
                        <th>College Name</th>
                        <th>Organizer</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredMeetings.length > 0 ? (
                        filteredMeetings.map((meeting, index) => (
                            <tr key={index}>
                                <td>{meeting.date}</td>
                                <td>{meeting.time}</td>
                                <td>{meeting.meetingName}</td>
                                <td>{meeting.collegeName}</td>
                                <td>{meeting.organizer}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="no-results">No meetings found</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Popup Form to Add New Meeting */}
            {showPopup && (
                <div className="popup-overlay">
                    <div className="popup">
                        <h2>Add New Meeting</h2>
                        <form>
                            <label>Date:</label>
                            <input
                                type="text"
                                name="date"
                                value={newMeeting.date}
                                onChange={handleInputChange}
                                placeholder="Enter Date"
                            />
                            <label>Time:</label>
                            <input
                                type="text"
                                name="time"
                                value={newMeeting.time}
                                onChange={handleInputChange}
                                placeholder="Enter Time"
                            />
                            <label>Meeting Name:</label>
                            <input
                                type="text"
                                name="meetingName"
                                value={newMeeting.meetingName}
                                onChange={handleInputChange}
                                placeholder="Enter Meeting Name"
                            />
                            <label>College Name:</label>
                            <input
                                type="text"
                                name="collegeName"
                                value={newMeeting.collegeName}
                                onChange={handleInputChange}
                                placeholder="Enter College Name"
                            />
                            <label>Organizer:</label>
                            <input
                                type="text"
                                name="organizer"
                                value={newMeeting.organizer}
                                onChange={handleInputChange}
                                placeholder="Enter Organizer"
                            />
                            <button type="button" onClick={addMeeting} className="add-button">
                                Add
                            </button>
                            <button type="button" onClick={closePopup} className="close-button">
                                Close
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UpcomingMeetings;

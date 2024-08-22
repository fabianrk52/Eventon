import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import './NewEvent.css';

const NewEvent = () => {
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');
    const [budget, setBudget] = useState('');
    const [status, setStatus] = useState('Planned');
    const [numGuests, setNumGuests] = useState('');
    const [teammate, setTeammate] = useState('');

    const navigate = useNavigate();

    const handleCreateEvent = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:65000/add_event', {
                title,
                date,
                location,
                description,
                budget,
                status,
                numGuests,
                teammate,
            }, {
                headers: {
                    Authorization: `Bearer ${Cookies.get('userToken')}`
                }
            });

            if (response.status === 201) {
                alert('Event created successfully!');
                navigate('/events');  // Redirect to events page
            }
        } catch (error) {
            console.error('Error creating event:', error);
            alert('Failed to create event. Please try again.');
        }
    };

    return (
        <div className="new-event-container">
            <h2>Create New Event</h2>
            <form onSubmit={handleCreateEvent} className="new-event-form">
                <div className="form-row">
                    <label>Title</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>
                <div className="form-row">
                    <label>Date</label>
                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
                </div>
                <div className="form-row">
                    <label>Location</label>
                    <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} required />
                </div>
                <div className="form-row">
                    <label>Description</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} required></textarea>
                </div>
                <div className="form-row">
                    <label>Budget</label>
                    <input type="number" value={budget} onChange={(e) => setBudget(e.target.value)} required />
                </div>
                <div className="form-row">
                    <label>Number of Guests</label>
                    <input type="number" value={numGuests} onChange={(e) => setNumGuests(e.target.value)} required />
                </div>
                <div className="form-row">
                    <label>Teammate</label>
                    <input type="text" value={teammate} onChange={(e) => setTeammate(e.target.value)} />
                </div>
                <div className="form-row">
                    <label>Status</label>
                    <select value={status} onChange={(e) => setStatus(e.target.value)}>
                        <option value="Planned">Planned</option>
                        <option value="Ongoing">Ongoing</option>
                        <option value="Completed">Completed</option>
                    </select>
                </div>
                <button type="submit" className="new-event-button">Create Event</button>
            </form>
        </div>
    );
};

export default NewEvent;

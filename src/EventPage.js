import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import './EventPage.css';

const EventPage = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [activeSections, setActiveSections] = useState({
    details: false,
    guests: false,
    tasks: false,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);
  const [newGuest, setNewGuest] = useState({ name: '', surname: '', phone: '', confirmation: '' });
  const [newTask, setNewTask] = useState({ title: '', openedBy: '', lastUpdate: '', status: '' });
  const [newDescription, setNewDescription] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      const token = Cookies.get('userToken'); // Retrieve the token from cookies

      if (token) {
        try {
          const response = await axios.get('https://your-api-endpoint.com/events', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.status === 200) {
            setEvents(response.data);
            setSelectedEvent(response.data[0]); // Select the first event by default
          }
        } catch (error) {
          console.error('Failed to fetch events:', error);
        }
      } else {
        window.location.href = '/login'; // Redirect to sign-in if no token is found
      }
    };

    fetchEvents();
  }, []);

  const handleEventSelection = (event) => {
    setSelectedEvent(event);
    setActiveSections({ details: false, guests: false, tasks: false });
    setIsEditing(false);
    setEditingSection(null);
    setEditingIndex(null);
  };

  const toggleSection = (section) => {
    setActiveSections(prevState => ({
      ...prevState,
      [section]: !prevState[section]
    }));
  };

  const handleEditSection = (section, index = null) => {
    setEditingSection(section);
    setIsEditing(true);
    setEditingIndex(index);

    if (section === 'details') {
      setNewDescription(selectedEvent.description);
    } else if (section === 'guests' && index !== null) {
      setNewGuest(selectedEvent.guests[index]);
    } else if (section === 'tasks' && index !== null) {
      setNewTask(selectedEvent.tasks[index]);
    }
  };

  const handleAddNewRow = (section) => {
    setEditingSection(section);
    setIsEditing(true);
    setEditingIndex(null);

    if (section === 'guests') {
      setNewGuest({ name: '', surname: '', phone: '', confirmation: '' });
    } else if (section === 'tasks') {
      setNewTask({ title: '', openedBy: '', lastUpdate: '', status: '' });
    }
  };

  const handleCancelEditing = () => {
    setIsEditing(false);
    setEditingSection(null);
    setEditingIndex(null);
    setNewGuest({ name: '', surname: '', phone: '', confirmation: '' });
    setNewTask({ title: '', openedBy: '', lastUpdate: '', status: '' });
    setNewDescription('');
  };

  const handleSaveGuest = async () => {
    try {
      let updatedGuests;
      if (editingIndex !== null) {
        updatedGuests = [...selectedEvent.guests];
        updatedGuests[editingIndex] = newGuest;
      } else {
        updatedGuests = [...selectedEvent.guests, newGuest];
      }
      const updatedEvent = { ...selectedEvent, guests: updatedGuests };

      const response = await axios.put(`https://your-api-endpoint.com/events/${selectedEvent.id}`, updatedEvent, {
        headers: {
          Authorization: `Bearer ${Cookies.get('userToken')}`, // Use token from cookies
        },
      });

      if (response.status === 200) {
        setEvents(events.map(event => event.id === selectedEvent.id ? updatedEvent : event));
        setSelectedEvent(updatedEvent);
        handleCancelEditing();
      }
    } catch (error) {
      console.error('Error saving the guest:', error);
    }
  };

  const handleSaveDetails = async () => {
    try {
      const updatedEvent = { ...selectedEvent, description: newDescription };
      
      const response = await axios.put(`https://your-api-endpoint.com/events/${selectedEvent.id}`, updatedEvent, {
        headers: {
          Authorization: `Bearer ${Cookies.get('userToken')}`, // Use token from cookies
        },
      });

      if (response.status === 200) {
        setEvents(events.map(event => event.id === selectedEvent.id ? updatedEvent : event));
        setSelectedEvent(updatedEvent);
        handleCancelEditing();
      }
    } catch (error) {
      console.error('Error saving the details:', error);
    }
  };

  const handleSaveTask = async () => {
    try {
      let updatedTasks;
      if (editingIndex !== null) {
        updatedTasks = [...selectedEvent.tasks];
        updatedTasks[editingIndex] = newTask;
      } else {
        updatedTasks = [...selectedEvent.tasks, newTask];
      }
      const updatedEvent = { ...selectedEvent, tasks: updatedTasks };

      const response = await axios.put(`https://your-api-endpoint.com/events/${selectedEvent.id}`, updatedEvent, {
        headers: {
          Authorization: `Bearer ${Cookies.get('userToken')}`, // Use token from cookies
        },
      });

      if (response.status === 200) {
        setEvents(events.map(event => event.id === selectedEvent.id ? updatedEvent : event));
        setSelectedEvent(updatedEvent);
        handleCancelEditing();
      }
    } catch (error) {
      console.error('Error saving the task:', error);
    }
  };

  const handleDeleteEvent = async () => {
    try {
      const response = await axios.delete(`https://your-api-endpoint.com/events/${selectedEvent.id}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get('userToken')}`, // Use token from cookies
        },
      });

      if (response.status === 200) {
        setEvents(events.filter(event => event.id !== selectedEvent.id));
        setSelectedEvent(events[0] || null); // Select the first event or null if none are left
      }
    } catch (error) {
      console.error('Error deleting the event:', error);
    }
  };

  return (
    <div className="event-page-container">
      <div className="event-menu">
        <h3>Events</h3>
        <ul>
          {events.map((event, index) => (
            <li key={index} onClick={() => handleEventSelection(event)}>
              {event.title}
            </li>
          ))}
        </ul>
        <button className="add-event-button" onClick={() => handleEditSection('title')}>Add Event</button>
      </div>
      <div className="event-details">
        {selectedEvent && (
          <>
            <h1>{selectedEvent.title}</h1>
            <p className="event-subtitle">
              <strong>Date:</strong> {selectedEvent.date} | <strong>Location:</strong> {selectedEvent.location}
            </p>
            <div className="accordion">
              <div className="accordion-section">
                <div className="accordion-header" onClick={() => toggleSection('details')}>
                  Details
                </div>
                {activeSections.details && (
                  <div className="accordion-content">
                    {isEditing && editingSection === 'details' ? (
                      <div>
                        <textarea
                          value={newDescription}
                          onChange={(e) => setNewDescription(e.target.value)}
                          rows={5}
                          placeholder="Enter event details"
                        />
                        <button onClick={handleSaveDetails}>Save</button>
                        <button onClick={handleCancelEditing}>Cancel</button>
                      </div>
                    ) : (
                      <div>
                        <p>{selectedEvent.description}</p>
                        <button onClick={() => handleEditSection('details')}>Edit</button>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="accordion-section">
                <div className="accordion-header" onClick={() => toggleSection('guests')}>
                  Guests
                </div>
                {activeSections.guests && (
                  <div className="accordion-content">
                    <h3>Guests List</h3>
                    <table className="guests-table">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Surname</th>
                          <th>Phone</th>
                          <th>Confirmation</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedEvent.guests.map((guest, index) => (
                          <tr key={index}>
                            {isEditing && editingSection === 'guests' && editingIndex === index ? (
                              <>
                                <td><input type="text" name="name" value={newGuest.name} onChange={(e) => setNewGuest({ ...newGuest, name: e.target.value })} placeholder="Name" /></td>
                                <td><input type="text" name="surname" value={newGuest.surname} onChange={(e) => setNewGuest({ ...newGuest, surname: e.target.value })} placeholder="Surname" /></td>
                                <td><input type="text" name="phone" value={newGuest.phone} onChange={(e) => setNewGuest({ ...newGuest, phone: e.target.value })} placeholder="Phone" /></td>
                                <td>
                                  <select name="confirmation" value={newGuest.confirmation} onChange={(e) => setNewGuest({ ...newGuest, confirmation: e.target.value })}>
                                    <option value="Confirmed">Confirmed</option>
                                    <option value="Pending">Pending</option>
                                  </select>
                                </td>
                                <td>
                                  <button onClick={handleSaveGuest}>Save</button>
                                  <button onClick={handleCancelEditing}>Cancel</button>
                                </td>
                              </>
                            ) : (
                              <>
                                <td>{guest.name}</td>
                                <td>{guest.surname}</td>
                                <td>{guest.phone}</td>
                                <td>{guest.confirmation}</td>
                                <td>
                                  <button onClick={() => handleEditSection('guests', index)}>Edit</button>
                                </td>
                              </>
                            )}
                          </tr>
                        ))}
                        {isEditing && editingSection === 'guests' && editingIndex === null && (
                          <tr>
                            <td><input type="text" name="name" value={newGuest.name} onChange={(e) => setNewGuest({ ...newGuest, name: e.target.value })} placeholder="Name" /></td>
                            <td><input type="text" name="surname" value={newGuest.surname} onChange={(e) => setNewGuest({ ...newGuest, surname: e.target.value })} placeholder="Surname" /></td>
                            <td><input type="text" name="phone" value={newGuest.phone} onChange={(e) => setNewGuest({ ...newGuest, phone: e.target.value })} placeholder="Phone" /></td>
                            <td>
                              <select name="confirmation" value={newGuest.confirmation} onChange={(e) => setNewGuest({ ...newGuest, confirmation: e.target.value })}>
                                <option value="Confirmed">Confirmed</option>
                                <option value="Pending">Pending</option>
                              </select>
                            </td>
                            <td>
                              <button onClick={handleSaveGuest}>Save</button>
                              <button onClick={handleCancelEditing}>Cancel</button>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                    {!isEditing && <button onClick={() => handleAddNewRow('guests')}>Add Guest</button>}
                  </div>
                )}
              </div>
              <div className="accordion-section">
                <div className="accordion-header" onClick={() => toggleSection('tasks')}>
                  Tasks
                </div>
                {activeSections.tasks && (
                  <div className="accordion-content">
                    <h3>Task List</h3>
                    <table className="tasks-table">
                      <thead>
                        <tr>
                          <th>Title</th>
                          <th>Opened By</th>
                          <th>Last Update</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedEvent.tasks.map((task, index) => (
                          <tr key={index}>
                            {isEditing && editingSection === 'tasks' && editingIndex === index ? (
                              <>
                                <td><input type="text" name="title" value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} placeholder="Title" /></td>
                                <td><input type="text" name="openedBy" value={newTask.openedBy} onChange={(e) => setNewTask({ ...newTask, openedBy: e.target.value })} placeholder="Opened By" /></td>
                                <td><input type="date" name="lastUpdate" value={newTask.lastUpdate} onChange={(e) => setNewTask({ ...newTask, lastUpdate: e.target.value })} /></td>
                                <td>
                                  <select name="status" value={newTask.status} onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Completed">Completed</option>
                                  </select>
                                </td>
                                <td>
                                  <button onClick={handleSaveTask}>Save</button>
                                  <button onClick={handleCancelEditing}>Cancel</button>
                                </td>
                              </>
                            ) : (
                              <>
                                <td>{task.title}</td>
                                <td>{task.openedBy}</td>
                                <td>{task.lastUpdate}</td>
                                <td>{task.status}</td>
                                <td>
                                  <button onClick={() => handleEditSection('tasks', index)}>Edit</button>
                                </td>
                              </>
                            )}
                          </tr>
                        ))}
                        {isEditing && editingSection === 'tasks' && editingIndex === null && (
                          <tr>
                            <td><input type="text" name="title" value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} placeholder="Title" /></td>
                            <td><input type="text" name="openedBy" value={newTask.openedBy} onChange={(e) => setNewTask({ ...newTask, openedBy: e.target.value })} placeholder="Opened By" /></td>
                            <td><input type="date" name="lastUpdate" value={newTask.lastUpdate} onChange={(e) => setNewTask({ ...newTask, lastUpdate: e.target.value })} /></td>
                            <td>
                              <select name="status" value={newTask.status} onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                              </select>
                            </td>
                            <td>
                              <button onClick={handleSaveTask}>Save</button>
                              <button onClick={handleCancelEditing}>Cancel</button>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                    {!isEditing && <button onClick={() => handleAddNewRow('tasks')}>Add Task</button>}
                  </div>
                )}
              </div>
            </div>
            <button className="delete-event-button" onClick={handleDeleteEvent}>Delete Event</button>
          </>
        )}
      </div>
    </div>
  );
};

export default EventPage;

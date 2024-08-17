import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import './EventPage.css';
import { useParams, useNavigate } from 'react-router-dom';

const EventPage = () => {
  const { id } = useParams();
  const [events, setEvents] = useState([
    {
      id: 1,
      title: 'Event 1',
      date: '2024-08-15',
      location: 'New York, NY',
      description: 'This is the description for Event 1.',
      budget: 5000,
      status: 'Planned',
      numGuests: 100,
      teammate: 'Alice Johnson',
      guests: [
        { name: 'John', surname: 'Doe', phone: '123-456-7890', confirmation: 'Confirmed', table: '8' },
        { name: 'Jane', surname: 'Smith', phone: '098-765-4321', confirmation: 'Pending', table: '2' }
      ],
      tasks: [
        { title: 'Setup Venue', description: 'Setup the venue', deadline: '2024-08-14', priority: 'High', teammate: 'John Doe', status: 'In Progress' },
        { title: 'Send Invitations', description: 'Send invitations to all guests', deadline: '2024-08-09', priority: 'Medium', teammate: 'Jane Smith', status: 'Completed' }
      ],
    },
    // Other initial events...
  ]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [activeSections, setActiveSections] = useState({
    details: false,
    guests: false,
    tasks: false,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);
  const [newGuest, setNewGuest] = useState({ name: '', surname: '', phone: '', confirmation: '', table: '' });
  const [newTask, setNewTask] = useState({ title: '', description: '', deadline: '', priority: '', teammate: '', status: '' });
  const [newDescription, setNewDescription] = useState('');
  const [newTitle, setNewTitle] = useState('');  // New state for title
  const [newDate, setNewDate] = useState('');  // New state for date
  const [newLocation, setNewLocation] = useState('');  // New state for location
  const [newBudget, setNewBudget] = useState('');  // New state for budget
  const [newStatus, setNewStatus] = useState('');  // New state for status
  const [newNumGuests, setNewNumGuests] = useState('');  // New state for number of guests
  const [newTeammate, setNewTeammate] = useState('');  // New state for teammate

  const navigate = useNavigate();

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
      setNewTitle(selectedEvent.title);
      setNewDate(selectedEvent.date);
      setNewLocation(selectedEvent.location);
      setNewDescription(selectedEvent.description);
      setNewBudget(selectedEvent.budget);
      setNewStatus(selectedEvent.status);
      setNewNumGuests(selectedEvent.numGuests);
      setNewTeammate(selectedEvent.teammate);
    } else if (section === 'guests' && index !== null) {
      setNewGuest(selectedEvent.guests[index]);
    } else if (section === 'tasks' && index !== null) {
      setNewTask(selectedEvent.tasks[index]);
    }
  };

  const handleCancelEditing = () => {
    setIsEditing(false);
    setEditingSection(null);
    setEditingIndex(null);
    setNewGuest({ name: '', surname: '', phone: '', confirmation: '', table: '' });
    setNewTask({ title: '', description: '', deadline: '', priority: '', teammate: '', status: '' });
    setNewTitle('');
    setNewDate('');
    setNewLocation('');
    setNewDescription('');
    setNewBudget('');
    setNewStatus('');
    setNewNumGuests('');
    setNewTeammate('');
  };

  const handleSaveDetails = async () => {
    try {
      const updatedEvent = {
        ...selectedEvent,
        title: newTitle,
        date: newDate,
        location: newLocation,
        description: newDescription,
        budget: newBudget,
        status: newStatus,
        numGuests: newNumGuests,
        teammate: newTeammate
      };

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

  const handleSaveGuest = async () => {
    try {
      let updatedGuests;
      if (editingIndex !== null) {  // Editing an existing guest
        updatedGuests = [...selectedEvent.guests];
        updatedGuests[editingIndex] = newGuest;  // Update the existing guest
      } else {  // Adding a new guest
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

  const handleDeleteGuest = async (index) => {
    try {
      const updatedGuests = selectedEvent.guests.filter((_, i) => i !== index);
      const updatedEvent = { ...selectedEvent, guests: updatedGuests };

      const response = await axios.put(`https://your-api-endpoint.com/events/${selectedEvent.id}`, updatedEvent, {
        headers: {
          Authorization: `Bearer ${Cookies.get('userToken')}`, // Use token from cookies
        },
      });

      if (response.status === 200) {
        setEvents(events.map(event => event.id === selectedEvent.id ? updatedEvent : event));
        setSelectedEvent(updatedEvent);
      }
    } catch (error) {
      console.error('Error deleting the guest:', error);
    }
  };

  const handleSaveTask = async () => {
    try {
      let updatedTasks;
      if (editingIndex !== null) {  // Editing an existing task
        updatedTasks = [...selectedEvent.tasks];
        updatedTasks[editingIndex] = newTask;  // Update the existing task
      } else {  // Adding a new task
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

  const handleDeleteTask = async (index) => {
    try {
      const updatedTasks = selectedEvent.tasks.filter((_, i) => i !== index);
      const updatedEvent = { ...selectedEvent, tasks: updatedTasks };

      const response = await axios.put(`https://your-api-endpoint.com/events/${selectedEvent.id}`, updatedEvent, {
        headers: {
          Authorization: `Bearer ${Cookies.get('userToken')}`, // Use token from cookies
        },
      });

      if (response.status === 200) {
        setEvents(events.map(event => event.id === selectedEvent.id ? updatedEvent : event));
        setSelectedEvent(updatedEvent);
      }
    } catch (error) {
      console.error('Error deleting the task:', error);
    }
  };

  const handleAddNewRow = (section) => {
    setEditingSection(section);
    setIsEditing(true);
    setEditingIndex(null);

    if (section === 'guests') {
      setNewGuest({ name: '', surname: '', phone: '', confirmation: '', table: '' });
    } else if (section === 'tasks') {
      setNewTask({ title: '', description: '', openedBy: '', deadline: '', priority: '', teammate: '', status: '' });
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
                    {
                      isEditing && editingSection === 'details' ? (
                        <form className="edit-details-form">
                          <div>
                            <label>Title</label>
                            <input
                              type="text"
                              value={newTitle}
                              onChange={(e) => setNewTitle(e.target.value)}
                              placeholder="Enter event title"
                            />
                          </div>
                          <div>
                            <label>Date</label>
                            <input
                              type="date"
                              value={newDate}
                              onChange={(e) => setNewDate(e.target.value)}
                            />
                          </div>
                          <div>
                            <label>Location</label>
                            <input
                              type="text"
                              value={newLocation}
                              onChange={(e) => setNewLocation(e.target.value)}
                              placeholder="Enter event location"
                            />
                          </div>
                          <div>
                            <label>Description</label>
                            <textarea
                              value={newDescription}
                              onChange={(e) => setNewDescription(e.target.value)}
                              rows={5}
                              placeholder="Enter event details"
                            />
                          </div>
                          <div>
                            <label>Budget</label>
                            <input
                              type="number"
                              value={newBudget}
                              onChange={(e) => setNewBudget(e.target.value)}
                              placeholder="Enter budget"
                            />
                          </div>
                          <div>
                            <label>Number of Guests</label>
                            <input
                              type="number"
                              value={newNumGuests}
                              onChange={(e) => setNewNumGuests(e.target.value)}
                              placeholder="Number of guests"
                            />
                          </div>
                          <div>
                            <label>Teammate</label>
                            <input
                              type="text"
                              value={newTeammate}
                              onChange={(e) => setNewTeammate(e.target.value)}
                              placeholder="Teammate"
                            />
                          </div>
                          <div>
                            <label>Status</label>
                            <select
                              value={newStatus}
                              onChange={(e) => setNewStatus(e.target.value)}
                            >
                              <option value="Planned">Planned</option>
                              <option value="Ongoing">Ongoing</option>
                              <option value="Completed">Completed</option>
                            </select>
                          </div>
                          <div className="button-group">
                            <button type="button" onClick={handleSaveDetails} className="save">Save</button>
                            <button type="button" onClick={handleCancelEditing} className="cancel">Cancel</button>
                          </div>
                        </form>
                      ) : (
                        <div>
                          <p>Description: {selectedEvent.description}</p>
                          <p>Budget: ${selectedEvent.budget}</p>
                          <p>Number of Guests: {selectedEvent.numGuests}</p>
                          <p>Teammate: {selectedEvent.teammate}</p>
                          <p>Status: {selectedEvent.status}</p>
                          <button onClick={() => handleEditSection('details')} className="edit">Edit</button>
                        </div>
                      )
                    }
                  </div>
                )}
              </div>

              {/* Guests Section */}
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
                          <th>Table</th>
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
                                <td><input type="text" name="table" value={newGuest.table} onChange={(e) => setNewGuest({ ...newGuest, table: e.target.value })} placeholder="Table Number" /></td>
                                <td>
                                  <button onClick={handleSaveGuest} className='save'>Save</button>
                                  <button onClick={handleCancelEditing} className='cancel'>Cancel</button>
                                </td>
                              </>
                            ) : (
                              <>
                                <td>{guest.name}</td>
                                <td>{guest.surname}</td>
                                <td>{guest.phone}</td>
                                <td>{guest.confirmation}</td>
                                <td>{guest.table}</td>
                                <td>
                                  <button onClick={() => handleEditSection('guests', index)} className="edit">Edit</button>
                                  <button onClick={() => handleDeleteGuest(index)} className="cancel">Delete</button>
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
                            <td><input type="text" name="table" value={newGuest.table} onChange={(e) => setNewGuest({ ...newGuest, table: e.target.value })} placeholder="Table Number" /></td>
                            <td>
                              <button onClick={handleSaveGuest} className='save'>Save</button>
                              <button onClick={handleCancelEditing} className='cancel'>Cancel</button>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                    {!isEditing && <button onClick={() => handleAddNewRow('guests')} className="edit">Add Guest</button>}
                  </div>
                )}
              </div>

              {/* Tasks Section */}
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
                          <th>Description</th>
                          <th>Deadline</th>
                          <th>Priority</th>
                          <th>Teammate</th>
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
                                <td><input type="text" name="description" value={newTask.description} onChange={(e) => setNewTask({ ...newTask, description: e.target.value })} placeholder="Description" /></td>
                                <td><input type="date" name="deadline" value={newTask.deadline} onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })} /></td>
                                <td>
                                  <select name="priority" value={newTask.priority} onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}>
                                    <option value="Low">Low</option>
                                    <option value="Medium">Medium</option>
                                    <option value="High">High</option>
                                  </select>
                                </td>
                                <td><input type="text" name="teammate" value={newTask.teammate} onChange={(e) => setNewTask({ ...newTask, teammate: e.target.value })} placeholder="Teammate" /></td>
                                <td>
                                  <select name="status" value={newTask.status} onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Completed">Completed</option>
                                  </select>
                                </td>
                                <td>
                                  <button onClick={handleSaveTask} className='save'>Save</button>
                                  <button onClick={handleCancelEditing} className='cancel'>Cancel</button>
                                </td>
                              </>
                            ) : (
                              <>
                                <td>{task.title}</td>
                                <td>{task.description}</td>
                                <td>{task.deadline}</td>
                                <td>{task.priority}</td>
                                <td>{task.teammate}</td>
                                <td>{task.status}</td>
                                <td>
                                  <button onClick={() => handleEditSection('tasks', index)} className="edit">Edit</button>
                                  <button onClick={() => handleDeleteTask(index)} className="cancel">Delete</button>
                                </td>
                              </>
                            )}
                          </tr>
                        ))}
                        {isEditing && editingSection === 'tasks' && editingIndex === null && (
                          <tr>
                            <td><input type="text" name="title" value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} placeholder="Title" /></td>
                            <td><input type="text" name="description" value={newTask.description} onChange={(e) => setNewTask({ ...newTask, description: e.target.value })} placeholder="Description" /></td>
                            <td><input type="date" name="deadline" value={newTask.deadline} onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })} /></td>
                            <td>
                              <select name="priority" value={newTask.priority} onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}>
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                              </select>
                            </td>
                            <td><input type="text" name="teammate" value={newTask.teammate} onChange={(e) => setNewTask({ ...newTask, teammate: e.target.value })} placeholder="Teammate" /></td>
                            <td>
                              <select name="status" value={newTask.status} onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                              </select>
                            </td>
                            <td>
                              <button onClick={handleSaveTask} className='save'>Save</button>
                              <button onClick={handleCancelEditing} className='cancel'>Cancel</button>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                    {!isEditing && <button onClick={() => handleAddNewRow('tasks')} className="edit">Add Task</button>}
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

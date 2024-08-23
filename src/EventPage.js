import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import './EventPage.css';
import { useNavigate } from 'react-router-dom';
import NewEvent from './NewEvent';

const EventPage = () => {
  const [events, setEvents] = useState([
    {
      event_id: '',
      title: '',
      date: '',
      location: '',
      description: '',
      budget: '',
      status: '',
      num_guests: '',
      teammate: '',
      guests: [],
      tasks: [],
    },
  ]);

  const [showNewEventForm, setShowNewEventForm] = useState(false);

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [activeSections, setActiveSections] = useState({
    details: false,
    guests: false,
    tasks: false,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);
  const [newGuest, setNewGuest] = useState({ name: '', surname: '', phone: '', confirmation: 'Pending', table: '' });
  const [newTask, setNewTask] = useState({ title: '', description: '', deadline: '', priority: 'Low', teammate: '', status: 'Not Started' });
  const [newDescription, setNewDescription] = useState('');
  const [newTitle, setNewTitle] = useState('');  // New state for title
  const [newDate, setNewDate] = useState('');  // New state for date
  const [newLocation, setNewLocation] = useState('');  // New state for location
  const [newBudget, setNewBudget] = useState('');  // New state for budget
  const [newStatus, setNewStatus] = useState('');  // New state for status
  const [newNumGuests, setNewNumGuests] = useState('');  // New state for number of guests
  const [newTeammate, setNewTeammate] = useState('');  // New state for teammate
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [needRefresh, setNeedRefresh] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserEvents = async () => {
      try {
        const response = await axios.get('http://localhost:65000/events-with-details', {
          headers: {
            Authorization: `Bearer ${Cookies.get('userToken')}`  // Use token from cookies
          }
        });
        setEvents(response.data);
        console.log(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load events');
        setLoading(false);
      }
    };
    fetchUserEvents();
    setNeedRefresh(false)
  }, [needRefresh]);

  const createNewEvent = async () => {
    setNeedRefresh(true);
    handleCancelNewEvent();
  }
  const handleCreateNewEvent = () => {
    setShowNewEventForm(true); // Show the New Event form when button is clicked
  };

  const handleCancelNewEvent = () => {
    setShowNewEventForm(false); // Hide the form and return to event view
  };

  const handleEventSelection = (event) => {
    setSelectedEvent(event);
    setActiveSections({ details: false, guests: false, tasks: false });
    setIsEditing(false);
    setEditingSection(null);
    setEditingIndex(null);
    setShowNewEventForm(false);
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
      setNewNumGuests(selectedEvent.num_guests);
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
    setNewGuest({ name: '', surname: '', phone: '', confirmation: 'Pending', table: '' });
    setNewTask({ title: '', description: '', deadline: '', priority: 'Low', teammate: '', status: 'Not Started' });
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
        num_guests: newNumGuests,
        teammate: newTeammate
      };

      const response = await axios.put(`http://localhost:65000/events/${selectedEvent.id}`, updatedEvent, {
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
      const response = await axios.delete(`http://localhost:65000/events/${selectedEvent.id}`, {
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
      let response;

      if (editingIndex !== null) {
        // Editing an existing guest
        updatedGuests = [...selectedEvent.guests];
        updatedGuests[editingIndex] = newGuest; // Update the existing guest

        response = await axios.put(`http://localhost:65000/events/${selectedEvent.id}/guests/${selectedEvent.guests[editingIndex].id}`, newGuest, {
          headers: {
            Authorization: `Bearer ${Cookies.get('userToken')}`, // Use token from cookies
          },
        });

      } else {
        response = await axios.post(`http://localhost:65000/events/${selectedEvent.id}/guests`, newGuest, {
          headers: {
            Authorization: `Bearer ${Cookies.get('userToken')}`, // Use token from cookies
          },
        });
      }
      if (response.status === 200 || response.status === 201) {
        alert(response.data.message)
        await fetchUpdatedEvent(selectedEvent.id);
        handleCancelEditing();
      }
    } catch (error) {
      console.error('Error saving the guest:', error);
    }
  };


  const handleDeleteGuest = async (index) => {
    try {
      const guestId = selectedEvent.guests[index].id;  // Get the guest ID
      const response = await axios.delete(`http://localhost:65000/events/${selectedEvent.id}/guests/${guestId}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get('userToken')}`,  // Use token from cookies
        },
      });

      if (response.status === 200) {
        await fetchUpdatedEvent(selectedEvent.id);

        // Update the state to remove the guest
        const updatedGuests = selectedEvent.guests.filter((_, i) => i !== index);
        const updatedEvent = { ...selectedEvent, guests: updatedGuests };

        // Update the state for both selectedEvent and events array
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
      let response;

      if (editingIndex !== null) {
        // Editing an existing task
        updatedTasks = [...selectedEvent.tasks];
        updatedTasks[editingIndex] = newTask;  // Update the existing task
        console.log(newTask);
        response = await axios.put(`http://localhost:65000/events/${selectedEvent.id}/tasks/${selectedEvent.tasks[editingIndex].id}`, newTask, {
          headers: {
            Authorization: `Bearer ${Cookies.get('userToken')}`,  // Use token from cookies
          },
        });
      } else {
        // Adding a new task
        response = await axios.post(`http://localhost:65000/events/${selectedEvent.id}/tasks`, newTask, {
          headers: {
            Authorization: `Bearer ${Cookies.get('userToken')}`,  // Use token from cookies
          },
        });
        console.log(newTask);
      }

      if (response.status === 200 || response.status === 201) {
        alert(response.data.message)
        await fetchUpdatedEvent(selectedEvent.id);
        handleCancelEditing();
      }
    } catch (error) {
      console.error('Error saving the task:', error);
    }
  };


  const handleDeleteTask = async (index) => {
    try {
      const taskId = selectedEvent.tasks[index].id;  // Get the task ID
      const response = await axios.delete(`http://localhost:65000/events/${selectedEvent.id}/tasks/${taskId}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get('userToken')}`,  // Use token from cookies
        },
      });

      if (response.status === 200) {
        await fetchUpdatedEvent(selectedEvent.id);

        const updatedTasks = selectedEvent.tasks.filter((_, i) => i !== index);
        const updatedEvent = { ...selectedEvent, tasks: updatedTasks };
        setEvents(events.map(event => event.id === selectedEvent.id ? updatedEvent : event));
        setSelectedEvent(updatedEvent);
      }
    } catch (error) {
      console.error('Error deleting the task:', error);
    }
  };

  const fetchUpdatedEvent = async (eventId) => {
    try {
      const response = await axios.get(`http://localhost:65000/events-with-details/${eventId}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get('userToken')}`, // Use token from cookies
        },
      });
      const updatedEvent = response.data;

      // Update the event in the global events array
      setEvents(events.map(event => event.id === eventId ? updatedEvent : event));
      // Set the selected event to the updated event
      setSelectedEvent(updatedEvent);
    } catch (error) {
      console.error('Error fetching updated event:', error);
    }
  };

  const handleAddNewRow = (section) => {
    setEditingSection(section);
    setIsEditing(true);
    setEditingIndex(null);

    if (section === 'guests') {
      setNewGuest({ name: '', surname: '', phone: '', confirmation: 'Pending', table: '' });
    } else if (section === 'tasks') {
      setNewTask({ title: '', description: '', openedBy: '', deadline: '', priority: 'Low', teammate: '', status: 'Not Started' });
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
              {console.log(event)}
            </li>
          ))}
        </ul>
        <button onClick={handleCreateNewEvent} className="create-event-button">Create New Event</button>
      </div>
      {showNewEventForm ? (<NewEvent onCancel={handleCancelNewEvent} createEvent={createNewEvent} />
      ) : (
        <>
          <div className="event-details">
            {selectedEvent && (
              <>
                <h1>{selectedEvent.title}</h1>
                <p className="event-subtitle">
                  <strong>Date:</strong> {new Date(selectedEvent.date).toLocaleDateString()} | <strong>Location:</strong> {selectedEvent.location}
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
                              <p>Number of Guests: {selectedEvent.num_guests}</p>
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
                                        <option value="Pending">Pending</option>
                                        <option value="Confirmed">Confirmed</option>
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
                                        <option value="Not Started">Not Started</option>
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
                                    <option value="Not Started">Not Started</option>
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
        </>
      )
      };</div>
  );
};

export default EventPage;

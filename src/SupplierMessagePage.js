import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './SupplierMessagesPage.css';

const SupplierMessagesPage = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingStatusId, setEditingStatusId] = useState(null); // Track which inquiry is being edited
  const [newStatus, setNewStatus] = useState(''); // Track the new status during editing

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get('/api/supplier-messages'); // Replace with your actual API endpoint
        setMessages(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load messages');
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  const handleEditStatus = (id, currentStatus) => {
    setEditingStatusId(id);
    setNewStatus(currentStatus); // Initialize the new status with the current status
  };

  const handleSaveStatus = async (id) => {
    try {
      // Update the status in the backend
      await axios.put(`/api/supplier-messages/${id}`, { status: newStatus });

      // Update the status in the frontend
      setMessages((prevMessages) =>
        prevMessages.map((message) =>
          message.id === id ? { ...message, status: newStatus } : message
        )
      );
      setEditingStatusId(null); // Exit editing mode after saving
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleCancelEdit = () => {
    setEditingStatusId(null); // Exit editing mode without saving changes
  };

//   if (loading) {
//     return <p>Loading...</p>;
//   }

//   if (error) {
//     return <p>{error}</p>;
//   }

const Inquries = [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john.doe@example.com",
      "phone": "+1 555-123-4567",
      "message": "I'm interested in your catering services for a wedding in December. Could you please provide more details on pricing and availability?",
      "date": "2024-08-01T10:00:00Z",
      "status": "Pending"
    },
    {
      "id": 2,
      "name": "Jane Smith",
      "email": "jane.smith@example.com",
      "phone": "+1 555-987-6543",
      "message": "I'm looking for decoration services for a corporate event. Do you offer package deals for large events?",
      "date": "2024-08-02T12:30:00Z",
      "status": "In Progress"
    },
    {
      "id": 3,
      "name": "Michael Johnson",
      "email": "michael.johnson@example.com",
      "phone": "+1 555-555-5555",
      "message": "I need a DJ for a birthday party. Do you have any availability in November?",
      "date": "2024-08-03T09:45:00Z",
      "status": "Resolved"
    },
    {
      "id": 4,
      "name": "Emily Davis",
      "email": "emily.davis@example.com",
      "phone": "+1 555-222-3333",
      "message": "Can you provide details on your photography services? I'm planning a family reunion and need a photographer.",
      "date": "2024-08-04T14:00:00Z",
      "status": "Pending"
    },
    {
      "id": 5,
      "name": "Chris Brown",
      "email": "chris.brown@example.com",
      "phone": "+1 555-444-7777",
      "message": "I would like to know more about your event hall rentals. I'm organizing a charity event.",
      "date": "2024-08-05T16:30:00Z",
      "status": "In Progress"
    }
  ]
  
  return (
    <div className="supplier-messages-page">
      <h1>Customer Inquiries</h1>
      {Inquries.length > 0 ? (
        <table className="messages-table">
          <thead>
            <tr>
              <th>Inquiry Number</th>
              <th>Customer Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Message</th>
              <th>Date Sent</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {Inquries.map((message, index) => (
              <tr key={message.id}>
                <td>{index + 1}</td>
                <td>{message.name}</td>
                <td>{message.email}</td>
                <td>{message.phone}</td>
                <td>{message.message}</td>
                <td>{new Date(message.date).toLocaleDateString()}</td>
                <td>
                  {editingStatusId === message.id ? (
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  ) : (
                    <span>{message.status}</span>
                  )}
                </td>
                <td>
                  {editingStatusId === message.id ? (
                    <>
                      <button
                        onClick={() => handleSaveStatus(message.id)}
                        className="save-button"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="cancel-button"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleEditStatus(message.id, message.status)}
                      className="edit-button"
                    >
                      Edit Status
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No messages found.</p>
      )}
    </div>
  );
};

export default SupplierMessagesPage;

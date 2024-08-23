import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx'; // Import the xlsx library
import './SupplierMessagesPage.css';
import Cookies from 'js-cookie';

const SupplierMessagesPage = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingStatusId, setEditingStatusId] = useState(null); // Track which inquiry is being edited
  const [newStatus, setNewStatus] = useState(''); // Track the new status during editing

  // Filters
  const [filterName, setFilterName] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`http://localhost:65000/supplier-messages`, {
          headers: {
            Authorization: `Bearer ${Cookies.get('userToken')}`
          }
        });
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
      await axios.put(`http://localhost:65000/supplier-messages/${id}`, { status: newStatus }, {
        headers: {
          Authorization: `Bearer ${Cookies.get('userToken')}`
        }
      });

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

  const applyFilters = (message) => {
    const messageDate = new Date(message.date);
    const dateFrom = filterDateFrom ? new Date(filterDateFrom) : null;
    const dateTo = filterDateTo ? new Date(filterDateTo) : null;

    return (
      (filterName === '' || message.first_name.toLowerCase().includes(filterName.toLowerCase()) 
      || message.last_name.toLowerCase().includes(filterName.toLowerCase())) &&
      (filterStatus === '' || message.status === filterStatus) &&
      (!dateFrom || messageDate >= dateFrom) &&
      (!dateTo || messageDate <= dateTo)
    );
  };

  const filteredMessages = messages.filter(applyFilters);

  const handleExport = () => {
    const exportData = filteredMessages.map((message, index) => ({
      "Inquiry Number": index + 1,
      "First Name": message.first_name,
      "Surname": message.last_name,
      "Email": message.email,
      "Phone": message.number_phone,
      "Message": message.message,
      "Date Sent": new Date(message.date).toLocaleDateString(),
      "Status": message.status,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Inquiries");
    XLSX.writeFile(workbook, "Customer_Inquiries.xlsx");
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="supplier-messages-page">
      <h1>Customer Inquiries</h1>

      <div className="filters-section">
        <h3>Filters</h3>
        <div className="filters">
          <div className="filter-block">
            <label>Filter by Name</label>
            <input
              type="text"
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
            />
          </div>
          <div className="filter-block">
            <label>Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
          <div className="filter-block">
            <label>From Date</label>
            <input
              type="date"
              value={filterDateFrom}
              onChange={(e) => setFilterDateFrom(e.target.value)}
            />
          </div>
          <div className="filter-block">
            <label>To Date</label>
            <input
              type="date"
              value={filterDateTo}
              onChange={(e) => setFilterDateTo(e.target.value)}
            />
          </div>
          <div className="filter-block reset-block">
            <button onClick={() => { setFilterName(''); setFilterStatus(''); setFilterDateFrom(''); setFilterDateTo(''); }}>Reset Filters</button>
          </div>
        </div>
      </div>

      <div className="export-section">
        <button onClick={handleExport}>Export to Excel</button>
      </div>

      {filteredMessages.length > 0 ? (
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
            {filteredMessages.map((message, index) => (
              <tr key={message.id}>
                <td>{index + 1}</td>
                <td>{message.first_name + " " + message.last_name}</td>
                <td>{message.email}</td>
                <td className='phone-cell'>{message.phone_number}</td>
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
                <td className="actions-cell">
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
                      Edit
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

import React, { useState, useEffect } from 'react';
import './ServicesPage.css';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Buffer } from 'buffer';


const ServicesPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);

  const initialCategory = queryParams.get('category') || '';

  const [category, setCategory] = useState(initialCategory);
  const [locationFilter, setLocationFilter] = useState('');
  const [rating, setRating] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [suppliers, setSuppliers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await axios.get('http://localhost:65000/suppliers', {
          headers: {
            Authorization: `Bearer ${Cookies.get('userToken')}`
          }
        });
        setSuppliers(response.data);
      } catch (err) {
        setError('Failed to load suppliers');
      }
    };

    fetchSuppliers();
  }, []);

  const handleMoreInfoClick = (id) => {
    navigate(`/profile/${id}`);
  };

  const filteredServices = suppliers.filter((service) => {
    return (
      (category === '' || service.supplier_category === category) &&
      (locationFilter === '' || service.location === locationFilter) &&
      (rating === '' || service.rating >= parseFloat(rating)) &&
      (searchTerm === '' || service.first_name.toLowerCase().includes(searchTerm.toLowerCase()) || service.last_name.toLowerCase().includes(searchTerm.toLowerCase())) // Filtering by search term
    );
  });

  return (
    <div className="services-page-container">
      {filteredServices.length > 0 ? (
        <div className="services-grid">
          {filteredServices.map((service) => (
            <div className="service-card" key={service.id}>
              {console.log(service)}
              <img src={`data:image/jpeg;base64,${Buffer.from(service.cover_image).toString('base64')}`} alt={service.title} className="service-image" />
              <div className="service-info">
                <h3>{service.first_name + " " + service.last_name}</h3>
                <p><strong>Category:</strong> {service.supplier_category}</p>
                <p><strong>Location:</strong> {service.location}</p>
                <p>{service.rating}★ ({service.reviews} Reviews) </p>
                <button
                  className="info-button"
                  onClick={() => handleMoreInfoClick(service.id)}
                >+ INFO</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-results-container">
          <img src="/not_found.gif" alt="No results found" className="not-found-gif" />
        </div>
      )}
      <div className="sidebar">
        <h4>Category</h4>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All</option>
          <option value="Catering">Catering</option>
          <option value="Photography">Photography</option>
          <option value="Music">Music</option>
          <option value="Hall">Hall</option>
          <option value="Decoration">Decoration</option>
        </select>

        <h4>Location</h4>
        <select value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)}>
          <option value="">All</option>
          <option value="Tel Aviv">Tel Aviv</option>
          <option value="Jerusalem">Jerusalem</option>
          <option value="Haifa">Haifa</option>
          <option value="Beer Sheva">Beer Sheva</option>
          <option value="Ness Ziona">Ness Ziona</option>
        </select>

        <h4>Rating</h4>
        <select value={rating} onChange={(e) => setRating(e.target.value)}>
          <option value="">All</option>
          <option value="4.5">4.5+</option>
          <option value="4.0">4.0+</option>
          <option value="3.5">3.5+</option>
        </select>

        <h4>Search</h4>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search services..."
          className="search-input"
        />
      </div>
    </div>
  );
};

export default ServicesPage;

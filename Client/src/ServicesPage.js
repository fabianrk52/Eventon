import React, { useState, useEffect } from 'react';
import './ServicesPage.css';
import { useNavigate, useLocation } from 'react-router-dom';

const ServicesPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const initialCategory = queryParams.get('category') || '';

  const [category, setCategory] = useState(initialCategory);
  const [locationFilter, setLocationFilter] = useState('');
  const [rating, setRating] = useState('');
  const [searchTerm, setSearchTerm] = useState(''); // New state for the free text search

  // Example data, you can replace this with dynamic data fetching
  const allServices = [
    {
      id: 1,
      title: 'TLV Food Catering',
      rating: 4.9,
      reviews: 159,
      location: 'Tel Aviv',
      category: 'Catering',
      image: '/catering.jpg',
    },
    {
      id: 2,
      title: 'Moshe Photography',
      rating: 4.8,
      reviews: 35,
      location: 'Jerusalem',
      category: 'Photography',
      image: '/cover-profile.jpg',
    },
    {
      id: 3,
      title: 'Aviv DJ',
      rating: 4.7,
      reviews: 48,
      location: 'Haifa',
      category: 'Music',
      image: '/dj.jpg',
    },
    {
      id: 4,
      title: 'Hatuna Event Hall',
      rating: 4.7,
      reviews: 48,
      location: 'Jerusalem',
      category: 'Hall',
      image: '/weeding.jpg',
    },
    {
      id: 5,
      title: 'Franky Event Designer',
      rating: 4.7,
      reviews: 48,
      location: 'Tel Aviv',
      category: 'Decoration',
      image: '/design.jpg',
    },
  ];

  const handleMoreInfoClick = (id) => {
    navigate(`/profile/${id}`);
  };

  const filteredServices = allServices.filter((service) => {
    return (
      (category === '' || service.category === category) &&
      (locationFilter === '' || service.location === locationFilter) &&
      (rating === '' || service.rating >= parseFloat(rating)) &&
      (searchTerm === '' || service.title.toLowerCase().includes(searchTerm.toLowerCase())) // Filtering by search term
    );
  });

  return (
    <div className="services-page-container">
      {filteredServices.length > 0 ? (
        <div className="services-grid">
          {filteredServices.map((service) => (
            <div className="service-card" key={service.id}>
              <img src={service.image} alt={service.title} className="service-image" />
              <div className="service-info">
                <h3>{service.title}</h3>
                <p><strong>Category:</strong> {service.category}</p>
                <p><strong>Location:</strong> {service.location}</p>
                <p>({service.reviews} Reviews) {service.rating} <span className="stars">★★★★★</span></p>
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

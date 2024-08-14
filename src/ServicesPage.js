import React, { useState } from 'react';
import './ServicesPage.css';
import { useNavigate } from 'react-router-dom';

const ServicesPage = () => {
  const navigate = useNavigate();

  // Example data, you can replace this with dynamic data fetching
  const allServices = [
    {
      id: 1,
      title: 'TLV Food Catering',
      rating: 4.9,
      reviews: 159,
      location: 'Tel Aviv',
      category: 'Catering',
      image: '/catering.jpeg',
    },
    {
      id: 2,
      title: 'Moshe Photography',
      rating: 4.8,
      reviews: 35,
      location: 'Jerusalem',
      category: 'Photography',
      image: '/cover-profile.webp',
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
      category: 'Venue',
      image: '/weeding.jpeg',
    },
    {
      id: 5,
      title: 'Franky Event Designer',
      rating: 4.7,
      reviews: 48,
      location: 'Tel Aviv',
      category: 'Design',
      image: '/design.jpg',
    },
  ];

  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [rating, setRating] = useState('');
  const [searchTerm, setSearchTerm] = useState(''); // New state for the free text search

  const handleMoreInfoClick = (id) => {
    navigate(`/profile/${id}`);
  };

  const filteredServices = allServices.filter((service) => {
    return (
      (category === '' || service.category === category) &&
      (location === '' || service.location === location) &&
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
          <option value="Venue">Venue</option>
          <option value="Design">Design</option>
        </select>

        <h4>Location</h4>
        <select value={location} onChange={(e) => setLocation(e.target.value)}>
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

import React, { useState } from 'react';
import './EventonLandingPage.css';

const testimonials = [
  {
    name: 'Tom Weiss',
    title: 'Event planner',
    review: 'This event planning system exceeded my expectations in every aspect. Its user-friendly interface made navigating through various features a breeze.',
    rating: 5,
    date: '22 September 2023',
    profilePic: '/tom.jpg',
  },
  {
    name: 'Sarah Johnson',
    title: 'Wedding Organizer',
    review: 'EventOn helped me organize the perfect wedding. The timeline feature kept everything on track, and the vendor management tools were a lifesaver!',
    rating: 5,
    date: '10 October 2023',
    profilePic: '/sarah.jpg',
  },
  {
    name: 'James Smith',
    title: 'Corporate Event Manager',
    review: 'Managing corporate events has never been easier. EventOn’s tools for tracking budgets and handling logistics are top-notch.',
    rating: 4.5,
    date: '5 November 2023',
    profilePic: 'james.jpeg',
  },
];

const EventonLandingPage = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const handleNext = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="landing-page">
      <div className="landing-hero">
        <div className="image-grid">
          <img src="landing1.jpg" alt="Event Planning 1" />
          <img src="landing2.jpg" alt="Event Planning 2" />
          <img src="landing3.jpg" alt="Event Planning 3" />
        </div>
        <div className="hero-text">
          <h1>Let's start Planning</h1>
          <p>
            EventOn is a comprehensive event planning system designed to streamline every aspect of organizing memorable events with ease and efficiency. Experience the power of efficient event planning, Sign up today.
          </p>
        </div>
      </div>

      <div className="testimonial-section">
        <button onClick={handlePrev} className="testimonial-nav prev">&lt;</button>
        <div className="testimonial-card">
          <div className="profile-picture">
            <img src={testimonials[currentTestimonial].profilePic} alt={testimonials[currentTestimonial].name} />
          </div>
          <div className="testimonial-content">
            <h3>{testimonials[currentTestimonial].name}</h3>
            <p>{testimonials[currentTestimonial].title}</p>
            <p>{testimonials[currentTestimonial].review}</p>
            <div className="rating">
              <span>{'★'.repeat(testimonials[currentTestimonial].rating)}</span>
            </div>
          </div>
          <div className="testimonial-date">
            <p>{testimonials[currentTestimonial].date}</p>
          </div>
        </div>
        <button onClick={handleNext} className="testimonial-nav next">&gt;</button>
      </div>
    </div>
  );
};

export default EventonLandingPage;

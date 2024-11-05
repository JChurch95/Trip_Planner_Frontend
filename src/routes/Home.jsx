import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import styles from './Home.module.css';

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    destination: '',
    start_date: '',
    end_date: '',
    arrival_time: '',
    departure_time: '',
    dietary_preferences: '',
    activity_preferences: '',
    additional_notes: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8000/trips/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.access_token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to create trip');
      }

      const data = await response.json();
      navigate(`/itinerary/${data.trip.id}`);
    } catch (error) {
      console.error('Error creating trip:', error);
      // Handle error (show message to user, etc.)
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Plan Your Trip</h1>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="destination">Destination</label>
          <input
            type="text"
            id="destination"
            name="destination"
            value={formData.destination}
            onChange={handleInputChange}
            required
            className={styles.input}
            placeholder="Enter your destination"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="start_date">Start Date</label>
          <input
            type="date"
            id="start_date"
            name="start_date"
            value={formData.start_date}
            onChange={handleInputChange}
            required
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="end_date">End Date</label>
          <input
            type="date"
            id="end_date"
            name="end_date"
            value={formData.end_date}
            onChange={handleInputChange}
            required
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="arrival_time">Arrival Time</label>
          <input
            type="time"
            id="arrival_time"
            name="arrival_time"
            value={formData.arrival_time}
            onChange={handleInputChange}
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="departure_time">Departure Time</label>
          <input
            type="time"
            id="departure_time"
            name="departure_time"
            value={formData.departure_time}
            onChange={handleInputChange}
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="dietary_preferences">Dietary Preferences</label>
          <textarea
            id="dietary_preferences"
            name="dietary_preferences"
            value={formData.dietary_preferences}
            onChange={handleInputChange}
            className={styles.textarea}
            placeholder="Any dietary restrictions or preferences?"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="activity_preferences">Activity Preferences</label>
          <textarea
            id="activity_preferences"
            name="activity_preferences"
            value={formData.activity_preferences}
            onChange={handleInputChange}
            className={styles.textarea}
            placeholder="What kinds of activities do you enjoy?"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="additional_notes">Additional Notes</label>
          <textarea
            id="additional_notes"
            name="additional_notes"
            value={formData.additional_notes}
            onChange={handleInputChange}
            className={styles.textarea}
            placeholder="Any other details you'd like to share?"
          />
        </div>

        <button type="submit" className={styles.button}>
          Generate Itinerary
        </button>
      </form>
    </div>
  );
}
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import styles from './Itinerary.module.css';

export default function Itinerary() {
  const { tripId } = useParams();
  const { user} = useAuth();
  const [tripData, setTripData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const accessToken = sessionStorage.getItem('sb-access-token');

  useEffect(() => {
    const fetchTripData = async () => {
      try {
        const response = await fetch(`http://localhost:8000/trips/${tripId}`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch trip data');
        }

        const data = await response.json();
        setTripData(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching trip:', error);
        setError('Failed to load itinerary');
        setLoading(false);
      }
    };

    fetchTripData();
  }, [tripId, user]);

  if (loading) {
    return <div className={styles.loading}>Loading itinerary...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  if (!tripData) {
    return <div className={styles.error}>No trip data found</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Your Trip to {tripData.trip.destination}</h1>
      
      <div className={styles.tripDetails}>
        <p><strong>Dates:</strong> {new Date(tripData.trip.start_date).toLocaleDateString()} - {new Date(tripData.trip.end_date).toLocaleDateString()}</p>
        {tripData.trip.arrival_time && <p><strong>Arrival:</strong> {tripData.trip.arrival_time}</p>}
        {tripData.trip.departure_time && <p><strong>Departure:</strong> {tripData.trip.departure_time}</p>}
      </div>

      <div className={styles.itineraryList}>
        {tripData.itineraries.map((day) => (
          <div key={day.day_number} className={styles.dayCard}>
            <h2 className={styles.dayTitle}>Day {day.day_number} - {new Date(day.date).toLocaleDateString()}</h2>
            
            <div className={styles.activities}>
              <section className={styles.section}>
                <h3>Morning</h3>
                <p>{day.morning_activities}</p>
              </section>

              <section className={styles.section}>
                <h3>Lunch</h3>
                <p>{day.lunch_suggestions}</p>
              </section>

              <section className={styles.section}>
                <h3>Afternoon</h3>
                <p>{day.afternoon_activities}</p>
              </section>

              <section className={styles.section}>
                <h3>Dinner</h3>
                <p>{day.dinner_suggestions}</p>
              </section>

              <section className={styles.section}>
                <h3>Evening</h3>
                <p>{day.evening_activities}</p>
              </section>
            </div>

            <div className={styles.aiSuggestions}>
              <h3>AI Generated Suggestions</h3>
              <p>{day.ai_suggestions}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
import { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { 
  Calendar, 
  MapPin, 
  Star,
  Clock,
  AlertTriangle,
  Building,
  ArrowRight,
  Coffee,
  Utensils,
  Sunset
} from 'lucide-react';
import styles from './Itinerary.module.css';

const LoadingState = () => (
  <div className={styles.loadingState}>
    <div className={styles.spinner} />
    <p className="mt-4 text-gray-600">Loading your itinerary...</p>
  </div>
);

const EmptyState = () => (
  <div className={styles.emptyState}>
    <AlertTriangle className="w-12 h-12 text-gray-400 mb-4" />
    <p className="text-gray-600">No itinerary details available</p>
  </div>
);

const ErrorState = ({ message }) => (
  <div className={styles.errorState}>
    <AlertTriangle className="w-12 h-12 text-red-400 mb-4" />
    <p className="text-red-600">{message}</p>
  </div>
);

const AccommodationCard = ({ hotel }) => (
  <div className={styles.accommodationCard}>
    <div className={styles.cardHeader}>
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-gray-900">{hotel.name}</h3>
        <div className={styles.rating}>
          <Star className="w-4 h-4 mr-1" />
          <span>{hotel.rating}</span>
        </div>
      </div>
      <div className="flex items-start text-gray-600 mb-3">
        <MapPin className="w-5 h-5 mr-2 flex-shrink-0" />
        <p>{hotel.location}</p>
      </div>
      <p className="text-gray-600 mb-4">{hotel.description}</p>
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="text-gray-600">
          <span className="font-semibold text-gray-900">${hotel.nightly_rate}</span> / night
        </div>
        <a 
          href={hotel.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
        >
          View Details
          <ArrowRight className="w-4 h-4 ml-1" />
        </a>
      </div>
    </div>
  </div>
);

const ActivityCard = ({ activity, time, icon: Icon }) => (
  <div className={styles.activityCard}>
    <div className="flex items-center mb-3">
      <div className={styles.icon}>
        <Icon className="w-full h-full" />
      </div>
      <div className="ml-3">
        <h4 className="font-medium text-gray-900">{activity.activity || activity.spot}</h4>
        {time && <p className="text-sm text-gray-500">{time}</p>}
      </div>
    </div>
    <p className="text-gray-600 text-sm">{activity.description}</p>
    
    <div className="flex items-center justify-between">
      {activity.rating && (
        <div className="mt-2 flex items-center text-gray-500">
          <Star className="w-4 h-4 text-yellow-400 fill-current" />
          <span className="ml-1 text-sm">{activity.rating}</span>
        </div>
      )}
      
      {activity.url && (
        <a 
          href={activity.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
        >
          View Details
          <ArrowRight className="w-4 h-4 ml-1" />
        </a>
      )}
    </div>
  </div>
);

export default function Itinerary() {
  const { tripId } = useParams();
  const { token } = useAuth();
  const [itineraryData, setItineraryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchItineraryData = async () => {
      if (!tripId || !token) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const [detailsResponse, itineraryResponse] = await Promise.all([
          fetch(`http://localhost:8000/trips/${tripId}/details`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }),
          fetch(`http://localhost:8000/itineraries/${tripId}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          })
        ]);

        if (!detailsResponse.ok || !itineraryResponse.ok) {
          throw new Error('Failed to fetch itinerary data');
        }

        const [tripDetails, itineraryDetails] = await Promise.all([
          detailsResponse.json(),
          itineraryResponse.json()
        ]);

        // Parse the daily_schedule if it's a string
        let processedDailySchedule = itineraryDetails.daily_schedule;
        if (typeof processedDailySchedule === 'string') {
          try {
            processedDailySchedule = JSON.parse(processedDailySchedule);
          } catch (e) {
            console.error('Error parsing daily_schedule:', e);
            processedDailySchedule = [];
          }
        }

        // Ensure accommodation is properly structured
        const processedAccommodation = itineraryDetails.accommodation || [];

        setItineraryData({
          ...tripDetails,
          ...itineraryDetails,
          daily_schedule: Array.isArray(processedDailySchedule) ? processedDailySchedule : [],
          accommodation: Array.isArray(processedAccommodation) ? processedAccommodation : []
        });
      } catch (err) {
        console.error('Error fetching itinerary:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchItineraryData();
  }, [tripId, token]);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;
  if (!itineraryData) return <EmptyState />;

  // Ensure the accommodation array exists and has items
  const accommodations = Array.isArray(itineraryData.accommodation) ? itineraryData.accommodation : [];
  const hasAccommodations = accommodations.length > 0;

  return (
    <div className={styles.container}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className={styles.header}>
          <h1 className={styles.title}>{itineraryData.destination}</h1>
          <div className={styles.dateRange}>
            <Calendar className="w-5 h-5 text-blue-500" />
            <span>
              {new Date(itineraryData.start_date).toLocaleDateString()} -{" "}
              {new Date(itineraryData.end_date).toLocaleDateString()}
            </span>
          </div>
        </header>

        {/* Accommodations */}
        {hasAccommodations && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Where You'll Stay</h2>
            <div className={styles.accommodationGrid}>
              {accommodations.map((hotel, index) => (
                <AccommodationCard key={index} hotel={hotel} />
              ))}
            </div>
          </section>
        )}

        {/* Daily Schedule */}
        {Array.isArray(itineraryData.daily_schedule) && itineraryData.daily_schedule.length > 0 && (
          <section>
            {itineraryData.daily_schedule.map((day, index) => (
              <div key={index} className={styles.scheduleCard}>
                <div className={styles.dayHeader}>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Day {index + 1}
                    {day.date && 
                      <span className="text-gray-500 ml-2">
                        {new Date(day.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    }
                  </h2>
                </div>
                
                <div className="p-6">
                  <div className={styles.scheduleGrid}>
                    {/* Morning */}
                    <div className="space-y-4">
                      <ActivityCard 
                        activity={day.breakfast}
                        time="Morning"
                        icon={Coffee}
                      />
                      <ActivityCard 
                        activity={day.morning_activity}
                        icon={Building}
                      />
                    </div>

                    {/* Afternoon */}
                    <div className="space-y-4">
                      <ActivityCard 
                        activity={day.lunch}
                        time="Afternoon"
                        icon={Utensils}
                      />
                      <ActivityCard 
                        activity={day.afternoon_activity}
                        icon={Building}
                      />
                    </div>

                    {/* Evening */}
                    <div className="space-y-4">
                      <ActivityCard 
                        activity={day.dinner}
                        time="Evening"
                        icon={Utensils}
                      />
                      <ActivityCard 
                        activity={day.evening_activity}
                        icon={Sunset}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </section>
        )}
      </div>
    </div>
  );
}

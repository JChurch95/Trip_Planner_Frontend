import { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Coffee, 
  Sun, 
  Moon,
  Star,
  Info,
  Navigation,
  Umbrella,
  Heart,
  AlertTriangle
} from 'lucide-react';

// Helper components for consistent UI elements
const EmptyState = ({ message }) => (
  <div className="flex flex-col items-center justify-center p-6 text-gray-500 bg-gray-50 rounded-lg">
    <AlertTriangle className="w-8 h-8 mb-2" />
    <p>{message}</p>
  </div>
);

const LoadingState = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

const ErrorState = ({ message }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center text-red-600">
      <AlertTriangle className="w-12 h-12 mx-auto mb-4" />
      <p className="text-lg">{message}</p>
    </div>
  </div>
);

const ActivitySection = ({ icon: Icon, title, activity, time, location, url }) => {
  if (!activity && !time && !location) {
    return <EmptyState message={`No ${title.toLowerCase()} activities planned yet`} />;
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-5 h-5 text-blue-500" />
        <h4 className="font-medium text-gray-900">{title}</h4>
      </div>
      {activity && <p className="text-gray-700 mb-2">{activity}</p>}
      {time && (
        <div className="flex items-center gap-1 text-gray-600 mb-1">
          <Clock className="w-4 h-4" />
          <span className="text-sm">{time}</span>
        </div>
      )}
      {location && (
        <div className="flex items-center gap-1 text-gray-600">
          <MapPin className="w-4 h-4" />
          <span className="text-sm">{location}</span>
        </div>
      )}
      {url && (
        <a 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center text-blue-500 hover:text-blue-600 mt-2"
        >
          <Navigation className="w-4 h-4 mr-1" />
          More Info
        </a>
      )}
    </div>
  );
};

const MealSection = ({ icon: Icon, title, spot, rating }) => {
  if (!spot && !rating) {
    return <EmptyState message={`No ${title.toLowerCase()} plans yet`} />;
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Icon className="w-5 h-5 text-blue-500" />
          <h4 className="font-medium text-gray-900">{title}</h4>
        </div>
        {rating > 0 && (
          <div className="flex items-center gap-1 text-yellow-500">
            <Star className="w-4 h-4 fill-current" />
            <span className="text-sm">{rating.toFixed(1)}</span>
          </div>
        )}
      </div>
      {spot && <p className="text-gray-700">{spot}</p>}
    </div>
  );
};

const DayCard = ({ day, index }) => {
  if (!day) return null;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
      <div className="bg-gray-50 px-6 py-4 border-b">
        <h2 className="text-xl font-semibold text-gray-900">
          Day {index + 1} - {new Date(day.date).toLocaleDateString()}
        </h2>
      </div>
      
      <div className="p-6 space-y-6">
        {/* Morning Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <MealSection
            icon={Coffee}
            title="Breakfast"
            spot={day.breakfast_spot}
            rating={day.breakfast_rating}
          />
          <ActivitySection
            icon={Sun}
            title="Morning Activity"
            activity={day.morning_activity}
            time={day.morning_activity_time}
            location={day.morning_activity_location}
            url={day.morning_activity_url}
          />
        </div>

        {/* Afternoon Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <MealSection
            icon={Sun}
            title="Lunch"
            spot={day.lunch_spot}
            rating={day.lunch_rating}
          />
          <ActivitySection
            icon={Sun}
            title="Afternoon Activity"
            activity={day.afternoon_activity}
            time={day.afternoon_activity_time}
            location={day.afternoon_activity_location}
            url={day.afternoon_activity_url}
          />
        </div>

        {/* Evening Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <MealSection
            icon={Moon}
            title="Dinner"
            spot={day.dinner_spot}
            rating={day.dinner_rating}
          />
          <ActivitySection
            icon={Moon}
            title="Evening Activity"
            activity={day.evening_activity}
            time={day.evening_activity_time}
            location={day.evening_activity_location}
            url={day.evening_activity_url}
          />
        </div>
      </div>
    </div>
  );
};

export default function Itinerary() {
  const { tripId } = useParams();
  const { token } = useAuth();
  const [activeView, setActiveView] = useState("daily");
  const [tripDetails, setTripDetails] = useState(null);
  const [dailyItineraries, setDailyItineraries] = useState([]);
  const [accommodations, setAccommodations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTripData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const headers = { Authorization: `Bearer ${token}` };
        const baseUrl = 'http://localhost:8000';

        // Fetch required data in parallel
        const [detailsRes, itinerariesRes, accommodationsRes] = await Promise.all([
          fetch(`${baseUrl}/trips/${tripId}/details`, { headers }),
          fetch(`${baseUrl}/trips/${tripId}/daily-itineraries`, { headers }),
          fetch(`${baseUrl}/trips/${tripId}/accommodations`, { headers })
        ]);

        // Check for non-200 responses and get error messages
        if (!detailsRes.ok || !itinerariesRes.ok || !accommodationsRes.ok) {
          const errorMessages = await Promise.all([
            detailsRes.ok ? null : detailsRes.text(),
            itinerariesRes.ok ? null : itinerariesRes.text(),
            accommodationsRes.ok ? null : accommodationsRes.text()
          ]);
          throw new Error(`API Error: ${errorMessages.filter(Boolean).join(', ')}`);
        }

        // Parse all responses
        const [details, itineraries, accommodations] = await Promise.all([
          detailsRes.json(),
          itinerariesRes.json(),
          accommodationsRes.json()
        ]);

        console.log('Fetched trip details:', details);
        console.log('Fetched daily itineraries:', itineraries);
        console.log('Fetched accommodations:', accommodations);

        setTripDetails(details);
        setDailyItineraries(itineraries);
        setAccommodations(accommodations);
      } catch (error) {
        console.error("Error fetching trip data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (tripId && token) {
      fetchTripData();
    }
  }, [tripId, token]);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;
  if (!tripDetails) return <ErrorState message="No trip data found" />;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Your Trip to {tripDetails.destination}
          </h1>
          <div className="flex items-center justify-center gap-2 text-gray-600">
            <Calendar className="w-5 h-5" />
            <span>
              {new Date(tripDetails.start_date).toLocaleDateString()} -{" "}
              {new Date(tripDetails.end_date).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setActiveView("accommodation")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              activeView === "accommodation"
                ? "bg-blue-500 text-white"
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            <MapPin className="w-5 h-5" />
            Accommodations
          </button>
          <button
            onClick={() => setActiveView("daily")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              activeView === "daily"
                ? "bg-blue-500 text-white"
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            <Calendar className="w-5 h-5" />
            Daily Itinerary
          </button>
        </div>

        {/* Content */}
        {activeView === "accommodation" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {accommodations.length === 0 ? (
              <EmptyState message="No accommodations found" />
            ) : (
              accommodations.map((hotel, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-semibold text-gray-900">{hotel.name}</h3>
                      {hotel.rating > 0 && (
                        <div className="flex items-center gap-1 text-yellow-500">
                          <Star className="w-4 h-4 fill-current" />
                          <span>{hotel.rating.toFixed(1)}</span>
                        </div>
                      )}
                    </div>
                    {hotel.description && (
                      <p className="text-gray-600 mb-4">{hotel.description}</p>
                    )}
                    {hotel.location && (
                      <div className="flex items-center text-gray-600 mb-2">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span>{hotel.location}</span>
                      </div>
                    )}
                    {hotel.unique_features && (
                      <div className="mt-4 text-gray-600">
                        <h4 className="font-medium text-gray-900 mb-1">Unique Features</h4>
                        <p>{hotel.unique_features}</p>
                      </div>
                    )}
                    {hotel.price_range && (
                      <div className="mt-2 text-gray-600">
                        <span className="font-medium">Price Range:</span> {hotel.price_range}
                      </div>
                    )}
                    {hotel.website_url && (
                      <a
                        href={hotel.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-blue-500 hover:text-blue-600 mt-4"
                      >
                        Visit Website
                        <Navigation className="w-4 h-4 ml-1" />
                      </a>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="space-y-8">
            {dailyItineraries.length === 0 ? (
              <EmptyState message="No daily itineraries found" />
            ) : (
              dailyItineraries.map((day, index) => (
                <DayCard key={index} day={day} index={index} />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

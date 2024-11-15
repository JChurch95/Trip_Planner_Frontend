import { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { 
  Calendar, 
  MapPin, 
  Star,
  AlertTriangle
} from 'lucide-react';

// Helper function to parse daily schedule
const parseDailySchedule = (schedule) => {
  if (typeof schedule === 'string') {
    try {
      return JSON.parse(schedule);
    } catch (e) {
      console.error('Failed to parse daily schedule:', e);
      return [];
    }
  }
  return Array.isArray(schedule) ? schedule : [];
};

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg">
    <AlertTriangle className="w-12 h-12 text-gray-400 mb-4" />
    <p className="text-gray-600">No itinerary details available</p>
  </div>
);

const LoadingState = () => (
  <div className="flex justify-center items-center min-h-[400px]">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

const ErrorState = ({ message }) => (
  <div className="flex flex-col items-center justify-center p-8 bg-red-50 rounded-lg">
    <AlertTriangle className="w-12 h-12 text-red-400 mb-4" />
    <p className="text-red-600">{message}</p>
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
  
        // Add debug logs for responses
        const detailsResponse = await fetch(`http://localhost:8000/trips/${tripId}/details`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        console.log('Trip details response:', await detailsResponse.clone().json());
  
        if (!detailsResponse.ok) {
          throw new Error(`Failed to fetch trip details: ${detailsResponse.status}`);
        }
  
        const tripDetails = await detailsResponse.json();
        console.log('Parsed trip details:', tripDetails);
  
        const itineraryResponse = await fetch(`http://localhost:8000/itineraries/${tripId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        console.log('Itinerary response:', await itineraryResponse.clone().json());
  
        if (!itineraryResponse.ok) {
          throw new Error(`Failed to fetch itinerary: ${itineraryResponse.status}`);
        }
  
        const itineraryDetails = await itineraryResponse.json();
        console.log('Parsed itinerary details:', itineraryDetails);
  
        // Ensure daily_schedule is properly formatted
        const schedule = Array.isArray(itineraryDetails.daily_schedule) 
          ? itineraryDetails.daily_schedule 
          : typeof itineraryDetails.daily_schedule === 'string'
            ? JSON.parse(itineraryDetails.daily_schedule)
            : [];
  
        console.log('Processed schedule:', schedule);
  
        setItineraryData({
          ...tripDetails,
          ...itineraryDetails,
          daily_schedule: schedule
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

  const schedule = itineraryData.daily_schedule;
  if (!Array.isArray(schedule) || schedule.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {itineraryData.destination}
          </h1>
          <div className="flex items-center justify-center gap-4 text-gray-600">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span>
                {new Date(itineraryData.start_date).toLocaleDateString()} -{" "}
                {new Date(itineraryData.end_date).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Hotel Section */}
        {itineraryData.hotel_name && (
          <div className="mb-8 bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b">
              <h2 className="text-xl font-semibold text-gray-900">Accommodation</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-500" />
                  <h3 className="font-medium text-lg">{itineraryData.hotel_name}</h3>
                </div>
                {itineraryData.hotel_rating && (
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star className="w-4 h-4 fill-current" />
                    <span>{itineraryData.hotel_rating.toFixed(1)}</span>
                  </div>
                )}
                {itineraryData.hotel_location && (
                  <p className="text-gray-600">{itineraryData.hotel_location}</p>
                )}
                {itineraryData.hotel_description && (
                  <p className="text-gray-600">{itineraryData.hotel_description}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Daily Schedule */}
        <div className="space-y-8">
          {schedule.map((day, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b">
                <h2 className="text-xl font-semibold text-gray-900">
                  Day {index + 1}
                  {day.date && ` - ${new Date(day.date).toLocaleDateString()}`}
                </h2>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  {Object.entries(day).map(([key, value]) => {
                    if (key === 'date') return null;
                    return (
                      <div key={key} className="bg-gray-50 rounded-lg p-4">
                        <h3 className="font-medium text-lg mb-2 capitalize">
                          {key.replace('_', ' ')}
                        </h3>
                        {typeof value === 'object' && value !== null && (
                          <div className="space-y-2">
                            {Object.entries(value).map(([subKey, subValue]) => (
                              <div key={subKey}>
                                <span className="capitalize text-gray-600">
                                  {subKey === 'spot' ? '' : `${subKey}: `}
                                </span>
                                <span className="text-gray-900">{subValue}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { Calendar, MapPin } from 'lucide-react';

export default function MyTrips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await fetch('http://localhost:8000/trips/', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch trips');
        }

        const data = await response.json();
        setTrips(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-lg text-gray-600">Loading your trips...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-lg text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Trips</h1>
        
        {trips.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">You haven't planned any trips yet.</p>
            <Link 
              to="/"
              className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Plan Your First Trip
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {trips.map((trip) => (
              <Link
                key={trip.id}
                to={`/itinerary/${trip.id}`}
                className="block bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-200"
              >
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    {trip.destination}
                  </h2>
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>
                        {new Date(trip.start_date).toLocaleDateString()} - {new Date(trip.end_date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span>{trip.destination}</span>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <span className="text-indigo-600 hover:text-indigo-500">
                      View Itinerary →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
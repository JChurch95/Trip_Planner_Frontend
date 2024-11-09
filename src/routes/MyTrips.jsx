import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { Calendar, MapPin, Star, RefreshCw } from "lucide-react";
import DeleteTripButton from "../components/DeleteTripButton";
import RecoverTripButton from "../components/RecoverTripButton";
import FavoriteButton from "../components/FavoriteButton";

export default function MyTrips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showUnpublished, setShowUnpublished] = useState(false);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const { token } = useAuth();

  const fetchTrips = async () => {
    try {
      const url = new URL('http://localhost:8000/trips/');
      url.searchParams.set('show_unpublished', showUnpublished);
      url.searchParams.set('favorites_only', showFavoritesOnly);

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch trips");
      }

      const data = await response.json();
      setTrips(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, [token, showUnpublished, showFavoritesOnly]);

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
        <div className="text-lg text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Trips</h1>

          <div className="flex gap-4">
            <button
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              className={`flex items-center px-4 py-2 rounded-md ${
                showFavoritesOnly
                  ? "bg-yellow-500 text-white"
                  : "bg-white text-gray-700"
              }`}
            >
              <Star className="w-4 h-4 mr-2" />
              Favorites
            </button>

            <button
              onClick={() => setShowUnpublished(!showUnpublished)}
              className={`flex items-center px-4 py-2 rounded-md ${
                showUnpublished
                  ? "bg-blue-500 text-white"
                  : "bg-white text-gray-700"
              }`}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              {showUnpublished ? "Hide Deleted" : "Show Deleted"}
            </button>
          </div>
        </div>

        {trips.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">No trips found.</p>
            <Link
              to="/"
              className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Plan a New Trip
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {trips.map((trip) => (
              <div
                key={trip.id}
                className={`relative bg-white rounded-lg shadow transition-all duration-200 ${
                  !trip.is_published ? "opacity-75" : ""
                }`}
              >
                <FavoriteButton
                  tripId={trip.id}
                  initialFavorite={trip.is_favorite}
                  onSuccess={fetchTrips}
                />

                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    {trip.destination}
                  </h2>

                  <div className="space-y-2">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>
                        {new Date(trip.start_date).toLocaleDateString()} -{" "}
                        {new Date(trip.end_date).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span>{trip.destination}</span>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-between items-center">
                    <Link
                      to={`/itinerary/${trip.id}`}
                      className="text-indigo-600 hover:text-indigo-500"
                    >
                      View Itinerary →
                    </Link>

                    {trip.is_published ? (
                      <DeleteTripButton
                        tripId={trip.id}
                        onSuccess={fetchTrips}
                      />
                    ) : (
                      <RecoverTripButton
                        tripId={trip.id}
                        onSuccess={fetchTrips}
                      />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

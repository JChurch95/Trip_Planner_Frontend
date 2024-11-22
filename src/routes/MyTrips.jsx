import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../AuthContext";
import {
  Calendar,
  MapPin,
  Star,
  RefreshCw,
  Loader,
  AlertTriangle,
} from "lucide-react";
import DeleteTripButton from "../components/DeleteTripButton";
import FavoriteButton from "../components/FavoriteButton";
import { motion } from "framer-motion";
import styles from "./MyTrips.module.css";

export default function MyTrips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showUnpublished, setShowUnpublished] = useState(false);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const { token } = useAuth();
  const location = useLocation();
  const prevRoute = sessionStorage.getItem("prevRoute");
  sessionStorage.setItem("prevRoute", location.pathname);

  const fromProfile = prevRoute === "/profile";
  const fromPlanTrip = prevRoute === "/plan-trip";
  const toProfile = location.pathname === "/profile";
  const toPlanTrip = location.pathname === "/plan-trip";

  const fetchTrips = async () => {
    try {
      const baseUrl = import.meta.env.VITE_API_URL;
      const url = new URL(`${baseUrl}/trips`);
      url.searchParams.set("include_deleted", String(showUnpublished)); // Convert boolean to string
      url.searchParams.set("favorites_only", String(showFavoritesOnly));

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch trips: ${response.status}`);
      }

      const data = await response.json();
      setTrips(data);
    } catch (err) {
      console.error("Fetch error:", err);
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
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin text-orange-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading your adventures...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600">Error: {error}</p>
        </div>
      </div>
    );
  }

  const displayedTrips = showFavoritesOnly ? trips.filter(trip => trip.is_favorite) : trips;
  return (
    <motion.div
      initial={{ y: 50, scale: 0.95, opacity: 0 }}
      animate={{ y: 0, scale: 1, opacity: 1 }}
      exit={{ y: -50, scale: 0.95, opacity: 0 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20,
        mass: 1,
      }}
    >
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 pt-navbar transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center md:items-center mb-8 space-y-4 md:space-y-0">
            <h1 className="text-4xl font-bold text-gray-900 mb-8 w-full text-center md:text-left">
              My{" "}
              <span className="animate-gradient bg-clip-text text-transparent">
                Adventures
              </span>
            </h1>
            <div className="flex flex-row gap-4">
              <button
                onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                className={`flex items-center px-4 py-2 md:px-3 md:py-1.5 rounded-xl transition-all transform hover:scale-105 ${
                  showFavoritesOnly
                    ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg"
                    : "bg-white text-gray-700 shadow-md hover:shadow-lg"
                }`}
              >
                <Star className="w-4 h-4 mr-2" />
                Favorites
              </button>
            </div>
          </div>
          {displayedTrips.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
              <img
                src="/api/placeholder/200/200"
                alt="No trips"
                className="w-32 h-32 mx-auto mb-6 rounded-full"
              />
              <p className="text-gray-500 text-lg mb-8">
                No adventures found. Time to plan one!
              </p>
              <Link
                to="/"
                className="inline-flex items-center px-6 py-3 rounded-xl text-white bg-gradient-to-r from-green-500 to-orange-500 transform transition-all hover:scale-105 shadow-md hover:shadow-lg"
              >
                Plan Your Next Adventure
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedTrips.map((trip) => (
                <div
                  key={trip.id}
                  className={`relative bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1 ${
                    !trip.is_published ? "opacity-75" : ""
                  } ${styles.tripCard}`}
                >
                  <FavoriteButton
                    tripId={trip.id}
                    initialFavorite={trip.is_favorite}
                    onSuccess={fetchTrips}
                  />

                  <div className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">
                      {trip.destination}
                    </h2>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-center text-gray-600">
                        <Calendar className="w-5 h-5 mr-2 text-green-500" />
                        <span>
                          {new Date(trip.start_date).toLocaleDateString()} -{" "}
                          {new Date(trip.end_date).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="flex items-center text-gray-600">
                        <MapPin className="w-5 h-5 mr-2 text-orange-500" />
                        <span>{trip.destination}</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                      <Link
                        to={`/itinerary/${trip.id}`}
                        className="text-indigo-600 hover:text-indigo-500 font-medium"
                      >
                        View Itinerary →
                      </Link>
                      <DeleteTripButton
                        tripId={trip.id}
                        onSuccess={fetchTrips}
                        isFavorite={trip.is_favorite}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}


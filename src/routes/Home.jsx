import { useState } from "react";
import { Search, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import styles from "./Home.module.css";
import { motion } from "framer-motion";

// Sample Locations, will need to add the ability for it to autofill anything after Demo Day
const SAMPLE_LOCATIONS = [
  "San Francisco, California",
  "New York City, United States",
  "Tokyo, Japan",
  "London, United Kingdom",
  "Paris, France",
  "Sydney, Australia",
  "Dubai, United Arab Emirates",
  "Singapore, Singapore",
  "Rio de Janeiro, Brazil",
  "Cape Town, South Africa",
  "Moscow, Russia",
  "Bangkok, Thailand",
  "Istanbul, Turkey",
  "Hong Kong, China",
  "Toronto, Canada",
  "Mumbai, India",
  "Los Angeles, United States",
  "Berlin, Germany",
  "Rome, Italy",
  "Buenos Aires, Argentina",
  "Seoul, South Korea",
];

const UI_TO_BACKEND_MAPPINGS = {
  travelerType: {
    "Solo Adventurer": "solo",
    "Traveling Duo": "couple",
    "Family Expedition": "family",
    "Group Journey": "group",
  },
  activityLevel: {
    "Relaxed & Easy": "relaxed",
    "Moderately Active": "moderate",
    "Very Active": "active",
  },
  budgetRange: {
    "Budget ($50-100/day)": "BUDGET",
    "Comfort ($100-200/day)": "COMFORT",
    "Premium ($200-500/day)": "PREMIUM",
    "Luxury ($500-1000/day)": "LUXURY",
    "Ultra Luxury ($1000+/day)": "ULTRA_LUXURY",
  },
};

const DAYS_OF_WEEK = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// Calendar component
function CalendarDropdown({ onSelect, onClose }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const handleDateClick = (date) => {
    if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
      setSelectedStartDate(date);
      setSelectedEndDate(null);
    } else {
      if (date < selectedStartDate) {
        setSelectedStartDate(date);
        setSelectedEndDate(null);
      } else {
        setSelectedEndDate(date);
        const formattedStart = selectedStartDate.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
        const formattedEnd = date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
        onSelect(`${formattedStart} to ${formattedEnd}`);
        onClose();
      }
    }
  };

  const navigateMonth = (direction) => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1)
    );
  };

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);
    const days = [];

    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className={styles.calendarDay}></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isSelected =
        (selectedStartDate &&
          date.toDateString() === selectedStartDate.toDateString()) ||
        (selectedEndDate &&
          date.toDateString() === selectedEndDate.toDateString());
      const isInRange =
        selectedStartDate &&
        selectedEndDate &&
        date > selectedStartDate &&
        date < selectedEndDate;

      days.push(
        <button
          key={day}
          onClick={() => handleDateClick(date)}
          className={`${styles.calendarDay} ${
            isSelected ? styles.selected : ""
          } 
                     ${isInRange ? styles.inRange : ""}`}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  return (
    <div
      className={styles.calendarWrapper}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <div className={styles.calendarHeader}>
        <button
          onClick={() => navigateMonth(-1)}
          className={styles.navigationButton}
        >
          <ChevronLeft size={20} />
        </button>
        <span>
          {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
        </span>
        <button
          onClick={() => navigateMonth(1)}
          className={styles.navigationButton}
        >
          <ChevronRight size={20} />
        </button>
      </div>
      <div className={styles.calendarGrid}>
        {DAYS_OF_WEEK.map((day) => (
          <div key={day} className={styles.dayHeader}>
            {day}
          </div>
        ))}
        {renderCalendar()}
      </div>
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [isCreatingTrip, setIsCreatingTrip] = useState(false);
  const [showLocations, setShowLocations] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [dateRange, setDateRange] = useState("");
  const [formData, setFormData] = useState({
    destination: "",
    arrival_time: "",
    departure_time: "",
    dietary_preferences: "",
    activity_preferences: "",
    additional_notes: "",
    traveler_type: "",
  });

  // Handlers
  const handleFormSubmit = async () => {
    setIsCreatingTrip(true);
    try {
      if (!token || !user) {
        console.error("No authentication token or user found");
        return;
      }

      if (!searchText || !dateRange) {
        console.error("Missing required fields");
        return;
      }

      const [startStr, endStr] = dateRange.split(" to ");
      const start_date = new Date(startStr).toISOString().split("T")[0];
      const end_date = new Date(endStr).toISOString().split("T")[0];

      const tripData = {
        user_id: user,
        destination: searchText,
        start_date: start_date,
        end_date: end_date,
        arrival_time: formData.arrival_time || null,
        departure_time: formData.departure_time || null,
        dietary_preferences: formData.dietary_preferences || null,
        activity_preferences: formData.activity_preferences || null,
        additional_notes: formData.additional_notes || null,
        status: "pending",
        is_published: true,
        is_favorite: false,
      };

      const response = await fetch("http://localhost:8000/trips/create", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tripData),
      });

      if (!response.ok) {
        throw new Error(`Failed to create trip: ${await response.text()}`);
      }

      const data = await response.json();
      if (data && data.message && data.trip) {
        setShowDetailsModal(false);
        setTimeout(() => {
          navigate(`/itinerary/${data.trip.id}`);
        }, 1000);
      }
    } catch (error) {
      console.error("Error creating trip:", error);
    } finally {
      setIsCreatingTrip(false);
    }
  };

  const filteredLocations = SAMPLE_LOCATIONS.filter((loc) =>
    loc.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleLocationSelect = (location) => {
    setSearchText(location);
    setFormData((prev) => ({ ...prev, destination: location }));
    setShowLocations(false);
  };

  const handleGenerateClick = () => {
    if (searchText && dateRange) {
      setShowDetailsModal(true);
    }
  };

  const handleDateSelect = (range) => {
    setDateRange(range);
    setShowCalendar(false);
  };

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
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-navbar pb-16">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Hop into hassle free planning with
              <br />
              <span className="animate-gradient bg-gradient-to-r from-green-500 via-emerald-500 via-orange-400 to-orange-500 text-transparent bg-clip-text">
                AI powered itineraries!
              </span>
            </h1>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              {/* Location Search with Suggestions */}
              <div className={`relative ${styles.inputGlow} rounded-xl`}>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchText}
                  onChange={(e) => {
                    setSearchText(e.target.value);
                    setShowLocations(true);
                  }}
                  onFocus={() => setShowLocations(true)}
                  placeholder="Where to?"
                  className="block w-full pl-10 pr-3 py-4 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent shadow-sm"
                />
                {/* Location Suggestions Dropdown */}
                {showLocations && searchText && (
                  <div className="absolute z-10 w-full mt-2 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                    {filteredLocations.map((location) => (
                      <button
                        key={location}
                        onClick={() => handleLocationSelect(location)}
                        className="block w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        {location}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Date Selection with Calendar */}
              <div className={`relative ${styles.inputGlow} rounded-xl`}>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={dateRange}
                  onClick={() => setShowCalendar(!showCalendar)}
                  placeholder="When?"
                  readOnly
                  className="block w-full pl-10 pr-3 py-4 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent shadow-sm cursor-pointer"
                />
                {showCalendar && (
                  <CalendarDropdown
                    onSelect={handleDateSelect}
                    onClose={() => setShowCalendar(false)}
                  />
                )}
              </div>
            </div>

            <div className="flex justify-center mt-4">
              <button
                onClick={handleGenerateClick}
                className="w-full md:w-1/2 animate-gradient bg-gradient-to-r from-green-500 via-emerald-500 via-orange-400 to-orange-500 text-white font-medium py-4 px-6 rounded-xl hover:opacity-90 transition-all hover:scale-[1.02] transform duration-200 flex items-center justify-center group shadow-md"
              >
                Generate Itinerary
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Details Modal */}
      {showDetailsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
              <h2 className="text-xl font-semibold text-gray-900">
                Tell us about your trip to {searchText}
              </h2>
            </div>

            <div className="p-4 sm:p-6">
              {/* Top Section - Single column */}
              <div className="mb-6 max-w-xl mx-auto">
                {/* Who's traveling */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2 text-center">
                    Who's traveling?
                  </label>
                  <div className="grid grid-cols-1 gap-2 w-1/2 mx-auto">
                    {Object.entries(UI_TO_BACKEND_MAPPINGS.travelerType).map(
                      ([display, value]) => (
                        <button
                          key={value}
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              traveler_type: value,
                            }))
                          }
                          className={`p-2 sm:p-3 rounded-lg text-sm sm:text-base transition-all ${
                            formData.traveler_type === value || formData.activity_level === value || formData.budget_preference === value
                              ? "animate-gradient bg-gradient-to-r from-green-500 via-emerald-500 via-orange-400 to-orange-500 text-white"
                              : "border border-gray-200 text-gray-700 hover:border-green-500"
                          }`}                        >
                          {display}
                        </button>
                      )
                    )}
                  </div>
                </div>

                {/* Activity Level */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2 text-center">
                    What's your preferred activity level?
                  </label>
                  <div className="grid grid-cols-1 gap-2 w-1/2 mx-auto">
                    {Object.entries(UI_TO_BACKEND_MAPPINGS.activityLevel).map(
                      ([display, value]) => (
                        <button
                          key={value}
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              activity_level: value,
                            }))
                          }
                          className={`p-2 sm:p-3 rounded-lg text-sm sm:text-base transition-all ${
                            formData.activity_level === value
                              ? "bg-gradient-to-r from-green-500 to-orange-500 text-white"
                              : "border border-gray-200 text-gray-700 hover:border-green-500"
                          }`}
                        >
                          {display}
                        </button>
                      )
                    )}
                  </div>
                </div>

                {/* Budget Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 text-center">
                    What's your budget range?
                  </label>
                  <div className="grid grid-cols-1 gap-2 w-1/2 mx-auto">
                    {Object.entries(UI_TO_BACKEND_MAPPINGS.budgetRange).map(
                      ([display, value]) => (
                        <button
                          key={value}
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              budget_preference: value,
                            }))
                          }
                          className={`p-2 sm:p-3 rounded-lg text-sm sm:text-base transition-all ${
                            formData.budget_preference === value
                              ? "bg-gradient-to-r from-green-500 to-orange-500 text-white"
                              : "border border-gray-200 text-gray-700 hover:border-green-500"
                          }`}
                        >
                          {display}
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom Section */}
              <div className="space-y-4">
                {/* Special Interests */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    What are your special interests?
                  </label>
                  <input
                    type="text"
                    value={formData.special_interests || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        special_interests: e.target.value,
                      }))
                    }
                    placeholder="Photography, Local Markets, Street Food..."
                    className="w-full border border-gray-200 rounded-lg p-2 sm:p-3 text-sm sm:text-base text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                {/* Dietary Preferences */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Any dietary preferences?
                  </label>
                  <input
                    type="text"
                    value={formData.dietary_preferences || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        dietary_preferences: e.target.value,
                      }))
                    }
                    placeholder="Vegetarian, Gluten-free, Halal..."
                    className="w-full border border-gray-200 rounded-lg p-2 sm:p-3 text-sm sm:text-base text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                {/* Additional Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Anything else we should know?
                  </label>
                  <textarea
                    value={formData.additional_notes || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        additional_notes: e.target.value,
                      }))
                    }
                    placeholder="Special requests, must-see places, or other preferences..."
                    className="w-full h-32 border border-gray-200 rounded-lg p-2 sm:p-3 text-sm sm:text-base text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"                  />
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-6 border-t border-gray-100 sticky bottom-0 bg-white">
              <button
                onClick={handleFormSubmit}
                disabled={isCreatingTrip}
                className="w-full md:w-1/2 mx-auto animate-gradient bg-gradient-to-r from-green-500 via-emerald-500 via-orange-400 to-orange-500 text-white font-medium py-4 px-6 rounded-xl hover:opacity-90 transition-all hover:scale-[1.02] transform duration-200 flex items-center justify-center group shadow-md"              >
                {isCreatingTrip ? (
                  <div className="flex items-center">
                    <div className="animate-spin mr-2 h-5 w-5 border-t-2 border-b-2 border-white rounded-full" />
                    Creating your trip...
                  </div>
                ) : (
                  "Generate Itinerary"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}

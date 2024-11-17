import { useState } from 'react';
import { Search, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import styles from "./Home.module.css";

// Keep your original constants
const SAMPLE_LOCATIONS = [
  "Charlotte",
  "Charlotte, North Carolina, United States",
  "Charlottesville, Virginia, United States",
  "Charlotte Amalie, Saint Thomas, US Virgin Islands",
  "Charlottetown, Prince Edward Island, Canada",
];

const DAYS_OF_WEEK = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

// Calendar component remains the same but with updated styling
function CalendarDropdown({ onSelect, onClose }) {
  // ... [Keep your existing Calendar implementation] ...
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);

  // Keep all your existing calendar functions
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
    // ... [Keep your existing calendar rendering logic] ...
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
          className={`${styles.calendarDay} ${isSelected ? styles.selected : ""} 
                     ${isInRange ? styles.inRange : ""}`}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  return (
    <div className={styles.calendarWrapper} onClick={(e) => e.stopPropagation()}>
      <div className={styles.calendarHeader}>
        <button onClick={() => navigateMonth(-1)} className={styles.navigationButton}>
          <ChevronLeft size={20} />
        </button>
        <span>
          {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
        </span>
        <button onClick={() => navigateMonth(1)} className={styles.navigationButton}>
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
  });

  // Keep all your existing handlers
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
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Simplify your trip planning with
            <br />
            <span className="bg-gradient-to-r from-green-500 to-orange-500 text-transparent bg-clip-text">
              AI powered itineraries
            </span>
          </h1>
        </div>

        {/* Search Container */}
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Location Search */}
            <div className="relative">
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
              
              {/* Location Suggestions */}
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

            {/* Date Selection */}
            <div className="relative">
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

          {/* Generate Button */}
          <button 
            onClick={handleGenerateClick}
            className="w-full bg-gradient-to-r from-green-500 to-orange-500 text-white font-medium py-4 px-6 rounded-xl hover:opacity-90 transition-all hover:scale-[1.02] transform duration-200 flex items-center justify-center group shadow-md"
          >
            Generate Itinerary
          </button>
        </div>
      </div>

      {/* Details Modal */}
      {showDetailsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-lg w-full shadow-xl">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Additional details?{" "}
              <span className="text-gray-500 text-sm font-normal">Optional</span>
            </h2>
            <p className="text-gray-600 text-sm mb-6">
              While we are generating your itinerary, let us know more about your
              trip - dietary preferences, existing plans, places you want to make
              sure to cover, etc.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What time are you arriving / departing?
                </label>
                <input
                  type="text"
                  value={formData.arrival_time}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      arrival_time: e.target.value,
                    }))
                  }
                  placeholder="Flying in late thursday night..."
                  className="w-full border border-gray-300 rounded-lg p-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional information
                </label>
                <textarea
                  value={formData.additional_notes}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      additional_notes: e.target.value,
                    }))
                  }
                  placeholder="I am vegetarian. I want to make sure to visit the Eiffel Tower. I am traveling with my wife and 2 kids."
                  className="w-full h-32 border border-gray-300 rounded-lg p-3 text-gray-900 placeholder-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <button
                onClick={handleFormSubmit}
                disabled={isCreatingTrip}
                className={`w-full bg-gradient-to-r from-green-500 to-orange-500 text-white rounded-lg py-3 font-medium hover:opacity-90 transition-all ${
                  isCreatingTrip ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isCreatingTrip ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin mr-2 h-5 w-5 border-t-2 border-b-2 border-white rounded-full" />
                    Creating your trip...
                  </div>
                ) : (
                  'Generate!'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
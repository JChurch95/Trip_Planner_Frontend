import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { Search, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './Home.module.css';

const SAMPLE_LOCATIONS = [
  "Charlotte",
  "Charlotte, North Carolina, United States",
  "Charlottesville, Virginia, United States",
  "Charlotte Amalie, Saint Thomas, US Virgin Islands",
  "Charlottetown, Prince Edward Island, Canada"
];

const DAYS_OF_WEEK = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

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
        const formattedStart = selectedStartDate.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        });
        const formattedEnd = date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        });
        onSelect(`${formattedStart} to ${formattedEnd}`);
        onClose();
      }
    }
  };

  const navigateMonth = (direction) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1));
  };

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className={styles.calendarDay}></div>);
    }

    // Add the days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isSelected = selectedStartDate && date.toDateString() === selectedStartDate.toDateString() ||
                        selectedEndDate && date.toDateString() === selectedEndDate.toDateString();
      const isInRange = selectedStartDate && selectedEndDate &&
                       date > selectedStartDate && date < selectedEndDate;
      
      days.push(
        <button
          key={day}
          onClick={() => handleDateClick(date)}
          className={`${styles.calendarDay} ${isSelected ? styles.selected : ''} 
                     ${isInRange ? styles.inRange : ''}`}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  return (
    <div className={styles.calendarWrapper} onClick={e => e.stopPropagation()}>
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
        {DAYS_OF_WEEK.map(day => (
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
  const { token } = useAuth();
  const [showLocations, setShowLocations] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [dateRange, setDateRange] = useState('');
  const [formData, setFormData] = useState({
    destination: '',
    arrival_time: '',
    additional_notes: ''
  });

  const filteredLocations = SAMPLE_LOCATIONS.filter(loc => 
    loc.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleLocationSelect = (location) => {
    setSearchText(location);
    setFormData(prev => ({ ...prev, destination: location }));
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
    <div className={`${styles.container} py-16 text-white`}>
      {/* Main Title */}
      <h1 className="text-4xl md:text-5xl font-bold text-center max-w-3xl mx-auto mb-16 px-4 leading-tight">
        Simplify your trip planning with<br />
        AI powered itineraries
      </h1>

      {/* Search Container */}
      <div className={styles.searchContainer}>
        <div className="flex flex-col md:flex-row gap-4">
          {/* Location Search */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
                setShowLocations(true);
              }}
              onFocus={() => setShowLocations(true)}
              placeholder="Where?"
              className="w-full bg-gray-900/50 border border-gray-800 rounded-lg py-3 px-12 text-white placeholder-gray-400 focus:outline-none focus:border-gray-700"
            />
            
            {showLocations && searchText && (
              <div className={styles.suggestions}>
                {filteredLocations.map((location) => (
                  <button
                    key={location}
                    onClick={() => handleLocationSelect(location)}
                    className={styles.suggestionItem}
                  >
                    {location}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Date Input */}
          <div className="relative flex-1">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={dateRange}
              onClick={() => setShowCalendar(!showCalendar)}
              placeholder="Pick a date"
              readOnly
              className="w-full bg-gray-900/50 border border-gray-800 rounded-lg py-3 px-12 text-white placeholder-gray-400 focus:outline-none focus:border-gray-700 cursor-pointer"
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
          className={`${styles.generateButton} w-full bg-black border border-gray-800 rounded-lg py-3 text-white font-medium mt-4`}
        >
          <span className="relative">Generate Itinerary</span>
        </button>
      </div>

      {/* Details Modal */}
      {showDetailsModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2 className="text-xl font-semibold mb-2">
              Additional details? <span className="text-gray-400 text-sm font-normal">Optional</span>
            </h2>
            <p className="text-gray-400 text-sm mb-6">
              While we are generating your itinerary, let us know more about your trip - dietary preferences, existing
              plans, places you want to make sure to cover, etc.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-2">
                  What time are you arriving / departing?
                </label>
                <input
                  type="text"
                  value={formData.arrival_time}
                  onChange={(e) => setFormData(prev => ({ ...prev, arrival_time: e.target.value }))}
                  placeholder="Flying in late thursday night..."
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:border-gray-600"
                />
              </div>

              <div>
                <label className="block text-sm mb-2">
                  Additional information
                </label>
                <textarea
                  value={formData.additional_notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, additional_notes: e.target.value }))}
                  placeholder="I am vegetarian. I want to make sure to visit the Eiffel Tower. I am traveling with my wife and 2 kids."
                  className="w-full h-32 bg-gray-800/50 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 resize-none focus:outline-none focus:border-gray-600"
                />
              </div>

              <button
                className="w-full bg-white text-gray-900 rounded-lg py-3 font-medium hover:bg-gray-100 transition-colors"
              >
                Generate!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
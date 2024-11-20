import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Coffee,
  Building,
  Utensils,
  Sunset,
  Star,
  ArrowRight,
} from "lucide-react";
import styles from "../routes/Itinerary.module.css";

const ActivityCard = ({ activity, time, icon: Icon }) => (
  <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 transform hover:-translate-y-1">
    <div className="flex items-center mb-3">
      <div className="w-10 h-10 rounded-lg bg-blue-50 p-2 text-blue-500">
        <Icon className="w-full h-full" />
      </div>
      <div className="ml-3 flex justify-between items-start flex-grow">
        <div>
          <h4 className="font-medium text-gray-900">
            {activity.activity || activity.spot}
          </h4>
          {time && <p className="text-sm text-gray-500">{time}</p>}
        </div>
        {activity.rating && (
          <div className={styles.rating}>
            <Star className="w-4 h-4 mr-1" />
            <span>{activity.rating}</span>
          </div>
        )}
      </div>
    </div>
    <p className="text-gray-600 text-sm">{activity.description}</p>

    <div className="flex items-center justify-end mt-3">
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

const DayCarousel = ({ dailySchedule }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);

  const next = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === dailySchedule.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? dailySchedule.length - 1 : prevIndex - 1
    );
  };

  const day = dailySchedule[currentIndex];

  return (
    <div
      className="relative max-w-5xl mx-auto"
      onTouchStart={(e) => {
        const touch = e.touches[0];

        setTouchStart(touch.clientX);
      }}
      onTouchMove={(e) => {
        if (!touchStart) return;
        const touch = e.touches[0];
        const diff = touchStart - touch.clientX;

        if (Math.abs(diff) > 50) {
          if (diff > 0) {
            next();
          } else {
            prev();
          }
          setTouchStart(null);
        }
      }}
      onTouchEnd={() => {
        setTouchStart(null);
      }}
    >
      {/* Progress indicator */}
      <div className="text-center mb-6">
        <span className="inline-block px-4 py-2 bg-white rounded-full shadow-sm text-gray-700">
          Day {currentIndex + 1} of {dailySchedule.length}
        </span>
      </div>

      {/* Navigation arrows */}
      <button
        onClick={prev}
        className="absolute left-0 top-1/2 -translate-y-1/2 md:-translate-x-12 p-2 rounded-full bg-white shadow-lg text-gray-700 hover:text-gray-900 transition-all hover:scale-110 z-10 mx-2 md:mx-0"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={next}
        className="absolute right-0 top-1/2 -translate-y-1/2 md:translate-x-12 p-2 rounded-full bg-white shadow-lg text-gray-700 hover:text-gray-900 transition-all hover:scale-110 z-10 mx-2 md:mx-0"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
      {/* Day card */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">
            Day {currentIndex + 1}
            {day.date && (
              <span className="text-gray-500 ml-2">
                {new Date(day.date).toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            )}
          </h2>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Morning */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-500 mb-4">Morning</h3>
              <ActivityCard
                activity={day.breakfast}
                time="Breakfast"
                icon={Coffee}
              />
              <ActivityCard
                activity={day.morning_activity}
                time="Morning Activity"
                icon={Building}
              />
            </div>

            {/* Afternoon */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-500 mb-4">Afternoon</h3>
              <ActivityCard activity={day.lunch} time="Lunch" icon={Utensils} />
              <ActivityCard
                activity={day.afternoon_activity}
                time="Afternoon Activity"
                icon={Building}
              />
            </div>

            {/* Evening */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-500 mb-4">Evening</h3>
              <ActivityCard
                activity={day.dinner}
                time="Dinner"
                icon={Utensils}
              />
              <ActivityCard
                activity={day.evening_activity}
                time="Evening Activity"
                icon={Sunset}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center mt-6 space-x-2">
        {dailySchedule.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex
                ? "bg-orange-500 w-6"
                : "bg-gray-300 hover:bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default DayCarousel;

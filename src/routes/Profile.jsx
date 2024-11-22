import { useState, useEffect, useRef } from "react";
import { useAuth } from "../AuthContext";
import {
  User,
  Globe,
  Calendar,
  MapPin,
  Share2,
  Trophy,
  Check,
  ChevronDown,
  Camera,
} from "lucide-react";
import { motion } from "framer-motion";
import { Listbox } from "@headlessui/react";
import Cropper from "react-easy-crop";
import { Link } from "react-router-dom";
import London from "../media/London.png";
import Tokyo from "../media/Tokyo.png";
import Paris from "../media/Paris.png";
import Sydney from "../media/Sydney.png";
import Default_Trip from "../media/Default_Trip.png"
import styles from "./Profile.module.css";

const SUPPORTED_LANGUAGES = [
  { value: "en", label: "English" },
  { value: "es", label: "Español" },
  { value: "fr", label: "Français" },
  { value: "de", label: "Deutsch" },
  { value: "it", label: "Italiano" },
];

const ACCESSIBILITY_OPTIONS = [
  {
    value: "No Accessibility Requirements",
    label: "No Accessibility Requirements",
  },
  { value: "wheelchair", label: "Wheelchair Access Required" },
  { value: "limited-mobility", label: "Limited Mobility Accommodations" },
  { value: "visual-aids", label: "Visual Aids/Braille" },
  { value: "hearing-aids", label: "Hearing Accommodations" },
  { value: "service-animal", label: "Service Animal Friendly" },
];

const MultiSelect = ({ options, value = [], onChange, placeholder }) => (
  <Listbox value={value} onChange={onChange} multiple>
    <div className="relative">
      <Listbox.Button className="w-full rounded-xl border border-gray-200 py-3 px-4 text-left shadow-sm focus:border-green-500 focus:ring-2 focus:ring-green-500">
        <span className="block truncate text-gray-900">
          {Array.isArray(value) && value.length
            ? value
                .map((v) => options.find((opt) => opt.value === v)?.label)
                .join(" • ")
            : placeholder}
        </span>
        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
      </Listbox.Button>

      <Listbox.Options className="absolute z-50 mt-1 w-full rounded-xl bg-white py-1 shadow-lg border border-gray-100">
        {options.map((option) => (
          <Listbox.Option
            key={option.value}
            value={option.value}
            className={({ active }) =>
              `cursor-pointer select-none px-4 py-2 ${
                active ? "bg-green-50 text-green-900" : "text-gray-900"
              }`
            }
          >
            {({ selected }) => (
              <div className="flex items-center">
                <span
                  className={`flex-grow ${
                    selected ? "font-medium" : "font-normal"
                  }`}
                >
                  {option.label}
                </span>
                {selected && <Check className="h-5 w-5 text-green-500" />}
              </div>
            )}
          </Listbox.Option>
        ))}
      </Listbox.Options>
    </div>
  </Listbox>
);

const DashboardSection = ({ title, icon, children }) => (
  <motion.div
    initial={{ y: 20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    className={`bg-white rounded-2xl shadow-sm p-6 mb-6 relative overflow-visible ${styles.sectionCard}`}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-green-50/30 to-orange-50/30 pointer-events-none" />
    <div className="relative">
      <div className="flex items-center gap-3 mb-6 lg:justify-start justify-center">
        {icon}
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
      </div>
      {children}
    </div>
  </motion.div>
);

const TravelStats = ({ trips }) => {
  const stats = {
    totalTrips: {
      value: trips?.length || 0,
      label: "Total Trips",
    },
    upcomingTrips: {
      value:
        trips?.filter((trip) => new Date(trip.start_date) > new Date())
          .length || 0,
      label: "Upcoming Trips",
    },
    completedTrips: {
      value:
        trips?.filter((trip) => new Date(trip.end_date) < new Date()).length ||
        0,
      label: "Completed Trips",
    },
    countries: {
      value: [
        ...new Set(
          trips?.map((trip) => trip.destination.split(",").pop().trim()) || []
        ),
      ].length,
      label: "Countries",
    },
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {Object.entries(stats).map(([key, { value, label }], index) => (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: index * 0.1 }}
          key={key}
        >
          <div className="h-[120px] bg-gradient-to-br from-white to-gray-50 rounded-xl p-4 flex flex-col">
            <div className="flex-1 flex items-center justify-center">
              <div className="text-3xl font-bold text-orange-500">{value}</div>
            </div>
            <div className="h-[36px] flex items-center justify-center text-center w-full">
              <div className="text-sm text-gray-600 px-1">{label}</div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

const TripGallery = ({ trips }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {trips?.map((trip, index) => (
      <Link to={`/itinerary/${trip.id}`} key={trip.id}>
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: index * 0.1 }}
          className={`group relative rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer ${styles.tripCard}`}
        >
          <div className="aspect-video">
            <img
              src={
                trip.destination.includes("London")
                  ? London
                  : trip.destination.includes("Tokyo")
                  ? Tokyo
                  : trip.destination.includes("Paris")
                  ? Paris
                  : trip.destination.includes("Sydney")
                  ? Sydney 
                  : Default_Trip 
              }
              alt={trip.destination}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute inset-0 p-4 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <h3 className="text-white font-semibold">{trip.destination}</h3>
              <button
                className="text-white opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.preventDefault();
                }}
              >
                <Share2 size={20} />
              </button>
            </div>
            <div className="text-white text-sm font-bold">
              {new Date(trip.start_date).toLocaleDateString()} -{" "}
              {new Date(trip.end_date).toLocaleDateString()}
            </div>
          </div>
        </motion.div>
      </Link>
    ))}
  </div>
);

const TravelGoals = () => {
  const [goals, setGoals] = useState([
    "Visit 10 new countries",
    "Try local cuisine in every destination",
    "Learn basic phrases in 5 languages",
    "Take a solo trip",
    "Experience Northern Lights",
  ]);
  const [newGoal, setNewGoal] = useState("");

  const addGoal = () => {
    if (newGoal.trim()) {
      setGoals([...goals, newGoal.trim()]);
      setNewGoal("");
    }
  };

  const removeGoal = (index) => {
    setGoals(goals.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={newGoal}
          onChange={(e) => setNewGoal(e.target.value)}
          placeholder="Add a new travel goal..."
          className="flex-grow rounded-xl border border-gray-200 px-4 py-2 text-white"
        />

        <button
          onClick={addGoal}
          className="px-4 py-2 rounded-xl animate-gradient text-white"
        >
          Add Goal
        </button>
      </div>
      <ul className="space-y-2">
        {goals.map((goal, index) => (
          <li
            key={index}
            className="flex items-center justify-between bg-gray-50 rounded-xl p-4"
          >
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-orange-500" />
              <span className="text-gray-900">{goal}</span>
            </div>
            <button
              onClick={() => removeGoal(index)}
              className="text-red-500 hover:text-red-600"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
const QuickPreferences = ({ profile, onUpdate }) => {
  const { token, user } = useAuth();
  const [localPreferences, setLocalPreferences] = useState(() => {
    const savedPrefs = localStorage.getItem("userPreferences");
    return savedPrefs
      ? JSON.parse(savedPrefs)
      : {
          preferred_languages: profile.preferred_languages || [],
          accessibility_needs: profile.accessibility_needs || [],
        };
  });

  useEffect(() => {
    localStorage.setItem("userPreferences", JSON.stringify(localPreferences));
  }, [localPreferences]);

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleChange = (key, value) => {
    setLocalPreferences((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/users/profile`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(localPreferences),
      });

      if (response.ok) {
        const data = await response.json();
        onUpdate("preferred_languages", data.preferred_languages);
        onUpdate("accessibility_needs", data.accessibility_needs);
        setSaveSuccess(true);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 relative">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="space-y-2"
        >
          <label className="text-sm font-medium text-gray-700">
            Preferred Languages
          </label>
          <MultiSelect
            options={SUPPORTED_LANGUAGES}
            value={localPreferences.preferred_languages}
            onChange={(value) => handleChange("preferred_languages", value)}
            placeholder="Select languages..."
          />
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="space-y-2"
        >
          <label className="text-sm font-medium text-gray-700">
            Accessibility Requirements
          </label>
          <MultiSelect
            options={ACCESSIBILITY_OPTIONS}
            value={localPreferences.accessibility_needs}
            onChange={(value) => handleChange("accessibility_needs", value)}
            placeholder="Select requirements..."
          />
        </motion.div>
      </div>
      <div className="flex justify-center lg:justify-end">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-4 py-2 animate-gradient text-white rounded-xl transition-all disabled:opacity-50"
        >
          {isSaving ? "Saving..." : saveSuccess ? "Saved! ✓" : "Save Changes"}
        </button>
      </div>

      {showToast && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg z-50 flex items-center gap-2"
        >
          <Check className="h-5 w-5" />
          <span>Changes saved successfully!</span>
        </motion.div>
      )}
    </div>
  );
};

const CropperModal = ({ image, onCropComplete, onClose }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const handleCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-4">
        <div className="relative h-80 mb-4">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={handleCropComplete}
          />
        </div>
        <div className="flex justify-between">
          <input
            type="range"
            value={zoom}
            min={1}
            max={3}
            step={0.1}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-1/2"
          />
          <div className="space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              onClick={() => onCropComplete(croppedAreaPixels)}
              className="px-4 py-2 rounded-xl animate-gradient text-white"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProfileHeader = ({ profile, trips, onProfileUpdate }) => {
  const { token, user } = useAuth();
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [profileImage, setProfileImage] = useState(
    localStorage.getItem("profileImage")
  );
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(profile.name || "Traveler");
  const [editedDescription, setEditedDescription] = useState(
    profile.description || "Adventure Seeker • Travel Enthusiast"
  );

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedImage(reader.result);
      setCropModalOpen(true);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveCrop = async (croppedAreaPixels) => {
    setUploading(true);
    const canvas = document.createElement("canvas");
    const image = new Image();
    image.src = selectedImage;

    await new Promise((resolve) => {
      image.onload = resolve;
    });

    canvas.width = croppedAreaPixels.width;
    canvas.height = croppedAreaPixels.height;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(
      image,
      croppedAreaPixels.x,
      croppedAreaPixels.y,
      croppedAreaPixels.width,
      croppedAreaPixels.height,
      0,
      0,
      croppedAreaPixels.width,
      croppedAreaPixels.height
    );

    const base64Image = canvas.toDataURL("image/jpeg");
    localStorage.setItem("profileImage", base64Image);
    setProfileImage(base64Image);
    setCropModalOpen(false);
    setUploading(false);
  };

  const handleSaveProfile = async () => {
    try {
      const response = await fetch("http://localhost:8000/users/profile", {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: editedName,
          description: editedDescription,
        }),
      });

      if (response.ok) {
        const updatedProfile = await response.json();
        onProfileUpdate(updatedProfile);
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  return (
    <>
      <div className="relative mb-8">
        <div className="h-48 w-full overflow-hidden">
          <div className="w-full h-full animate-gradient"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative -mt-24 sm:-mt-32 flex flex-col items-center">
            <div className="relative group">
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-white overflow-hidden bg-white shadow-lg">
                <img
                  src={profileImage || "/default-avatar.png"}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  {uploading ? (
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-white" />
                  ) : (
                    <Camera className="w-6 h-6 text-white" />
                  )}
                </button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
            </div>
            {isEditing ? (
              <div className="mt-4 space-y-4 w-full max-w-md">
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="w-full text-center text-3xl font-bold text-gray-900 bg-white rounded-xl border border-gray-200 px-4 py-2"
                />
                <input
                  type="text"
                  value={editedDescription}
                  onChange={(e) => setEditedDescription(e.target.value)}
                  className="w-full text-center text-gray-600 bg-white rounded-xl border border-gray-200 px-4 py-2"
                />
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveProfile}
                    className="px-4 py-2 rounded-xl bg-green-500 text-white hover:bg-green-600"
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-4 text-center">
                <h1 className="text-3xl font-bold text-gray-900">
                  {editedName}
                </h1>
                <p className="text-gray-600">{editedDescription}</p>
                <button
                  onClick={() => setIsEditing(true)}
                  className="mt-2 text-sm text-green-500 hover:text-green-600"
                >
                  Edit Profile
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      {cropModalOpen && (
        <CropperModal
          image={selectedImage}
          onCropComplete={handleSaveCrop}
          onClose={() => setCropModalOpen(false)}
        />
      )}
    </>
  );
};

const UserProfile = () => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(() => {
    const savedPrefs = localStorage.getItem("userPreferences");
    return {
      name: "Jordan",
      description: "Adventure Seeker • Donut Connoisseur",
      preferred_languages: ["en"],
      accessibility_needs: [],
      ...(savedPrefs ? JSON.parse(savedPrefs) : {}),
    };
  });

  const [trips, setTrips] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tripsRes = await fetch(`${import.meta.env.VITE_API_URL}/trips`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (tripsRes.ok) {
          const tripsData = await tripsRes.json();
          setTrips(tripsData);
        }
      } catch (error) {
        console.error("Error fetching trips:", error);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchData();
  }, [token]);
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
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 pt-navbar pb-16">
        <ProfileHeader
          profile={profile}
          trips={trips}
          onProfileUpdate={(newProfileData) => {
            setProfile((prev) => ({
              ...prev,
              ...newProfileData,
            }));
          }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Two-column grid for first two sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <DashboardSection
              title="Travel Overview"
              icon={<Globe className="w-6 h-6 text-green-500" />}
            >
              <TravelStats trips={trips} />
            </DashboardSection>

            <DashboardSection
              title="Quick Preferences"
              icon={<User className="w-6 h-6 text-orange-500" />}
            >
              <QuickPreferences
                profile={profile}
                onUpdate={(key, value) =>
                  setProfile((prev) => ({ ...prev, [key]: value }))
                }
              />
            </DashboardSection>
          </div>

          <DashboardSection
            title="Your Trips"
            icon={<Calendar className="w-6 h-6 text-green-500" />}
          >
            <TripGallery trips={trips} />
          </DashboardSection>

          <DashboardSection
            title="Travel Goals"
            icon={<MapPin className="w-6 h-6 text-orange-500" />}
          >
            <TravelGoals />
          </DashboardSection>
        </div>
      </div>
    </motion.div>
  );
};

export default UserProfile;
TravelStats;

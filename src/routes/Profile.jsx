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
  Camera
} from "lucide-react";
import { motion } from "framer-motion";
import { Listbox } from "@headlessui/react";
import Cropper from 'react-easy-crop';

const SUPPORTED_LANGUAGES = [
  { value: "en", label: "English" },
  { value: "es", label: "Español" },
  { value: "fr", label: "Français" },
  { value: "de", label: "Deutsch" },
  { value: "it", label: "Italiano" },
];

const ACCESSIBILITY_OPTIONS = [
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
            ? value.map(v => options.find(opt => opt.value === v)?.label).join(' • ')
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
                active ? 'bg-green-50 text-green-900' : 'text-gray-900'
              }`
            }
          >
            {({ selected }) => (
              <div className="flex items-center">
                <span className={`flex-grow ${selected ? 'font-medium' : 'font-normal'}`}>
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
    className="bg-white rounded-2xl shadow-sm p-6 mb-6 relative overflow-visible"
    style={{
      boxShadow:
        "0 0 20px rgba(0, 0, 0, 0.05), 0 0 40px rgba(34, 197, 94, 0.03)",
    }}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-green-50/30 to-orange-50/30 pointer-events-none" />
    <div className="relative">
      <div className="flex items-center gap-3 mb-6">
        {icon}
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
      </div>
      {children}
    </div>
  </motion.div>
);

const TravelStats = ({ trips }) => {
  const stats = {
    totalTrips: trips?.length || 0,
    upcomingTrips:
      trips?.filter((trip) => new Date(trip.start_date) > new Date()).length ||
      0,
    completedTrips:
      trips?.filter((trip) => new Date(trip.end_date) < new Date()).length || 0,
    countries: [
      ...new Set(
        trips?.map((trip) => trip.destination.split(",").pop().trim()) || []
      ),
    ].length,
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {Object.entries(stats).map(([key, value], index) => (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: index * 0.1 }}
          key={key}
          className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 text-center shadow-sm border border-gray-100"
        >
          <div className="text-3xl font-bold text-orange-500">{value}</div>
          <div className="text-sm text-gray-600 mt-2">
            {key.replace(/([A-Z])/g, " $1").trim()}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

const TripGallery = ({ trips }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {trips?.map((trip, index) => (
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: index * 0.1 }}
        key={trip.id}
        className="group relative rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all"
      >
        <div className="aspect-video bg-gradient-to-br from-green-500 to-orange-500 opacity-90"></div>
        <div className="absolute inset-0 p-4 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <h3 className="text-white font-semibold">{trip.destination}</h3>
            <button className="text-white opacity-0 group-hover:opacity-100 transition-opacity">
              <Share2 size={20} />
            </button>
          </div>
          <div className="text-white text-sm">
            {new Date(trip.start_date).toLocaleDateString()} -{" "}
            {new Date(trip.end_date).toLocaleDateString()}
          </div>
        </div>
      </motion.div>
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
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={newGoal}
          onChange={(e) => setNewGoal(e.target.value)}
          placeholder="Add a new travel goal..."
          className="flex-1 rounded-xl border border-gray-200 py-2 px-4 focus:border-green-500 focus:ring-2 focus:ring-green-500 text-white"
        />
        <button
          onClick={addGoal}
          className="animate-gradient text-white px-4 py-2 rounded-xl hover:opacity-90 transition-all"
        >
          Add Goal
        </button>
      </div>

      {goals.map((goal, index) => (
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: index * 0.1 }}
          key={goal}
          className="flex items-center justify-between gap-3 p-4 rounded-xl bg-gray-50 border border-gray-100"
        >
          <div className="flex items-center gap-3">
            <Trophy className="text-orange-500" size={20} />
            <span className="text-gray-900 font-medium">{goal}</span>
          </div>
          <button
            onClick={() => removeGoal(index)}
            className="text-gray-400 hover:text-red-500 transition-colors"
          >
            ×
          </button>
        </motion.div>
      ))}
    </div>
  );
};

const QuickPreferences = ({ profile, onUpdate }) => {
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const { token } = useAuth();

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('http://localhost:8000/users/profile', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(profile)
      });
      
      if (response.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2000);
      }
    } catch (error) {
      console.error('Error saving preferences:', error);
    } finally {
      setSaving(false);
    }
  };

  const languageValues = Array.isArray(profile.preferred_languages) 
    ? profile.preferred_languages 
    : profile.preferred_languages?.split(',').filter(Boolean) || [];
    
  const accessibilityValues = Array.isArray(profile.accessibility_needs)
    ? profile.accessibility_needs
    : profile.accessibility_needs?.split(',').filter(Boolean) || [];

  return (
    <div className="space-y-6">
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
            value={languageValues}
            onChange={(value) => onUpdate('preferred_languages', value)}
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
            value={accessibilityValues}
            onChange={(value) => onUpdate('accessibility_needs', value)}
            placeholder="Select requirements..."
          />
        </motion.div>
      </div>
      
      <button
        onClick={handleSave}
        className="w-full animate-gradient text-white font-medium py-3 px-6 rounded-xl hover:opacity-90 transition-all hover:scale-[1.02] transform duration-200 flex items-center justify-center shadow-md"
      >
        {saving ? (
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
            Saving...
          </div>
        ) : saveSuccess ? (
          <div className="flex items-center gap-2">
            <Check className="h-5 w-5" />
            Saved!
          </div>
        ) : (
          'Save Preferences'
        )}
      </button>
    </div>
  );
};

const CropperModal = ({ image, onCropComplete, onClose }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

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
            onCropComplete={onCropComplete}
          />
        </div>
        <div className="flex justify-between">
          <input
            type="range"
            value={zoom}
            min={1}
            max={3}
            step={0.1}
            onChange={(e) => setZoom(e.target.value)}
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
              onClick={() => onCropComplete(crop, zoom)}
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

const ProfileHeader = ({ profile, trips }) => {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [profileImage, setProfileImage] = useState(localStorage.getItem('profileImage'));
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

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

  const handleCropComplete = async (croppedArea, croppedAreaPixels) => {
    setUploading(true);
    
    // Create a canvas to draw the cropped image
    const canvas = document.createElement('canvas');
    const image = new Image();
    image.src = selectedImage;
    
    await new Promise((resolve) => {
      image.onload = resolve;
    });
    // Set canvas size to match the cropped area
    canvas.width = croppedAreaPixels.width;
    canvas.height = croppedAreaPixels.height;
    
    const ctx = canvas.getContext('2d');
    
    // Draw the cropped image
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
    // Convert to base64 and save
    const base64Image = canvas.toDataURL('image/jpeg');
    localStorage.setItem('profileImage', base64Image);
    setProfileImage(base64Image);
    
    setCropModalOpen(false);
    setUploading(false);
  };

  return (
    <>
      <div className="relative mb-8">
        {/* Cover Photo */}
        <div className="h-48 w-full rounded-2xl overflow-hidden">
          <div className="w-full h-full animate-gradient"></div>
        </div>
        
        {/* Profile Info Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative -mt-24 sm:-mt-32 flex flex-col items-center">
            {/* Profile Picture */}
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

            {/* User Info */}
            <h1 className="mt-4 text-3xl font-bold text-gray-900">{profile.name || 'Traveler'}</h1>
            <p className="text-gray-600">Adventure Seeker • Travel Enthusiast</p>

            {/* Stats */}
            <div className="mt-6 flex gap-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-500">{trips?.length || 0}</div>
                <div className="text-sm text-gray-600">Trips</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-500">
                  {[...new Set(trips?.map(trip => trip.destination.split(',').pop().trim()) || [])].length}
                </div>
                <div className="text-sm text-gray-600">Countries</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-500">
                  {trips?.reduce((total, trip) => {
                    const start = new Date(trip.start_date);
                    const end = new Date(trip.end_date);
                    return total + Math.ceil((end - start) / (1000 * 60 * 60 * 24));
                  }, 0) || 0}
                </div>
                <div className="text-sm text-gray-600">Travel Days</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {cropModalOpen && (
        <CropperModal
          image={selectedImage}
          onCropComplete={handleCropComplete}
          onClose={() => setCropModalOpen(false)}
        />
      )}
    </>
  );
};

export default function UserProfile() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({});
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, tripsRes] = await Promise.all([
          fetch('http://localhost:8000/users/profile', {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch('http://localhost:8000/trips', {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ]);

        if (profileRes.ok && tripsRes.ok) {
          const [profileData, tripsData] = await Promise.all([
            profileRes.json(),
            tripsRes.json()
          ]);
          setProfile(profileData);
          setTrips(tripsData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchData();
  }, [token]);

  return (
    <motion.div
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -300, opacity: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 pt-navbar pb-16">
        <ProfileHeader profile={profile} trips={trips} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
}
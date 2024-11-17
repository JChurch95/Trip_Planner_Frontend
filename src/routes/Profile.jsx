import { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { User, Bike, Wallet, Globe, Utensils, Heart, Languages } from 'lucide-react';

export default function UserProfile() {
  const { user, token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [profile, setProfile] = useState({
    traveler_type: '',
    activity_level: '',
    special_interests: '',
    dietary_preferences: '',
    accessibility_needs: '',
    preferred_languages: '',
    budget_preference: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('http://localhost:8000/users/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setProfile(data);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchProfile();
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const response = await fetch('http://localhost:8000/users/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...profile,
          user_id: user
        })
      });

      if (response.ok) {
        setMessage('Profile updated successfully!');
      } else {
        setMessage('Failed to update profile. Please try again.');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage('An error occurred. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 pt-32 flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 pt-32 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Travel{" "}
            <span className="bg-gradient-to-r from-green-500 to-orange-500 text-transparent bg-clip-text">
              Preferences
            </span>
          </h1>
          <p className="text-gray-600">
            Help us personalize your travel experiences by telling us a bit about yourself
          </p>
        </div>

        {message && (
          <div className={`mb-8 p-4 rounded-xl ${
            message.includes('success') 
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {message}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Traveler Type */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-gray-900">
                <User className="w-5 h-5 text-green-500" />
                <h2 className="text-lg font-semibold">Traveler Type</h2>
              </div>
              <select
                name="traveler_type"
                value={profile.traveler_type || ''}
                onChange={handleChange}
                className="w-full rounded-xl border-gray-200 shadow-sm focus:border-green-500 focus:ring-green-500"
              >
                <option value="">Select type</option>
                <option value="solo">Solo Adventurer</option>
                <option value="couple">Traveling Duo</option>
                <option value="family">Family Expedition</option>
                <option value="group">Group Journey</option>
              </select>
            </div>

            {/* Activity Level */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-gray-900">
                <Bike className="w-5 h-5 text-orange-500" />
                <h2 className="text-lg font-semibold">Activity Level</h2>
              </div>
              <select
                name="activity_level"
                value={profile.activity_level || ''}
                onChange={handleChange}
                className="w-full rounded-xl border-gray-200 shadow-sm focus:border-orange-500 focus:ring-orange-500"
              >
                <option value="">Select level</option>
                <option value="relaxed">Relaxed & Easy</option>
                <option value="moderate">Moderately Active</option>
                <option value="active">Very Active</option>
              </select>
            </div>

            {/* Budget Preference */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-gray-900">
                <Wallet className="w-5 h-5 text-green-500" />
                <h2 className="text-lg font-semibold">Budget Range</h2>
              </div>
              <select
                name="budget_preference"
                value={profile.budget_preference || ''}
                onChange={handleChange}
                className="w-full rounded-xl border-gray-200 shadow-sm focus:border-green-500 focus:ring-green-500"
              >
                <option value="">Select budget</option>
                <option value="BUDGET">Budget ($50-100/day)</option>
                <option value="COMFORT">Comfort ($100-200/day)</option>
                <option value="PREMIUM">Premium ($200-500/day)</option>
                <option value="LUXURY">Luxury ($500-1000/day)</option>
                <option value="ULTRA_LUXURY">Ultra Luxury ($1000+/day)</option>
              </select>
            </div>

            {/* Special Interests */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-gray-900">
                <Heart className="w-5 h-5 text-orange-500" />
                <h2 className="text-lg font-semibold">Special Interests</h2>
              </div>
              <input
                type="text"
                name="special_interests"
                value={profile.special_interests || ''}
                onChange={handleChange}
                placeholder="Photography, Hiking, Food Tours..."
                className="w-full rounded-xl border-gray-200 shadow-sm focus:border-orange-500 focus:ring-orange-500"
              />
            </div>

            {/* Dietary Preferences */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-gray-900">
                <Utensils className="w-5 h-5 text-green-500" />
                <h2 className="text-lg font-semibold">Dietary Preferences</h2>
              </div>
              <input
                type="text"
                name="dietary_preferences"
                value={profile.dietary_preferences || ''}
                onChange={handleChange}
                placeholder="Vegetarian, Gluten-free..."
                className="w-full rounded-xl border-gray-200 shadow-sm focus:border-green-500 focus:ring-green-500"
              />
            </div>

            {/* Accessibility Needs */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-gray-900">
                <Globe className="w-5 h-5 text-orange-500" />
                <h2 className="text-lg font-semibold">Accessibility Requirements</h2>
              </div>
              <input
                type="text"
                name="accessibility_needs"
                value={profile.accessibility_needs || ''}
                onChange={handleChange}
                placeholder="Any specific accessibility needs..."
                className="w-full rounded-xl border-gray-200 shadow-sm focus:border-orange-500 focus:ring-orange-500"
              />
            </div>

            {/* Languages */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-gray-900">
                <Languages className="w-5 h-5 text-green-500" />
                <h2 className="text-lg font-semibold">Preferred Languages</h2>
              </div>
              <input
                type="text"
                name="preferred_languages"
                value={profile.preferred_languages || ''}
                onChange={handleChange}
                placeholder="English, Spanish..."
                className="w-full rounded-xl border-gray-200 shadow-sm focus:border-green-500 focus:ring-green-500"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={saving}
              className="w-full bg-gradient-to-r from-green-500 to-orange-500 text-white font-medium py-4 px-6 rounded-xl hover:opacity-90 transition-all hover:scale-[1.02] transform duration-200 flex items-center justify-center group shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                  Saving...
                </div>
              ) : (
                'Save Preferences'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
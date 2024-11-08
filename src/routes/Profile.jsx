import { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';

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
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Your Travel Profile</h1>
        
        {message && (
          <div className={`p-4 rounded-md mb-6 ${message.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Traveler Type</label>
            <select
              name="traveler_type"
              value={profile.traveler_type || ''}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">Select type</option>
              <option value="solo">Solo</option>
              <option value="couple">Couple</option>
              <option value="family">Family</option>
              <option value="group">Group</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Activity Level</label>
            <select
              name="activity_level"
              value={profile.activity_level || ''}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">Select level</option>
              <option value="relaxed">Relaxed</option>
              <option value="moderate">Moderate</option>
              <option value="active">Active</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Budget Preference</label>
            <select
              name="budget_preference"
              value={profile.budget_preference || ''}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">Select budget</option>
              <option value="BUDGET">Budget ($50-100/day)</option>
              <option value="COMFORT">Comfort ($100-200/day)</option>
              <option value="PREMIUM">Premium ($200-500/day)</option>
              <option value="LUXURY">Luxury ($500-1000/day)</option>
              <option value="ULTRA_LUXURY">Ultra Luxury ($1000+/day)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Special Interests</label>
            <input
              type="text"
              name="special_interests"
              value={profile.special_interests || ''}
              onChange={handleChange}
              placeholder="e.g., Photography, Hiking, Food Tours"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Dietary Preferences</label>
            <input
              type="text"
              name="dietary_preferences"
              value={profile.dietary_preferences || ''}
              onChange={handleChange}
              placeholder="e.g., Vegetarian, Gluten-free"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Accessibility Needs</label>
            <input
              type="text"
              name="accessibility_needs"
              value={profile.accessibility_needs || ''}
              onChange={handleChange}
              placeholder="Any specific accessibility requirements"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Preferred Languages</label>
            <input
              type="text"
              name="preferred_languages"
              value={profile.preferred_languages || ''}
              onChange={handleChange}
              placeholder="e.g., English, Spanish"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
      </div>
    </div>
  );
}
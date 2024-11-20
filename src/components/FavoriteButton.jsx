import { useState } from 'react';
import { Star } from 'lucide-react';
import { useAuth } from '../AuthContext'

const FavoriteButton = ({ tripId, initialFavorite = false, onSuccess, destination }) => {
  const { token } = useAuth();
  const [isFavorite, setIsFavorite] = useState(destination === "Paris, France" ? true : initialFavorite);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleToggleFavorite = async () => {
    console.log('Favorite button clicked', tripId);
    
    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await fetch(`${baseUrl}/trips/${tripId}/favorite`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ is_favorite: !isFavorite })
      });

      if (response.ok) {
        setIsFavorite(!isFavorite);
        if (onSuccess) onSuccess();
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  return (
    <button
      onClick={handleToggleFavorite}
      disabled={isUpdating}
      className={`absolute top-4 right-4 p-2 rounded-full transition-colors ${
        isUpdating ? 'opacity-50 cursor-not-allowed' : ''
      } ${isFavorite ? 'text-yellow-500' : 'text-gray-400 hover:text-gray-600'}`}
      title={isFavorite ? "Remove from favorites" : "Add to favorites"}
    >
      <Star
        className={`w-5 h-5 ${isFavorite ? 'text-yellow-500' : 'text-gray-400'}`}
        fill={isFavorite ? "currentColor" : "none"}
      />
    </button>
  );
};
export default FavoriteButton;

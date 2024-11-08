import { useState } from 'react';
import { Star } from 'lucide-react';

const FavoriteButton = ({ tripId, initialFavorite = false, onSuccess }) => {
  const [isFavorite, setIsFavorite] = useState(initialFavorite);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleToggleFavorite = async () => {
    setIsUpdating(true);
    const token = sessionStorage.getItem('sb-access-token');

    try {
      // Changed to include favorite as a query parameter
      const response = await fetch(
        `http://localhost:8000/trips/${tripId}/favorite?favorite=${!isFavorite}`, 
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update favorite status: ${errorText}`);
      }

      setIsFavorite(!isFavorite);
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error updating favorite status:', error);
    } finally {
      setIsUpdating(false);
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
        className="w-5 h-5"
        fill={isFavorite ? "currentColor" : "none"}
      />
    </button>
  );
};

export default FavoriteButton;
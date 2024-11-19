import { useState } from 'react';
import { Star } from 'lucide-react';

const FavoriteButton = ({ tripId, initialFavorite = false, onSuccess, destination }) => {
  const [isFavorite, setIsFavorite] = useState(destination === "Paris, France" ? true : initialFavorite);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    if (onSuccess) onSuccess();
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
        className={`w-5 h-5 ${tripId === 155 ? 'text-yellow-500' : 'text-gray-400'}`}
        fill={tripId === 155 ? "currentColor" : "none"}
      />
    </button>
  );
};
export default FavoriteButton;
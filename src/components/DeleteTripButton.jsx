import { useState } from 'react';
import { Trash2 } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;


const DeleteTripButton = ({ tripId, onSuccess, isFavorite }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    const token = sessionStorage.getItem('sb-access-token');

    try {
      const baseUrl = API_URL;
      const response = await fetch(`${baseUrl}/trips/${tripId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to delete trip: ${errorText}`);
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error deleting trip:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isFavorite}
      className={`${
        isFavorite 
          ? 'cursor-not-allowed opacity-50' 
          : 'hover:text-red-600'
      } text-red-500`}
      title={isFavorite ? "Cannot delete favorited trips" : "Delete trip"}
    >
      <Trash2 className="w-5 h-5" />
    </button>
  );
};

export default DeleteTripButton;
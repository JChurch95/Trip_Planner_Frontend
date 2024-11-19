import { useState } from 'react';
import { Trash2 } from 'lucide-react';

const DeleteTripButton = ({ tripId, onSuccess }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    const token = sessionStorage.getItem('sb-access-token');
    const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";

    try {
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
      disabled={isDeleting}
      className={`p-2 rounded-full text-red-600 hover:bg-red-50 transition-colors ${
        isDeleting ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      title="Delete Trip"
    >
      <Trash2 className={`w-5 h-5 ${isDeleting ? 'opacity-50' : ''}`} />
    </button>
  );
};

export default DeleteTripButton;
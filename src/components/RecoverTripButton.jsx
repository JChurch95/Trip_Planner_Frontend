import { useState } from 'react';
import { RefreshCw } from 'lucide-react';

const RecoverTripButton = ({ tripId, onSuccess }) => {
  const [isRecovering, setIsRecovering] = useState(false);

  const handleRecover = async () => {
    setIsRecovering(true);
    const token = sessionStorage.getItem('sb-access-token');
    const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";

    try {
      const response = await fetch(`${baseUrl}/trips/${tripId}/recover`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to recover trip: ${errorText}`);
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error recovering trip:', error);
    } finally {
      setIsRecovering(false);
    }
  };

  return (
    <button
      onClick={handleRecover}
      disabled={isRecovering}
      className={`p-2 rounded-full text-green-600 hover:bg-green-50 transition-colors ${
        isRecovering ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      title="Recover Trip"
    >
      <RefreshCw className={`w-5 h-5 ${isRecovering ? 'animate-spin' : ''}`} />
    </button>
  );
};

export default RecoverTripButton;
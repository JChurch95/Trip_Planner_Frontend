import { React, useState, createElement } from 'react';
import { Users, Activity, Wallet2, PenLine, Map, ChevronRight, ChevronLeft, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TripDetailsWizard = ({ destination, onClose, onSubmit, isCreatingTrip }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    traveler_type: '',
    activity_level: '',
    budget_preference: '',
    special_interests: '',
    dietary_preferences: '',
    additional_notes: ''
  });

  const steps = [
    {
      id: 'traveler',
      icon: Users,
      title: 'Who\'s traveling?',
      subtitle: 'Help us tailor the perfect experience',
      options: [
        { value: 'solo', label: 'Solo Adventurer', icon: '🏃‍♂️', description: 'Flexible schedule, personal interests' },
        { value: 'couple', label: 'Traveling Duo', icon: '👫', description: 'Romantic spots, shared experiences' },
        { value: 'family', label: 'Family Expedition', icon: '👨‍👩‍👧‍👦', description: 'Kid-friendly activities' },
        { value: 'group', label: 'Group Journey', icon: '👥', description: 'Social activities, group dining' }
      ]
    },
    {
      id: 'activity',
      icon: Activity,
      title: 'Activity Level',
      subtitle: 'Set the pace for your journey',
      options: [
        { value: 'relaxed', label: 'Relaxed & Easy', icon: '🌅', description: 'Leisurely pace, plenty of downtime' },
        { value: 'moderate', label: 'Moderately Active', icon: '🚶‍♂️', description: 'Balance of activity and rest' },
        { value: 'active', label: 'Very Active', icon: '🏃‍♂️', description: 'High-energy adventures' }
      ]
    },
    {
      id: 'budget',
      icon: Wallet2,
      title: 'Budget Range',
      subtitle: 'Find the perfect balance',
      options: [
        { value: 'BUDGET', label: 'Budget', icon: '💰', description: '$50-100 per day' },
        { value: 'COMFORT', label: 'Comfort', icon: '💰💰', description: '$100-200 per day' },
        { value: 'PREMIUM', label: 'Premium', icon: '💰💰💰', description: '$200-500 per day' },
        { value: 'LUXURY', label: 'Luxury', icon: '💰💰💰💰', description: '$500-1000 per day' },
        { value: 'ULTRA_LUXURY', label: 'Ultra Luxury', icon: '💎', description: '$1000+ per day' }
      ]
    },
    {
      id: 'preferences',
      icon: PenLine,
      title: 'Preferences & Notes',
      subtitle: 'Tell us more about your interests'
    }
  ];

  const handleOptionSelect = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(current => current + 1);
    } else {
      onSubmit(formData);
    }
  };

  <div className="flex justify-center mb-4">
  {steps[currentStep].icon && createElement(steps[currentStep].icon, {
    className: "w-8 h-8 text-orange-500"
  })}
</div>

const handleBack = () => {
  setCurrentStep(current => Math.max(0, current - 1));
};

  const isStepComplete = () => {
    const step = steps[currentStep];
    if (step.id === 'preferences') {
      return true; // Optional step
    }
    return !!formData[step.id === 'traveler' ? 'traveler_type' : 
                     step.id === 'activity' ? 'activity_level' : 
                     'budget_preference'];
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={() => onClose()}
    >
      <div 
        className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative p-6 border-b border-gray-100">
          <div className="absolute right-4 top-4">
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          
          <div className="flex items-center gap-3 mb-2">
            <Map className="w-6 h-6 text-orange-500" />
            <h2 className="text-2xl font-bold text-gray-900">
              Plan Your Trip to {destination}
            </h2>
          </div>

          {/* Progress Bar */}
          <div className="flex gap-2 mt-6">
            {steps.map((step, index) => (
              <div 
                key={step.id}
                className="flex-1 h-1 rounded-full overflow-hidden bg-gray-100"
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ 
                    width: currentStep > index ? '100%' : 
                           currentStep === index ? '50%' : '0%'
                  }}
                  className="h-full bg-gradient-to-r from-green-500 to-orange-500"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {currentStep < steps.length - 1 ? (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                      {React.createElement(steps[currentStep].icon, {
                        className: "w-8 h-8 text-orange-500"
                      })}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {steps[currentStep].title}
                    </h3>
                    <p className="text-gray-500 mt-1">
                      {steps[currentStep].subtitle}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {steps[currentStep].options.map(option => (
                      <button
                        key={option.value}
                        onClick={() => handleOptionSelect(
                          steps[currentStep].id === 'traveler' ? 'traveler_type' :
                          steps[currentStep].id === 'activity' ? 'activity_level' :
                          'budget_preference',
                          option.value
                        )}
                        className={`p-4 rounded-xl border-2 text-left transition-all transform hover:scale-[1.02] ${
                          formData[
                            steps[currentStep].id === 'traveler' ? 'traveler_type' :
                            steps[currentStep].id === 'activity' ? 'activity_level' :
                            'budget_preference'
                          ] === option.value
                            ? 'border-orange-500 bg-orange-50'
                            : 'border-gray-100 hover:border-orange-200'
                        }`}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-2xl">{option.icon}</span>
                          <h4 className="font-semibold text-gray-900">
                            {option.label}
                          </h4>
                        </div>
                        <p className="text-sm text-gray-600">
                          {option.description}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Special Interests
                      </label>
                      <input
                        type="text"
                        value={formData.special_interests}
                        onChange={(e) => handleOptionSelect('special_interests', e.target.value)}
                        placeholder="Photography, Local Markets, Street Food..."
                        className="w-full border border-gray-200 rounded-xl p-3 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Dietary Preferences
                      </label>
                      <input
                        type="text"
                        value={formData.dietary_preferences}
                        onChange={(e) => handleOptionSelect('dietary_preferences', e.target.value)}
                        placeholder="Vegetarian, Gluten-free, Halal..."
                        className="w-full border border-gray-200 rounded-xl p-3 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Additional Notes
                      </label>
                      <textarea
                        value={formData.additional_notes}
                        onChange={(e) => handleOptionSelect('additional_notes', e.target.value)}
                        placeholder="Any special requests, must-see places, or other preferences..."
                        className="w-full h-32 border border-gray-200 rounded-xl p-3 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                      />
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100">
          <div className="flex justify-between items-center">
            <button
              onClick={handleBack}
              className={`flex items-center px-6 py-3 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors ${
                currentStep === 0 ? 'invisible' : ''
              }`}
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              Back
            </button>

            <button
              onClick={handleNext}
              disabled={!isStepComplete() || isCreatingTrip}
              className="flex items-center px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-orange-500 text-white font-medium transition-all hover:opacity-90 disabled:opacity-50"
            >
              {isCreatingTrip ? (
                <>
                  <div className="animate-spin mr-2 h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                  Creating...
                </>
              ) : (
                <>
                  {currentStep === steps.length - 1 ? 'Generate Itinerary' : 'Next'}
                  <ChevronRight className="w-5 h-5 ml-2" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TripDetailsWizard;
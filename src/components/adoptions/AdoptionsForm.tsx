import React, { useState } from 'react';
import type { AdoptionRequest } from '../../types';
import Button from '../ui/Button';

interface AdoptionFormProps {
  petId: number;
  petName: string;
  adopterId: number;
  onSubmit: (data: AdoptionRequest) => Promise<void>;
  onCancel: () => void;
}

const AdoptionForm: React.FC<AdoptionFormProps> = ({
  petId,
  petName,
  adopterId,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    notes: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsLoading(true);
    try {
      await onSubmit({
        petId,
        adopterId,
        notes: formData.notes.trim() || undefined,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-blue-50 p-4 rounded-md">
        <h4 className="text-sm font-medium text-blue-800">
          Adoption Request for: {petName}
        </h4>
        <p className="text-sm text-blue-600 mt-1">
          You are requesting to adopt this pet. Please provide any additional notes below.
        </p>
      </div>
      
      <div className="space-y-1">
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
          Notes (Optional)
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={4}
          value={formData.notes}
          onChange={handleChange}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="Tell us why you'd like to adopt this pet, your experience with pets, living situation, etc."
        />
      </div>
      
      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          isLoading={isLoading}
        >
          Submit Adoption Request
        </Button>
      </div>
    </form>
  );
};

export default AdoptionForm;
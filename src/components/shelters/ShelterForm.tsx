import React from 'react';
import { Button, Input } from '../ui';

interface ShelterFormProps {
  shelter?: {
    id?: number;
    name: string;
    address: string;
    email: string;
    phone: string;
  };
  onSubmit: (data: {
    name: string;
    address: string;
    email: string;
    phone: string;
  }) => Promise<void>;
  onCancel: () => void;
}

const ShelterForm: React.FC<ShelterFormProps> = ({
  shelter,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = React.useState({
    name: shelter?.name || '',
    address: shelter?.address || '',
    email: shelter?.email || '',
    phone: shelter?.phone || '',
  });
  const [error, setError] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await onSubmit(formData);
    } catch (err: any) {
      setError(err.message || 'Failed to save shelter');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">{error}</h3>
            </div>
          </div>
        </div>
      )}

      <Input
        label="Shelter Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        required
        placeholder="Enter shelter name"
      />

      <Input
        label="Address"
        name="address"
        value={formData.address}
        onChange={handleChange}
        required
        placeholder="Enter shelter address"
      />

      <Input
        label="Email"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        required
        placeholder="Enter shelter email"
      />

      <Input
        label="Phone"
        name="phone"
        type="tel"
        value={formData.phone}
        onChange={handleChange}
        required
        placeholder="Enter shelter phone number"
      />

      <div className="flex justify-end space-x-3">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : shelter ? 'Update Shelter' : 'Create Shelter'}
        </Button>
      </div>
    </form>
  );
};

export default ShelterForm;
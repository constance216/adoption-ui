import React, { useState } from 'react';
import type { User } from '../../types';
import Input from '../ui/Input';
import Button from '../ui/Button';

interface VeterinarianFormProps {
  veterinarian?: User;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
}

const VeterinarianForm: React.FC<VeterinarianFormProps> = ({
  veterinarian,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    username: veterinarian?.username || '',
    email: veterinarian?.email || '',
    password: '',
    fullName: veterinarian?.fullName || '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!veterinarian && !formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (!veterinarian && formData.username.trim().length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!veterinarian && !formData.password) {
      newErrors.password = 'Password is required';
    } else if (!veterinarian && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      const submitData = veterinarian 
        ? {
            email: formData.email.trim(),
            fullName: formData.fullName.trim(),
            ...(formData.password && { password: formData.password }),
          }
        : {
            username: formData.username.trim(),
            email: formData.email.trim(),
            password: formData.password,
            fullName: formData.fullName.trim(),
          };
      
      await onSubmit(submitData);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Full Name"
        name="fullName"
        value={formData.fullName}
        onChange={handleChange}
        error={errors.fullName}
        placeholder="Enter veterinarian's full name"
        required
      />
      
      {!veterinarian && (
        <Input
          label="Username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          error={errors.username}
          placeholder="Enter username"
          required
        />
      )}
      
      <Input
        label="Email"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
        placeholder="Enter email address"
        required
      />
      
      <Input
        label={veterinarian ? "New Password (optional)" : "Password"}
        name="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        error={errors.password}
        placeholder={veterinarian ? "Leave blank to keep current password" : "Enter password"}
        required={!veterinarian}
      />
      
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
          {veterinarian ? 'Update' : 'Create'} Veterinarian
        </Button>
      </div>
    </form>
  );
};

export default VeterinarianForm;
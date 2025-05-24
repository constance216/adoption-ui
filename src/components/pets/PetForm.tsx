import React, { useState, useEffect } from 'react';
import type { Pet, Category, Breed } from '../../types';
import { categoryService } from '../../services/categoryService';
import { breedService } from '../../services/breedService';
import { Input, Select, Button } from '../ui';

interface PetFormProps {
  pet?: Pet;
  onSubmit: (data: {
    name: string;
    breedId?: number;
    categoryId: number;
    age: number;
    description?: string;
    image?: string;
    gender: 'MALE' | 'FEMALE';
  }) => Promise<void>;
  onCancel: () => void;
}

const PetForm: React.FC<PetFormProps> = ({
  pet,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    name: pet?.name || '',
    categoryId: pet?.category?.id.toString() || '',
    breedId: pet?.breed?.id.toString() || '',
    age: pet?.age?.toString() || '',
    description: pet?.description || '',
    image: pet?.image || '',
    gender: pet?.gender || '',
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [breeds, setBreeds] = useState<Breed[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (formData.categoryId) {
      fetchBreeds(parseInt(formData.categoryId));
    } else {
      setBreeds([]);
    }
  }, [formData.categoryId]);

  const fetchCategories = async () => {
    try {
      const data = await categoryService.getAllCategories();
      setCategories(data);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    } finally {
      setDataLoading(false);
    }
  };

  const fetchBreeds = async (categoryId: number) => {
    try {
      setDataLoading(true);
      const data = await breedService.getBreedsByCategory(categoryId);
      setBreeds(data);
    } catch (err) {
      console.error('Failed to fetch breeds:', err);
    } finally {
      setDataLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Pet name is required';
    }
    
    if (!formData.categoryId) {
      newErrors.categoryId = 'Category is required';
    }
    
    if (!formData.age.trim()) {
      newErrors.age = 'Age is required';
    } else if (isNaN(Number(formData.age)) || Number(formData.age) < 0) {
      newErrors.age = 'Age must be a valid number';
    }
    
    if (!formData.gender) {
      newErrors.gender = 'Gender is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      await onSubmit({
        name: formData.name.trim(),
        categoryId: parseInt(formData.categoryId),
        breedId: formData.breedId ? parseInt(formData.breedId) : undefined,
        age: parseInt(formData.age),
        description: formData.description.trim() || undefined,
        image: formData.image.trim() || undefined,
        gender: formData.gender as 'MALE' | 'FEMALE',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const categoryOptions = categories.map(cat => ({
    value: cat.id.toString(),
    label: cat.name,
  }));

  const breedOptions = breeds.map(breed => ({
    value: breed.id.toString(),
    label: breed.name,
  }));

  const genderOptions = [
    { value: 'MALE', label: 'Male' },
    { value: 'FEMALE', label: 'Female' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Pet Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        error={errors.name}
        placeholder="Enter pet name"
        required
      />
      
      <Select
        label="Category"
        name="categoryId"
        value={formData.categoryId}
        onChange={handleChange}
        error={errors.categoryId}
        options={categoryOptions}
        placeholder="Select a category"
        disabled={dataLoading}
        required
      />
      
      <Select
        label="Breed"
        name="breedId"
        value={formData.breedId}
        onChange={handleChange}
        options={breedOptions}
        placeholder="Select a breed"
        disabled={!formData.categoryId || dataLoading}
      />
      
      <Input
        label="Age"
        name="age"
        type="number"
        value={formData.age}
        onChange={handleChange}
        error={errors.age}
        placeholder="Enter pet age"
        required
      />
      
      <Select
        label="Gender"
        name="gender"
        value={formData.gender}
        onChange={handleChange}
        error={errors.gender}
        options={genderOptions}
        placeholder="Select gender"
        required
      />
      
      <Input
        label="Image URL"
        name="image"
        value={formData.image}
        onChange={handleChange}
        placeholder="Enter image URL (optional)"
      />
      
      <div className="space-y-1">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          value={formData.description}
          onChange={handleChange}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="Enter pet description (optional)"
        />
      </div>
      
      <div className="flex justify-end space-x-3">
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
          {pet ? 'Update' : 'Create'} Pet
        </Button>
      </div>
    </form>
  );
};

export default PetForm; 
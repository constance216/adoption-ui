import React, { useState, useEffect } from 'react';
import type { Breed, Category } from '../../types';
import { categoryService } from '../../services/categoryService';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';

interface BreedFormProps {
  breed?: Breed;
  onSubmit: (data: { name: string; categoryId: number; description?: string }) => Promise<void>;
  onCancel: () => void;
}

const BreedForm: React.FC<BreedFormProps> = ({
  breed,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    name: breed?.name || '',
    categoryId: breed?.category?.id?.toString() || '',
    description: breed?.description || '',
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await categoryService.getAllCategories();
      setCategories(data);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    } finally {
      setCategoriesLoading(false);
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
      newErrors.name = 'Breed name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Breed name must be at least 2 characters';
    }
    
    if (!formData.categoryId) {
      newErrors.categoryId = 'Category is required';
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
        description: formData.description.trim() || undefined,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const categoryOptions = categories.map(cat => ({
    value: cat.id,
    label: cat.name,
  }));

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Breed Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        error={errors.name}
        placeholder="Enter breed name"
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
        disabled={categoriesLoading}
        required
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
          placeholder="Enter breed description (optional)"
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
          {breed ? 'Update' : 'Create'} Breed
        </Button>
      </div>
    </form>
  );
};

export default BreedForm;
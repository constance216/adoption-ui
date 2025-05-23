import React, { useState, useEffect } from 'react';
import type { Breed, Category } from '../types';
import { breedService } from '../services/breedService';
import { categoryService } from '../services/categoryService';
import BreedList from '../components/breeds/BreedList';
import BreedForm from '../components/breeds/BreedForm';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Select from '../components/ui/Select';

const BreedsPage: React.FC = () => {
  const [breeds, setBreeds] = useState<Breed[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBreed, setEditingBreed] = useState<Breed | null>(null);
  const [deletingBreed, setDeletingBreed] = useState<Breed | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('');

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterBreeds();
  }, [filterCategory]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [breedsData, categoriesData] = await Promise.all([
        breedService.getAllBreeds(),
        categoryService.getAllCategories(),
      ]);
      setBreeds(breedsData);
      setCategories(categoriesData);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const filterBreeds = async () => {
    if (!filterCategory) {
      fetchData();
      return;
    }

    try {
      setLoading(true);
      const filteredBreeds = await breedService.getBreedsByCategory(parseInt(filterCategory));
      setBreeds(filteredBreeds);
    } catch (err: any) {
      setError(err.message || 'Failed to filter breeds');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingBreed(null);
    setIsModalOpen(true);
  };

  const handleEdit = (breed: Breed) => {
    setEditingBreed(breed);
    setIsModalOpen(true);
  };

  const handleSubmit = async (data: { name: string; categoryId: number; description?: string }) => {
    try {
      if (editingBreed) {
        await breedService.updateBreed(editingBreed.id, data);
      } else {
        await breedService.createBreed(data);
      }
      
      setIsModalOpen(false);
      setEditingBreed(null);
      fetchData();
    } catch (err: any) {
      throw new Error(err.message || 'Failed to save breed');
    }
  };

  const handleDelete = (breed: Breed) => {
    setDeletingBreed(breed);
  };

  const confirmDelete = async () => {
    if (!deletingBreed) return;
    
    try {
      await breedService.deleteBreed(deletingBreed.id);
      setDeletingBreed(null);
      fetchData();
    } catch (err: any) {
      setError(err.message || 'Failed to delete breed');
      setDeletingBreed(null);
    }
  };

  const cancelDelete = () => {
    setDeletingBreed(null);
  };

  const handleCategoryFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterCategory(e.target.value);
  };

  const categoryOptions = [
    { value: '', label: 'All Categories' },
    ...categories.map(cat => ({ value: cat.id.toString(), label: cat.name })),
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Breeds Management
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage pet breeds for the adoption system
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <Button onClick={handleCreate}>
            Add Breed
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="sm:w-64">
          <Select
            label="Filter by Category"
            value={filterCategory}
            onChange={handleCategoryFilter}
            options={categoryOptions}
          />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">{error}</h3>
            </div>
          </div>
        </div>
      )}

      {/* Breeds List */}
      <Card>
        <BreedList
          breeds={breeds}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </Card>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingBreed ? 'Edit Breed' : 'Create Breed'}
      >
        <BreedForm
          breed={editingBreed || undefined}
          onSubmit={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deletingBreed}
        onClose={cancelDelete}
        title="Delete Breed"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Are you sure you want to delete the breed "{deletingBreed?.name}"? 
            This action cannot be undone and may affect existing pets.
          </p>
          
          <div className="flex justify-end space-x-3">
            <Button variant="secondary" onClick={cancelDelete}>
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmDelete}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default BreedsPage;
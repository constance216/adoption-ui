import React, { useState, useEffect } from 'react';
import type { Pet, Category, Breed } from '../types';
import { petService } from '../services/petService';
import { categoryService } from '../services/categoryService';
import { breedService } from '../services/breedService';
import { adoptionService } from '../services/adoptionService';
import { useAuth } from '../features/auth/AuthContext';
import PetCard from '../components/pets/PetCard';
import AdoptionForm from '../components/adoptions/AdoptionsForm';
import { Modal, Button, Select, Input, Card } from '../components/ui';

interface PetFilters {
  status: string;
  category: string;
  breed: string;
  gender: string;
  ageRange: string;
  search: string;
}

const PetsPage: React.FC = () => {
  // State management
  const [pets, setPets] = useState<Pet[]>([]);
  const [filteredPets, setFilteredPets] = useState<Pet[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [breeds, setBreeds] = useState<Breed[]>([]);
  const [filteredBreeds, setFilteredBreeds] = useState<Breed[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Modal states
  const [adoptingPet, setAdoptingPet] = useState<Pet | null>(null);
  const [viewingPet, setViewingPet] = useState<Pet | null>(null);

  // Filter states
  const [filters, setFilters] = useState<PetFilters>({
    status: '',
    category: '',
    breed: '',
    gender: '',
    ageRange: '',
    search: '',
  });

  const { user } = useAuth();

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  // Apply filters when they change
  useEffect(() => {
    applyFilters();
  }, [pets, filters]);

  // Update breed options when category changes
  useEffect(() => {
    if (filters.category) {
      const categoryBreeds = breeds.filter(
        breed => breed.category.id.toString() === filters.category
      );
      setFilteredBreeds(categoryBreeds);
      // Reset breed filter if current breed doesn't belong to selected category
      if (filters.breed && !categoryBreeds.find(b => b.id.toString() === filters.breed)) {
        setFilters(prev => ({ ...prev, breed: '' }));
      }
    } else {
      setFilteredBreeds(breeds);
    }
  }, [filters.category, breeds]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [petsData, categoriesData, breedsData] = await Promise.all([
        petService.getAllPets(),
        categoryService.getAllCategories(),
        breedService.getAllBreeds(),
      ]);
      
      setPets(petsData);
      setCategories(categoriesData);
      setBreeds(breedsData);
      setFilteredBreeds(breedsData);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to load pets data');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...pets];

    // Status filter
    if (filters.status) {
      filtered = filtered.filter(pet => pet.status === filters.status);
    }

    // Category filter
    if (filters.category) {
      filtered = filtered.filter(pet => 
        pet.category?.id.toString() === filters.category
      );
    }

    // Breed filter
    if (filters.breed) {
      filtered = filtered.filter(pet => 
        pet.breed?.id.toString() === filters.breed
      );
    }

    // Gender filter
    if (filters.gender) {
      filtered = filtered.filter(pet => pet.gender === filters.gender);
    }

    // Age range filter
    if (filters.ageRange) {
      filtered = filtered.filter(pet => {
        switch (filters.ageRange) {
          case 'young': return pet.age <= 2;
          case 'adult': return pet.age > 2 && pet.age <= 8;
          case 'senior': return pet.age > 8;
          default: return true;
        }
      });
    }

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(pet =>
        pet.name.toLowerCase().includes(searchLower) ||
        pet.breed?.name.toLowerCase().includes(searchLower) ||
        pet.description?.toLowerCase().includes(searchLower) ||
        pet.category?.name.toLowerCase().includes(searchLower)
      );
    }

    setFilteredPets(filtered);
  };

  const handleFilterChange = (key: keyof PetFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      status: '',
      category: '',
      breed: '',
      gender: '',
      ageRange: '',
      search: '',
    });
  };

  const handleAdopt = (pet: Pet) => {
    if (!user) {
      setError('Please login to adopt a pet');
      return;
    }
    if (user.role !== 'USER') {
      setError('Only users can adopt pets');
      return;
    }
    setAdoptingPet(pet);
  };

  const handleAdoptionSubmit = async (adoptionData: any) => {
    try {
      await adoptionService.createAdoption(adoptionData);
      setAdoptingPet(null);
      setSuccessMessage('Adoption request submitted successfully! You can track its status in the Adoptions page.');
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (err: any) {
      throw new Error(err.message || 'Failed to submit adoption request');
    }
  };

  const handleView = (pet: Pet) => {
    setViewingPet(pet);
  };

  const handleEdit = (pet: Pet) => {
    // TODO: Implement edit functionality or navigate to edit page
    console.log('Edit pet:', pet);
    setError('Edit functionality coming soon!');
    setTimeout(() => setError(''), 3000);
  };

  // Filter options
  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'ACTIVE', label: 'Available' },
    { value: 'ADOPTED', label: 'Adopted' },
    { value: 'UNAVAILABLE', label: 'Unavailable' },
  ];

  const categoryOptions = [
    { value: '', label: 'All Categories' },
    ...categories.map(cat => ({ value: cat.id.toString(), label: cat.name })),
  ];

  const breedOptions = [
    { value: '', label: 'All Breeds' },
    ...filteredBreeds.map(breed => ({ value: breed.id.toString(), label: breed.name })),
  ];

  const genderOptions = [
    { value: '', label: 'All Genders' },
    { value: 'MALE', label: 'Male' },
    { value: 'FEMALE', label: 'Female' },
  ];

  const ageRangeOptions = [
    { value: '', label: 'All Ages' },
    { value: 'young', label: 'Young (0-2 years)' },
    { value: 'adult', label: 'Adult (3-8 years)' },
    { value: 'senior', label: 'Senior (9+ years)' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading pets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Find Your Perfect Pet
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Discover loving companions waiting for their forever home
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4 space-x-3">
          {(user?.role === 'ADMIN' || user?.role === 'SHELTER') && (
            <Button onClick={() => setError('Add pet functionality coming soon!')}>
              Add Pet
            </Button>
          )}
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="rounded-md bg-green-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">{successMessage}</h3>
            </div>
          </div>
        </div>
      )}

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

      {/* Filters */}
      <Card>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Filters</h3>
            <Button variant="secondary" size="sm" onClick={clearFilters}>
              Clear All
            </Button>
          </div>
          
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            <Input
              placeholder="Search pets..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
            
            <Select
              options={statusOptions}
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              placeholder="Status"
            />
            
            <Select
              options={categoryOptions}
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              placeholder="Category"
            />
            
            <Select
              options={breedOptions}
              value={filters.breed}
              onChange={(e) => handleFilterChange('breed', e.target.value)}
              placeholder="Breed"
              disabled={!filters.category}
            />
            
            <Select
              options={genderOptions}
              value={filters.gender}
              onChange={(e) => handleFilterChange('gender', e.target.value)}
              placeholder="Gender"
            />
            
            <Select
              options={ageRangeOptions}
              value={filters.ageRange}
              onChange={(e) => handleFilterChange('ageRange', e.target.value)}
              placeholder="Age Range"
            />
          </div>
        </div>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing {filteredPets.length} of {pets.length} pets
        </p>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <span>Sort by:</span>
          <select 
            className="border-0 bg-transparent focus:ring-0 text-sm"
            onChange={(e) => {
              const sortBy = e.target.value;
              const sorted = [...filteredPets].sort((a, b) => {
                switch (sortBy) {
                  case 'name': return a.name.localeCompare(b.name);
                  case 'age': return a.age - b.age;
                  case 'newest': return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                  default: return 0;
                }
              });
              setFilteredPets(sorted);
            }}
          >
            <option value="">Default</option>
            <option value="name">Name A-Z</option>
            <option value="age">Age (Young to Old)</option>
            <option value="newest">Newest First</option>
          </select>
        </div>
      </div>

      {/* Pets Grid */}
      {filteredPets.length === 0 ? (
        <Card className="text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-4v4m0-4V9a1 1 0 00-1-1h-1m1 1v4h-1m1-4h-2l-1-1h-2.4m0 0l-.5-.5L9 6h2.4"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No pets found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your filters to find more pets.
          </p>
          <div className="mt-6">
            <Button variant="secondary" onClick={clearFilters}>
              Clear Filters
            </Button>
        </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredPets.map((pet) => (
            <PetCard
              key={pet.id}
              pet={pet}
              onAdopt={handleAdopt}
              onView={handleView}
              onEdit={handleEdit}
            />
          ))}
        </div>
      )}

      {/* Adoption Form Modal */}
      <Modal
        isOpen={!!adoptingPet}
        onClose={() => setAdoptingPet(null)}
        title="Submit Adoption Request"
      >
        {adoptingPet && user && (
          <AdoptionForm
            petId={adoptingPet.id}
            petName={adoptingPet.name}
            adopterId={user.id}
            onSubmit={handleAdoptionSubmit}
            onCancel={() => setAdoptingPet(null)}
          />
        )}
      </Modal>

      {/* Pet Details Modal */}
      <Modal
        isOpen={!!viewingPet}
        onClose={() => setViewingPet(null)}
        title="Pet Details"
        size="lg"
      >
        {viewingPet && (
          <div className="space-y-6">
            {/* Pet Image */}
            <div className="w-full h-64 bg-gray-200 rounded-lg overflow-hidden">
              {viewingPet.image ? (
                <img
                  src={viewingPet.image}
                  alt={viewingPet.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <svg
                    className="h-20 w-20 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
              )}
            </div>

            {/* Pet Information */}
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{viewingPet.name}</h3>
                  <p className="text-lg text-gray-600">
                    {viewingPet.breed?.name || 'Mixed breed'} • {viewingPet.age} years old
                  </p>
                </div>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  viewingPet.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                  viewingPet.status === 'ADOPTED' ? 'bg-blue-100 text-blue-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {viewingPet.status}
                </span>
              </div>
              
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-500">Category:</span>
                  <p className="text-sm text-gray-900">{viewingPet.category?.name || 'Unknown'}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Gender:</span>
                  <p className="text-sm text-gray-900">{viewingPet.gender}</p>
                </div>
                {viewingPet.shelter && (
                  <div className="col-span-2">
                    <span className="text-sm font-medium text-gray-500">Shelter:</span>
                    <p className="text-sm text-gray-900">{viewingPet.shelter.fullName}</p>
                  </div>
                )}
              </div>
              
              {viewingPet.description && (
                <div className="mt-6">
                  <span className="text-sm font-medium text-gray-500">About {viewingPet.name}:</span>
                  <p className="text-sm text-gray-900 mt-2 leading-relaxed">{viewingPet.description}</p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button
                variant="secondary"
                onClick={() => setViewingPet(null)}
              >
                Close
              </Button>
              {viewingPet.status === 'ACTIVE' && user?.role === 'USER' && (
                <Button
                  onClick={() => {
                    setViewingPet(null);
                    handleAdopt(viewingPet);
                  }}
                >
                  Adopt {viewingPet.name}
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PetsPage;
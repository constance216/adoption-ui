import React, { useState, useEffect } from 'react';
import type { Pet } from '../types';
import { shelterService } from '../services/shelterService';
import { useAuth } from '../features/auth/AuthContext';
import ShelterList from '../components/shelters/ShelterList';
import ShelterForm from '../components/shelters/ShelterForm';
import { Modal, Button, Card, Select, Input } from '../components/ui';

interface Shelter {
  id: number;
  name: string;
  address: string;
  email: string;
  phone: string;
  createdAt: string;
  pets?: Pet[];
}

interface ShelterFilters {
  search: string;
  hasPets: string;
}

const SheltersPage: React.FC = () => {
  const [shelters, setShelters] = useState<Shelter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingShelter, setEditingShelter] = useState<Shelter | null>(null);
  const [viewingShelter, setViewingShelter] = useState<Shelter | null>(null);
  const [shelterPets, setShelterPets] = useState<Pet[]>([]);
  const [petsLoading, setPetsLoading] = useState(false);
  const [filters, setFilters] = useState<ShelterFilters>({
    search: '',
    hasPets: '',
  });

  const { user } = useAuth();

  useEffect(() => {
    fetchShelters();
  }, []);

  const fetchShelters = async () => {
    try {
      setLoading(true);
      const data = await shelterService.getAllShelters();
      setShelters(data);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to fetch shelters');
    } finally {
      setLoading(false);
    }
  };

  const fetchShelterPets = async (shelterId: number) => {
    try {
      setPetsLoading(true);
      const pets = await shelterService.getShelterPets(shelterId);
      setShelterPets(pets);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch shelter pets');
    } finally {
      setPetsLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingShelter(null);
    setIsModalOpen(true);
  };

  const handleEdit = (shelter: Shelter) => {
    setEditingShelter(shelter);
    setIsModalOpen(true);
  };

  const handleView = async (shelter: Shelter) => {
    setViewingShelter(shelter);
    await fetchShelterPets(shelter.id);
  };

  const handleSubmit = async (data: { name: string; address: string; email: string; phone: string }) => {
    try {
      if (editingShelter) {
        await shelterService.updateShelter(editingShelter.id, data);
      } else {
        await shelterService.createShelter(data);
      }
      
      setIsModalOpen(false);
      setEditingShelter(null);
      fetchShelters();
    } catch (err: any) {
      throw new Error(err.message || 'Failed to save shelter');
    }
  };

  const handleFilterChange = (key: keyof ShelterFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      hasPets: '',
    });
  };

  const filteredShelters = shelters.filter(shelter => {
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesName = shelter.name.toLowerCase().includes(searchLower);
      const matchesAddress = shelter.address.toLowerCase().includes(searchLower);
      if (!matchesName && !matchesAddress) return false;
    }

    if (filters.hasPets === 'yes') {
      if (!shelter.pets || shelter.pets.length === 0) return false;
    } else if (filters.hasPets === 'no') {
      if (shelter.pets && shelter.pets.length > 0) return false;
    }

    return true;
  });

  const hasPetsOptions = [
    { value: '', label: 'All Shelters' },
    { value: 'yes', label: 'Has Pets' },
    { value: 'no', label: 'No Pets' },
  ];

  const canManageShelters = user?.role === 'ADMIN';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Shelters Management
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            {canManageShelters 
              ? 'Manage shelter profiles and view their pets'
              : 'View registered shelters and their available pets'
            }
          </p>
        </div>
        {canManageShelters && (
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <Button onClick={handleCreate}>
              Add Shelter
            </Button>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="sm:w-64">
          <Input
            label="Search Shelters"
            type="text"
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            placeholder="Search by name or address"
          />
        </div>
        <div className="sm:w-64">
          <Select
            label="Filter by Pets"
            value={filters.hasPets}
            onChange={(e) => handleFilterChange('hasPets', e.target.value)}
            options={hasPetsOptions}
          />
        </div>
        {(filters.search || filters.hasPets) && (
          <div className="sm:w-auto sm:flex sm:items-end">
            <Button variant="secondary" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        )}
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

      {/* Shelters List */}
      <Card>
        {filteredShelters.length === 0 ? (
          <div className="text-center py-12">
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
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No shelters found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your filters to find more shelters.
            </p>
            <div className="mt-6">
              <Button variant="secondary" onClick={clearFilters}>
                Clear Filters
              </Button>
            </div>
          </div>
        ) : (
          <ShelterList
            shelters={filteredShelters}
            loading={loading}
            onEdit={canManageShelters ? handleEdit : undefined}
            onView={handleView}
            canManage={canManageShelters}
          />
        )}
      </Card>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingShelter ? 'Edit Shelter' : 'Create Shelter'}
      >
        <ShelterForm
          shelter={editingShelter || undefined}
          onSubmit={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>

      {/* View Shelter Modal */}
      <Modal
        isOpen={!!viewingShelter}
        onClose={() => setViewingShelter(null)}
        title="Shelter Details"
        size="lg"
      >
        {viewingShelter && (
          <div className="space-y-6">
            {/* Shelter Information */}
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-3">Shelter Information</h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Name:</span>
                    <p className="text-sm text-gray-900">{viewingShelter.name}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Address:</span>
                    <p className="text-sm text-gray-900">{viewingShelter.address}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Email:</span>
                    <p className="text-sm text-gray-900">{viewingShelter.email}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Phone:</span>
                    <p className="text-sm text-gray-900">{viewingShelter.phone}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Member Since:</span>
                    <p className="text-sm text-gray-900">{new Date(viewingShelter.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Shelter Pets */}
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-3">
                Available Pets ({shelterPets.length})
              </h4>
              {petsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : shelterPets.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No pets available at this shelter</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {shelterPets.map((pet) => (
                    <div key={pet.id} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h5 className="font-medium text-gray-900">{pet.name}</h5>
                          <p className="text-sm text-gray-600">
                            {pet.breed?.name || 'Mixed breed'} • {pet.age} years old
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            {pet.gender} • {pet.status}
                          </p>
                        </div>
                        {pet.image && (
                          <img
                            src={pet.image}
                            alt={pet.name}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default SheltersPage;
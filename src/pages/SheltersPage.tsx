import React, { useState, useEffect } from 'react';
import type { User, Pet } from '../types';
import { shelterService } from '../services/shelterService';
import { useAuth } from '../features/auth/AuthContext';
import ShelterList from '../components/shelters/ShelterList';
import ShelterForm from '../components/shelters/ShelterForm';
import { Modal, Button, Card } from '../components/ui';

const SheltersPage: React.FC = () => {
  const [shelters, setShelters] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingShelter, setEditingShelter] = useState<User | null>(null);
  const [viewingShelter, setViewingShelter] = useState<User | null>(null);
  const [shelterPets, setShelterPets] = useState<Pet[]>([]);
  const [petsLoading, setPetsLoading] = useState(false);

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

  const handleEdit = (shelter: User) => {
    setEditingShelter(shelter);
    setIsModalOpen(true);
  };

  const handleView = async (shelter: User) => {
    setViewingShelter(shelter);
    await fetchShelterPets(shelter.id);
  };

  const handleSubmit = async (data: { username: string; email: string; password?: string; fullName: string }) => {
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
              ? 'Manage shelter accounts and view their pets'
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
        <ShelterList
          shelters={shelters}
          loading={loading}
          onEdit={canManageShelters ? handleEdit : undefined}
          onView={handleView}
          canManage={canManageShelters}
        />
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
                    <p className="text-sm text-gray-900">{viewingShelter.fullName}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Username:</span>
                    <p className="text-sm text-gray-900">@{viewingShelter.username}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Email:</span>
                    <p className="text-sm text-gray-900">{viewingShelter.email}</p>
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
import React, { useState, useEffect } from 'react';
import type { User, Pet } from '../types';
import { veterinarianService } from '../services/veterinarianService';
import { useAuth } from '../features/auth/AuthContext';
import VeterinarianList from '../components/veterinarians/VeterinarianList';
import VeterinarianForm from '../components/veterinarians/VeterinarianForm';
import PetCard from '../components/pets/PetCard';
import { Modal, Button, Card, Input } from '../components/ui';

const VeterinariansPage: React.FC = () => {
  // State management
  const [veterinarians, setVeterinarians] = useState<User[]>([]);
  const [filteredVeterinarians, setFilteredVeterinarians] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingVeterinarian, setEditingVeterinarian] = useState<User | null>(null);
  const [viewingVeterinarian, setViewingVeterinarian] = useState<User | null>(null);
  const [viewingPets, setViewingPets] = useState<{ veterinarian: User; pets: Pet[] } | null>(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');

  const { user } = useAuth();

  // Load initial data
  useEffect(() => {
    loadVeterinarians();
  }, []);

  // Apply filters when they change
  useEffect(() => {
    applyFilters();
  }, [veterinarians, searchTerm]);

  const loadVeterinarians = async () => {
    try {
      setLoading(true);
      const data = await veterinarianService.getAllVeterinarians();
      setVeterinarians(data);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to load veterinarians');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...veterinarians];

    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(vet =>
        vet.fullName.toLowerCase().includes(searchLower) ||
        vet.username.toLowerCase().includes(searchLower) ||
        vet.email.toLowerCase().includes(searchLower)
      );
    }

    setFilteredVeterinarians(filtered);
  };

  const handleCreate = () => {
    setEditingVeterinarian(null);
    setIsCreateModalOpen(true);
  };

  const handleEdit = (veterinarian: User) => {
    setEditingVeterinarian(veterinarian);
    setIsCreateModalOpen(true);
  };

  const handleSubmit = async (data: any) => {
    try {
      if (editingVeterinarian) {
        await veterinarianService.updateVeterinarian(editingVeterinarian.id, data);
        setSuccessMessage('Veterinarian updated successfully!');
      } else {
        await veterinarianService.createVeterinarian(data);
        setSuccessMessage('Veterinarian created successfully!');
      }
      
      setIsCreateModalOpen(false);
      setEditingVeterinarian(null);
      loadVeterinarians();
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (err: any) {
      throw new Error(err.message || 'Failed to save veterinarian');
    }
  };

  const handleView = (veterinarian: User) => {
    setViewingVeterinarian(veterinarian);
  };

  const handleViewPets = async (veterinarian: User) => {
    try {
      const pets = await veterinarianService.getPetsByVeterinarian(veterinarian.id);
      setViewingPets({ veterinarian, pets });
    } catch (err: any) {
      setError(err.message || 'Failed to load veterinarian pets');
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  const canManageVeterinarians = user?.role === 'ADMIN';

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading veterinarians...</p>
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
            Veterinarians Management
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage veterinarians and their assigned pets
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4 space-x-3">
          {canManageVeterinarians && (
            <Button onClick={handleCreate}>
              Add Veterinarian
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
            <h3 className="text-lg font-medium text-gray-900">Search & Filter</h3>
            {searchTerm && (
              <Button variant="secondary" size="sm" onClick={clearSearch}>
                Clear Search
              </Button>
            )}
          </div>
          
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Input
              placeholder="Search veterinarians..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
        </div>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing {filteredVeterinarians.length} of {veterinarians.length} veterinarians
        </p>
      </div>

      {/* Veterinarians List */}
      <Card>
        {filteredVeterinarians.length === 0 ? (
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
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No veterinarians found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? 'Try adjusting your search terms.' : 'Get started by adding a new veterinarian.'}
            </p>
            {canManageVeterinarians && !searchTerm && (
              <div className="mt-6">
                <Button onClick={handleCreate}>
                  Add First Veterinarian
                </Button>
              </div>
            )}
          </div>
        ) : (
          <VeterinarianList
            veterinarians={filteredVeterinarians}
            loading={loading}
            onEdit={handleEdit}
            onView={handleView}
            onViewPets={handleViewPets}
          />
        )}
      </Card>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title={editingVeterinarian ? 'Edit Veterinarian' : 'Create Veterinarian'}
      >
        <VeterinarianForm
          veterinarian={editingVeterinarian || undefined}
          onSubmit={handleSubmit}
          onCancel={() => setIsCreateModalOpen(false)}
        />
      </Modal>

      {/* View Veterinarian Modal */}
      <Modal
        isOpen={!!viewingVeterinarian}
        onClose={() => setViewingVeterinarian(null)}
        title="Veterinarian Details"
        size="lg"
      >
        {viewingVeterinarian && (
          <div className="space-y-6">
            {/* Profile Information */}
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-3">Profile Information</h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Full Name:</span>
                    <p className="text-sm text-gray-900">{viewingVeterinarian.fullName}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Username:</span>
                    <p className="text-sm text-gray-900">@{viewingVeterinarian.username}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Email:</span>
                    <p className="text-sm text-gray-900">{viewingVeterinarian.email}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Role:</span>
                    <p className="text-sm text-gray-900">{viewingVeterinarian.role}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Joined:</span>
                    <p className="text-sm text-gray-900">
                      {new Date(viewingVeterinarian.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button
                variant="secondary"
                onClick={() => setViewingVeterinarian(null)}
              >
                Close
              </Button>
              {canManageVeterinarians && (
                <Button
                  onClick={() => {
                    setViewingVeterinarian(null);
                    handleEdit(viewingVeterinarian);
                  }}
                >
                  Edit Veterinarian
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* View Pets Modal */}
      <Modal
        isOpen={!!viewingPets}
        onClose={() => setViewingPets(null)}
        title={`Pets Assigned to ${viewingPets?.veterinarian.fullName}`}
        size="xl"
      >
        {viewingPets && (
          <div className="space-y-6">
            <div className="text-sm text-gray-600">
              Total pets assigned: {viewingPets.pets.length}
            </div>

            {viewingPets.pets.length === 0 ? (
              <div className="text-center py-8">
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
                <h3 className="mt-2 text-sm font-medium text-gray-900">No pets assigned</h3>
                <p className="mt-1 text-sm text-gray-500">
                  This veterinarian doesn't have any pets assigned yet.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {viewingPets.pets.map((pet) => (
                  <PetCard
                    key={pet.id}
                    pet={pet}
                    onView={() => {}} // You can implement pet details view if needed
                  />
                ))}
              </div>
            )}

            <div className="flex justify-end pt-4 border-t">
              <Button
                variant="secondary"
                onClick={() => setViewingPets(null)}
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default VeterinariansPage;
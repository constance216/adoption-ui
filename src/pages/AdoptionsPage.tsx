import React, { useState, useEffect } from 'react';
import type { Adoption } from '../types';
import { adoptionService } from '../services/adoptionService';
import { useAuth } from '../features/auth/AuthContext';
import AdoptionList from '../components/adoptions/AdoptionsList';
import Modal from '../components/ui/Modal';
import Card from '../components/ui/Card';
import Select from '../components/ui/Select';

const AdoptionsPage: React.FC = () => {
  const [adoptions, setAdoptions] = useState<Adoption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [viewingAdoption, setViewingAdoption] = useState<Adoption | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchAdoptions();
  }, [filterStatus, user]);

  const fetchAdoptions = async () => {
    if (!user) return;

    try {
      setLoading(true);
      let data: Adoption[];

      if (filterStatus) {
        data = await adoptionService.getAdoptionsByStatus(filterStatus);
      } else if (user.role === 'USER') {
        // Regular users only see their own adoption requests
        data = await adoptionService.getAdoptionsByAdopter(user.id);
      } else {
        // Admins and shelters see all adoptions
        data = await adoptionService.getAllAdoptions();
      }

      setAdoptions(data);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to fetch adoptions');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (adoption: Adoption, newStatus: string) => {
    try {
      await adoptionService.updateAdoptionStatus(adoption.id, { status: newStatus as any });
      fetchAdoptions();
    } catch (err: any) {
      setError(err.message || 'Failed to update adoption status');
    }
  };

  const handleView = (adoption: Adoption) => {
    setViewingAdoption(adoption);
  };

  const handleStatusFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterStatus(e.target.value);
  };

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'PENDING', label: 'Pending' },
    { value: 'APPROVED', label: 'Approved' },
    { value: 'COMPLETED', label: 'Completed' },
    { value: 'CANCELLED', label: 'Cancelled' },
  ];

  const getPageTitle = () => {
    if (user?.role === 'USER') {
      return 'My Adoption Requests';
    }
    return 'Adoption Management';
  };

  const getPageDescription = () => {
    if (user?.role === 'USER') {
      return 'Track your pet adoption requests and their status';
    }
    return 'Manage pet adoption requests from users';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            {getPageTitle()}
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            {getPageDescription()}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="sm:w-64">
          <Select
            label="Filter by Status"
            value={filterStatus}
            onChange={handleStatusFilter}
            options={statusOptions}
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

      {/* Adoptions List */}
      <Card>
        <AdoptionList
          adoptions={adoptions}
          loading={loading}
          onUpdateStatus={handleStatusUpdate}
          onView={handleView}
        />
      </Card>

      {/* View Adoption Modal */}
      <Modal
        isOpen={!!viewingAdoption}
        onClose={() => setViewingAdoption(null)}
        title="Adoption Details"
        size="lg"
      >
        {viewingAdoption && (
          <div className="space-y-6">
            {/* Pet Information */}
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-3">Pet Information</h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Name:</span>
                    <p className="text-sm text-gray-900">{viewingAdoption.pet.name}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Breed:</span>
                    <p className="text-sm text-gray-900">{viewingAdoption.pet.breed}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Age:</span>
                    <p className="text-sm text-gray-900">{viewingAdoption.pet.age} years</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Gender:</span>
                    <p className="text-sm text-gray-900">{viewingAdoption.pet.gender}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Adopter Information */}
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-3">Adopter Information</h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Full Name:</span>
                    <p className="text-sm text-gray-900">{viewingAdoption.adopter.fullName}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Username:</span>
                    <p className="text-sm text-gray-900">@{viewingAdoption.adopter.username}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Adoption Details */}
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-3">Adoption Details</h4>
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-500">Status:</span>
                  <p className="text-sm text-gray-900">{viewingAdoption.status}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Request Date:</span>
                  <p className="text-sm text-gray-900">{new Date(viewingAdoption.adoptionDate).toLocaleDateString()}</p>
                </div>
                {viewingAdoption.notes && (
                  <div>
                    <span className="text-sm font-medium text-gray-500">Notes:</span>
                    <p className="text-sm text-gray-900 mt-1">{viewingAdoption.notes}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdoptionsPage;
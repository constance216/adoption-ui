import React from 'react';
import type { Pet } from '../../types';
import { getStatusColor } from '../../utils/helpers';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { useAuth } from '../../features/auth/AuthContext';

interface PetCardProps {
  pet: Pet;
  onAdopt?: (pet: Pet) => void;
  onEdit?: (pet: Pet) => void;
  onView?: (pet: Pet) => void;
}

const PetCard: React.FC<PetCardProps> = ({
  pet,
  onAdopt,
  onEdit,
  onView,
}) => {
  const { user } = useAuth();

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'success';
      case 'ADOPTED': return 'info';
      case 'UNAVAILABLE': return 'danger';
      default: return 'default';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Pet Image */}
      <div className="aspect-w-16 aspect-h-9">
        <div className="w-full h-48 bg-gray-200 rounded-t-lg overflow-hidden">
          {pet.image ? (
            <img
              src={pet.image}
              alt={pet.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg
                className="h-16 w-16 text-gray-400"
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
      </div>

      {/* Pet Details */}
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">{pet.name}</h3>
            <p className="text-sm text-gray-600">
              {pet.breed?.name || 'Unknown breed'} • {pet.age} {pet.age === 1 ? 'year' : 'years'} old
            </p>
          </div>
          <Badge variant={getStatusVariant(pet.status)}>
            {pet.status}
          </Badge>
        </div>

        {/* Additional Info */}
        <div className="mt-2 space-y-1">
          <div className="flex items-center text-sm text-gray-500">
            <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            <span>Gender: {pet.gender}</span>
          </div>
          
          {pet.category && (
            <div className="flex items-center text-sm text-gray-500">
              <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <span>Category: {pet.category.name}</span>
            </div>
          )}
        </div>

        {/* Description */}
        {pet.description && (
          <p className="mt-3 text-sm text-gray-600 line-clamp-2">
            {pet.description}
          </p>
        )}

        {/* Shelter Info */}
        {pet.shelter && (
          <div className="mt-3 text-xs text-gray-500">
            <span>Shelter: {pet.shelter.fullName}</span>
          </div>
        )}

        {/* Actions */}
        <div className="mt-4 flex space-x-2">
          {onView && (
            <Button
              size="sm"
              variant="secondary"
              onClick={() => onView(pet)}
              className="flex-1"
            >
              View Details
            </Button>
          )}
          
          {pet.status === 'ACTIVE' && user?.role === 'USER' && onAdopt && (
            <Button
              size="sm"
              variant="primary"
              onClick={() => onAdopt(pet)}
              className="flex-1"
            >
              Adopt
            </Button>
          )}
          
          {(user?.role === 'ADMIN' || user?.role === 'SHELTER') && onEdit && (
            <Button
              size="sm"
              variant="secondary"
              onClick={() => onEdit(pet)}
              className="flex-1"
            >
              Edit
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PetCard;
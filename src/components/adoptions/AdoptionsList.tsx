import React from 'react';
import type { Adoption } from '../../types';
import { formatDateTime } from '../../utils/helpers';
import Table from '../ui/Table';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { useAuth } from '../../features/auth/AuthContext';

interface AdoptionListProps {
  adoptions: Adoption[];
  loading: boolean;
  onUpdateStatus?: (adoption: Adoption, status: string) => void;
  onView?: (adoption: Adoption) => void;
}

const AdoptionList: React.FC<AdoptionListProps> = ({
  adoptions,
  loading,
  onUpdateStatus,
  onView,
}) => {
  const { user } = useAuth();
  
  const canManageAdoptions = user?.role === 'ADMIN' || user?.role === 'SHELTER';

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'PENDING': return 'warning';
      case 'APPROVED': return 'info';
      case 'COMPLETED': return 'success';
      case 'CANCELLED': return 'danger';
      default: return 'default';
    }
  };

  const columns = [
    {
      key: 'pet.name',
      title: 'Pet',
      width: '20%',
      render: (value: string, record: Adoption) => (
        <div>
          <div className="font-medium">{value}</div>
          <div className="text-sm text-gray-500">
            {record.pet.breed} • {record.pet.age} years
          </div>
        </div>
      ),
    },
    {
      key: 'adopter.fullName',
      title: 'Adopter',
      width: '20%',
      render: (value: string, record: Adoption) => (
        <div>
          <div className="font-medium">{value}</div>
          <div className="text-sm text-gray-500">@{record.adopter.username}</div>
        </div>
      ),
    },
    {
      key: 'status',
      title: 'Status',
      width: '15%',
      render: (value: string) => (
        <Badge variant={getStatusVariant(value)}>
          {value}
        </Badge>
      ),
    },
    {
      key: 'adoptionDate',
      title: 'Request Date',
      width: '20%',
      render: (value: string) => formatDateTime(value),
    },
    {
      key: 'notes',
      title: 'Notes',
      width: '15%',
      render: (value: string) => (
        value ? (
          <span className="text-sm" title={value}>
            {value.length > 30 ? `${value.substring(0, 30)}...` : value}
          </span>
        ) : (
          <span className="text-gray-400 text-sm">No notes</span>
        )
      ),
    },
    {
      key: 'actions',
      title: 'Actions',
      width: '10%',
      render: (_: any, record: Adoption) => (
        <div className="flex flex-col space-y-1">
          {onView && (
            <Button size="sm" variant="secondary" onClick={() => onView(record)}>
              View
            </Button>
          )}
          
          {canManageAdoptions && onUpdateStatus && record.status === 'PENDING' && (
            <>
              <Button
                size="sm"
                variant="success"
                onClick={() => onUpdateStatus(record, 'APPROVED')}
              >
                Approve
              </Button>
              <Button
                size="sm"
                variant="danger"
                onClick={() => onUpdateStatus(record, 'CANCELLED')}
              >
                Cancel
              </Button>
            </>
          )}
          
          {canManageAdoptions && onUpdateStatus && record.status === 'APPROVED' && (
            <Button
              size="sm"
              variant="success"
              onClick={() => onUpdateStatus(record, 'COMPLETED')}
            >
              Complete
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <Table
      data={adoptions}
      columns={columns}
      loading={loading}
      emptyMessage="No adoption requests found"
    />
  );
};

export default AdoptionList;
import React from 'react';
import type { User } from '../../types';
import { formatDate } from '../../utils/helpers';
import Table from '../ui/Table';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

interface VeterinarianListProps {
  veterinarians: User[];
  loading: boolean;
  onEdit: (veterinarian: User) => void;
  onView: (veterinarian: User) => void;
  onViewPets: (veterinarian: User) => void;
}

const VeterinarianList: React.FC<VeterinarianListProps> = ({
  veterinarians,
  loading,
  onEdit,
  onView,
  onViewPets,
}) => {
  const columns = [
    {
      key: 'fullName',
      title: 'Full Name',
      width: '25%',
    },
    {
      key: 'username',
      title: 'Username',
      width: '20%',
      render: (value: string) => (
        <span className="font-mono text-sm">@{value}</span>
      ),
    },
    {
      key: 'email',
      title: 'Email',
      width: '25%',
    },
    {
      key: 'role',
      title: 'Role',
      width: '10%',
      render: (value: string) => (
        <Badge variant="success">{value}</Badge>
      ),
    },
    {
      key: 'createdAt',
      title: 'Joined',
      width: '10%',
      render: (value: string) => formatDate(value),
    },
    {
      key: 'actions',
      title: 'Actions',
      width: '10%',
      render: (_: any, record: User) => (
        <div className="flex flex-col space-y-1">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => onView(record)}
          >
            View
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => onEdit(record)}
          >
            Edit
          </Button>
          <Button
            size="sm"
            variant="primary"
            onClick={() => onViewPets(record)}
          >
            View Pets
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Table
      data={veterinarians}
      columns={columns}
      loading={loading}
      emptyMessage="No veterinarians found"
    />
  );
};

export default VeterinarianList;
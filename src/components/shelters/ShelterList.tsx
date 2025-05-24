import React from 'react';
import { Table, Button, Badge } from '../ui';
import { formatDateTime } from '../../utils/helpers';

interface Shelter {
  id: number;
  name: string;
  address: string;
  email: string;
  phone: string;
  createdAt: string;
}

interface ShelterListProps {
  shelters: Shelter[];
  loading: boolean;
  onEdit?: (shelter: Shelter) => void;
  onView: (shelter: Shelter) => void;
  canManage: boolean;
}

const ShelterList: React.FC<ShelterListProps> = ({
  shelters,
  loading,
  onEdit,
  onView,
  canManage,
}) => {
  const columns = [
    {
      key: 'name',
      title: 'Name',
      width: '20%',
      render: (value: string) => (
        <div className="font-medium text-gray-900">{value}</div>
      ),
    },
    {
      key: 'address',
      title: 'Address',
      width: '25%',
      render: (value: string) => (
        <div className="text-sm text-gray-900">{value}</div>
      ),
    },
    {
      key: 'contact',
      title: 'Contact',
      width: '25%',
      render: (_: any, record: Shelter) => (
        <div>
          <div className="text-sm text-gray-900">{record.email}</div>
          <div className="text-sm text-gray-500">{record.phone}</div>
        </div>
      ),
    },
    {
      key: 'createdAt',
      title: 'Member Since',
      width: '20%',
      render: (value: string) => formatDateTime(value),
    },
    {
      key: 'actions',
      title: 'Actions',
      width: '10%',
      render: (_: any, record: Shelter) => (
        <div className="flex flex-col space-y-1">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => onView(record)}
          >
            View
          </Button>
          {canManage && onEdit && (
            <Button
              size="sm"
              variant="secondary"
              onClick={() => onEdit(record)}
            >
              Edit
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <Table
      data={shelters}
      columns={columns}
      loading={loading}
      emptyMessage="No shelters found"
    />
  );
};

export default ShelterList;
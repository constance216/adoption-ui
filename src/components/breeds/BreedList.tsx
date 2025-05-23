import React from 'react';
import type { Breed } from '../../types';
import { formatDate, truncateText } from '../../utils/helpers';
import Table from '../ui/Table';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

interface BreedListProps {
  breeds: Breed[];
  loading: boolean;
  onEdit: (breed: Breed) => void;
  onDelete: (breed: Breed) => void;
}

const BreedList: React.FC<BreedListProps> = ({
  breeds,
  loading,
  onEdit,
  onDelete,
}) => {
  const columns = [
    {
      key: 'name',
      title: 'Name',
      width: '25%',
    },
    {
      key: 'category.name',
      title: 'Category',
      width: '20%',
      render: (value: string) => (
        <Badge variant="info">{value}</Badge>
      ),
    },
    {
      key: 'description',
      title: 'Description',
      width: '30%',
      render: (value: string) => (
        value ? truncateText(value, 60) : <span className="text-gray-400">No description</span>
      ),
    },
    {
      key: 'createdAt',
      title: 'Created At',
      width: '15%',
      render: (value: string) => formatDate(value),
    },
    {
      key: 'actions',
      title: 'Actions',
      width: '10%',
      render: (_: any, record: Breed) => (
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => onEdit(record)}
          >
            Edit
          </Button>
          <Button
            size="sm"
            variant="danger"
            onClick={() => onDelete(record)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Table
      data={breeds}
      columns={columns}
      loading={loading}
      emptyMessage="No breeds found"
    />
  );
};

export default BreedList;
import React from 'react';
import type { Category } from '../../types';
import { formatDate } from '../../utils/helpers';
import Table from '../ui/Table';
import Button from '../ui/Button';

interface CategoryListProps {
  categories: Category[];
  loading: boolean;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}

const CategoryList: React.FC<CategoryListProps> = ({
  categories,
  loading,
  onEdit,
  onDelete,
}) => {
  const columns = [
    {
      key: 'name',
      title: 'Name',
      width: '40%',
    },
    {
      key: 'createdAt',
      title: 'Created At',
      width: '30%',
      render: (value: string) => formatDate(value),
    },
    {
      key: 'actions',
      title: 'Actions',
      width: '30%',
      render: (_: any, record: Category) => (
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
      data={categories}
      columns={columns}
      loading={loading}
      emptyMessage="No categories found"
    />
  );
};

export default CategoryList;
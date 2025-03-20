'use client';

import { Application } from '@/components/type/application';
import { ColumnDef } from '@tanstack/react-table';
import { EditableCell } from './editable-cell';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';

// Export a plain array of column definitions instead of using useMemo at the module level
export const columns: ColumnDef<Application>[] = [
  {
    accessorKey: 'company',
    header: 'Company',
    cell: EditableCell,
  },
  {
    accessorKey: 'role',
    header: 'Role',
    cell: EditableCell,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: EditableCell,
  },
  {
    accessorKey: 'location',
    header: 'Location',
    cell: EditableCell,
  },
  {
    accessorKey: 'category',
    header: 'Category',
    cell: EditableCell,
  },
  {
    accessorKey: 'date_applied',
    header: 'Applied Date',
    cell: (info) => format(info.getValue() as Date, 'PP'),
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          alert('blah blah');
        }}
      >
        Details
      </Button>
    ),
  },
];

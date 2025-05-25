'use client';

import { Application } from '@/components/type/application';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { ApplicationDetailsModal } from './application-detail-modal';

export const columns = (
  openModal: (app: Application) => void
): ColumnDef<Application>[] => [
  {
    accessorKey: 'company',
    header: 'Company',
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: 'role',
    header: 'Role',
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: (info) => {
      const value = info.getValue() as string;
      return value ? value.charAt(0).toUpperCase() + value.slice(1) : '';
    },
  },
  {
    accessorKey: 'location',
    header: 'Location',
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: 'category',
    header: 'Category',
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: 'date_applied',
    header: 'Applied Date',
    cell: (info) => format(info.getValue() as Date, 'PP'),
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const application = row.original;
      return (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => openModal(application)}
        >
          Details
        </Button>
      );
    },
  },
];

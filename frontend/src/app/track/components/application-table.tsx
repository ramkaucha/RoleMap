'use client';

import { useState, useEffect } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender,
} from '@tanstack/react-table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Application } from '@/components/type/application';
import { columns } from './columns';
import { fuzzyFilter } from './fuzzy-filters';
import CSVReader from '@/components/csv-reader';
import { FormValues } from './application-create-modal';
import { useCreateMultipleApplicationMutation } from '@/routes/application';

interface ApplicationTableProps {
  data: Application[];
  setData: React.Dispatch<React.SetStateAction<Application[]>>;
  title?: string;
}

export default function ApplicationTable({
  data,
  setData,
  title = 'Applications',
}: ApplicationTableProps) {
  const [globalFilter, setGlobalFilter] = useState('');
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 7,
  });

  const table = useReactTable({
    data,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    state: {
      globalFilter,
      pagination,
    },
    onPaginationChange: setPagination,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    meta: {
      updateData: (rowIndex: number, columnId: string, value: any) => {
        setData((old) =>
          old.map((row, index) => {
            if (index === rowIndex) {
              return {
                ...old[rowIndex],
                [columnId]: value,
              };
            }
            return row;
          })
        );
      },
    },
  });

  const getRowStyles = (status: string) => {
    if (status?.toLowerCase() === 'rejected') {
      return 'bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30';
    }
    return '';
  };

  useEffect(() => {
    table.resetPageIndex();
  }, [globalFilter, table]);

  const transformCSV = (record: Record<string, string>): FormValues | null => {
    try {
      const status = record.status?.toLowerCase();
      const rawDate = record['date_applied'];

      const [day, month, year] = rawDate ? rawDate.split('/') : [];
      const fullYear = year?.length == 2 ? `20${year}` : year;
      const parsedDate = rawDate
        ? new Date(
            `${fullYear}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
          )
        : new Date();
      return {
        company: record.company,
        role: record.role,
        status: status as FormValues['status'],
        location: record.location ?? '',
        category: record.category ?? '',
        link: record.link || '',
        comments: record.comments ?? '',
        date_applied: parsedDate,
      };
    } catch (err: any) {
      console.error('Error transforming record:', record, err);
      return null;
    }
  };

  const createMultipleApplication = useCreateMultipleApplicationMutation();

  const handleCSVSubmit = (rawData: Record<string, string>[]) => {
    const transformed = rawData
      .map(transformCSV)
      .filter((r: any): r is FormValues => r !== null);

    createMultipleApplication.mutateAsync(transformed);
  };

  return (
    <Card className="w-full mx-auto flex flex-col min-h-[80vh]">
      <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="w-full">
          <CardTitle className="text-2xl">{title}</CardTitle>
          <Input
            placeholder="Search applications..."
            value={globalFilter ?? ''}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="max-w-sm mt-2"
          />
        </div>
        <CSVReader onSubmitCSV={handleCSVSubmit} />
      </CardHeader>

      <CardContent className="flex flex-col justify-between flex-1">
        <div className="rounded-md border w-full overflow-x-auto">
          <Table className="w-full h-full">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                    className={getRowStyles(row.original.status)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No applications found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between space-x-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            Page {pagination.pageIndex + 1} of {table.getPageCount()} (
            {table.getPrePaginationRowModel().rows.length} total records)
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <div className="flex items-center space-x-1">
              {Array.from({ length: table.getPageCount() }, (_, i) => (
                <Button
                  key={i}
                  variant={pagination.pageIndex === i ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => table.setPageIndex(i)}
                  className="w-8 h-8 p-0"
                >
                  {i + 1}
                </Button>
              )).slice(
                Math.max(
                  0,
                  Math.min(pagination.pageIndex - 2, table.getPageCount() - 5)
                ),
                Math.max(
                  5,
                  Math.min(pagination.pageIndex + 3, table.getPageCount())
                )
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

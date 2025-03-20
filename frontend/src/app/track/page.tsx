'use client';

import { useState, useEffect, useMemo } from 'react';
import PageWrapper from "@/components/PageWrapper";
import { 
  useReactTable, 
  getCoreRowModel, 
  getPaginationRowModel, 
  getFilteredRowModel, 
  ColumnDef, 
  flexRender, 
  FilterFn
} from '@tanstack/react-table';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from 'date-fns';
import { rankItem } from '@tanstack/match-sorter-utils';

const ApplicationStatus = {
  APPLIED: 'applied',
  ONLINE_ASSESSMENT: 'online assessment',
  INTERVIEWING: 'interviewing',
  REJECTED: 'rejected',
  GHOSTED: 'ghosted'
};

type Application = {
  id: number;
  company: string;
  role: string;
  status: string;
  location: string;
  link: string;
  comments?: string;
  category: string;
  date_applied: Date;
  user_id: number;
  created_at: Date;
  updated_at: Date;
};

const generateSampleApplications = (): Application[] => {
  const companies = [
    'Google', 'Amazon', 'Microsoft', 'Apple', 'Meta', 'Netflix', 'Uber', 
    'Airbnb', 'Twitter', 'Stripe', 'Shopify', 'Square', 'Lyft', 'Adobe', 
    'Salesforce', 'Oracle', 'IBM', 'Intel', 'Cisco', 'Dell', 'PayPal', 
    'Dropbox', 'Slack', 'Zoom', 'Twilio', 'Pinterest', 'Snap', 'SpaceX'
  ];
  
  const roles = [
    'Software Engineer', 'Frontend Developer', 'Backend Developer', 'Full Stack Engineer',
    'DevOps Engineer', 'Data Scientist', 'Machine Learning Engineer', 'Product Manager',
    'UI/UX Designer', 'QA Engineer', 'Site Reliability Engineer', 'Mobile Developer',
    'Cloud Architect', 'Systems Engineer', 'Network Engineer', 'Security Engineer',
    'Data Engineer', 'Database Administrator', 'Technical Writer', 'Scrum Master'
  ];
  
  const locations = [
    'San Francisco, CA', 'New York, NY', 'Seattle, WA', 'Austin, TX', 'Boston, MA',
    'Chicago, IL', 'Los Angeles, CA', 'Denver, CO', 'Atlanta, GA', 'Remote',
    'Portland, OR', 'Washington D.C.', 'Dallas, TX', 'Miami, FL', 'Phoenix, AZ'
  ];
  
  const categories = [
    'Software', 'AI/ML', 'DevOps', 'Data', 'Product', 'Design', 'QA',
    'Mobile', 'Infrastructure', 'Security', 'Frontend', 'Backend'
  ];
  
  const comments = [
    'Applied through referral', 'Completed first round', 'Waiting for response',
    'Technical interview scheduled', 'Rejected after final interview', 'Offer received',
    'Need to follow up', 'Assessment completed', 'Onsite scheduled', null
  ];
  
  const applications: Application[] = [];
  
  for (let i = 1; i <= 25; i++) {
    const company = companies[Math.floor(Math.random() * companies.length)];
    const role = roles[Math.floor(Math.random() * roles.length)];
    const status = Object.values(ApplicationStatus)[Math.floor(Math.random() * Object.values(ApplicationStatus).length)];
    const location = locations[Math.floor(Math.random() * locations.length)];
    const category = categories[Math.floor(Math.random() * categories.length)];
    const comment = comments[Math.floor(Math.random() * comments.length)];
    
    const today = new Date();
    const threeMonthsAgo = new Date(today);
    threeMonthsAgo.setMonth(today.getMonth() - 3);
    const randomDate = new Date(threeMonthsAgo.getTime() + Math.random() * (today.getTime() - threeMonthsAgo.getTime()));
    
    const updatedDate = new Date(randomDate);
    updatedDate.setDate(randomDate.getDate() + Math.floor(Math.random() * 10));
    
    applications.push({
      id: i,
      company,
      role,
      status,
      location,
      link: `https://${company.toLowerCase().replace(/\s+/g, '')}.com/careers`,
      comments: comment,
      category,
      date_applied: randomDate,
      user_id: 1,
      created_at: randomDate,
      updated_at: updatedDate
    });
  }
  
  return applications.sort((a, b) => b.date_applied.getTime() - a.date_applied.getTime());
};

const sampleApplications = generateSampleApplications();

const fuzzyFilter: FilterFn<Application> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value);
  addMeta({ itemRank });
  return itemRank.passed;
};

const EditableCell = ({ 
  getValue, 
  row, 
  column, 
  table 
}: { 
  getValue: () => any; 
  row: any; 
  column: any; 
  table: any;
}) => {
  const initialValue = getValue();
  const [value, setValue] = useState(initialValue);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const onBlur = () => {
    setIsEditing(false);
    table.options.meta?.updateData(row.index, column.id, value);
  };

  if (column.id === 'status' && isEditing) {
    return (
      <Select 
        defaultValue={value} 
        onValueChange={(newValue) => {
          setValue(newValue);
          table.options.meta?.updateData(row.index, column.id, newValue);
          setIsEditing(false);
        }}
      >
        <SelectTrigger className="w-full h-8 text-sm">
          <SelectValue placeholder={value} />
        </SelectTrigger>
        <SelectContent>
          {Object.values(ApplicationStatus).map((status) => (
            <SelectItem key={status} value={status}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  if (isEditing) {
    return (
      <Input
        value={value}
        onChange={e => setValue(e.target.value)}
        onBlur={onBlur}
        autoFocus
        className="h-8 w-full text-sm"
      />
    );
  }

  return (
    <div 
      className="w-full h-full min-h-[32px] cursor-pointer p-2 -mx-2 hover:bg-slate-100 rounded" 
      onClick={() => setIsEditing(true)}
    >
      {value instanceof Date ? format(value, 'PPP') : value}
    </div>
  );
};

export default function ApplicationsPage() {
  const [data, setData] = useState<Application[]>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  
  useEffect(() => {
    setData(sampleApplications);
  }, []);

  const columns = useMemo<ColumnDef<Application>[]>(
    () => [
      {
        accessorKey: 'company',
        header: 'Company',
        cell: EditableCell
      },
      {
        accessorKey: 'role',
        header: 'Role',
        cell: EditableCell
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: EditableCell
      },
      {
        accessorKey: 'location',
        header: 'Location',
        cell: EditableCell
      },
      {
        accessorKey: 'category',
        header: 'Category',
        cell: EditableCell
      },
      {
        accessorKey: 'date_applied',
        header: 'Applied Date',
        cell: info => format(info.getValue() as Date, 'PP')
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => {
              // navigate to details/edit API
              alert(`View details for application ID: ${row.original.id}`);
            }}
          >
            Details
          </Button>
        )
      }
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    state: {
      globalFilter,
      pagination: {
        pageIndex: 0,
        pageSize: 20,       },
    },
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    meta: {
      updateData: (rowIndex: number, columnId: string, value: any) => {
        setData(old => 
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
      }
    }
  });

  return (
    <PageWrapper className="w-full p-4">
      <div className="w-full">
        <Card className="w-full mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">Applications</CardTitle>
            <div className="flex items-center gap-2">
              <Input
                placeholder="Search applications..."
                value={globalFilter ?? ''}
                onChange={e => setGlobalFilter(e.target.value)}
                className="max-w-sm"
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border w-full overflow-x-auto">
              <Table className="w-full">
                <TableHeader>
                  {table.getHeaderGroups().map(headerGroup => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map(header => (
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
                    table.getRowModel().rows.map(row => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                      >
                        {row.getVisibleCells().map(cell => (
                          <TableCell key={cell.id}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={columns.length} className="h-24 text-center">
                        No applications found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            
            <div className="flex items-center justify-between space-x-2 py-4">
              <div className="flex-1 text-sm text-muted-foreground">
                Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{" "}
                {Math.min(
                  (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                  table.getFilteredRowModel().rows.length
                )}{" "}
                of {table.getFilteredRowModel().rows.length} applications
              </div>
              <div className="space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  Previous
                </Button>
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
      </div>
    </PageWrapper>
  );
}

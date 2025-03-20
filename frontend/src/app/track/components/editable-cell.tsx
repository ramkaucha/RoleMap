import { ApplicationStatus } from '@/components/type/application';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';

export const EditableCell = ({
  getValue,
  row,
  column,
  table,
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

  if (column.id === 'status') {
    return isEditing ? (
      <Select
        defaultValue={value}
        value={value}
        onValueChange={(newValue) => {
          setValue(newValue);
          table.options.meta?.updateData(row.index, column.id, newValue);
          setIsEditing(false);
        }}
        onOpenChange={(open) => {
          if (!open) {
            setIsEditing(false);
          }
        }}
      >
        <SelectTrigger className="h-8 w-full text-sm">
          <SelectValue placeholder="Select status" />
        </SelectTrigger>
        <SelectContent>
          {Object.values(ApplicationStatus).map((status) => (
            <SelectItem key={status} value={status}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    ) : (
      <div
        className="w-full h-full min-h-[32px] cursor-pointer p-2 -mx-2 hover:bg-slate-100 dark:hover:bg-slate-800/30 rounded transition-colors"
        onClick={() => setIsEditing(true)}
      >
        {value ? value.charAt(0).toUpperCase() + value.slice(1) : 'Not set'}
      </div>
    );
  }

  if (isEditing) {
    return (
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={() => {
          setIsEditing(false);
          table.options.meta?.updateData(row.index, column.id, value);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            setIsEditing(false);
            table.options.meta?.updateData(row.index, column.id, value);
          }
        }}
        autoFocus
        className="h-8 w-full text-sm"
      />
    );
  }

  return (
    <div
      className="w-full h-full min-h-[32px] cursor-pointer p-2 -mx-2 hover:bg-slate-100 dark:hover:bg-slate-800/30 rounded transition-colors"
      onClick={() => setIsEditing(true)}
    >
      {value instanceof Date ? format(value, 'PPP') : value}
    </div>
  );
};

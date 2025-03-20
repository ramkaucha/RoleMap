import { ApplicationStatus } from '@/components/type/application';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@radix-ui/react-select';
import { formToJSON } from 'axios';
import { format } from 'date-fns';
import { useForceUpdate } from 'framer-motion';
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

  const onBlur = () => {
    setIsEditing(false);
    table.options.meta?.updateData(row.index, column.id, value);

    if (column.id === 'status' && isEditing) {
      return (
        <Select
          defaultValue={value}
          onValueChange={(newValue) => {
            setValue(newValue);
            table.options.meta?.updateData(row.index, column.id, value);
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
  };

  if (isEditing) {
    return (
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={onBlur}
        autoFocus
        className="h-8 w-full text-sm"
      />
    );
  }

  return (
    <div
      className="w-full h-full min-h[32px] cursor-pointer p-2 -mx-2 hover:bg-slate-100 dark:hover:bg-slate-800/30 rounded transition-colors"
      onClick={() => setIsEditing(true)}
    >
      {value instanceof Date ? format(value, 'PPP') : value}
    </div>
  );
};

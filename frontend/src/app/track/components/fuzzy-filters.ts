import { Application } from '@/components/type/application';
import { rankItem } from '@tanstack/match-sorter-utils';
import { FilterFn } from '@tanstack/react-table';

export const fuzzyFilter: FilterFn<Application> = (
  row,
  columnId,
  value,
  addMeta
) => {
  const itemRank = rankItem(row.getValue(columnId), value);

  return itemRank.passed;
};

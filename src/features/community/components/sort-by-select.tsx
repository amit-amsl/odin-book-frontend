import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { SORT_OPTIONS } from '@/lib/utils';
import { SortByQueryParam } from '@/types/api';

type SortBySelectionListProps = {
  sortOptionSelected: SortByQueryParam;
  handleSortSelection: (value: SortByQueryParam) => void;
};

export function SortBySelectionList({
  sortOptionSelected,
  handleSortSelection,
}: SortBySelectionListProps) {
  return (
    <div className="flex gap-2 p-2">
      <Label htmlFor="sort-select">Sort by</Label>
      <Select value={sortOptionSelected} onValueChange={handleSortSelection}>
        <SelectTrigger id="sort-select" className="w-[180px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          {SORT_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

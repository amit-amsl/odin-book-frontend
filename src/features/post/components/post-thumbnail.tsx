import { ScanText } from 'lucide-react';

export function PostThumbnail() {
  return (
    <div className="bg-secondary hidden h-[76px] w-[102px] items-center justify-center rounded-lg border md:flex">
      <ScanText className="stroke-muted-foreground" />
    </div>
  );
}

import { DiamondMinus, EyeOff, ScanText } from 'lucide-react';

type PostThumbnailProps = {
  isPostNSFW: boolean;
  isPostSpoiler: boolean;
};

export function PostThumbnail({
  isPostNSFW,
  isPostSpoiler,
}: PostThumbnailProps) {
  return (
    <div className="bg-secondary hidden h-[76px] w-[102px] shrink-0 items-center justify-center rounded-lg border md:flex">
      {isPostNSFW ? (
        <DiamondMinus className="text-red-500" />
      ) : isPostSpoiler ? (
        <EyeOff className="stroke-muted-foreground" />
      ) : (
        <ScanText className="stroke-muted-foreground" />
      )}
    </div>
  );
}

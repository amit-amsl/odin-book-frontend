import { DiamondMinus, EyeOff, PlayCircle, ScanText } from 'lucide-react';

type PostThumbnailProps = {
  isPostNSFW: boolean;
  isPostSpoiler: boolean;
  imageUrl: string | null;
  youtubeVideoId: string | null;
  isMobile: boolean;
};

export function PostThumbnail({
  isPostNSFW,
  isPostSpoiler,
  imageUrl,
  youtubeVideoId,
  isMobile,
}: PostThumbnailProps) {
  if (youtubeVideoId) {
    return (
      <div
        className={`bg-secondary relative ${isMobile ? 'h-[61px] w-[82px]' : 'h-[76px] w-[102px]'} flex shrink-0 items-center justify-center rounded-lg border`}
      >
        <img
          src={`https://img.youtube.com/vi/${youtubeVideoId}/hqdefault.jpg`}
          className={`rounded-lg ${isPostNSFW || isPostSpoiler ? 'blur-sm' : ''}`}
        />
        {isPostNSFW ? (
          <DiamondMinus className="absolute text-red-500" />
        ) : isPostSpoiler ? (
          <EyeOff className="absolute" />
        ) : (
          <PlayCircle className="absolute" />
        )}
      </div>
    );
  }

  if (imageUrl) {
    return (
      <div
        className={`bg-secondary relative ${isMobile ? 'h-[61px] w-[82px]' : 'h-[76px] w-[102px]'} flex shrink-0 items-center justify-center rounded-lg border`}
      >
        <img
          src={imageUrl.replace(
            '/upload/',
            `/upload/c_thumb,w_102,h_76${isPostNSFW || isPostSpoiler ? ',e_blur:400' : ''}/`
          )}
          className="rounded-lg"
        />
        {isPostNSFW ? (
          <DiamondMinus className="absolute text-red-500" />
        ) : isPostSpoiler ? (
          <EyeOff className="absolute" />
        ) : (
          ''
        )}
      </div>
    );
  }

  return (
    <div
      className={`bg-secondary ${isMobile ? 'h-[61px] w-[82px]' : 'h-[76px] w-[102px]'} flex shrink-0 items-center justify-center rounded-lg border`}
    >
      {imageUrl && <img src={imageUrl} />}
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

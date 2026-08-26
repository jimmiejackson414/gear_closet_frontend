import type { Database } from '@/types';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/** CSS pixel size of `GcAvatar` for each named size. Transforms request 2× this. */
export const AVATAR_DISPLAY_PX: Record<AvatarSize, number> = {
  lg: 64,
  md: 48,
  sm: 32,
  xl: 80,
  xs: 24,
};

/**
 * Public URL for a stored avatar. Pass a size to request a Storage image
 * transform (cover-cropped, 2× CSS pixels). Omit transform for the original.
 */
export const buildImageSrc = (
  url: string | undefined | null,
  size: AvatarSize = 'md',
  options?: { transform?: boolean },
) => {
  if (!url) return undefined;
  const supabase = useSupabaseClient<Database>();
  const transform = options?.transform !== false;
  const px = AVATAR_DISPLAY_PX[size] * 2;
  const { data } = supabase.storage.from('avatars')
    .getPublicUrl(url, transform
      ? {
        transform: {
          height: px,
          resize: 'cover',
          width: px,
        },
      }
      : undefined);
  return data?.publicUrl ?? undefined;
};

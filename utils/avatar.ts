import type { Database } from '@/types';

/**
 * Builds the image source URL for a stored avatar.
 */
export const buildImageSrc = (url: string | undefined | null) => {
  if (!url) return undefined;
  const supabase = useSupabaseClient<Database>();
  const { data } = supabase.storage.from('avatars')
    .getPublicUrl(url);
  return data?.publicUrl ?? undefined;
};

import type { Tables } from '@/types';
import type { ExtendedComment } from '@/types/planning';

export type ExtendedCategoryItem = Tables<'category_items'> & {
  item: Tables<'items'>
};

export type ExtendedCategory = Tables<'categories'> & {
  category_items: ExtendedCategoryItem[];
};

export type ExtendedPack = Tables<'packs'> & {
  categories: ExtendedCategory[];
};

export interface PublicPack extends ExtendedPack {
  profile: Tables<'profiles'>;
  categories: ExtendedCategory[];
  comments: ExtendedComment[];
}

/** Closet page CSV import results. */
export type ParsedResults = {
  data: any[];
  errors: string[];
  meta: {
    aborted: boolean;
    cursor: number;
    delimiter: string;
    fields: string[];
    linebreak: string;
    truncated: boolean;
  }
};

export const FREE_PACK_LIMIT = 1;
export const FREE_TRIP_LIMIT = 1;

export type LockableResource = {
  id: number;
  locked_at?: string | null;
};

export function isResourceLocked (resource: LockableResource | null | undefined): boolean {
  return Boolean(resource?.locked_at);
}

export function unlockedResources<T extends LockableResource> (resources: T[]): T[] {
  return resources.filter((resource) => !isResourceLocked(resource));
}

export function lockedResources<T extends LockableResource> (resources: T[]): T[] {
  return resources.filter((resource) => isResourceLocked(resource));
}

export function exceedsFreePackLimit (packs: LockableResource[]): boolean {
  return unlockedResources(packs).length > FREE_PACK_LIMIT
    || packs.length > FREE_PACK_LIMIT;
}

export function exceedsFreeTripLimit (trips: LockableResource[]): boolean {
  return unlockedResources(trips).length > FREE_TRIP_LIMIT
    || trips.length > FREE_TRIP_LIMIT;
}

/** Free users need a pick when they have more total resources than the Free quota. */
export function needsFreeResourcePick (packs: LockableResource[], trips: LockableResource[]): boolean {
  return packs.length > FREE_PACK_LIMIT || trips.length > FREE_TRIP_LIMIT;
}

export function isFreeCreateBlocked (
  isPaidMember: boolean,
  resources: LockableResource[],
  limit: number,
): boolean {
  if (isPaidMember) return false;
  return unlockedResources(resources).length >= limit;
}

export const LOCKED_RESOURCE_TIP = 'Upgrade to unlock this item, or change your Free selection from your profile.';
export const FREE_PACK_CREATE_TIP = 'Free accounts are limited to one pack. Please upgrade to enjoy unlimited packs!';
export const FREE_TRIP_CREATE_TIP = 'Free accounts are limited to one trip. Please upgrade to enjoy unlimited trips!';

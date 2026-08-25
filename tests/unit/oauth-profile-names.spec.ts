import { describe, expect, it } from 'vitest';
import { profileNamesFromAuthMetadata } from '@/utils/oauthProfileNames';

describe('profileNamesFromAuthMetadata', () => {
  it('uses Google given_name and family_name', () => {
    expect(profileNamesFromAuthMetadata({
      given_name: 'Jane',
      family_name: 'Doe',
      name: 'Jane Doe',
    }))
      .toEqual({ firstName: 'Jane', lastName: 'Doe' });
  });

  it('does not dump the full display name into first_name when given_name exists', () => {
    expect(profileNamesFromAuthMetadata({
      given_name: 'Jane',
      name: 'Jane Doe Extra',
    }))
      .toEqual({ firstName: 'Jane', lastName: null });
  });

  it('uses Facebook first_name and last_name', () => {
    expect(profileNamesFromAuthMetadata({
      first_name: 'Pat',
      last_name: 'Lee',
      name: 'Pat Lee',
    }))
      .toEqual({ firstName: 'Pat', lastName: 'Lee' });
  });

  it('splits full_name when given/family are missing', () => {
    expect(profileNamesFromAuthMetadata({ full_name: 'Mary Ann Smith' }))
      .toEqual({ firstName: 'Mary', lastName: 'Ann Smith' });
  });

  it('treats a single-token name as first name only', () => {
    expect(profileNamesFromAuthMetadata({ name: 'Prince' }))
      .toEqual({ firstName: 'Prince', lastName: null });
  });

  it('returns nulls when metadata is empty', () => {
    expect(profileNamesFromAuthMetadata({}))
      .toEqual({ firstName: null, lastName: null });
    expect(profileNamesFromAuthMetadata(null))
      .toEqual({ firstName: null, lastName: null });
  });
});

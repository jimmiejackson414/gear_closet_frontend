import { describe, expect, it } from 'vitest';
import {
  escapeIlikeTerm,
  mergeProfileSearchResults,
  parseFriendSearchEmail,
  toSafeTsQuery,
} from '@/utils/friendsSearch';

describe('friends search helpers', () => {
  it('turns an email into a tsquery without @ or . operators', () => {
    expect(toSafeTsQuery('Pat@Example.com'))
      .toBe('pat:* & example:* & com:*');
    expect(toSafeTsQuery('  John Smith  '))
      .toBe('john:* & smith:*');
    expect(toSafeTsQuery('@@@'))
      .toBeNull();
  });

  it('parses a complete email and rejects partial input', () => {
    expect(parseFriendSearchEmail('  Pat@Example.com '))
      .toBe('pat@example.com');
    expect(parseFriendSearchEmail('pat@'))
      .toBeNull();
    expect(parseFriendSearchEmail('Pat Lee'))
      .toBeNull();
  });

  it('escapes ilike wildcards for exact email lookup', () => {
    expect(escapeIlikeTerm('a%b_c'))
      .toBe('a\\%b\\_c');
  });

  it('merges profile hits and drops the current user', () => {
    const self = { email: 'me@example.com', id: 'me' };
    const other = { email: 'pat@example.com', id: 'them' };

    expect(mergeProfileSearchResults([[self, other], [other]], 'me'))
      .toEqual([other]);
  });
});

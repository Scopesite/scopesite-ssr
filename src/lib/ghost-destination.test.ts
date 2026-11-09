import { describe, expect, it } from 'vitest';
import {
  CAFMO_DESTINATION,
  isScopeSitePost,
  RWD_DESTINATION,
  scopeSiteFilter,
  type GhostPost,
} from './ghost';

function post(overrides: Partial<GhostPost> = {}): GhostPost {
  return {
    id: '1',
    uuid: 'uuid-1',
    slug: 'example-post',
    title: 'Example',
    featured: false,
    published_at: '2026-09-16T00:00:00.000Z',
    updated_at: '2026-09-16T00:00:00.000Z',
    reading_time: 3,
    ...overrides,
  };
}

describe('scopeSiteFilter', () => {
  it('always excludes recruitment and CAFMO destinations and requires public visibility', () => {
    expect(scopeSiteFilter()).toBe(`tag:-${RWD_DESTINATION}+tag:-${CAFMO_DESTINATION}+visibility:public`);
  });

  it('groups extra filters so they cannot override the destination guard', () => {
    expect(scopeSiteFilter('featured:true')).toBe(
      `tag:-${RWD_DESTINATION}+tag:-${CAFMO_DESTINATION}+visibility:public+(featured:true)`
    );
    expect(scopeSiteFilter('tag:recruitment,tag:ai')).toBe(
      `tag:-${RWD_DESTINATION}+tag:-${CAFMO_DESTINATION}+visibility:public+(tag:recruitment,tag:ai)`
    );
  });
});

describe('isScopeSitePost', () => {
  it('keeps ordinary public posts', () => {
    expect(
      isScopeSitePost(
        post({
          visibility: 'public',
          tags: [{ id: 't1', name: 'Recruitment', slug: 'recruitment' }],
        })
      )
    ).toBe(true);
  });

  it.each([
    { destinations: [RWD_DESTINATION] },
    { destinations: [CAFMO_DESTINATION] },
    { destinations: [RWD_DESTINATION, CAFMO_DESTINATION] },
    { destinations: ['hash-site-unknown'] },
  ])('rejects public posts tagged with $destinations', ({ destinations }) => {
    expect(isScopeSitePost(post({
      visibility: 'public',
      tags: [
        { id: 't1', name: 'Recruitment', slug: 'recruitment' },
        ...destinations.map(slug => ({ id: slug, name: slug, slug })),
      ],
    }))).toBe(false);
  });

  it('rejects members-only or inaccessible posts', () => {
    expect(isScopeSitePost(post({ visibility: 'members' }))).toBe(false);
    expect(isScopeSitePost(post({ access: false }))).toBe(false);
  });
});

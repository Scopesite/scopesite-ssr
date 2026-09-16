import { describe, expect, it } from 'vitest';
import {
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
  it('always excludes the recruitment destination and requires public visibility', () => {
    expect(scopeSiteFilter()).toBe(`tag:-${RWD_DESTINATION}+visibility:public`);
  });

  it('groups extra filters so they cannot override the destination guard', () => {
    expect(scopeSiteFilter('featured:true')).toBe(
      `tag:-${RWD_DESTINATION}+visibility:public+(featured:true)`
    );
    expect(scopeSiteFilter('tag:recruitment,tag:ai')).toBe(
      `tag:-${RWD_DESTINATION}+visibility:public+(tag:recruitment,tag:ai)`
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

  it('rejects destination-tagged posts even when they are public', () => {
    expect(
      isScopeSitePost(
        post({
          visibility: 'public',
          tags: [
            { id: 't1', name: 'Recruitment', slug: 'recruitment' },
            { id: 't2', name: '#site-recruitmentwebdesign', slug: RWD_DESTINATION },
          ],
        })
      )
    ).toBe(false);
  });

  it('rejects members-only or inaccessible posts', () => {
    expect(isScopeSitePost(post({ visibility: 'members' }))).toBe(false);
    expect(isScopeSitePost(post({ access: false }))).toBe(false);
  });
});

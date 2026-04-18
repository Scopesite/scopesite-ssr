/**
 * Territory Command - UK region activation config.
 *
 * Phase C rollout = flip a region to `active: true` and add pin coordinates
 * to src/lib/territory/pin-coordinates.ts. Zero component changes.
 */

export const MAP_REGIONS = {
  south_west:        { active: true,  label: 'South West' },
  north_west:        { active: false, label: 'North West' },
  north_east:        { active: false, label: 'North East' },
  yorkshire_humber:  { active: false, label: 'Yorkshire and the Humber' },
  east_midlands:     { active: false, label: 'East Midlands' },
  west_midlands:     { active: false, label: 'West Midlands' },
  east_of_england:   { active: false, label: 'East of England' },
  london:            { active: false, label: 'London' },
  south_east:        { active: false, label: 'South East' },
  wales:             { active: false, label: 'Wales' },
  scotland:          { active: false, label: 'Scotland' },
  northern_ireland:  { active: false, label: 'Northern Ireland' },
} as const;

export type RegionKey = keyof typeof MAP_REGIONS;

export function isActiveRegion(key: string): key is RegionKey {
  return Object.prototype.hasOwnProperty.call(MAP_REGIONS, key)
    && MAP_REGIONS[key as RegionKey].active;
}

export function getRegionLabel(key: string): string {
  if (Object.prototype.hasOwnProperty.call(MAP_REGIONS, key)) {
    return MAP_REGIONS[key as RegionKey].label;
  }
  return key;
}

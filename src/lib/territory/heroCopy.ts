import 'server-only';

import { getCheapestActiveMonthlyPrice } from './postcodePricing';

export async function getHeroPriceStrip(): Promise<string> {
  const cheapest = await getCheapestActiveMonthlyPrice();
  return `From £${cheapest}/month. Full pricing discussed on your qualifying call.`;
}

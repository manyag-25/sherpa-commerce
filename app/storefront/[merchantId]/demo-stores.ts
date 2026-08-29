/**
 * The storefronts that carry the full visual treatment.
 *
 * Sherpa and Challenger are the two stores the demo actually walks through, so
 * they get the WebGL ribbon, the drifting objects and their own hero art.
 *
 * Every other merchant renders as a static placeholder: the same layout and
 * the same real catalogue data, but no canvas and no animation. Three or four
 * storefronts each running a requestAnimationFrame loop is work the machine
 * does not need to be doing during a live demo, and the pages nobody opens
 * should not be the ones costing frames.
 *
 * This is keyed by merchant id rather than by a flag on the record because it
 * is a property of the demo script, not of the merchant. The Supabase project
 * carries merchants that the seed file does not, so anything not named here is
 * a placeholder by default.
 */
export const DEMO_STOREFRONTS = new Set(['sherpa-computers', 'challenger'])

export function isDemoStorefront(merchantId: string): boolean {
  return DEMO_STOREFRONTS.has(merchantId)
}

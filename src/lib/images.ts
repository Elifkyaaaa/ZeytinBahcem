/**
 * Image sources.
 *
 * Every image is served from `public/` and comes from our own shoots; no
 * external CDN (Unsplash and friends) is involved.
 *
 * We have three photographs, so each key maps to the closest matching frame.
 * When new photos arrive, only the mapping below changes — no call site needs
 * touching.
 */

const PHOTO = {
  /** Rows of olive trees, morning sun, blue sky */
  bahce: '/images/zeytin-bahcesi.jpg',
  /** Olive tree on ploughed soil with a harvest crate */
  hasat: '/images/hasat.jpg',
  /** A handful of large black olives, full crate behind */
  zeytin: '/images/siyah-zeytin.jpg',
  /** Olive-laden branches against a clear blue sky, shot from below */
  dal: '/images/olive-branch.jpg',
  /**
   * Brand logo (1049×947, transparent PNG).
   * The vignette from the source image was removed and the background made
   * transparent. Its lettering is dark green, so it must always sit on a
   * light surface to stay legible.
   */
  logo: '/images/elmora-logo.png',
} as const;

export const IMG = {
  // Brand logo — shown at its own aspect ratio on a light surface
  brandLogo: PHOTO.logo,
  // Olive branch against the sky — fills the hero's brand panel
  heroBranch: PHOTO.dal,

  // Grove and landscape
  heroGrove: PHOTO.bahce,
  groveHill: PHOTO.bahce,
  groveField: PHOTO.bahce,
  groveSheep: PHOTO.hasat,
  branchOlives: PHOTO.bahce,
  branchMacro: PHOTO.bahce,
  branchClose: PHOTO.bahce,
  branchLeaves: PHOTO.bahce,
  treeMacro: PHOTO.bahce,
  treeOlives: PHOTO.bahce,
  rocksTree: PHOTO.hasat,
  loneTree: PHOTO.hasat,
  leavesTilt: PHOTO.bahce,
  leavesGreen: PHOTO.bahce,
  greenLeaves: PHOTO.bahce,
  greenPlant: PHOTO.bahce,

  // Hasat
  harvestCrate: PHOTO.hasat,
  harvestHand: PHOTO.zeytin,
  harvestNet: PHOTO.hasat,
  harvestBeans: PHOTO.zeytin,
  harvestFruit: PHOTO.zeytin,

  // Bottles and oil — we have no product shots yet, so the closest frame is used
  cruetOlives: PHOTO.zeytin,
  bottlePourer: PHOTO.bahce,
  bottleDark: PHOTO.hasat,
  cruetCounter: PHOTO.bahce,
  bottleLemon: PHOTO.zeytin,

  // Zeytin
  olivesBowls: PHOTO.zeytin,
  olivesGreen: PHOTO.zeytin,
  olivesBasin: PHOTO.zeytin,
  olivesMixed: PHOTO.zeytin,
  olivesDark: PHOTO.zeytin,
  olivesPile: PHOTO.zeytin,

  // Table and lifestyle
  ingredients: PHOTO.hasat,
  foodTable: PHOTO.zeytin,
  foodSpread: PHOTO.zeytin,
  mezeTable: PHOTO.zeytin,

  // Region
  aegeanPath: PHOTO.bahce,
  aegeanStreet: PHOTO.bahce,
  aegeanTables: PHOTO.hasat,
  aegeanCoast: PHOTO.bahce,
  aegeanAlley: PHOTO.bahce,
} as const;

/**
 * People images.
 * We have no real portrait photography, so these are initial-based SVG badges
 * in the brand colours — more honest than passing an olive photo off as an
 * avatar.
 */
export const AVATAR = {
  a1: '/avatars/a1.svg',
  a2: '/avatars/a2.svg',
  a3: '/avatars/a3.svg',
  a4: '/avatars/a4.svg',
  a5: '/avatars/a5.svg',
  a6: '/avatars/a6.svg',
  a7: '/avatars/a7.svg',
} as const;


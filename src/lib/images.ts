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
  bahce: '/images/olive_grove.jpg',
  /** Olive tree on ploughed soil with a harvest crate */
  hasat: '/images/harvest.jpg',
  /** A handful of large black olives, full crate behind */
  zeytin: '/images/black.jpg',
  /** Olive-laden branches against a clear blue sky, shot from below */
  dal: '/images/olive-branch.jpg',
  /**
   * Sunlit grove looking out to the sea, branches framing the edges and a
   * stone ledge along the bottom. The middle is deliberately empty and very
   * bright (luma ~245), so the hero built on it is a light one: its copy is
   * dark olive and the header keeps its normal colours.
   *
   * Two crops are derived from it because one aspect cannot serve both a wide
   * desktop and a phone: filling a 2.3:1 window from the 3:2 original cropped
   * 36% off the top and bottom and took the framing branches with it, and a
   * phone lost 69% sideways.
   *
   * The wide variant is a nine-slice stretch: the branch masses at either side
   * keep their own scale and only the middle band — sky, sea, hills, ledge —
   * is stretched, so nothing about the leaves is distorted. Mirroring and
   * blurred fills were both tried first and looked obviously fabricated.
   *
   * The tall variant invents nothing at all: it is a straight portrait crop
   * that keeps the left branch mass and the view. On a phone the right-hand
   * branches fall outside the frame; a portrait photograph would fix that.
   */
  bahceIsik: '/images/hero-grove.jpg',
  bahceGenis: '/images/hero-grove-wide.jpg',
  bahceGenisWebp: '/images/hero-grove-wide.webp',
  bahceDikey: '/images/hero-grove-tall.jpg',
  bahceDikeyWebp: '/images/hero-grove-tall.webp',
  /**
   * Horizontal wordmark (1416×638, transparent PNG). Dark green lettering with
   * a gold subtitle, so it needs a light, untextured surface. Kept for light
   * layouts; the hero uses the gold lockup below instead.
   */
  wordmark: '/images/elmora-wordmark.png',
  /**
   * Gold lockup (1078×1024, transparent PNG): monogram emblem over the
   * wordmark. Drawn for a dark ground, so gold reads on the hero photograph
   * exactly as intended — this is the primary mark on dark surfaces.
   */
  emblem: '/images/elmora-emblem.png',
  /**
   * Brand logo (1049×947, transparent PNG).
   * The vignette from the source image was removed and the background made
   * transparent. Its lettering is dark green, so it must always sit on a
   * light surface to stay legible.
   */
  logo: '/images/elmora-logo.png',
} as const;

export const IMG = {
  // Round badge lockup, for light surfaces
  brandLogo: PHOTO.logo,
  // Horizontal wordmark — full colour, needs a light and untextured surface
  brandWordmark: PHOTO.wordmark,
  // Gold lockup — the primary mark wherever the background is dark
  brandEmblem: PHOTO.emblem,
  // Olive branch against the sky
  heroBranch: PHOTO.dal,
  // Sunlit grove — the hero background, art directed by viewport
  heroGroveLight: PHOTO.bahceIsik,
  heroGroveWide: PHOTO.bahceGenis,
  heroGroveWideWebp: PHOTO.bahceGenisWebp,
  heroGroveTall: PHOTO.bahceDikey,
  heroGroveTallWebp: PHOTO.bahceDikeyWebp,

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


/**
 * Görsel kaynakları.
 *
 * Tüm görseller `public/` altından, kendi çekimlerimizden servis edilir.
 * Dış CDN (Unsplash vb.) kullanılmaz.
 *
 * Elde üç fotoğraf var; anahtarlar anlamlarına en yakın kareye eşlenir.
 * Yeni fotoğraf geldiğinde yalnızca aşağıdaki eşleme güncellenir —
 * çağrı yerlerinde hiçbir değişiklik gerekmez.
 */

const PHOTO = {
  /** Sıra sıra zeytin ağaçları, sabah güneşi, mavi gökyüzü */
  bahce: '/gorseller/zeytin-bahcesi.jpg',
  /** Sürülmüş toprakta zeytin ağacı ve hasat kasası */
  hasat: '/gorseller/hasat.jpg',
  /** Avuçta iri siyah zeytinler, arkada dolu kasa */
  zeytin: '/gorseller/siyah-zeytin.jpg',
} as const;

export const IMG = {
  // Bahçe & manzara
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

  // Şişe & yağ — elimizde ürün çekimi yok, en yakın kare kullanılıyor
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

  // Sofra & yaşam
  ingredients: PHOTO.hasat,
  foodTable: PHOTO.zeytin,
  foodSpread: PHOTO.zeytin,
  mezeTable: PHOTO.zeytin,

  // Bölge
  aegeanPath: PHOTO.bahce,
  aegeanStreet: PHOTO.bahce,
  aegeanTables: PHOTO.hasat,
  aegeanCoast: PHOTO.bahce,
  aegeanAlley: PHOTO.bahce,
} as const;

/**
 * Kişi görselleri.
 * Gerçek portre fotoğrafımız olmadığı için baş harfli, marka renklerinde
 * SVG rozetler kullanılıyor — zeytin fotoğrafını avatar yapmaktan dürüst.
 */
export const AVATAR = {
  a1: '/avatarlar/a1.svg',
  a2: '/avatarlar/a2.svg',
  a3: '/avatarlar/a3.svg',
  a4: '/avatarlar/a4.svg',
  a5: '/avatarlar/a5.svg',
  a6: '/avatarlar/a6.svg',
  a7: '/avatarlar/a7.svg',
} as const;


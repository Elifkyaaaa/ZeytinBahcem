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
  bahce: '/images/zeytin-bahcesi.jpg',
  /** Sürülmüş toprakta zeytin ağacı ve hasat kasası */
  hasat: '/images/hasat.jpg',
  /** Avuçta iri siyah zeytinler, arkada dolu kasa */
  zeytin: '/images/siyah-zeytin.jpg',
  /**
   * Kurucumuzun sepya portresi (1122×1402, dikey).
   * Marka adı ve "Since 1889" ibaresi görselin altına basılıdır —
   * bu yüzden asla kırpılmadan, 4/5 oranında gösterilmelidir.
   */
  kurucuPortre: '/images/kurucu-portre.jpg',
} as const;

export const IMG = {
  // Kurucu portresi — üzerindeki yazı nedeniyle yalnızca 4/5 oranında kullanılır
  founderPortrait: PHOTO.kurucuPortre,

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
  a1: '/avatars/a1.svg',
  a2: '/avatars/a2.svg',
  a3: '/avatars/a3.svg',
  a4: '/avatars/a4.svg',
  a5: '/avatars/a5.svg',
  a6: '/avatars/a6.svg',
  a7: '/avatars/a7.svg',
} as const;


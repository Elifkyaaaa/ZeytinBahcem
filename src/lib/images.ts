/**
 * Unsplash görsel kimlikleri.
 * Her kimlik CDN'de doğrulandı; marka/logo görünen kareler bilinçli olarak elendi.
 * Kullanım: `img(IMG.heroGrove, 1920, 1080)`
 */
export const IMG = {
  // Bahçe & manzara
  heroGrove: 'photo-1697829234209-5497520a9fc6',
  groveHill: 'photo-1642687791249-86d868e17746',
  groveField: 'photo-1698036867785-a8aeb0f59c48',
  groveSheep: 'photo-1722228097356-bd0202d99367',
  branchOlives: 'photo-1565459374854-6fa73a99abf5',
  branchMacro: 'photo-1770810416138-a0998ecec78e',
  branchClose: 'photo-1758641283518-59ade23743ae',
  branchLeaves: 'photo-1681572028201-0e13e0810714',
  treeMacro: 'photo-1571139587318-bbb3f0ff433e',
  treeOlives: 'photo-1696848962059-a7e577ca7e6b',
  rocksTree: 'photo-1544475925-9199e8ed85ab',
  loneTree: 'photo-1672940711883-754b2fdefa1c',
  leavesTilt: 'photo-1629797278949-f75067a28371',
  leavesGreen: 'photo-1565460316878-66a800b39ff4',
  greenLeaves: 'photo-1534099946341-34fe5ef39eef',
  greenPlant: 'photo-1625173617589-770990c4a3f9',

  // Hasat
  harvestCrate: 'photo-1753703986291-6f95a7f299ba',
  harvestHand: 'photo-1642275964193-8b9a8523443b',
  harvestNet: 'photo-1753703986174-95e74e094b0e',
  harvestBeans: 'photo-1666955546775-f39d76308be7',
  harvestFruit: 'photo-1663178405985-25074d8e72f4',

  // Şişe & yağ
  cruetOlives: 'photo-1474979266404-7eaacbcd87c5',
  bottlePourer: 'photo-1552592074-ea7a91b851b3',
  bottleDark: 'photo-1666694890460-37ec16b0df47',
  cruetCounter: 'photo-1676751926100-ae4228ba0da4',
  bottleLemon: 'photo-1707827914998-0d56ee13c161',

  // Zeytin
  olivesBowls: 'photo-1755404389864-6f6cc98c29ac',
  olivesGreen: 'photo-1698775942613-3e9fc114b2a1',
  olivesBasin: 'photo-1571094444461-b3e0090ce9c3',
  olivesMixed: 'photo-1731085624461-4fc616f4f7c8',
  olivesDark: 'photo-1708372517145-ac61fe3d3a8d',
  olivesPile: 'photo-1634657443172-efbae44fd04b',

  // Sofra & yaşam
  ingredients: 'photo-1760445530191-55f1d7a8cfd6',
  foodTable: 'photo-1653611540493-b3a896319fbf',
  foodSpread: 'photo-1748540459503-19efc015143b',
  mezeTable: 'photo-1785734290864-eca98549d0b6',

  // Ege
  aegeanPath: 'photo-1781442512012-26dc08a50e62',
  aegeanStreet: 'photo-1663875612292-1bd48eb0a6ce',
  aegeanTables: 'photo-1761773538886-e96d5a45ff49',
  aegeanCoast: 'photo-1601454910277-473849475829',
  aegeanAlley: 'photo-1663875288563-0d0fb0419793',
} as const;

export const AVATAR = {
  a1: 'photo-1494790108377-be9c29b29330',
  a2: 'photo-1580489944761-15a19d654956',
  a3: 'photo-1757744705465-ea08b0ddc38a',
  a4: 'photo-1531750026848-8ada78f641c2',
  a5: 'photo-1651684215020-f7a5b6610f23',
  a6: 'photo-1562337404-3044c84ac061',
  a7: 'photo-1507003211169-0a1dd7228f2d',
} as const;

/**
 * Unsplash CDN URL'i — sabit oran, otomatik format, akıllı kırpma.
 *
 * Genişlik 1920'de sınırlanır: daha büyük kareler 1 MB'ı aşıp Next.js görsel
 * iyileştiricisinin yukarı akış zaman aşımına takılıyor. 1920 px, 2× DPR'li
 * ekranlar için de fazlasıyla yeterli.
 */
export function img(id: string, w: number, h: number, quality = 75) {
  const width = Math.min(w, 1920);
  const height = Math.round((h / w) * width);
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&crop=entropy&w=${width}&h=${height}&q=${quality}`;
}

const DEFAULT_SITE_URL = 'https://bandaijima.com';

/**
 * 景点单一实体（Single Entity）定义。
 * SEO 相关字段集中在此处维护，页面与 JSON-LD 只引用这里的值，
 * 避免同一实体在不同位置出现互相矛盾的信息。
 */
export const attraction = {
  /** 官方全称 / Official full name */
  fullName: 'みなとのマルシェ ピアBandai',
  /** 官方全称的英文表记 */
  fullNameEn: 'Minato Marche Pier Bandai',
  /** 通用俗称、域名对应含义 */
  shortName: 'ピアBandai',
  /** 别名集合，用于 alternateName 与正文等价声明 */
  alternateNames: ['ピアBandai', 'ピア万代', 'みなとのマルシェピアBandai', 'Minato Marche Pier Bandai'],
  /** Google 地図のカテゴリ */
  category: 'Market',
  categoryLabel: '市場・食の複合施設',
  /** 地理所属层级：景点 → 市区 → 省/县 → 国家 */
  city: '新潟市中央区',
  cityEn: 'Niigata',
  stateProvince: '新潟県',
  stateProvinceEn: 'Niigata Prefecture',
  country: '日本',
  countryEn: 'Japan',
  countryCode: 'JP',
  postalCode: '950-0078',
  plusCode: 'W3F6+8H Niigata, Japan',
  telephone: '+81-25-249-2560',
  telephoneLabel: '025-249-2560',
  coordinates: {
    latitude: 37.9233394,
    longitude: 139.061446,
  },
  /** 页面表示用の住所 */
  addressLabel: '〒950-0078 新潟県新潟市中央区万代島2-2 にぎわいマルシェ',
  streetAddress: '万代島2-2 にぎわいマルシェ',
  /** Google マップ 共有短縮リンク */
  mapsShareUrl: 'https://maps.app.goo.gl/1iQ1ESvPGUQ6QUt59',
  /** Google マップ 埋め込み src */
  mapsEmbedUrl:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3147.3035097658326!2d139.061446!3d37.923339399999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x5ff4ca1fdfbef965%3A0x2d08e3d2cac13c0a!2sMinato%20Marche%20Pier%20Bandai!5e0!3m2!1sja!2sJP!4v1785411169543!5m2!1sja!2sJP',
  /** 施設公式サイト */
  officialSiteUrl: 'https://www.bandai-nigiwai.jp/',
  officialSiteLabel: 'みなとのマルシェ ピアBandai 公式サイト',
  /** 权威出站链接（政府・公式観光） */
  govtTourismUrl: 'https://www.nvcb.or.jp/',
  govtTourismLabel: '新潟市観光ガイド（公益財団法人 新潟市観光コンベンション協会）',
  cityOfficialUrl: 'https://www.city.niigata.lg.jp/',
  cityOfficialLabel: '新潟市 公式サイト',
  /** 周辺核心地标 */
  nearbyLandmarks: [
    { name: '朱鷺メッセ（Befcoばかうけ展望室）', url: 'https://www.nvcb.or.jp/spot/detail_1206.html' },
    { name: '萬代橋', url: 'https://www.city.niigata.lg.jp/' },
  ],
  nearbyLandmarksText: '朱鷺メッセ（Befcoばかうけ展望室）、萬代橋',
  isAccessibleForFree: true,
  heroImage: '/images/pia-bandai-hero.webp',
  /** 構造化データ用の画像（絶対URL化して使用） */
  schemaImages: [
    '/images/pia-bandai-hero.webp',
    '/images/whats-niigata.webp',
    '/images/seafood-market.webp',
  ],
  /**
   * Google マップのユーザー評価。
   * 方針: 画面表示のみ。aggregateRating は JSON-LD に含めない。
   */
  rating: {
    value: 4.0,
    count: 7045,
    sourceLabel: 'Google マップ（Google Maps）',
    sourceName: 'Google マップ',
    syncedAt: '2026年9月',
    sourceUrl: 'https://maps.app.goo.gl/1iQ1ESvPGUQ6QUt59',
  },
} as const;

export const siteConfig = {
  name: 'みなと日和｜ピアBandai旅の手帖',
  shortName: 'みなと日和',
  description:
    '新潟・万代島の「みなとのマルシェ ピアBandai」を楽しむための非公式ガイド。海鮮、寿司、ランチ、買い物、営業時間、駐車場、アクセス、周辺散歩を日本語で案内します。',
  siteUrl: import.meta.env.PUBLIC_SITE_URL || DEFAULT_SITE_URL,
  gaId: 'G-HXM22WWPKP',
  locale: 'ja_JP',
  language: 'ja',
  address: attraction.addressLabel,
  coordinates: attraction.coordinates,
  /** 全ページ共通のナビゲーション（モバイルメニュー・フッターで使用） */
  nav: [
    { label: '食べる', href: '/gourmet/' },
    { label: '買う', href: '/shopping/' },
    { label: '営業時間', href: '/hours/' },
    { label: '天気・海況', href: '/weather/' },
    { label: '季節ガイド', href: '/season/' },
    { label: 'アクセス', href: '/access/' },
    { label: '施設・サービス', href: '/services/' },
    { label: 'タイプ別プラン', href: '/plan/' },
    { label: '歴史・伝承', href: '/heritage/' },
    { label: 'よくある質問', href: '/faq/' },
  ],
  /** ヘッダーに表示する主要導線（デスクトップ） */
  navPrimary: [
    { label: '食べる', href: '/gourmet/' },
    { label: '買う', href: '/shopping/' },
    { label: '天気・海況', href: '/weather/' },
    { label: '季節ガイド', href: '/season/' },
    { label: '歴史・伝承', href: '/heritage/' },
    { label: 'アクセス', href: '/access/' },
    { label: 'よくある質問', href: '/faq/' },
  ],
} as const;

/** 気象・海況モジュールの設定（地点は施設座標を使用） */
export const weatherConfig = {
  timezone: 'Asia/Tokyo',
  /** 島内表示用の地点名 */
  pointLabel: `${attraction.city}・万代島`,
  /** 取得値のキャッシュ保持時間（分） */
  cacheMinutes: 15,
  /** 画面側での再取得間隔（分） */
  refreshMinutes: 10,
} as const;

/** 末尾スラッシュを付けない正規化済みドメイン */
export const canonicalOrigin = siteConfig.siteUrl.replace(/\/+$/, '');

/** 実体ノードの @id（Knowledge Graph 上のアンカー） */
export const attractionId = `${canonicalOrigin}/#attraction`;

/** 相対パスを絶対URLへ変換 */
export const absoluteUrl = (path: string) => new URL(path, `${canonicalOrigin}/`).toString();

export const siteConfig = {
  name: 'みなと日和｜ピアBandai旅の手帖',
  shortName: 'みなと日和',
  description:
    '新潟・万代島の「みなとのマルシェ ピアBandai」を楽しむための非公式ガイド。海鮮、寿司、ランチ、買い物、営業時間、駐車場、アクセス、周辺散歩を日本語で案内します。',
  siteUrl: import.meta.env.PUBLIC_SITE_URL || 'https://Bandaijima.com',
  gaId: 'G-HXM22WWPKP',
  locale: 'ja_JP',
  language: 'ja',
  address: '新潟県新潟市中央区万代島2',
  coordinates: {
    latitude: 37.9233394,
    longitude: 139.061446,
  },
  nav: [
    { label: '食べる', href: '/gourmet/' },
    { label: '買う', href: '/shopping/' },
    { label: '営業時間', href: '/hours/' },
    { label: 'アクセス', href: '/access/' },
    { label: 'モデルコース', href: '/course/' },
    { label: 'よくある質問', href: '/faq/' },
  ],
} as const;

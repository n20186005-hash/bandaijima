export type ShopCategory = 'sushi' | 'kaisendon' | 'oyster' | 'meat' | 'ramen' | 'cafe';
export type Budget = 'under1500' | 'under2500' | 'over2500';
export type StayTime = 'quick' | 'normal' | 'relaxed';

export interface Shop {
  id: string;
  name: string;
  shortName: string;
  category: ShopCategory;
  categoryLabel: string;
  lead: string;
  description: string;
  recommended: string[];
  budget: Budget;
  budgetLabel: string;
  stayTime: StayTime;
  rawFish: boolean;
  solo: boolean;
  kids: boolean;
  quick: boolean;
  image: string;
  imageAlt: string;
  hours: string;
  closed: string;
  note?: string;
}

export const shops: Shop[] = [
  {
    id: 'benkei',
    name: '佐渡廻転寿司 弁慶',
    shortName: '弁慶',
    category: 'sushi',
    categoryLabel: '佐渡の寿司',
    lead: 'はじめての一軒に選びたい、佐渡地魚の人気寿司。',
    description:
      '佐渡から届く魚介を中心に、新潟らしい寿司を腰を据えて楽しみたい日に。週末や昼どきは待ち時間を見込み、先に受付状況を確認するのがおすすめです。',
    recommended: ['初訪問', '佐渡地魚', '家族・友人'],
    budget: 'over2500',
    budgetLabel: 'しっかり楽しむ',
    stayTime: 'relaxed',
    rawFish: true,
    solo: true,
    kids: true,
    quick: false,
    image: '/images/sushi-platter.webp',
    imageAlt: '色とりどりの握り寿司の盛り合わせ',
    hours: '10:30〜21:00の案内が目安',
    closed: '水曜を基本に変更の場合あり',
    note: '混雑時は立ち食い店との使い分けが便利です。',
  },
  {
    id: 'tachigui-benkei',
    name: '別館 立ち食い弁慶',
    shortName: '立ち食い弁慶',
    category: 'sushi',
    categoryLabel: '立ち食い寿司',
    lead: '一人旅や短時間の昼食に、職人の寿司を軽快に。',
    description:
      'カウンターで好みの握りを選びやすく、フェリー前や移動途中にも組み込みやすい一軒。長居よりも、旬を数貫味わう使い方に向いています。',
    recommended: ['一人旅', '短時間', '職人握り'],
    budget: 'under2500',
    budgetLabel: '数貫から調整',
    stayTime: 'quick',
    rawFish: true,
    solo: true,
    kids: false,
    quick: true,
    image: '/images/sushi-platter.webp',
    imageAlt: '海老や貝などを使った握り寿司',
    hours: '10:30〜21:00の案内が目安',
    closed: '水曜を基本に変更の場合あり',
  },
  {
    id: 'minato-shokudo',
    name: '新潟鮮魚問屋 港食堂',
    shortName: '港食堂',
    category: 'kaisendon',
    categoryLabel: '海鮮丼・定食',
    lead: '魚屋の目利きを、丼と定食でまっすぐ味わう。',
    description:
      '海鮮丼を中心に、焼き魚や新潟らしい魚料理を選びたい人へ。寿司以外で魚をしっかり食べたい日にも使いやすい食堂です。',
    recommended: ['海鮮丼', '定食', '新潟の魚'],
    budget: 'under2500',
    budgetLabel: '昼食の中心価格帯',
    stayTime: 'normal',
    rawFish: true,
    solo: true,
    kids: true,
    quick: false,
    image: '/images/seafood-market.webp',
    imageAlt: '新潟県内の市場に並ぶベニズワイガニ',
    hours: '平日は昼・夜の二部営業となる日あり',
    closed: '店舗案内で当日確認',
    note: '週末・祝日は営業形態が変わることがあります。',
  },
  {
    id: 'kaki-goya',
    name: '波止場のかき小屋',
    shortName: 'かき小屋',
    category: 'oyster',
    categoryLabel: '牡蠣料理',
    lead: '港らしい湯気と香りを、牡蠣料理で。',
    description:
      '生牡蠣、焼き牡蠣、牡蠣ごはんなどを気分に合わせて。室内席があり、天候が不安定な日にも候補にしやすい店です。',
    recommended: ['牡蠣', '雨の日', '日本酒と'],
    budget: 'under2500',
    budgetLabel: '注文量で調整',
    stayTime: 'normal',
    rawFish: false,
    solo: true,
    kids: true,
    quick: false,
    image: '/images/seafood-market.webp',
    imageAlt: '氷の上に並ぶ新潟県産のベニズワイガニ',
    hours: '季節・曜日で変動',
    closed: '店舗案内で当日確認',
  },
  {
    id: 'hyakuichizen',
    name: 'ぬか釜ステーキ丼専門店 百一膳',
    shortName: '百一膳',
    category: 'meat',
    categoryLabel: '新潟米・肉',
    lead: '海鮮が苦手でも、新潟米のおいしさは外さない。',
    description:
      '稲殻を燃料にする「ぬか釜」で炊いたごはんと肉を一杯に。生ものを避けたい人や、魚料理と別の選択肢が必要なグループにも便利です。',
    recommended: ['生ものなし', '新潟米', '満足感'],
    budget: 'under2500',
    budgetLabel: '丼で満足',
    stayTime: 'normal',
    rawFish: false,
    solo: true,
    kids: true,
    quick: true,
    image: '/images/niigata-rice.webp',
    imageAlt: '新潟県十日町市に広がる水田',
    hours: '昼を中心に営業',
    closed: '店舗案内で当日確認',
  },
  {
    id: 'shokudo-misa',
    name: '食堂ミサ ピアBandai店',
    shortName: '食堂ミサ',
    category: 'ramen',
    categoryLabel: '新潟ラーメン',
    lead: '白みそ、玉ねぎ、にんにく。上越の一杯を港で。',
    description:
      '海鮮だけでなく新潟のご当地麺も楽しみたい人へ。甘みのある白みそスープは、寒い日やしっかり食べたい昼にも向いています。',
    recommended: ['白みそ', '生ものなし', '温かい一杯'],
    budget: 'under1500',
    budgetLabel: '1,500円以内が目安',
    stayTime: 'normal',
    rawFish: false,
    solo: true,
    kids: true,
    quick: true,
    image: '/images/pia-bandai-hero.webp',
    imageAlt: 'みなとのマルシェ ピアBandaiの市場エリア',
    hours: '曜日により営業時間が異なる',
    closed: '店舗案内で当日確認',
  },
  {
    id: 'bay-standard',
    name: 'BAY STANDARD by SUZUKI COFFEE',
    shortName: 'BAY STANDARD',
    category: 'cafe',
    categoryLabel: '珈琲・休憩',
    lead: '買い物の余韻を、港のコーヒーでゆっくり。',
    description:
      '食後の一杯、待ち合わせ、モデルコースの休憩地点に。豆を選ぶ楽しさやコーヒー系スイーツもあり、魚介の後に気分を切り替えられます。',
    recommended: ['食後', '休憩', 'コーヒー豆'],
    budget: 'under1500',
    budgetLabel: '軽い休憩',
    stayTime: 'quick',
    rawFish: false,
    solo: true,
    kids: true,
    quick: true,
    image: '/images/whats-niigata.webp',
    imageAlt: '万代島の青空とWhat’s NIIGATAのサイン',
    hours: '朝から夕方を中心に営業',
    closed: '店舗案内で当日確認',
  },
];

export const categoryLabels: Record<ShopCategory, string> = {
  sushi: '寿司',
  kaisendon: '海鮮丼・定食',
  oyster: '牡蠣',
  meat: '肉・新潟米',
  ramen: 'ラーメン',
  cafe: 'カフェ',
};

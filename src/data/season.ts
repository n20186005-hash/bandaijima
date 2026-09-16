/**
 * 月別の気候値は気象庁「平年値（1991〜2020年／新潟）」（統計期間30年）に基づく。
 * 海況・混雑・旬の魚介は、公開情報と編集上の目安を組み合わせた定性評価で、
 * 数値の気候値とは性質が異なるため、表示側で区別している。
 */

export interface SeaState {
  /** 1: 穏やか / 2: 波あり / 3: 時化やすい */
  level: 1 | 2 | 3;
  label: string;
  note: string;
}

export interface CrowdState {
  /** 1: 落ち着き / 4: 非常に混雑 */
  level: 1 | 2 | 3 | 4;
  label: string;
  note: string;
}

export interface SeasonMonth {
  month: number;
  label: string;
  /** 気象庁平年値（1991〜2020年・新潟） */
  normal: {
    temp: number;
    tmax: number;
    tmin: number;
    precip: number;
    sunlight: number;
    snowfall: number;
    snowDepth: number;
  };
  sea: SeaState;
  crowd: CrowdState;
  /** 旬の魚介（新潟県の水揚げの目安。状況により変動） */
  fish: string[];
  /** 旬の農産物・加工品 */
  produce: string[];
  clothing: string;
  tip: string;
  /** 訪問適期スコア（1〜5・編集上の目安） */
  score: number;
}

export const seasonMonths: SeasonMonth[] = [
  {
    month: 1, label: '1月',
    normal: { temp: 2.5, tmax: 5.3, tmin: 0.1, precip: 180.9, sunlight: 56.4, snowfall: 63, snowDepth: 23 },
    sea: { level: 3, label: '時化やすい', note: '季節風が強く、うねりが入りやすい時期。海沿いの散歩は短時間に。' },
    crowd: { level: 3, label: '三が日は混雑', note: '正月期は混み合うが、中旬以降の平日は比較的落ち着く。' },
    fish: ['寒ブリ', 'マダラ', 'ノドグロ（アカムツ）', '南蛮エビ', 'ズワイガニ', 'カキ'],
    produce: ['雪下にんじん', 'あんぽ柿', '寒漬け大根'],
    clothing: '厚手のコート、帽子、手袋、防水の靴。風を遮る上着が有効。',
    tip: '吹雪の日はバスやタクシーで移動。屋内の売り場と食事を中心に組み立てる。',
    score: 4,
  },
  {
    month: 2, label: '2月',
    normal: { temp: 3.1, tmax: 6.4, tmin: -0.1, precip: 115.8, sunlight: 74.3, snowfall: 48, snowDepth: 23 },
    sea: { level: 3, label: '時化やすい', note: '積雪が残り、港は冷え込む。フェリー欠航の可能性も意識する。' },
    crowd: { level: 2, label: '落ち着き', note: '冬の平日は比較的空いている。祝日の昼どきは並ぶ。' },
    fish: ['寒ブリ', 'マダラ', 'ノドグロ（アカムツ）', '南蛮エビ', 'カキ', 'ワカサギ'],
    produce: ['雪下にんじん', '寒ねぎ', '味噌・漬物'],
    clothing: '真冬装備。滑りにくい靴と替えの靴下があると安心。',
    tip: '冬の魚は脂がのる。刺身、煮付け、粕汁など調理法で選ぶと満足度が上がる。',
    score: 4,
  },
  {
    month: 3, label: '3月',
    normal: { temp: 6.2, tmax: 10.3, tmin: 2.4, precip: 112.0, sunlight: 136.8, snowfall: 8, snowDepth: 5 },
    sea: { level: 2, label: '波あり', note: '日ごとに変化。日中と朝夕の寒暖差が大きい。' },
    crowd: { level: 2, label: '落ち着き', note: '春休みの週末に小さな山。平日は動きやすい。' },
    fish: ['メバル', 'アイナメ', '白魚（シロウオ）', 'ノドグロ', 'アサリ'],
    produce: ['のらぼう菜', 'ふきのとう', '山菜', '春キャベツ'],
    clothing: '重ね着。朝は冬、日中は春の服装へ調整できると快適。',
    tip: '雪解けで路面が濡れやすい。屋外の広場より屋内の買い物中心に。',
    score: 3,
  },
  {
    month: 4, label: '4月',
    normal: { temp: 11.3, tmax: 16.1, tmin: 7.0, precip: 97.2, sunlight: 177.7, snowfall: 0, snowDepth: 0 },
    sea: { level: 2, label: '波あり', note: '海上は穏やかな日が増える。風はまだ冷たい。' },
    crowd: { level: 3, label: '週末に混雑', note: '桜の時期と重なると萬代橋周辺が混み合う。' },
    fish: ['白魚（シロウオ）', 'サクラマス', 'メバル', 'キス', '初ガツオ'],
    produce: ['山菜', 'のらぼう菜', 'アスパラガス', '春いちご'],
    clothing: '薄手のアウター。日差し対策に帽子があると快適。',
    tip: '萬代橋の桜と信濃川を歩き、昼にピアBandaiへ。半日コースが組みやすい。',
    score: 5,
  },
  {
    month: 5, label: '5月',
    normal: { temp: 16.7, tmax: 21.3, tmin: 12.7, precip: 94.4, sunlight: 202.8, snowfall: 0, snowDepth: 0 },
    sea: { level: 2, label: '波あり', note: 'おおむね穏やか。紫外線は強い。' },
    crowd: { level: 4, label: '連休は非常に混雑', note: '大型連休は駐車場と人気店が満車・行列。夕方は落ち着く。' },
    fish: ['初ガツオ', 'キス', 'アジ', 'イワシ', 'ホタルイカ'],
    produce: ['枝豆（ハウス）', '新玉ねぎ', '新じゃがいも', 'そらまめ'],
    clothing: '長袖シャツと羽織り。日差しが強く、日焼け対策が必要。',
    tip: '連休は開店直後か14時以降を狙う。先に駐車、次に食事、買い物は最後。',
    score: 5,
  },
  {
    month: 6, label: '6月',
    normal: { temp: 20.9, tmax: 24.8, tmin: 17.7, precip: 121.1, sunlight: 179.2, snowfall: 0, snowDepth: 0 },
    sea: { level: 1, label: '穏やか', note: '海は静かだが湿度が高い。梅雨の雨は断続的。' },
    crowd: { level: 2, label: '落ち着き', note: '梅雨の平日は空いている。雨の日の屋内利用が快適。' },
    fish: ['岩牡蠣', 'スズキ', 'キス', 'アジ', 'イサキ'],
    produce: ['枝豆', 'トマト', 'きゅうり', '梅'],
    clothing: '通気性の良い服と折りたたみ傘。冷房対策の薄手の羽織り。',
    tip: '雨でも市場と食事は楽しめる。港の散歩は無理をせず短く区切る。',
    score: 3,
  },
  {
    month: 7, label: '7月',
    normal: { temp: 24.9, tmax: 28.7, tmin: 21.8, precip: 222.3, sunlight: 162.1, snowfall: 0, snowDepth: 0 },
    sea: { level: 1, label: '穏やか', note: '海は遊びやすいが、午後の雷雨と急な雨に注意。' },
    crowd: { level: 3, label: '週末に混雑', note: '海の日の連休と夏休み開始で家族客が増える。' },
    fish: ['岩牡蠣', 'スズキ', 'アジ', 'イワシ', 'イサキ', 'ウニ（佐渡）'],
    produce: ['枝豆', 'トマト', 'かぐらなんばん', '桃'],
    clothing: '半袖、帽子、水分。強い雨に対応できる軽い雨具。',
    tip: '降水量が最も多い月。午前中に市場、午後に屋内の見学先へ移す構成が安全。',
    score: 3,
  },
  {
    month: 8, label: '8月',
    normal: { temp: 26.5, tmax: 30.8, tmin: 23.3, precip: 163.4, sunlight: 205.2, snowfall: 0, snowDepth: 0 },
    sea: { level: 1, label: '穏やか（台風注意）', note: '晴れが続くが、台風のうねりで急に海が荒れることがある。' },
    crowd: { level: 4, label: 'お盆は非常に混雑', note: '帰省と旅行が重なる。午前の早い時間と夕方が狙い目。' },
    fish: ['岩牡蠣', 'アジ', 'イワシ', 'スルメイカ', 'スズキ', 'ウニ（佐渡）'],
    produce: ['枝豆', '桃', 'トマト', 'すいか'],
    clothing: '薄手で通気性の良い服。熱中症対策の飲料と日傘。',
    tip: '気温が高い日は保冷品の持ち歩き時間を短く。宅配を先に検討する。',
    score: 3,
  },
  {
    month: 9, label: '9月',
    normal: { temp: 22.5, tmax: 26.4, tmin: 19.0, precip: 151.9, sunlight: 156.2, snowfall: 0, snowDepth: 0 },
    sea: { level: 2, label: '波あり', note: '台風期。フェリーや海沿いの予定は余白を持たせる。' },
    crowd: { level: 3, label: '週末に混雑', note: '行楽シーズンの入口。連休は昼どきに集中する。' },
    fish: ['秋鮭', 'サンマ', 'スルメイカ', 'アジ', 'マグロ（佐渡）'],
    produce: ['新米（早場）', '梨', 'ぶどう', '里芋'],
    clothing: '半袖と羽織り。朝晩は涼しく、雨が多い。',
    tip: '新米と秋の魚が重なる季節。主食と魚を同時に選びやすい。',
    score: 4,
  },
  {
    month: 10, label: '10月',
    normal: { temp: 16.7, tmax: 20.7, tmin: 12.8, precip: 157.7, sunlight: 138.2, snowfall: 0, snowDepth: 0 },
    sea: { level: 2, label: '波あり', note: '次第に風が強まる。港の散歩は快適な気温。' },
    crowd: { level: 3, label: '週末に混雑', note: '行楽期のピーク。市場の午前は買い物客でにぎわう。' },
    fish: ['秋鮭', 'サンマ', 'イカ', 'マグロ（佐渡）', 'ヒラメ'],
    produce: ['新米', '里芋', 'きのこ', '柿', 'りんご'],
    clothing: '長袖に薄手のジャケット。風が冷たくなる。',
    tip: '新米・地酒・秋鮭の組み合わせが揃う。土産選びに最も向く時期。',
    score: 5,
  },
  {
    month: 11, label: '11月',
    normal: { temp: 10.5, tmax: 14.3, tmin: 6.9, precip: 203.5, sunlight: 91.5, snowfall: 0, snowDepth: 0 },
    sea: { level: 3, label: '時化やすい', note: '季節風が吹き始め、海が荒れる日が増える。' },
    crowd: { level: 3, label: '週末に混雑', note: '紅葉期とカニ解禁で県内外から来訪が増える。' },
    fish: ['寒ブリ（走り）', 'ズワイガニ', 'サケ', 'ノドグロ', 'カキ'],
    produce: ['新米', 'くわい', '大根', 'あんぽ柿（仕込み）'],
    clothing: 'コート、防風の上着、暖かい靴下。',
    tip: 'カニと寒ブリの始まり。値段と量を店頭で確認し、家族分は早めに。',
    score: 4,
  },
  {
    month: 12, label: '12月',
    normal: { temp: 5.3, tmax: 8.7, tmin: 2.4, precip: 225.9, sunlight: 62.9, snowfall: 19, snowDepth: 8 },
    sea: { level: 3, label: '時化やすい', note: '冬型の気圧配置で荒天が続く。乗船予定は余裕を持つ。' },
    crowd: { level: 4, label: '年末は非常に混雑', note: '歳末の買い出しで混み合う。年内の午前が比較的動きやすい。' },
    fish: ['寒ブリ', 'ズワイガニ', 'カキ', 'マダラ', 'ノドグロ', '南蛮エビ'],
    produce: ['雪下にんじん', 'あんぽ柿', '寒漬け', '米菓'],
    clothing: '冬装備。手袋と耳当て、滑りにくい靴。',
    tip: '歳末は開店と同時に動き、保冷品は最後に。発送は締切が早まる点に注意。',
    score: 4,
  },
];

export interface SeasonBlock {
  id: string;
  label: string;
  months: string;
  headline: string;
  body: string;
  bestFor: string;
}

export const seasonBlocks: SeasonBlock[] = [
  {
    id: 'spring',
    label: '春',
    months: '3月〜5月',
    headline: '雪解けと桜、そして初ガツオへ',
    body: '気温が上がり、海沿いを歩くのに向く時期へ変わります。萬代橋の桜と信濃川を組み合わせた半日コースが最も成立しやすく、白魚やメバルなど春の魚が並び始めます。大型連休は混雑が最大になるため、時間帯の設計が重要です。',
    bestFor: '街歩きと写真、初訪問',
  },
  {
    id: 'summer',
    label: '夏',
    months: '6月〜8月',
    headline: '雨と暑さ、どちらにも備える',
    body: '降水量が増える梅雨から、気温が最も高くなる盛夏へ。屋内の売り場と飲食が中心の構成が安定します。7月は年間で最も降水量が多く、8月は日照が最も長い月。晴れれば絶好の港日和ですが、保冷品の持ち歩き時間は短く見積もります。',
    bestFor: '家族連れと屋内中心の滞在',
  },
  {
    id: 'autumn',
    label: '秋',
    months: '9月〜11月',
    headline: '新米と秋の魚が重なる最良期',
    body: '新米、秋鮭、サンマ、地酒が同時に揃い、土産選びの満足度が最も高くなる季節です。気温も歩きやすく、萬代島の散歩と展望を組み合わせやすい時期。ただし9月は台風、11月は季節風の影響で海況が変わりやすくなります。',
    bestFor: '食と土産、散策',
  },
  {
    id: 'winter',
    label: '冬',
    months: '12月〜2月',
    headline: '寒ブリと雪の港',
    body: '寒ブリ、ズワイガニ、ノドグロ、南蛮エビと、日本海の冬の魚が最も充実します。その一方で降雪と風、路面凍結、フェリーの欠航リスクが重なります。移動はバス・タクシー・車を基本にし、屋外の滞在は短く区切るのが現実的です。',
    bestFor: '魚介と温かい料理',
  },
];

export const packingNotes = [
  { season: '通年', items: ['歩きやすい靴', '折りたたみ傘', '保冷バッグ（折り畳み）', '小銭'], note: '市場の床は濡れていることがあります。滑りにくい靴底が安心です。' },
  { season: '春・秋', items: ['羽織りもの', '花粉対策', '日焼け止め'], note: '朝晩と日中の気温差が大きく、重ね着が有効です。' },
  { season: '夏', items: ['飲料', '帽子', '汗拭き', '冷感タオル'], note: '保冷品を持ち歩く時間を短くし、宅配の利用も検討します。' },
  { season: '冬', items: ['手袋', '防水の靴', '替えの靴下', 'カイロ'], note: '降雪時は移動時間が伸びます。出発時刻に余白を入れます。' },
];

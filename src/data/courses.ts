export interface CourseStep {
  time: string;
  title: string;
  text: string;
  kind: 'eat' | 'shop' | 'walk' | 'view' | 'rest';
}

export interface Course {
  id: string;
  duration: string;
  label: string;
  title: string;
  summary: string;
  steps: CourseStep[];
}

export const courses: Course[] = [
  {
    id: '60',
    duration: '60分',
    label: 'さっと満喫',
    title: '港ランチと旬の買い物',
    summary: '移動前でも、新潟の魚と市場の空気を外さない最短コース。',
    steps: [
      { time: '0:00', title: '先に食事を決める', text: '短時間なら立ち食い寿司か丼を選び、待ち時間を抑えます。', kind: 'eat' },
      { time: '0:30', title: '鮮魚・土産を見る', text: '保冷の必要な品は最後に購入。米菓や加工品なら移動日にも便利です。', kind: 'shop' },
      { time: '0:50', title: '港の広場で一息', text: '写真を撮り、次の交通手段へ。', kind: 'rest' },
    ],
  },
  {
    id: '120',
    duration: '2時間',
    label: '定番',
    title: '寿司・市場・コーヒー',
    summary: '初めての訪問にちょうどいい、食べる・買う・休むの基本形。',
    steps: [
      { time: '0:00', title: '寿司または海鮮丼', text: '到着したら混雑を確認し、待つか別の店へ切り替えるかを先に決めます。', kind: 'eat' },
      { time: '0:55', title: '鮮魚と新潟米を見比べる', text: '魚介、青果、米、地酒を順に。持ち帰り条件も確認します。', kind: 'shop' },
      { time: '1:30', title: 'コーヒーブレイク', text: '買い物を整理しながら、港の空気でひと休み。', kind: 'rest' },
      { time: '1:55', title: '広場で記念写真', text: '万代島らしい風景を一枚。', kind: 'walk' },
    ],
  },
  {
    id: 'half',
    duration: '半日',
    label: '景色も',
    title: '萬代橋から港の展望へ',
    summary: '信濃川の街並み、ピアBandaiの食、朱鷺メッセの眺望をつなぎます。',
    steps: [
      { time: '10:00', title: '萬代橋を歩く', text: '新潟駅側から信濃川へ。橋と街のスケールを感じます。', kind: 'walk' },
      { time: '11:00', title: 'ピアBandaiで昼食', text: '寿司、海鮮丼、ラーメンからその日の気分で。', kind: 'eat' },
      { time: '12:15', title: '市場で買い物', text: '新潟米、地酒、海産物、菓子を選びます。', kind: 'shop' },
      { time: '13:10', title: '朱鷺メッセ方面へ散歩', text: '港沿いを歩き、万代島の水辺を楽しみます。', kind: 'walk' },
      { time: '13:40', title: '展望室から新潟を眺める', text: '天候が良ければ、市街地、日本海、佐渡方面まで視界が広がります。', kind: 'view' },
    ],
  },
  {
    id: 'ferry',
    duration: '乗船前',
    label: '佐渡へ',
    title: 'フェリー前の90分',
    summary: '時間を読みやすくし、保冷品は最後に買う実用コース。',
    steps: [
      { time: '出航90分前', title: '短時間の食事', text: '立ち食い寿司、ラーメン、丼など提供が早い候補から選びます。', kind: 'eat' },
      { time: '出航50分前', title: '常温の土産を購入', text: '米菓、加工品、菓子など、船内で扱いやすいものを先に。', kind: 'shop' },
      { time: '出航35分前', title: '必要なら保冷品を購入', text: '保冷時間と受け取り方法を確認します。', kind: 'shop' },
      { time: '出航25分前', title: '佐渡汽船方面へ移動', text: '繁忙期は手続きと館内移動に余裕を持ちます。', kind: 'walk' },
    ],
  },
];

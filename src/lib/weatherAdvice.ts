import type { WeatherData } from './weather';
import { weatherLabel } from './weather';

/**
 * 観測値から「今日どう動くか」を組み立てる提案エンジン。
 * サーバー側の初期描画と画面側の再取得で同じ処理を使うため、
 * ここに置いた判定は必ず両方に反映される。
 *
 * 方針:
 * - 専門用語を避け、行動に直結する文だけを出す
 * - 条件を満たさない提案は出さない（出ない＝不要）
 * - 降水確率は確率として扱い、「必ず降る」とは書かない
 * - 注意事項が出るときは通常提案を絞り、安全側を優先する
 */

const LIGHT_RAIN = new Set([51, 53, 55, 56, 57, 61, 66, 80]);
const HEAVY_RAIN = new Set([63, 65, 67, 81, 82]);
const SNOW = new Set([71, 73, 75, 77, 85, 86]);
const FOG = new Set([45, 48]);

export interface WeatherTip {
  id: string;
  title: string;
  text: string;
}

export interface WeatherRisk extends WeatherTip {
  /** high は行程の見直しを促す強い注意 */
  level: 'high' | 'mid';
}

export interface WeatherAdvice {
  /** 「現在：くもり 18〜25° …」形式の要約 */
  headline: string;
  risks: WeatherRisk[];
  outfit: WeatherTip[];
  plan: WeatherTip[];
  items: WeatherTip[];
}

export interface AdviceFact {
  nowCode: number;
  nowTemp: number;
  nowFeels: number;
  nowWind: number;
  nowGust: number;
  nowVisibility: number;
  humidity: number;
  code: number;
  tmax: number;
  tmin: number;
  feelsMax: number;
  pop: number;
  precip: number;
  precipHours: number;
  snowfall: number;
  windMax: number;
  gustMax: number;
  uvMax: number;
  sunrise: string;
  sunset: string;
  waveMax: number | null;
  wavePeriod: number | null;
  sst: number | null;
}

const round = (value: number) => Math.round(value);
const finite = (value: number | null | undefined): boolean => typeof value === 'number' && Number.isFinite(value);

/** 風速（m/s）をビューフォート階級に。強風判定の基準として使う。 */
export function beaufort(speed: number): number {
  if (!finite(speed)) return 0;
  const thresholds = [0.3, 1.6, 3.4, 5.5, 8.0, 10.8, 13.9, 17.2, 20.8, 24.5];
  let level = 0;
  for (const threshold of thresholds) {
    if (Math.abs(speed) >= threshold) level += 1;
  }
  return level;
}

/** 風の人向け表現（階級番号は使わない） */
export function windLabel(speed: number): string {
  const level = beaufort(speed);
  if (level <= 2) return '風は弱め';
  if (level <= 4) return '風ふつう';
  if (level === 5) return '風やや強い';
  if (level === 6) return '風が強い';
  if (level <= 8) return '風がかなり強い';
  return '非常に強い風';
}

/** 紫外線指数の人向け表現（気象庁の区分に準拠） */
export function uvLabel(uv: number): string {
  if (!finite(uv)) return '';
  if (uv < 3) return '弱い';
  if (uv < 5) return '中程度';
  if (uv < 7) return '強い';
  if (uv < 9) return '非常に強い';
  if (uv < 11) return '極めて強い';
  return '極端に強い';
}

export function toAdviceFact(data: WeatherData): AdviceFact {
  const day = data.days[0];
  return {
    nowCode: data.current.code,
    nowTemp: data.current.temp,
    nowFeels: data.current.feels,
    nowWind: data.current.wind,
    nowGust: data.current.gust,
    nowVisibility: data.current.visibility,
    humidity: data.current.humidity,
    code: day?.code ?? data.current.code,
    tmax: day?.tmax ?? data.current.temp,
    tmin: day?.tmin ?? data.current.temp,
    feelsMax: day?.feelsMax ?? data.current.feels,
    pop: day?.pop ?? 0,
    precip: day?.precip ?? 0,
    precipHours: day?.precipHours ?? 0,
    snowfall: day?.snowfall ?? 0,
    windMax: day?.wind ?? data.current.wind,
    gustMax: day?.gust ?? data.current.gust,
    uvMax: day?.uvMax ?? data.current.uv,
    sunrise: day?.sunrise ?? '',
    sunset: day?.sunset ?? '',
    waveMax: data.sea?.waveMax ?? null,
    wavePeriod: data.sea?.wavePeriod ?? null,
    sst: data.sea?.sst ?? null,
  };
}

export function buildWeatherAdvice(fact: AdviceFact): WeatherAdvice {
  const risks = buildRisks(fact);
  const worry = risks.length > 0;
  const wear = buildOutfit(fact);
  // 注意事項がある日は1枠しか出さないため、「いつも通りの服装」ではなく
  // その天気への対処（雨・風）を優先して出す
  const outfitSource = worry ? [wear[1] ?? wear[0]] : [wear[0], wear[1]];
  return {
    headline: buildHeadline(fact),
    risks,
    outfit: outfitSource.filter((tip): tip is WeatherTip => Boolean(tip)).slice(0, worry ? 1 : 2),
    plan: buildPlan(fact).slice(0, worry ? 2 : 3),
    items: buildItems(fact).slice(0, worry ? 3 : 4),
  };
}

function buildHeadline(f: AdviceFact): string {
  const parts = [
    weatherLabel(f.nowCode),
    `最高 ${round(f.tmax)}°／最低 ${round(f.tmin)}°`,
    `降水確率 ${round(f.pop)}%`,
    windLabel(f.windMax),
  ];
  const uv = uvLabel(f.uvMax);
  if (uv) parts.push(`紫外線 ${uv}`);
  return parts.join(' ／ ');
}

function buildRisks(f: AdviceFact): WeatherRisk[] {
  const risks: WeatherRisk[] = [];
  const push = (level: WeatherRisk['level'], id: string, title: string, text: string) => {
    risks.push({ level, id, title, text });
  };

  if (beaufort(f.windMax) >= 9 || f.gustMax >= 25) {
    push('high', 'gale', '暴風級の風の予報', '歩行にも影響が出る強さです。岸壁・防波堤には近づかず、遊覧船・フェリーは欠航の可能性が高いため、運航情報を最優先で確認してください。');
  } else if (beaufort(f.windMax) >= 7 || f.gustMax >= 20) {
    push('high', 'strong-wind', '強風の注意', '荷物や帽子が飛ばされます。岸壁・テトラポッド周辺は避け、遊覧船・フェリーは運休になる場合があります。乗る予定があれば先に運行状況を確認してください。');
  } else if (beaufort(f.windMax) >= 5) {
    push('mid', 'wind', '風が強めの時間帯', '海沿いは数字より寒く感じます。帽子や長い裾は飛ばされやすく、岸壁の散策は短めに収めると安心です。');
  }

  if (f.code >= 95 || f.nowCode >= 95) {
    push('high', 'thunder', '雷雨の可能性', '落雷・突風・急な強雨に注意。海辺・岸壁・高い木の下は避け、遊覧船や海上のアクティビティは中止になる場合があります。');
  }

  if (HEAVY_RAIN.has(f.code) || f.precip >= 20) {
    push('high', 'heavy-rain', '強い雨の予報', '視界が悪く、低い道や水たまりに注意が必要です。市場や水族館など屋根のある施設を主役にして、川・海の近くには近づかないでください。');
  } else if (LIGHT_RAIN.has(f.code) || (f.pop >= 60 && f.precip >= 1)) {
    push('mid', 'shower', 'にわか雨の可能性', '路面が濡れて滑りやすくなります。屋根のある動線をつないで歩くのが安心です。');
  }

  if (f.waveMax !== null && f.waveMax >= 2) {
    push('high', 'high-wave', '波が高い状態', `波の高さは${f.waveMax.toFixed(1)}mほどの目安。テトラポッド・岸壁・釣り場には近づかず、船上や防波堤からの撮影は控えてください。`);
  }

  if (f.snowfall >= 5) {
    push('high', 'snow', 'まとまった雪の予報', '交通の遅延・運休が出やすく、路面が凍結します。移動時間に余裕を持ち、滑りにくい靴で行動してください。');
  } else if (f.snowfall > 0 && f.tmax <= 5) {
    push('mid', 'snow-light', '雪・凍結の可能性', '積もらなくても路面が凍ることがあります。足元と車の運転に注意してください。');
  }

  if (f.tmax >= 32 || f.feelsMax >= 35) {
    push('high', 'heat', '暑さが厳しい予報', '熱中症の危険がある暑さです。11〜15時は屋内へ回し、こまめに水分と塩分を補給してください。');
  } else if (f.tmax >= 30) {
    push('mid', 'heat-caution', '蒸し暑い一日', '日陰と屋外を交互に取りながら、喉が渇く前に水分を取る組み立てが安全です。');
  }

  if (f.tmin <= 0) {
    push('mid', 'freeze', '朝晩は氷点下', '早朝・夜間は凍結します。暖かい服装と滑り止めのある靴を用意してください。');
  }

  if (FOG.has(f.code) || (finite(f.nowVisibility) && (f.nowVisibility as number) <= 1000)) {
    push('mid', 'fog', '霧で見通しが悪い', '運転・徒歩ともに視界が悪くなります。船やフェリーは遅延・欠航が出やすく、遠景目的の訪問には向きません。');
  }

  const order = { high: 0, mid: 1 };
  return risks.sort((a, b) => order[a.level] - order[b.level]).slice(0, 2);
}

function buildOutfit(f: AdviceFact): WeatherTip[] {
  const tips: WeatherTip[] = [];
  const gap = f.tmax - f.tmin;

  if (f.tmax >= 32) {
    tips.push({ id: 'wear-hot', title: '風通しの良い薄手1枚で', text: `日中は${round(f.tmax)}℃前後。汗を吸う素材と汗拭きタオルがあると快適です。` });
  } else if (f.tmax >= 28) {
    tips.push({ id: 'wear-summer', title: '半袖＋薄手の羽織り', text: `日中は${round(f.tmax)}℃前後。屋内の冷房よけに1枚あると楽です。` });
  } else if (f.tmax >= 20) {
    tips.push({ id: 'wear-mid', title: '長袖＋薄手の上着', text: `日中は${round(f.tmax)}℃前後。日陰と海風で体感が下がります。` });
  } else if (f.tmax >= 12) {
    tips.push({ id: 'wear-jacket', title: 'ジャケットが必要', text: `日中は${round(f.tmax)}℃・最低は${round(f.tmin)}℃前後。風を通しにくい上着が安心です。` });
  } else {
    tips.push({ id: 'wear-winter', title: '厚手のコート＋防寒小物', text: `最高でも${round(f.tmax)}℃。海からの風で体感はさらに下がります。` });
  }

  if (HEAVY_RAIN.has(f.code) || f.precip >= 10) {
    tips.push({ id: 'wear-rain-hard', title: '上下とも濡れて良い防水アウター', text: '長傘は風であおられ危険です。フード付きの雨具が安全です。' });
  } else if (LIGHT_RAIN.has(f.code) || f.pop >= 60) {
    tips.push({ id: 'wear-rain', title: '撥水の上着、または折りたたみ傘', text: '短い雨をしのげる軽い雨具があると安心です。' });
  }

  if (beaufort(f.windMax) >= 5) {
    tips.push({ id: 'wear-wind', title: '風を通しにくい上着', text: '海沿いは体感温度が下がります。帽子・長いスカートは飛ばされやすいので避けてください。' });
  } else if (gap > 8) {
    tips.push({ id: 'wear-layer', title: '脱ぎ着しやすい重ね着を', text: `朝夕と日中で${round(gap)}℃ほど差があります（最低${round(f.tmin)}℃）。` });
  }

  if (f.tmin <= 5 || f.tmax <= 10) {
    tips.push({ id: 'wear-cold', title: '厚手の上着・手袋・マフラー', text: '海からの冷たい風で、気温の数字より寒く感じます。' });
  }

  return tips;
}

function buildPlan(f: AdviceFact): WeatherTip[] {
  const tips: WeatherTip[] = [];
  const roughSea = (f.waveMax !== null && f.waveMax >= 1.5) || beaufort(f.windMax) >= 6;
  const calmSea = f.waveMax !== null && f.waveMax <= 0.7 && beaufort(f.windMax) <= 3;
  const stormy = f.code >= 95 || HEAVY_RAIN.has(f.code) || f.precip >= 20;
  const snowy = (SNOW.has(f.code) || f.snowfall > 0) && f.tmax <= 5;

  if (roughSea) {
    tips.push({ id: 'plan-ship', title: '船・フェリーは運航確認を先に', text: '波または風が強く、遊覧船・フェリーは揺れや欠航が出やすい条件です。乗船予定があれば出発前に運航情報を確認してください。' });
  } else if (calmSea && !FOG.has(f.code)) {
    tips.push({ id: 'plan-quay', title: '岸壁の散策・海の眺めに向く日', text: '風と波が穏やかな条件です。河口から岸壁を歩くならこの日が狙い目です。' });
  }

  // この施設固有の条件（雪・寒さ）を、一般的な降水確率の目安より優先する
  if (stormy) {
    tips.push({ id: 'plan-indoor-heavy', title: '屋内中心の組み立てに', text: '市場・水族館・飲食店など屋根のある施設を主役にして、屋外は短時間に切り替えてください。' });
  } else if (snowy) {
    tips.push({ id: 'plan-snow', title: '雪景色を楽しむなら時間に余裕を', text: '足元が悪く移動に時間がかかります。公共交通の遅延も見込んで予定を組んでください。' });
  } else if (f.pop >= 60) {
    tips.push({ id: 'plan-indoor', title: '降水確率が高め。屋内と屋外を交互に', text: `降水確率は${round(f.pop)}%程度。降らなくても屋外は短めにして、屋内施設を軸に回すと崩れにくい予定になります。` });
  } else if (f.pop >= 30 || LIGHT_RAIN.has(f.code) || LIGHT_RAIN.has(f.nowCode)) {
    tips.push({ id: 'plan-shower', title: 'にわか雨を織り込んだ予定に', text: '一時的な雨の可能性があります。屋根のある場所を動線に入れておくと安心です。' });
  } else if (f.tmax <= 10) {
    tips.push({ id: 'plan-cold', title: '屋外は短時間ずつ、暖かい場所と', text: '風を遮れる屋内施設をこまめに挟むのが快適です。' });
  }

  if (f.code === 0 || f.code === 1) {
    const timeHint = f.sunset ? `日没は${f.sunset}ごろです。` : '';
    tips.push({ id: 'plan-clear', title: '晴れて見通しが良い一日', text: `日本海側の夕景・写真撮影に向きます。${timeHint}朝夕の斜光の時間帯が狙い目です。` });
  } else if (f.code === 3) {
    tips.push({ id: 'plan-overcast', title: '光が柔らかく写真向き', text: '日差しが強くないぶん、長時間の散策でも疲れにくい一日です。' });
  } else if (f.code === 2) {
    tips.push({ id: 'plan-partly', title: '晴れと曇りが混ざる空', text: '急な日差しの変化に備えつつ、朝夕の散策に向く条件です。' });
  }

  if (f.uvMax >= 5 || f.tmax >= 32) {
    tips.push({ id: 'plan-noon', title: '正午前後は屋内へ回す', text: `紫外線は${uvLabel(f.uvMax)}水準。日陰の少ない岸壁は照り返しも強いため、11〜14時は屋内施設や日陰に回してください。` });
  }

  if (FOG.has(f.code)) {
    tips.push({ id: 'plan-fog', title: '見晴らし目的は控えめに', text: '霧で遠くが見えにくいコンディションです。市場や展示など近距離の楽しみ方が向いています。' });
  }

  return tips;
}

function buildItems(f: AdviceFact): WeatherTip[] {
  const items: WeatherTip[] = [];
  // 「いま小雨が降っている」場合も傘の判断材料に含める
  const wetDay = f.pop >= 60 || HEAVY_RAIN.has(f.code) || LIGHT_RAIN.has(f.code) || LIGHT_RAIN.has(f.nowCode) || f.precip >= 1;
  const soaked = HEAVY_RAIN.has(f.code) || f.precip >= 10;
  const windy = beaufort(f.windMax) >= 5;

  if (wetDay) {
    if (windy) {
      items.push({ id: 'item-raincoat', title: '雨がっぱ（レインコート）', text: '風が強く長傘はあおられ危険です。両手が空く雨具を。' });
    } else if (soaked) {
      items.push({ id: 'item-umbrella-hard', title: 'しっかりした傘または雨具', text: '降り続く可能性があります。濡れると海風で冷えるため防水の上着も。' });
    } else {
      items.push({ id: 'item-umbrella', title: '折りたたみ傘', text: '短い雨の可能性があるため、荷物に1本。' });
    }
  }

  if (f.uvMax >= 5) {
    items.push({ id: 'item-uv', title: '日焼け止め・帽子・サングラス', text: `紫外線は${uvLabel(f.uvMax)}水準。海面の照り返しもあります。` });
  }

  if (f.tmax >= 28 || f.uvMax >= 5) {
    items.push({ id: 'item-water', title: '飲み物', text: 'こまめな水分補給を。' });
  }

  if (f.tmax - f.tmin > 8) {
    items.push({ id: 'item-layer', title: '羽織る一枚', text: '朝夕と日中で体感が変わります。' });
  }

  if (f.tmin <= 5 || f.tmax <= 10) {
    items.push({ id: 'item-warm', title: '手袋・マフラー', text: '海風で気温より寒く感じます。' });
  }

  if (f.precip >= 1 || f.snowfall > 0 || f.tmin <= 0) {
    items.push({ id: 'item-shoes', title: '滑りにくい靴', text: '濡れた路面・凍結に備えて。' });
  }

  if (windy) {
    items.push({ id: 'item-wind', title: '飛ばされにくい帽子・髪留め', text: '岸壁は風が強くなります。' });
  }

  return items;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export interface AdviceHtml {
  risks: string;
  outfit: string;
  plan: string;
  items: string;
}

/**
 * 提案を HTML 文字列にする。
 * 初期描画（set:html）と画面側更新（innerHTML）で完全に同じ見た目になるよう、
 * 表層の組み立てはここだけに置く。
 */
export function renderAdviceHtml(advice: WeatherAdvice): AdviceHtml {
  const riskItems = advice.risks
    .map(
      (risk) => `<li class="border-l-4 border-vermilion bg-vermilion/[.07] px-4 py-3.5">
  <p class="text-[0.82rem] font-extrabold tracking-[0.03em] text-vermilion">${escapeHtml(risk.title)}</p>
  <p class="mt-1.5 text-[0.74rem] leading-7 text-ink-soft">${escapeHtml(risk.text)}</p>
</li>`
    )
    .join('');

  const tipItems = (tips: WeatherTip[]) =>
    tips
      .map(
        (tip) => `<li class="border-t border-line pt-3 first:border-0 first:pt-0">
  <p class="text-[0.8rem] font-extrabold leading-6 text-ink">${escapeHtml(tip.title)}</p>
  <p class="mt-1 text-[0.74rem] leading-7 text-ink-soft">${escapeHtml(tip.text)}</p>
</li>`
      )
      .join('');

  const itemList = advice.items.length
    ? advice.items
        .map(
          (item) => `<li class="flex gap-2.5 text-[0.74rem] leading-7 text-ink-soft">
  <span class="mt-[0.5rem] h-1.5 w-1.5 shrink-0 rotate-45 bg-vermilion" aria-hidden="true"></span>
  <span><span class="font-extrabold text-ink">${escapeHtml(item.title)}</span>${item.text ? `　${escapeHtml(item.text)}` : ''}</span>
</li>`
        )
        .join('')
    : '<li class="text-[0.74rem] leading-7 text-ink-soft">特別な持ち物は不要です。普段の観光の服装で歩けます。</li>';

  return {
    risks: riskItems,
    outfit: tipItems(advice.outfit),
    plan: tipItems(advice.plan),
    items: itemList,
  };
}

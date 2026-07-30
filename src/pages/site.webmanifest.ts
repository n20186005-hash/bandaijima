import type { APIRoute } from 'astro';

export const prerender = true;

export const GET: APIRoute = () => {
  const manifest = {
    name: 'みなと日和｜ピアBandai旅の手帖',
    short_name: 'みなと日和',
    description: '新潟・万代島の食と港を楽しむ非公式旅行ガイド',
    lang: 'ja',
    start_url: '/',
    display: 'standalone',
    background_color: '#f6f1e7',
    theme_color: '#123f53',
    icons: [{ src: '/favicon.svg', sizes: 'any', type: 'image/svg+xml' }],
  };

  return new Response(JSON.stringify(manifest), {
    headers: { 'Content-Type': 'application/manifest+json; charset=utf-8' },
  });
};

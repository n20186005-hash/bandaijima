import type { APIRoute } from 'astro';

export const prerender = true;

export const GET: APIRoute = () => {
  const manifest = {
    name: 'みなとのマルシェ ピアBandai（新潟）旅行ガイド',
    short_name: 'みなと日和',
    description: '新潟・万代島の食と港を楽しむ非公式旅行ガイド',
    lang: 'ja',
    start_url: '/',
    display: 'standalone',
    background_color: '#f6f1e7',
    theme_color: '#123f53',
    categories: ['travel', 'food', 'lifestyle'],
    icons: [
      { src: '/favicon.svg', sizes: 'any', type: 'image/svg+xml' },
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/icons/icon-maskable-192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
      { src: '/icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };

  return new Response(JSON.stringify(manifest), {
    headers: { 'Content-Type': 'application/manifest+json; charset=utf-8' },
  });
};

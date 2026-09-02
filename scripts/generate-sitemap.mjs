import fs from 'fs';
import path from 'path';

const SITE_URL = 'https://toolbox.example.com';

const TOOLS = [
  'qrcode',
  'password',
  'unit',
  'currency',
  'json',
  'markdown',
  'wordcount',
  'color',
  'base64',
  'image',
  'lorem',
  'timestamp'
];

function generateSitemap() {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${SITE_URL}</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>`;

  for (const tool of TOOLS) {
    xml += `
  <url>
    <loc>${SITE_URL}/tools/${tool}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
  }

  xml += '\n</urlset>';

  const distPath = path.resolve(process.cwd(), 'public');
  if (!fs.existsSync(distPath)) {
    fs.mkdirSync(distPath);
  }

  fs.writeFileSync(path.join(distPath, 'sitemap.xml'), xml);
  console.log('✅ sitemap.xml generated in public/ folder.');
}

generateSitemap();

/* global process */
const PROJECT_ID = process.env.VITE_FIREBASE_PROJECT_ID;
const SITE_URL   = process.env.VITE_SITE_URL || 'https://migron.mtive.tech';

const TODAY = new Date().toISOString().split('T')[0];

const STATIC_URLS = [
  // ── Core ─────────────────────────────────────────────────────────────────────
  { loc: '/',                    priority: '1.0', changefreq: 'daily',   lastmod: TODAY },

  // ── Visa Programs ─────────────────────────────────────────────────────────────
  { loc: '/visa',                priority: '1.0', changefreq: 'weekly',  lastmod: TODAY },
  { loc: '/visa/189',            priority: '0.9', changefreq: 'monthly', lastmod: TODAY },
  { loc: '/visa/190',            priority: '0.9', changefreq: 'monthly', lastmod: TODAY },
  { loc: '/visa/491',            priority: '0.9', changefreq: 'monthly', lastmod: TODAY },
  { loc: '/visa/482',            priority: '0.9', changefreq: 'monthly', lastmod: TODAY },
  { loc: '/visa/186',            priority: '0.9', changefreq: 'monthly', lastmod: TODAY },
  { loc: '/visa/500',            priority: '0.9', changefreq: 'monthly', lastmod: TODAY },
  { loc: '/visa/485',            priority: '0.9', changefreq: 'monthly', lastmod: TODAY },
  { loc: '/visa/820',            priority: '0.8', changefreq: 'monthly', lastmod: TODAY },
  { loc: '/visa/600',            priority: '0.8', changefreq: 'monthly', lastmod: TODAY },
  { loc: '/program-turleri',     priority: '0.8', changefreq: 'monthly', lastmod: TODAY },
  { loc: '/processing-times',    priority: '0.9', changefreq: 'weekly',  lastmod: TODAY },
  { loc: '/pr-yol-haritasi',     priority: '0.8', changefreq: 'monthly', lastmod: TODAY },

  // ── Tools ─────────────────────────────────────────────────────────────────────
  { loc: '/occupation',          priority: '1.0', changefreq: 'weekly',  lastmod: TODAY },
  { loc: '/salary-calculator',   priority: '0.9', changefreq: 'monthly', lastmod: TODAY },
  { loc: '/points-calculator',   priority: '0.9', changefreq: 'monthly', lastmod: TODAY },
  { loc: '/visa-checklist',      priority: '0.9', changefreq: 'monthly', lastmod: TODAY },
  { loc: '/suburb',              priority: '0.9', changefreq: 'daily',   lastmod: TODAY },
  { loc: '/traffic',             priority: '0.7', changefreq: 'daily',   lastmod: TODAY },

  // ── Settlement Guides ─────────────────────────────────────────────────────────
  { loc: '/centrelink',          priority: '0.9', changefreq: 'monthly', lastmod: TODAY },
  { loc: '/vergi-ve-super',      priority: '0.8', changefreq: 'monthly', lastmod: TODAY },
  { loc: '/maas-rehberi',        priority: '0.7', changefreq: 'monthly', lastmod: TODAY },
  { loc: '/sertifikalar',        priority: '0.8', changefreq: 'monthly', lastmod: TODAY },
  { loc: '/belge-sablonlari',    priority: '0.7', changefreq: 'monthly', lastmod: TODAY },
  { loc: '/tax-calculator',      priority: '0.9', changefreq: 'monthly', lastmod: TODAY },
  { loc: '/super-calculator',    priority: '0.8', changefreq: 'monthly', lastmod: TODAY },

  // ── Information ───────────────────────────────────────────────────────────────
  { loc: '/hukuk',               priority: '0.8', changefreq: 'weekly',  lastmod: TODAY },
  { loc: '/egitim',              priority: '0.8', changefreq: 'weekly',  lastmod: TODAY },
  { loc: '/sosyal',              priority: '0.7', changefreq: 'weekly',  lastmod: TODAY },
  { loc: '/sss',                 priority: '0.8', changefreq: 'weekly',  lastmod: TODAY },
  { loc: '/iletisim',            priority: '0.6', changefreq: 'monthly', lastmod: TODAY },
];

export default async function handler(req, res) {
  let articleUrls = [];

  try {
    const firestoreRes = await fetch(
      `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/articles?pageSize=200`
    );
    const data = await firestoreRes.json();

    if (data.documents) {
      articleUrls = data.documents
        .filter(doc => {
          const f = doc.fields || {};
          return f.status?.stringValue === 'published' && f.slug?.stringValue;
        })
        .map(doc => {
          const f = doc.fields || {};
          const slug = f.slug.stringValue;
          const ts = f.updatedAt?.timestampValue || f.createdAt?.timestampValue;
          return {
            loc: `/makale/${slug}`,
            priority: '0.7',
            changefreq: 'monthly',
            lastmod: ts ? ts.split('T')[0] : TODAY,
          };
        });
    }
  } catch (err) {
    console.error('[sitemap] article fetch failed:', err.message);
  }

  const all = [...STATIC_URLS, ...articleUrls];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${all.map(u => `  <url>
    <loc>${SITE_URL}${u.loc}</loc>
    <lastmod>${u.lastmod || TODAY}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
  res.status(200).send(xml);
}

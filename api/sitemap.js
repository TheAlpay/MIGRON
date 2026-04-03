const PROJECT_ID = 'migron-32348';
const SITE_URL = 'https://migron.mtive.tech';

const STATIC_URLS = [
    { loc: '/',                     priority: '1.0', changefreq: 'daily' },
    { loc: '/hukuk',                priority: '0.8', changefreq: 'weekly' },
    { loc: '/egitim',               priority: '0.8', changefreq: 'weekly' },
    { loc: '/sosyal',               priority: '0.8', changefreq: 'weekly' },
    { loc: '/sss',                  priority: '0.8', changefreq: 'weekly' },
    { loc: '/program-turleri',      priority: '0.9', changefreq: 'monthly' },
    { loc: '/pr-yol-haritasi',      priority: '0.9', changefreq: 'monthly' },
    { loc: '/puan-hesapla',         priority: '0.9', changefreq: 'monthly' },
    { loc: '/vize-kontrol-listesi', priority: '0.9', changefreq: 'monthly' },
    { loc: '/belge-sablonlari',     priority: '0.8', changefreq: 'monthly' },
    { loc: '/ilk-48-saat',          priority: '0.8', changefreq: 'monthly' },
    { loc: '/sertifikalar',         priority: '0.8', changefreq: 'monthly' },
    { loc: '/vergi-ve-super',       priority: '0.8', changefreq: 'monthly' },
    { loc: '/centrelink',           priority: '0.7', changefreq: 'monthly' },
    { loc: '/maas-rehberi',         priority: '0.8', changefreq: 'monthly' },
    { loc: '/iletisim',             priority: '0.6', changefreq: 'monthly' },
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
                        lastmod: ts ? ts.split('T')[0] : null,
                    };
                });
        }
    } catch (err) {
        console.error('[sitemap] article fetch failed:', err.message);
    }

    const all = [...STATIC_URLS, ...articleUrls];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${all.map(u => `  <url>
    <loc>${SITE_URL}${u.loc}</loc>${u.lastmod ? `\n    <lastmod>${u.lastmod}</lastmod>` : ''}
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
    res.status(200).send(xml);
}

// api/australia-news.js
// Fetches and parses Australian news RSS feeds server-side (no API key needed)
// Vercel edge cache: s-maxage=3600 (1 hour)

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=600');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

    // FIX: SBS URL was wrong. Real SBS feed paths tried in order.
    const FEEDS = [
        { url: 'https://www.abc.net.au/news/feed/45910/rss.xml',          source: 'ABC News'     },
        { url: 'https://www.theguardian.com/australia-news/rss',           source: 'The Guardian' },
        { url: 'https://www.sbs.com.au/news/topic/australia/feed',         source: 'SBS News'     },
    ];

    const results = await Promise.allSettled(
        FEEDS.map(async ({ url, source }) => {
            const r = await fetch(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (compatible; Migron-News-Bot/1.0)',
                    'Accept':     'application/rss+xml, application/xml, text/xml, */*',
                },
                signal: AbortSignal.timeout(9000),
            });
            if (!r.ok) {
                throw new Error(`HTTP ${r.status} ${r.statusText} from ${source} (${url})`);
            }
            const text = await r.text();
            return parseRSS(text, source);
        })
    );

    const articles = [];
    for (let i = 0; i < results.length; i++) {
        const result = results[i];
        const label  = FEEDS[i].source;
        if (result.status === 'fulfilled') {
            articles.push(...result.value);
        } else {
            console.error(`[australia-news] FAILED ${label}:`, result.reason?.message);
        }
    }

    // Sort newest first
    articles.sort((a, b) => {
        const da = a.pubDate ? new Date(a.pubDate) : new Date(0);
        const db = b.pubDate ? new Date(b.pubDate) : new Date(0);
        return db - da;
    });

    if (articles.length === 0) {
        return res.status(200).json({
            articles:  [],
            fetchedAt: new Date().toISOString(),
            warning:   'All feeds returned 0 articles. Check server logs.',
        });
    }

    return res.status(200).json({
        articles:  articles.slice(0, 15),
        fetchedAt: new Date().toISOString(),
        count:     articles.length,
    });
}

// ─────────────────────────────────────────────────────────────────────────────

function parseRSS(xml, source) {
    const items = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
    let match;

    while ((match = itemRegex.exec(xml)) !== null) {
        const item = match[1];

        const title       = extractCDATA(item, 'title');
        // FIX: try <link>, then <guid isPermaLink="true">, then plain <guid>
        const link        = extractLink(item);
        const description = extractCDATA(item, 'description');
        const pubDate     = extractTag(item, 'pubDate');
        const image       = extractImage(item);
        const category    = extractCDATA(item, 'category');

        if (title && link) {
            items.push({
                title:       title.trim(),
                link:        link.trim(),
                description: description ? stripHTML(description).slice(0, 220) : '',
                pubDate:     pubDate ? pubDate.trim() : null,
                image:       image || null,
                source,
                category:    category ? category.trim() : null,
            });
        }
    }

    return items;
}

function extractTag(xml, tag) {
    const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i');
    const m  = xml.match(re);
    return m ? m[1].trim() : null;
}

function extractCDATA(xml, tag) {
    const cdataRe    = new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>`, 'i');
    const cdataMatch = xml.match(cdataRe);
    if (cdataMatch) return cdataMatch[1];
    return extractTag(xml, tag);
}

function extractLink(item) {
    // 1. Standard RSS <link>URL</link>
    const tagMatch = item.match(/<link>([^<\s][^<]*)<\/link>/i);
    if (tagMatch) return tagMatch[1].trim();

    // FIX 2. Some RSS encodes link as text node immediately after <link> without closing tag
    //    e.g. ABC News: <link>\nhttps://www.abc.net.au/...\n</link>  — already handled above,
    //    but sometimes they omit </link> entirely. Try: <link>\n(url) at end of line.
    const plainLink = item.match(/<link>\s*(https?:\/\/[^\s<]+)/i);
    if (plainLink) return plainLink[1].trim();

    // FIX 3. <guid isPermaLink="true">URL</guid>
    const guidPermalink = item.match(/<guid[^>]*isPermaLink="true"[^>]*>([^<]+)<\/guid>/i);
    if (guidPermalink) return guidPermalink[1].trim();

    // 4. atom:link href="URL"
    const atomLink = item.match(/atom:link[^>]*href="([^"]+)"/i);
    if (atomLink) return atomLink[1];

    // FIX 5. Plain <guid> with http URL as last resort
    const guid = item.match(/<guid[^>]*>(https?:\/\/[^<]+)<\/guid>/i);
    if (guid) return guid[1].trim();

    return null;
}

function extractImage(item) {
    // media:thumbnail url="..."
    const mediaThumbnail = item.match(/media:thumbnail[^>]*url="([^"]+)"/i);
    if (mediaThumbnail) return mediaThumbnail[1];

    // media:content url="..." (only if it's image-like)
    const mediaContent = item.match(/media:content[^>]*url="([^"]+\.(?:jpg|jpeg|png|webp)[^"]*?)"/i);
    if (mediaContent) return mediaContent[1];

    // enclosure type="image/..."
    const enclosure = item.match(/<enclosure[^>]*type="image\/[^"]*"[^>]*url="([^"]+)"/i)
                   || item.match(/<enclosure[^>]*url="([^"]+)"[^>]*type="image\/[^"]*"/i);
    if (enclosure) return enclosure[1];

    // <img src="..."> inside description/content
    const imgInDesc = item.match(/<img[^>]+src="(https?:\/\/[^"]+)"/i);
    if (imgInDesc) return imgInDesc[1];

    return null;
}

function stripHTML(html) {
    return html
        .replace(/<[^>]*>/g, ' ')
        .replace(/&amp;/g,  '&')
        .replace(/&lt;/g,   '<')
        .replace(/&gt;/g,   '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g,  "'")
        .replace(/&nbsp;/g, ' ')
        .replace(/&[a-zA-Z0-9#]+;/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

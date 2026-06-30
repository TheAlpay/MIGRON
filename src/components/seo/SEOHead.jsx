import { useEffect } from 'react';
import { env } from '../../lib/env.ts';

const SITE_URL = env.VITE_SITE_URL;
const DEFAULT_IMAGE = `${SITE_URL}/migron.webp`;

const DEFAULT_TITLE = 'MIGRON — Australian Immigration Platform | Visa Tools, Occupation Checker & Settlement Guide';
const DEFAULT_DESC  = 'Australia\'s most comprehensive immigration platform. Visa guides, occupation checker, points calculator, salary tools, suburb explorer and settlement resources for skilled migrants.';

const SEOHead = ({ title, description, path = '/', ogImage = null, ogType = 'website', lang = 'en' }) => {
    const fullTitle = title ? `${title} | MIGRON` : DEFAULT_TITLE;
    const fullUrl   = `${SITE_URL}${path}`;
    const desc      = description || DEFAULT_DESC;
    const image     = ogImage || DEFAULT_IMAGE;
    const locale    = lang === 'tr' ? 'tr_TR' : 'en_AU';

    useEffect(() => {
        document.title = fullTitle;
        document.documentElement.lang = lang;

        const setMeta = (attr, key, content) => {
            let el = document.querySelector(`meta[${attr}="${key}"]`);
            if (!el) {
                el = document.createElement('meta');
                el.setAttribute(attr, key);
                document.head.appendChild(el);
            }
            el.setAttribute('content', content);
        };

        const setLink = (rel, href, extra = {}) => {
            const selector = Object.entries(extra).reduce(
                (s, [k, v]) => `${s}[${k}="${v}"]`, `link[rel="${rel}"]`
            );
            let el = document.querySelector(selector);
            if (!el) {
                el = document.createElement('link');
                el.setAttribute('rel', rel);
                Object.entries(extra).forEach(([k, v]) => el.setAttribute(k, v));
                document.head.appendChild(el);
            }
            el.setAttribute('href', href);
        };

        // Standard
        setMeta('name', 'description', desc);

        // Open Graph
        setMeta('property', 'og:title',       fullTitle);
        setMeta('property', 'og:description',  desc);
        setMeta('property', 'og:url',          fullUrl);
        setMeta('property', 'og:image',        image);
        setMeta('property', 'og:image:width',  '1200');
        setMeta('property', 'og:image:height', '630');
        setMeta('property', 'og:type',         ogType);
        setMeta('property', 'og:site_name',    'MIGRON');
        setMeta('property', 'og:locale',       locale);

        // Twitter Card
        setMeta('name', 'twitter:card',        'summary_large_image');
        setMeta('name', 'twitter:title',       fullTitle);
        setMeta('name', 'twitter:description', desc);
        setMeta('name', 'twitter:image',       image);

        // Canonical
        setLink('canonical', fullUrl);

    }, [fullTitle, desc, fullUrl, image, lang, locale, ogType]);

    return null;
};

export default SEOHead;

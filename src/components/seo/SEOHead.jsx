import { useEffect } from 'react';
import Logo from '../../assets/migron.webp';

const SITE_URL = 'https://migron.mtive.tech';

/**
 * SEOHead — Sets document title and meta tags dynamically per page.
 * Lightweight alternative to react-helmet, uses direct DOM manipulation.
 */
const SEOHead = ({ title, description, path = '/', ogImage = null }) => {
    const fullTitle = title ? `${title} | MIGRON` : 'MIGRON | Göç & Hukuk Platformu';
    const fullUrl = `${SITE_URL}${path}`;
    const desc = description || 'MIGRON — Avustralya göçmenlik hukuku, vize danışmanlığı ve diaspora teknoloji platformu.';
    const image = ogImage || `${SITE_URL}${Logo}`;

    useEffect(() => {
        // Title
        document.title = fullTitle;

        // Helper to set or create meta tags
        const setMeta = (attr, key, content) => {
            let el = document.querySelector(`meta[${attr}="${key}"]`);
            if (!el) {
                el = document.createElement('meta');
                el.setAttribute(attr, key);
                document.head.appendChild(el);
            }
            el.setAttribute('content', content);
        };

        // Standard meta
        setMeta('name', 'description', desc);

        // Open Graph
        setMeta('property', 'og:title', fullTitle);
        setMeta('property', 'og:description', desc);
        setMeta('property', 'og:url', fullUrl);
        setMeta('property', 'og:image', image);
        setMeta('property', 'og:type', 'website');
        setMeta('property', 'og:site_name', 'MIGRON');
        setMeta('property', 'og:locale', 'tr_TR');

        // Twitter Card
        setMeta('name', 'twitter:card', 'summary_large_image');
        setMeta('name', 'twitter:title', fullTitle);
        setMeta('name', 'twitter:description', desc);
        setMeta('name', 'twitter:image', image);

        // Canonical URL
        let canonical = document.querySelector('link[rel="canonical"]');
        if (!canonical) {
            canonical = document.createElement('link');
            canonical.setAttribute('rel', 'canonical');
            document.head.appendChild(canonical);
        }
        canonical.setAttribute('href', fullUrl);

    }, [fullTitle, desc, fullUrl, image]);

    return null; // This component renders nothing
};

export default SEOHead;

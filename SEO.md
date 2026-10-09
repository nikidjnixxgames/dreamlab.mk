# DreamLab sharing fix — current online version

The previous changes to the outdated SSD checkout were fully rolled back. Pre-existing local index.html, vite.config.js, manifest, robots and sitemap files remain. Restored source files were validated against the original SHA-256 hashes. Ignored build output was rebuilt from the restored source.

The corrected work is in this chat's work/current-dreamlab checkout, based on GitHub main 97199354f974e56a75c718ef7644235c9f07d6f9. Its unmodified build produced index-BGaMbncT.js and index-BX9Xn2jN.css, matching the online site's initial HTML. The other chat's local CSS changes were not copied or modified. Current CSS and layout stay unchanged.

Browser favicon and mobile icons reuse the current approved signature favicon, with PNG exports for browser fallback, Apple touch, and 192/512 manifest entries. Open Graph and Twitter large-image previews reference the existing dreamlab-signature-green-dl.png directly (2043×770); no new social image was generated. The image is a transparent signature logo; rendering/cropping varies by social platform. A custom 1200×630 composition would require separate approval.

Title, description, Open Graph, Twitter, canonical, hreflang, manifest, robots and sitemap are configured for English root URLs and Macedonian /mk/ URLs. The build writes four initial HTML documents for home and Konobar in both languages. Crawlers receive these tags without JavaScript. React navigation updates the same metadata and language switching preserves the page. This does not prerender the body.

Checks passed: production build, scripts/check-seo.js, four HTTP requests with a social-crawler user agent, and browser MK Konobar navigation and head inspection. Lint exits successfully with existing warnings. No commit, push or deploy was performed.

Deploy all dist files, including nested index.html files and .htaccess. Apache DirectoryIndex/mod_rewrite overrides must be enabled. The existing extensionless Konobar URL redirects to its canonical trailing slash URL. Local Vite preview does not execute Apache rules; verify those after an explicitly approved deployment. Social preview cache refresh also follows deployment.

Patch usage from a clean checkout of the stated commit:

```
git apply --check DreamLab-current-sharing.patch
git apply DreamLab-current-sharing.patch
npm ci
npm run build
node scripts/check-seo.js
npm run lint
```

/**
 * CountUp Accounting — Client-Side Localization Engine (i18n)
 */

(function () {
    const STORAGE_KEY = 'countup_lang';

    function getTranslations() {
        return window.CountUpTranslations || null;
    }

    function resolveKey(lang, path) {
        const trans = getTranslations();
        if (!trans) return '';
        const keys = path.split('.');
        let current = trans[lang] || trans.en;
        for (const k of keys) {
            if (current && current[k] !== undefined) {
                current = current[k];
            } else {
                return '';
            }
        }
        return current;
    }

    function detectInitialLanguage() {
        // 1. Check URL parameters (?lang=fr or ?lang=en)
        const params = new URLSearchParams(window.location.search);
        const urlLang = params.get('lang');
        if (urlLang === 'fr' || urlLang === 'en') {
            return urlLang;
        }

        // 2. Check path (/fr or /index-fr.html)
        const pathname = window.location.pathname.toLowerCase();
        if (pathname.includes('index-fr.html') || pathname.endsWith('/fr') || pathname.endsWith('/fr/')) {
            return 'fr';
        }

        // 3. Check localStorage
        const savedLang = localStorage.getItem(STORAGE_KEY);
        if (savedLang === 'fr' || savedLang === 'en') {
            return savedLang;
        }

        // 4. Check browser language
        if (navigator.language && navigator.language.toLowerCase().startsWith('fr')) {
            return 'fr';
        }

        // Default to English
        return 'en';
    }

    function applyLanguage(lang) {
        const trans = getTranslations();
        if (!trans) {
            console.warn('CountUp translations not yet loaded');
            return;
        }

        const currentLang = lang === 'fr' ? 'fr' : 'en';
        document.documentElement.lang = currentLang;

        // 1. Document Title & Meta Description
        const metaTitle = resolveKey(currentLang, 'meta.title');
        if (metaTitle) document.title = metaTitle;

        const metaDescEl = document.querySelector('meta[name="description"]');
        const metaDescVal = resolveKey(currentLang, 'meta.description');
        if (metaDescEl && metaDescVal) {
            metaDescEl.setAttribute('content', metaDescVal);
        }

        // 2. Translate Text Content (data-i18n)
        const textElements = document.querySelectorAll('[data-i18n]');
        textElements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            const translation = resolveKey(currentLang, key);
            if (translation) {
                el.textContent = translation;
            }
        });

        // 3. Translate HTML Content (data-i18n-html)
        const htmlElements = document.querySelectorAll('[data-i18n-html]');
        htmlElements.forEach(el => {
            const key = el.getAttribute('data-i18n-html');
            const translation = resolveKey(currentLang, key);
            if (translation) {
                el.innerHTML = translation;
            }
        });

        // 4. Translate Attributes (data-i18n-attr="placeholder:contact.namePlaceholder,aria-label:nav.home")
        const attrElements = document.querySelectorAll('[data-i18n-attr]');
        attrElements.forEach(el => {
            const attrConfig = el.getAttribute('data-i18n-attr');
            const pairs = attrConfig.split(',');
            pairs.forEach(pair => {
                const [attr, key] = pair.split(':').map(s => s.trim());
                if (attr && key) {
                    const translation = resolveKey(currentLang, key);
                    if (translation) {
                        el.setAttribute(attr, translation);
                    }
                }
            });
        });

        // 5. Update Language Switcher Buttons
        const langSwitchers = document.querySelectorAll('.lang-switcher-btn');
        langSwitchers.forEach(btn => {
            const targetLang = currentLang === 'en' ? 'fr' : 'en';
            const targetLabel = targetLang.toUpperCase();
            btn.innerHTML = `<i class="fa-solid fa-globe"></i> ${targetLabel}`;
            btn.setAttribute('aria-label', targetLang === 'fr' ? 'Passer en français' : 'Switch to English');
            btn.setAttribute('data-target-lang', targetLang);
        });

        // 6. Persist preference
        localStorage.setItem(STORAGE_KEY, currentLang);

        // 7. Dispatch event for other scripts
        window.dispatchEvent(new CustomEvent('countup:languageChanged', {
            detail: { lang: currentLang }
        }));
    }

    function setLanguage(lang, updateUrl = true) {
        applyLanguage(lang);

        if (updateUrl && window.history && window.history.replaceState) {
            const url = new URL(window.location.href);
            // If on /fr or index-fr.html, update appropriately
            if (lang === 'fr') {
                url.searchParams.set('lang', 'fr');
            } else {
                url.searchParams.delete('lang');
            }
            window.history.replaceState(null, '', url.pathname + url.search + url.hash);
        }
    }

    function toggleLanguage() {
        const current = document.documentElement.lang === 'fr' ? 'fr' : 'en';
        const next = current === 'en' ? 'fr' : 'en';
        setLanguage(next, true);
    }

    // Expose API on window
    window.CountUpI18n = {
        setLanguage,
        toggleLanguage,
        getCurrentLanguage: () => document.documentElement.lang || 'en',
        resolveKey
    };

    // Initialize when DOM is ready
    function init() {
        const initialLang = detectInitialLanguage();
        applyLanguage(initialLang);

        // Attach listener to any language switch buttons
        document.addEventListener('click', (e) => {
            const btn = e.target.closest('.lang-switcher-btn');
            if (btn) {
                e.preventDefault();
                toggleLanguage();
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

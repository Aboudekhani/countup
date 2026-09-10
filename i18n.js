/**
 * CountUp Accounting — Client-Side Localization Engine (i18n)
 * Ultra-resilient, iframe-safe, and zero-dependency bilingual manager.
 */

(function () {
    const STORAGE_KEY = 'countup_lang';

    function getTranslations() {
        return (typeof window !== 'undefined' && window.CountUpTranslations) 
            || (typeof CountUpTranslations !== 'undefined' ? CountUpTranslations : null);
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
        // 1. Safe check URL parameters (?lang=fr or ?lang=en)
        try {
            const params = new URLSearchParams(window.location.search);
            const urlLang = params.get('lang');
            if (urlLang === 'fr' || urlLang === 'en') {
                return urlLang;
            }
        } catch (e) {
            console.warn('[CountUp i18n] Could not read search params:', e);
        }

        // 2. Safe check pathname (/fr or /index-fr.html)
        try {
            const pathname = window.location.pathname.toLowerCase();
            if (pathname.includes('index-fr.html') || pathname.endsWith('/fr') || pathname.endsWith('/fr/')) {
                return 'fr';
            }
        } catch (e) {}

        // 3. Safe check localStorage (handles iframe/private-browsing exceptions)
        try {
            if (typeof localStorage !== 'undefined') {
                const savedLang = localStorage.getItem(STORAGE_KEY);
                if (savedLang === 'fr' || savedLang === 'en') {
                    return savedLang;
                }
            }
        } catch (e) {
            console.warn('[CountUp i18n] localStorage inaccessible:', e);
        }

        // 4. Safe check browser language
        try {
            if (navigator.language && navigator.language.toLowerCase().startsWith('fr')) {
                return 'fr';
            }
        } catch (e) {}

        // Default to English
        return 'en';
    }

    function applyLanguage(lang) {
        const trans = getTranslations();
        if (!trans) {
            console.warn('[CountUp i18n] Translations not yet loaded, retrying...');
            setTimeout(() => applyLanguage(lang), 60);
            return;
        }

        const currentLang = (lang === 'fr') ? 'fr' : 'en';
        document.documentElement.lang = currentLang;

        // 1. Document Title & Meta Description
        try {
            const metaTitle = resolveKey(currentLang, 'meta.title');
            if (metaTitle) document.title = metaTitle;

            const metaDescEl = document.querySelector('meta[name="description"]');
            const metaDescVal = resolveKey(currentLang, 'meta.description');
            if (metaDescEl && metaDescVal) {
                metaDescEl.setAttribute('content', metaDescVal);
            }
        } catch (e) {}

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
            if (!attrConfig) return;
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

        // 5. Update Language Switcher Buttons (Desktop & Mobile)
        const targetLang = currentLang === 'en' ? 'fr' : 'en';
        const targetLabel = targetLang.toUpperCase();
        const ariaLabel = targetLang === 'fr' ? 'Passer en français' : 'Switch to English';

        const langSwitchers = document.querySelectorAll('.lang-switcher-btn');
        langSwitchers.forEach(btn => {
            btn.innerHTML = `<i class="fa-solid fa-globe"></i> <span>${targetLabel}</span>`;
            btn.setAttribute('aria-label', ariaLabel);
            btn.setAttribute('title', ariaLabel);
            btn.setAttribute('data-target-lang', targetLang);
        });

        // 6. Persist preference safely
        try {
            if (typeof localStorage !== 'undefined') {
                localStorage.setItem(STORAGE_KEY, currentLang);
            }
        } catch (e) {}

        // 7. Dispatch event for other scripts
        try {
            window.dispatchEvent(new CustomEvent('countup:languageChanged', {
                detail: { lang: currentLang }
            }));
        } catch (e) {}
    }

    function setLanguage(lang, updateUrl = true) {
        applyLanguage(lang);

        if (updateUrl) {
            try {
                if (window.history && window.history.replaceState && window.location.protocol.startsWith('http')) {
                    const url = new URL(window.location.href);
                    if (lang === 'fr') {
                        url.searchParams.set('lang', 'fr');
                    } else {
                        url.searchParams.delete('lang');
                    }
                    window.history.replaceState(null, '', url.pathname + url.search + url.hash);
                }
            } catch (e) {
                // Iframe or sandboxed origin restriction - silently fallback
            }
        }
    }

    function toggleLanguage() {
        const current = (document.documentElement.lang === 'fr') ? 'fr' : 'en';
        const next = (current === 'en') ? 'fr' : 'en';
        setLanguage(next, true);
    }

    // Attach to global window
    window.CountUpI18n = {
        setLanguage,
        toggleLanguage,
        getCurrentLanguage: () => document.documentElement.lang || 'en',
        resolveKey,
        applyLanguage
    };
    window.toggleCountUpLanguage = toggleLanguage;
    window.setCountUpLanguage = setLanguage;

    // Attach listeners directly to buttons and via delegation
    function bindButtons() {
        const buttons = document.querySelectorAll('.lang-switcher-btn');
        buttons.forEach(btn => {
            btn.onclick = function (e) {
                if (e) {
                    e.preventDefault();
                    e.stopPropagation();
                }
                toggleLanguage();
            };
        });
    }

    function init() {
        // Retry if translations dictionary is still loading
        if (!getTranslations()) {
            setTimeout(init, 50);
            return;
        }

        const initialLang = detectInitialLanguage();
        applyLanguage(initialLang);
        bindButtons();

        // Delegated listener as extra safety guarantee
        document.addEventListener('click', function (e) {
            const btn = e.target && e.target.closest ? e.target.closest('.lang-switcher-btn') : null;
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

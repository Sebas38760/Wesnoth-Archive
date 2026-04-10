// index.js – UI language & theme for the Wesnoth Archive hub

(function() {
  let currentUILang = 'en';
  const uiTranslations = {};
  const uiModulesList = [];

  // Build UI language list from window.translation_ui (populated by ui_index_*.js)
  function buildUILanguages() {
    if (!window.translation_ui) return;
    for (const code in window.translation_ui) {
      const mod = window.translation_ui[code];
      if (mod && mod.translations) {
        uiTranslations[code] = mod.translations;
        uiModulesList.push({ code, name: mod.name, dir: mod.dir });
      }
    }
  }

  function populateUILangDropdown() {
    const sel = document.getElementById('languageSelect');
    if (!sel) return;
    sel.innerHTML = '';
    uiModulesList.forEach(lang => {
      const opt = document.createElement('option');
      opt.value = lang.code;
      opt.textContent = lang.name;
      sel.appendChild(opt);
    });
    if (uiTranslations[currentUILang]) sel.value = currentUILang;
    else if (uiModulesList.length) {
      currentUILang = uiModulesList[0].code;
      sel.value = currentUILang;
    }
  }

  function getUIText(key, fallback = '') {
    try {
      let val = uiTranslations[currentUILang]?.[key];
      if (typeof val === 'string' && val.length) return val;
      if (uiTranslations.en) {
        val = uiTranslations.en[key];
        if (typeof val === 'string' && val.length) return val;
      }
      return fallback || `[${key}]`;
    } catch { return fallback || `[${key}]`; }
  }

  function updateUI() {
    document.getElementById('siteTitleSpan').innerText = getUIText('siteTitle', 'Wesnoth Archive');
    document.getElementById('siteSubtitleSpan').innerText = getUIText('siteSubtitle', 'utilities for Wesnoth lore');
    document.getElementById('uiLangLabel').innerText = getUIText('uiLangLabel', '🌐 UI Language:');
    document.getElementById('themeLabel').innerText = getUIText('themeLabel', '🎨 Theme:');
    document.getElementById('chronicleTitle').innerText = getUIText('chronicleTitle', 'Wesnoth Chronicle');
    document.getElementById('chronicleDesc').innerText = getUIText('chronicleDesc', 'Interactive timeline of mainline campaigns and UMC events.');
    document.getElementById('chronicleBtn').innerHTML = getUIText('chronicleBtn', '📖 Open Chronicle →');
    // Footer elements (three‑column layout)
const footerLegalHeading = document.getElementById('footerLegalHeading');
if (footerLegalHeading) footerLegalHeading.innerText = getUIText('footerLegalHeading', '📜 Legal');
const footerTermsLink = document.getElementById('footerTermsLink');
if (footerTermsLink) footerTermsLink.innerText = getUIText('footerTermsLink', 'Terms of Use');
const footerPrivacyLink = document.getElementById('footerPrivacyLink');
if (footerPrivacyLink) footerPrivacyLink.innerText = getUIText('footerPrivacyLink', 'Privacy Policy');
const footerSiteName = document.getElementById('footerSiteName');
if (footerSiteName) footerSiteName.innerText = getUIText('footerSiteName', 'Wesnoth Archive');
const footerSiteDesc = document.getElementById('footerSiteDesc');
if (footerSiteDesc) footerSiteDesc.innerText = getUIText('footerSiteDesc', '✦ utilities for Wesnoth lore & campaigns');
const footerDevHeading = document.getElementById('footerDevHeading');
if (footerDevHeading) footerDevHeading.innerText = getUIText('footerDevHeading', '🛠️ Developer');
const footerDeveloper = document.getElementById('footerDeveloper');
if (footerDeveloper) footerDeveloper.innerText = getUIText('footerDeveloper', 'Developed by Mejri Ziad');
const footerHosted = document.getElementById('footerHosted');
if (footerHosted) footerHosted.innerText = getUIText('footerHosted', 'Hosted on GitHub & Netlify');
const archiveLink = document.getElementById('archiveHomeLink');
if (archiveLink) archiveLink.innerHTML = getUIText('archiveHomeLink', '🏠 Archive Home');

    // Theme dropdown
    const themeSelect = document.getElementById('themeSelect');
    if (themeSelect) {
      const themes = [
        { value: 'light', textKey: 'themeLight' },
        { value: 'dark', textKey: 'themeDark' },
        { value: 'high-contrast', textKey: 'themeHighContrast' }
      ];
      themeSelect.innerHTML = '';
      themes.forEach(t => {
        const opt = document.createElement('option');
        opt.value = t.value;
        opt.textContent = getUIText(t.textKey, t.value);
        themeSelect.appendChild(opt);
      });
      const savedTheme = localStorage.getItem('argothor_theme') || 'light';
      if (Array.from(themeSelect.options).some(o => o.value === savedTheme)) {
        themeSelect.value = savedTheme;
      }
    }
  }

  function setTheme(theme) {
    document.body.classList.remove('theme-light', 'theme-dark', 'theme-high-contrast');
    document.body.classList.add(`theme-${theme}`);
    localStorage.setItem('argothor_theme', theme);
    const announcer = document.getElementById('themeAnnouncer');
    if (announcer) announcer.textContent = `Theme changed to ${theme}`;
  }

  function init() {
    buildUILanguages();
    
    // Load saved language preference
    const savedLang = localStorage.getItem('argothor_ui_lang');
    if (savedLang && uiTranslations[savedLang]) currentUILang = savedLang;
    else if (uiModulesList.length) currentUILang = uiModulesList[0].code;
    
    populateUILangDropdown();
    updateUI();
    
    // Language change handler
    document.getElementById('languageSelect').addEventListener('change', e => {
      currentUILang = e.target.value;
      localStorage.setItem('argothor_ui_lang', currentUILang);
      updateUI();
      const meta = uiModulesList.find(l => l.code === currentUILang);
      document.body.classList.toggle('ui-rtl', meta?.dir === 'rtl');
    });
    
    // Theme change handler
    const themeSelect = document.getElementById('themeSelect');
    const savedTheme = localStorage.getItem('argothor_theme') || 'light';
    setTheme(savedTheme);
    themeSelect.addEventListener('change', e => setTheme(e.target.value));
    
    // Initial RTL
    const initialMeta = uiModulesList.find(l => l.code === currentUILang);
    if (initialMeta?.dir === 'rtl') document.body.classList.add('ui-rtl');
  }

let deferredPrompt;
const installBtn = document.getElementById('installPwaBtn');

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  installBtn.style.display = 'inline-block';
});

installBtn.addEventListener('click', async () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  if (outcome === 'accepted') {
    installBtn.style.display = 'none';
  }
  deferredPrompt = null;
});
  window.addEventListener('DOMContentLoaded', init);
})();
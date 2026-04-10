// ==================== UI TRANSLATIONS (MODULAR) ====================
let uiTranslations = {};
let uiModulesList = [];

function buildUILanguages() {
  if (!window.translation_ui) return;
  uiTranslations = {};
  uiModulesList = [];
  for (const code in window.translation_ui) {
    const mod = window.translation_ui[code];
    if (mod && mod.translations) {
      uiTranslations[code] = mod.translations;
      uiModulesList.push({ code: code, name: mod.name, dir: mod.dir });
    }
  }
}

function populateUILangDropdown() {
  const sel = document.getElementById("languageSelect");
  if (!sel) return;
  sel.innerHTML = "";
  for (const lang of uiModulesList) {
    const opt = document.createElement("option");
    opt.value = lang.code;
    opt.textContent = lang.name;
    sel.appendChild(opt);
  }
  if (currentUILang && uiTranslations[currentUILang]) {
    sel.value = currentUILang;
  } else if (uiModulesList.length) {
    sel.value = uiModulesList[0].code;
    currentUILang = sel.value;
  }
}

function getUIText(key, fallback = '') {
  try {
    let val = uiTranslations[currentUILang]?.[key];
    if (typeof val === 'string' && val.length > 0) return val;
    if (uiTranslations.en) {
      val = uiTranslations.en[key];
      if (typeof val === 'string' && val.length > 0) return val;
    }
    return fallback || `[${key}]`;
  } catch(e) {
    return fallback || `[${key}]`;
  }
}

function formatUIText(key, params = {}, fallback = '') {
  let text = getUIText(key, fallback);
  for (const [param, value] of Object.entries(params)) {
    text = text.replace(new RegExp(`{${param}}`, 'g'), value);
  }
  return text;
}

// ==================== THEME CONFIGURATION (DATA-DRIVEN) ====================
const THEMES = [
  { value: "light", textKey: "themeLight" },
  { value: "dark", textKey: "themeDark" },
  { value: "high-contrast", textKey: "themeHighContrast" }
];

// ==================== MODULAR EVENTS ====================
let eventsDB = {};
let eventsLanguagesList = [];

function validateEvent(ev, langCode) {
  const required = ['id', 'yearNumeric', 'yearDisplay', 'title', 'description', 'tags', 'isCampaign'];
  const missing = required.filter(field => ev[field] === undefined);
  if (missing.length) {
    console.warn(`Event "${ev.title || ev.id}" in ${langCode} missing fields: ${missing.join(', ')}`);
    return false;
  }
  if (!Array.isArray(ev.tags)) {
    console.warn(`Event "${ev.id}" in ${langCode}: tags is not an array`);
    ev.tags = [];
  }
  return true;
}

function loadEventsModules() {
  eventsDB = {};
  eventsLanguagesList = [];

  for (const key in window) {
    if (key.startsWith("eventsDB_")) {
      const code = key.slice(9);
      const mod = window[key];
      if (mod && mod.events && Array.isArray(mod.events)) {
        mod.events = mod.events.filter(ev => validateEvent(ev, code));
        eventsDB[code] = mod;
        eventsLanguagesList.push({
          code: code,
          name: mod.name || code,
          dir: mod.dir || "ltr"
        });
        console.log(`Loaded events module: ${code} (${mod.events.length} events)`);
      } else {
        console.error(`eventsDB_${code} exists but has no valid 'events' array`);
        showToast(formatUIText('toastEventDataInvalid', { code }), 5000);
      }
    }
  }

  if (eventsLanguagesList.length === 0) {
    console.error("No events modules found.");
    showToast(formatUIText('toastNoEventLanguages'), 5000);
  } else {
    console.log("Available event languages:", eventsLanguagesList);
  }

  if (!eventsDB.en) {
    console.warn("⚠️ English events module (eventsDB_en) not found. Fallbacks may fail.");
    showToast(formatUIText('toastEnglishMissing'), 4000);
  }
}

function populateEventsDropdown() {
  const sel = document.getElementById("eventsLangSelect");
  if (!sel) return;
  sel.innerHTML = "";
  for (const lang of eventsLanguagesList) {
    const opt = document.createElement("option");
    opt.value = lang.code;
    opt.textContent = lang.name;
    sel.appendChild(opt);
  }
  if (currentEventsLang && eventsDB[currentEventsLang]) {
    sel.value = currentEventsLang;
  } else if (eventsLanguagesList.length) {
    sel.value = eventsLanguagesList[0].code;
    currentEventsLang = sel.value;
  }
}

function getSafeEnglishEvents() {
  return (eventsDB.en && Array.isArray(eventsDB.en.events)) ? eventsDB.en.events : [];
}

function getCurrentEvents() {
  const primaryModule = eventsDB[currentEventsLang];
  if (!primaryModule && !eventsDB.en) {
    console.warn("No events data available");
    showToast(formatUIText('toastNoEventData'), 4000);
    return [];
  }
  const primary = primaryModule?.events.slice() || [];
  const english = getSafeEnglishEvents();
  let merged = [...primary];
  const ids = new Set(merged.map(e => e.id));
  for (let ev of english) {
    if (!ids.has(ev.id)) merged.push(JSON.parse(JSON.stringify(ev)));
  }
  return merged.sort((a, b) => a.yearNumeric - b.yearNumeric).map(ev => {
    const eng = english.find(e => e.id === ev.id);
    if (eng && (!ev.title || ev.title === '')) ev.title = eng.title;
    if (eng && (!ev.description || ev.description === '')) ev.description = eng.description;
    if (eng && (!ev.tags || ev.tags.length === 0)) ev.tags = [...eng.tags];
    return ev;
  });
}

function getCampaignsList() {
  const module = eventsDB[currentEventsLang];
  if (module && Array.isArray(module.campaigns)) {
    return module.campaigns;
  }
  if (eventsDB.en && Array.isArray(eventsDB.en.campaigns)) {
    return eventsDB.en.campaigns;
  }
  console.error('No campaign definitions found.');
  showToast(formatUIText('toastNoCampaignDefs'), 4000);
  return [];
}

function getCurrentDeepEvents() {
  const cid = document.getElementById("campaignDeepSelect")?.value;
  if (!cid) return [];

  let deepArray = [];
  const primaryDeep = window[`campaignsDeep_${currentEventsLang}`];
  if (primaryDeep && Array.isArray(primaryDeep)) {
    const found = primaryDeep.find(c => c.id === cid);
    if (found && found[`deepEvents_${currentEventsLang}`]) {
      deepArray = found[`deepEvents_${currentEventsLang}`];
    }
  }

  if (!deepArray.length) {
    for (const key in window) {
      if (key.startsWith("campaignsDeep_")) {
        const langData = window[key];
        if (Array.isArray(langData)) {
          const found = langData.find(c => c.id === cid);
          const deepKey = `deepEvents_${key.slice(14)}`;
          if (found && found[deepKey] && found[deepKey].length) {
            deepArray = found[deepKey];
            console.warn(`⚠️ Deep data for campaign "${cid}" not found in ${currentEventsLang}, falling back to ${key.slice(14)}`);
            break;
          }
        }
      }
    }
  }

  if (!deepArray.length) {
    console.warn(`⚠️ No deep events found for campaign "${cid}" in any language.`);
  }

  return deepArray.slice().sort((a, b) => a.yearNumeric - b.yearNumeric);
}

// ==================== EVENT DIRECTION (RTL SUPPORT) ====================
function applyEventDirection() {
  const langMeta = eventsLanguagesList.find(l => l.code === currentEventsLang);
  const container = document.querySelector('.container');
  if (container) {
    if (langMeta && langMeta.dir === 'rtl') {
      container.classList.add('events-rtl');
    } else {
      container.classList.remove('events-rtl');
    }
  }
}

// ==================== STATE & CACHING ====================
let currentUILang = 'en';
let currentEventsLang = 'en';
let currentTypeFilter = "all";
let activeTags = new Set();
let currentView = "cards";

let tooltipEl = null;
let tooltipHideTimeout = null;
let tooltipPinned = false;
let currentFocusedNode = null;
let tooltipContentId = 'tooltip-content-' + Math.random().toString(36).substr(2, 8);

let eventsCache = {
  lang: null,
  type: null,
  tagsKey: '',
  result: null
};

function invalidateCache() {
  eventsCache.lang = null;
}

function getFilteredEvents() {
  const lang = currentEventsLang;
  const type = currentTypeFilter;
  const tagsKey = Array.from(activeTags).sort().join('|');

  if (eventsCache.lang === lang && eventsCache.type === type && eventsCache.tagsKey === tagsKey) {
    return eventsCache.result;
  }

  const filtered = getCurrentEvents().filter(ev => {
    if (type === "campaign" && !ev.isCampaign) return false;
    if (type === "global" && ev.isCampaign) return false;
    if (activeTags.size && !(ev.tags || []).some(t => activeTags.has(t))) return false;
    return true;
  }).sort((a, b) => a.yearNumeric - b.yearNumeric);

  eventsCache = { lang, type, tagsKey, result: filtered };
  return filtered;
}

function getAllTags() {
  const set = new Set();
  getCurrentEvents().forEach(ev => (ev.tags || []).forEach(t => set.add(t)));
  return Array.from(set).sort();
}

function escapeHtml(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/`/g, '&#96;');
}

// ==================== SCREEN READER ANNOUNCEMENTS ====================
function announceToScreenReader(message) {
  const announcer = document.getElementById('themeAnnouncer');
  if (announcer) {
    announcer.textContent = message;
  } else {
    const temp = document.createElement('div');
    temp.setAttribute('aria-live', 'polite');
    temp.style.position = 'absolute';
    temp.style.width = '1px';
    temp.style.height = '1px';
    temp.style.padding = '0';
    temp.style.margin = '-1px';
    temp.style.overflow = 'hidden';
    temp.textContent = message;
    document.body.appendChild(temp);
    setTimeout(() => temp.remove(), 1000);
  }
}

// ==================== PREFERENCES PERSISTENCE ====================
function loadSavedPreferences() {
  try {
    const savedUILang = localStorage.getItem('argothor_ui_lang');
    const savedEventsLang = localStorage.getItem('argothor_events_lang');
    if (savedUILang && uiTranslations[savedUILang]) currentUILang = savedUILang;
    if (savedEventsLang && eventsDB[savedEventsLang]) currentEventsLang = savedEventsLang;
  } catch(e) {
    console.warn('Could not load preferences from localStorage', e);
  }
}

function saveUIPreference(lang) {
  try {
    localStorage.setItem('argothor_ui_lang', lang);
  } catch(e) {}
}

function saveEventsPreference(lang) {
  try {
    localStorage.setItem('argothor_events_lang', lang);
  } catch(e) {}
}

// ==================== LOADING INDICATOR (ROBUST) ====================
function showLoading() {
  const overlay = document.getElementById('loadingOverlay');
  if (overlay) overlay.style.display = 'flex';
  document.querySelectorAll('select, button').forEach(el => el.disabled = true);
}

function hideLoading() {
  const overlay = document.getElementById('loadingOverlay');
  if (overlay) overlay.style.display = 'none';
  document.querySelectorAll('select, button').forEach(el => el.disabled = false);
}

async function withLoading(asyncFn) {
  showLoading();
  try {
    await asyncFn();
  } catch (error) {
    console.error('Operation failed:', error);
    showToast(formatUIText('toastGenericError'), 4000);
  } finally {
    hideLoading();
  }
}

// ==================== TOOLTIP WITH TAP-TO-TOGGLE (ARROW ONLY) ====================
function createTooltip() {
  if (tooltipEl) return tooltipEl;
  tooltipEl = document.createElement("div");
  tooltipEl.className = "floating-tooltip";
  tooltipEl.setAttribute('role', 'tooltip');
  tooltipEl.setAttribute('aria-live', 'polite');
  tooltipEl.id = tooltipContentId;
  tooltipEl.style.opacity = '0';
  tooltipEl.style.transition = 'opacity 0.15s';
  document.body.appendChild(tooltipEl);
  return tooltipEl;
}

function updateTooltipContent(ev) {
  const tip = createTooltip();
  tip.innerHTML = `
    <div class="tooltip-title">${escapeHtml(ev.title)}</div>
    <div class="tooltip-year">${escapeHtml(ev.yearDisplay)}</div>
    <div class="tooltip-desc">${escapeHtml(ev.description)}</div>
    <div class="tooltip-tags">${(ev.tags || []).map(t => `<span class="mini-tag">${escapeHtml(t)}</span>`).join('')}</div>
  `;
}

function positionTooltipFromEvent(e) {
  if (!tooltipEl) return;
  const tip = tooltipEl;
  let left, top;

  if (e instanceof FocusEvent) {
    const rect = e.target.getBoundingClientRect();
    left = rect.left + window.scrollX;
    top = rect.bottom + window.scrollY + 5;
  } else {
    left = e.clientX + 15;
    top = e.clientY - 10;
  }

  const rect = tip.getBoundingClientRect();
  if (left + rect.width > window.innerWidth - 10) left = window.innerWidth - rect.width - 10;
  if (left < 10) left = 10;
  if (top + rect.height > window.innerHeight - 10) top = window.innerHeight - rect.height - 10;
  if (top < 10) top = 10;

  tip.style.left = left + "px";
  tip.style.top = top + "px";
}

function showTooltip(e, ev) {
  if (tooltipHideTimeout) {
    clearTimeout(tooltipHideTimeout);
    tooltipHideTimeout = null;
  }
  updateTooltipContent(ev);
  positionTooltipFromEvent(e);
  tooltipEl.style.opacity = '1';
  tooltipEl.classList.add("visible");
  if (e.target) {
    e.target.setAttribute('aria-describedby', tooltipContentId);
  }
}

function hideTooltip(e) {
  if (!tooltipEl) return;
  if (tooltipPinned) return;
  if (tooltipHideTimeout) clearTimeout(tooltipHideTimeout);
  tooltipHideTimeout = setTimeout(() => {
    tooltipEl.classList.remove("visible");
    tooltipEl.style.opacity = '0';
    if (e && e.target) {
      e.target.removeAttribute('aria-describedby');
    }
  }, 100);
}

function toggleTooltipPin(e, ev) {
  if (tooltipPinned) {
    tooltipPinned = false;
    hideTooltip(e);
  } else {
    tooltipPinned = true;
    showTooltip(e, ev);
    if (tooltipHideTimeout) clearTimeout(tooltipHideTimeout);
    tooltipHideTimeout = setTimeout(() => {
      tooltipPinned = false;
      hideTooltip(e);
    }, 5000);
  }
}

// Attach tooltip handlers ONLY to arrow nodes
function attachTooltipHandlers(node, ev) {
  node.addEventListener("mouseenter", (e) => showTooltip(e, ev));
  node.addEventListener("mouseleave", (e) => hideTooltip(e));
  node.addEventListener("focus", (e) => showTooltip(e, ev));
  node.addEventListener("blur", (e) => hideTooltip(e));
  node.addEventListener("keydown", (e) => { if (e.key === "Escape") hideTooltip(e); });
  node.addEventListener("click", (e) => {
    if (e.pointerType !== 'mouse') {
      e.preventDefault();
      toggleTooltipPin(e, ev);
    }
  });
}

function showToast(msg, duration = 2500) {
  const toast = document.getElementById("toastMsg");
  if (!toast) return;
  toast.innerText = msg;
  toast.style.opacity = "1";
  setTimeout(() => toast.style.opacity = "0", duration);
}

// ==================== ROVING TABINDEX ====================
function initRovingTabindex(containerSelector, nodeSelector) {
  const container = document.querySelector(containerSelector);
  if (!container) return;
  const nodes = () => Array.from(container.querySelectorAll(nodeSelector));
  
  const setActive = (index) => {
    nodes().forEach((n, i) => {
      n.tabIndex = i === index ? 0 : -1;
      if (i === index) n.focus();
    });
  };

  const handleKeydown = (e) => {
    const items = nodes();
    if (!items.length) return;
    const currentIndex = items.findIndex(n => n === document.activeElement);
    if (currentIndex === -1) return;

    let newIndex = currentIndex;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      newIndex = (currentIndex + 1) % items.length;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      newIndex = (currentIndex - 1 + items.length) % items.length;
    } else if (e.key === 'Home') {
      e.preventDefault();
      newIndex = 0;
    } else if (e.key === 'End') {
      e.preventDefault();
      newIndex = items.length - 1;
    } else {
      return;
    }
    setActive(newIndex);
  };

  container.removeEventListener('keydown', handleKeydown);
  container.addEventListener('keydown', handleKeydown);
}

// ==================== EVENT HIGHLIGHT FROM URL HASH ====================
function highlightEventFromHash() {
  const hash = window.location.hash;
  if (!hash.startsWith('#event-')) return;
  const id = parseInt(hash.slice(7), 10);
  if (isNaN(id)) return;

  const events = getFilteredEvents();
  const ev = events.find(e => e.id === id);
  if (!ev) {
    showToast(formatUIText('toastEventNotFound'), 3000);
    return;
  }

  setTimeout(() => {
    if (currentView === 'cards') {
      const cards = document.querySelectorAll('.event-card');
      const index = events.findIndex(e => e.id === id);
      if (index >= 0 && cards[index]) {
        cards[index].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        cards[index].classList.add('highlight-pulse');
        setTimeout(() => cards[index].classList.remove('highlight-pulse'), 2000);
      }
    } else if (currentView === 'table') {
      const rows = document.querySelectorAll('#tableBody tr');
      const index = events.findIndex(e => e.id === id);
      if (index >= 0 && rows[index]) {
        rows[index].scrollIntoView({ behavior: 'smooth', block: 'center' });
        rows[index].classList.add('highlight-pulse');
        setTimeout(() => rows[index].classList.remove('highlight-pulse'), 2000);
      }
    } else if (currentView === 'arrow') {
      const nodes = document.querySelectorAll('.arrow-node');
      const index = events.findIndex(e => e.id === id);
      if (index >= 0 && nodes[index]) {
        nodes[index].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        nodes[index].classList.add('highlight-pulse');
        setTimeout(() => nodes[index].classList.remove('highlight-pulse'), 2000);
      }
    }
  }, 100);
}

// ==================== RENDERING (NO TOOLTIPS ON CARDS/TABLE) ====================
function renderCards() {
  const track = document.getElementById("cardsTrack");
  const filtered = getFilteredEvents();
  track.innerHTML = "";
  if (!filtered.length) {
    track.innerHTML = `<div class='empty-msg'>${getUIText('emptyNoEvents')}</div>`;
    return;
  }
  filtered.forEach(ev => {
    const card = document.createElement("div");
    card.className = "event-card";
    card.style.borderLeftColor = ev.isCampaign ? "#c95f3a" : "#4d7a9e";
    card.innerHTML = `<div class="card-header"><div class="event-year">${escapeHtml(ev.yearDisplay)}</div><div class="event-title">${escapeHtml(ev.title)}</div></div><div class="event-desc">${escapeHtml(ev.description)}</div><div class="tag-list">${(ev.tags || []).map(t => `<span class="tag-badge">${escapeHtml(t)}</span>`).join('')}</div>`;
    track.appendChild(card);
  });
  highlightEventFromHash();
}

function renderTable() {
  const tbody = document.getElementById("tableBody");
  const filtered = getFilteredEvents();
  tbody.innerHTML = "";
  if (!filtered.length) {
    tbody.innerHTML = `<tr><td colspan='4' class='empty-msg'>${getUIText('emptyNoEvents')}</td></tr>`;
    return;
  }
  filtered.forEach(ev => {
    const r = tbody.insertRow();
    r.insertCell(0).innerText = ev.yearDisplay;
    r.insertCell(1).innerHTML = `<strong>${escapeHtml(ev.title)}</strong>`;
    r.insertCell(2).innerText = ev.description;
    r.insertCell(3).innerHTML = `<div class="table-tag-list">${(ev.tags || []).map(t => `<span class="mini-tag">${escapeHtml(t)}</span>`).join('')}</div>`;
  });
  highlightEventFromHash();
}

function renderArrow() {
  const track = document.getElementById("arrowTrack");
  const filtered = getFilteredEvents();
  track.innerHTML = "";
  if (!filtered.length) {
    track.innerHTML = `<div class='empty-msg'>${getUIText('emptyNoEventsShort')}</div>`;
    return;
  }
  filtered.forEach(ev => {
    const node = document.createElement("div");
    node.className = `arrow-node ${ev.isCampaign ? 'campaign-point' : 'global-point'}`;
    node.setAttribute('role', 'button');
    node.setAttribute('tabindex', '-1');
    node.setAttribute('aria-label', `${ev.title}, ${ev.yearDisplay}`);
    node.innerHTML = `<div class="point-circle"></div><div class="node-year">${escapeHtml(ev.yearDisplay)}</div>`;
    attachTooltipHandlers(node, ev); // Tooltip only for arrow nodes
    track.appendChild(node);
  });
  const nodes = track.querySelectorAll('.arrow-node');
  if (nodes.length) nodes[0].tabIndex = 0;
  initRovingTabindex('#arrowTrack', '.arrow-node');
  highlightEventFromHash();
}

function refreshMainView() {
  if (currentView === "cards") renderCards();
  else if (currentView === "table") renderTable();
  else renderArrow();
}

function buildTagFilterUI() {
  const container = document.getElementById("tagChecklist");
  container.innerHTML = "";
  container.setAttribute('role', 'group');
  container.setAttribute('aria-label', getUIText('tagsLabel'));
  getAllTags().forEach(tag => {
    const label = document.createElement("label");
    label.className = "tag-check";
    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.value = tag;
    cb.checked = activeTags.has(tag);
    cb.setAttribute('aria-label', `Filter by tag ${tag}`);
    cb.addEventListener("change", () => {
      if (cb.checked) activeTags.add(tag);
      else activeTags.delete(tag);
      invalidateCache();
      refreshMainView();
      refreshDeepView();
    });
    label.appendChild(cb);
    label.appendChild(document.createTextNode(tag));
    container.appendChild(label);
  });
}

function resetFilters() {
  currentTypeFilter = "all";
  activeTags.clear();
  invalidateCache();
  document.querySelectorAll(".type-btn").forEach(btn => btn.classList.remove("active"));
  document.querySelector('.type-btn[data-type="all"]').classList.add("active");
  buildTagFilterUI();
  refreshMainView();
  refreshDeepView();
}

function switchView(view) {
  currentView = view;
  document.querySelectorAll('.view-container').forEach(c => c.classList.remove('active-view'));
  document.getElementById(`${view}View`).classList.add('active-view');
  document.querySelectorAll('.view-btn').forEach(btn => {
    btn.classList.remove('active');
    btn.setAttribute('aria-pressed', 'false');
  });
  const activeBtn = document.querySelector(`.view-btn[data-view="${view}"]`);
  activeBtn.classList.add('active');
  activeBtn.setAttribute('aria-pressed', 'true');
  refreshMainView();
  refreshDeepView();
  hideTooltip();
}

function renderDeepCards() {
  const events = getCurrentDeepEvents();
  const track = document.getElementById("deepCardsTrack");
  track.innerHTML = "";
  if (!events.length) {
    track.innerHTML = `<div class='empty-msg'>${getUIText('emptyNoCharEvents')}</div>`;
    return;
  }
  events.forEach(ev => {
    const card = document.createElement("div");
    card.className = "deep-event-card";
    card.innerHTML = `<div class="card-header"><div class="event-year">${escapeHtml(ev.yearDisplay)}</div><div class="event-title">${escapeHtml(ev.title)}</div></div><div class="event-desc">${escapeHtml(ev.description)}</div>`;
    track.appendChild(card);
  });
}

function renderDeepTable() {
  const events = getCurrentDeepEvents();
  const tbody = document.getElementById("deepTableBody");
  tbody.innerHTML = "";
  if (!events.length) {
    tbody.innerHTML = `<tr><td colspan='3' class='empty-msg'>${getUIText('emptyNoDeep')}</td></tr>`;
    return;
  }
  events.forEach(ev => {
    const r = tbody.insertRow();
    r.insertCell(0).innerText = ev.yearDisplay;
    r.insertCell(1).innerHTML = `<strong>${escapeHtml(ev.title)}</strong>`;
    r.insertCell(2).innerText = ev.description;
  });
}

function renderDeepArrow() {
  const events = getCurrentDeepEvents();
  const track = document.getElementById("deepTimelineTrack");
  track.innerHTML = "";
  if (!events.length) {
    track.innerHTML = `<div class='empty-msg'>${getUIText('emptyNoDeep')}</div>`;
    return;
  }
  events.forEach(ev => {
    const node = document.createElement("div");
    node.className = "deep-arrow-node";
    node.setAttribute('role', 'button');
    node.setAttribute('tabindex', '-1');
    node.setAttribute('aria-label', `${ev.title}, ${ev.yearDisplay}`);
    node.innerHTML = `<div class="deep-point-circle"></div><div class="deep-node-year">${escapeHtml(ev.yearDisplay)}</div>`;
    attachTooltipHandlers(node, ev); // Tooltip for deep arrow too
    track.appendChild(node);
  });
  const nodes = track.querySelectorAll('.deep-arrow-node');
  if (nodes.length) nodes[0].tabIndex = 0;
  initRovingTabindex('#deepTimelineTrack', '.deep-arrow-node');
}

function refreshDeepView() {
  const containers = ["deepCardsContainer", "deepTableContainer", "deepArrowContainer"];
  containers.forEach(id => document.getElementById(id).classList.remove("active-deep-view"));
  if (currentView === "cards") {
    document.getElementById("deepCardsContainer").classList.add("active-deep-view");
    renderDeepCards();
  } else if (currentView === "table") {
    document.getElementById("deepTableContainer").classList.add("active-deep-view");
    renderDeepTable();
  } else {
    document.getElementById("deepArrowContainer").classList.add("active-deep-view");
    renderDeepArrow();
  }
}

function populateCampaignDropdown() {
  const sel = document.getElementById("campaignDeepSelect");
  if (!sel) return;
  const curr = sel.value;
  sel.innerHTML = "";
  const campaigns = getCampaignsList();
  if (!campaigns.length) {
    const opt = document.createElement("option");
    opt.value = "";
    opt.textContent = "— No campaigns —";
    sel.appendChild(opt);
    refreshDeepView();
    return;
  }
  campaigns.forEach(c => {
    const opt = document.createElement("option");
    opt.value = c.id;
    opt.textContent = c.name;
    sel.appendChild(opt);
  });
  if (curr && Array.from(sel.options).some(o => o.value === curr)) sel.value = curr;
  else if (campaigns.length) sel.value = campaigns[0].id;
  refreshDeepView();
}

function populateThemeSelect() {
  const sel = document.getElementById("themeSelect");
  if (!sel) return;
  sel.innerHTML = "";
  THEMES.forEach(t => {
    const opt = document.createElement("option");
    opt.value = t.value;
    opt.textContent = getUIText(t.textKey, t.value);
    sel.appendChild(opt);
  });
  const saved = localStorage.getItem('argothor_theme') || 'light';
  if (Array.from(sel.options).some(o => o.value === saved)) {
    sel.value = saved;
  }
}

function updateUI() {
  document.getElementById("siteTitleSpan").innerText = getUIText('siteTitle', 'Wesnoth Chronicle');
  document.getElementById("siteSubtitleSpan").innerText = getUIText('siteSubtitle', '✦ timeline for Wesnoth mainline and UMC');
  document.getElementById("uiLangLabel").innerText = getUIText('uiLangLabel');
  document.getElementById("eventsLangLabel").innerText = getUIText('eventsLangLabel');
  document.getElementById("themeLabel").innerText = getUIText('themeLabel');
  document.getElementById("eventTypeLabel").innerText = getUIText('eventTypeLabel');
  document.getElementById("typeAllBtn").innerHTML = getUIText('typeAllBtn');
  document.getElementById("typeCampaignBtn").innerHTML = getUIText('typeCampaignBtn');
  document.getElementById("typeGlobalBtn").innerHTML = getUIText('typeGlobalBtn');
  document.getElementById("tagsLabel").innerHTML = getUIText('tagsLabel');
  document.getElementById("resetFiltersBtn").innerHTML = getUIText('resetBtn');
  document.getElementById("viewCardsBtn").innerHTML = getUIText('viewCardsBtn');
  document.getElementById("viewTableBtn").innerHTML = getUIText('viewTableBtn');
  document.getElementById("viewArrowBtn").innerHTML = getUIText('viewArrowBtn');
  document.getElementById("chronoHint").innerHTML = getUIText('chronoHint');
  document.getElementById("hoverHint").innerHTML = getUIText('hoverHint');
  document.getElementById("deepTitle").innerHTML = getUIText('deepTitle');
  document.getElementById("activeCampaignLabel").innerHTML = getUIText('activeCampaignLabel');
  document.getElementById("syncNote").innerHTML = getUIText('syncNote');
  document.getElementById("personalBeatsHint").innerHTML = getUIText('personalBeatsHint');
  document.getElementById("tableYearHeader").innerText = getUIText('tableYearHeader');
  document.getElementById("tableTitleHeader").innerText = getUIText('tableTitleHeader');
  document.getElementById("tableDescHeader").innerText = getUIText('tableDescHeader');
  document.getElementById("tableTagsHeader").innerText = getUIText('tableTagsHeader');
  document.getElementById("deepYearHeader").innerText = getUIText('deepYearHeader');
  document.getElementById("deepEventHeader").innerText = getUIText('deepEventHeader');
  document.getElementById("deepDescHeader").innerText = getUIText('deepDescHeader');// Footer elements (three‑column layout)
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

  document.querySelectorAll('[data-i18n-aria]').forEach(el => {
    const key = el.getAttribute('data-i18n-aria');
    el.setAttribute('aria-label', getUIText(key));
  });

  populateThemeSelect();
}

function setTheme(theme) {
  document.body.classList.remove('theme-light', 'theme-dark', 'theme-high-contrast');
  document.body.classList.add(`theme-${theme}`);
  localStorage.setItem('argothor_theme', theme);
  announceToScreenReader(`Theme changed to ${theme}`);
}

function initTheme() {
  const saved = localStorage.getItem('argothor_theme');
  setTheme(saved || 'light');
  const themeSelect = document.getElementById('themeSelect');
  themeSelect.addEventListener('change', e => setTheme(e.target.value));
}

function setUILanguage(lang) {
  withLoading(async () => {
    currentUILang = lang;
    saveUIPreference(lang);
    updateUI();
    invalidateCache();
    refreshMainView();
    refreshDeepView();
    
    const langMeta = uiModulesList.find(l => l.code === lang);
    if (langMeta && langMeta.dir === 'rtl') {
      document.body.classList.add('ui-rtl');
    } else {
      document.body.classList.remove('ui-rtl');
    }
  });
}

function setEventsLanguage(lang) {
  withLoading(async () => {
    currentEventsLang = lang;
    saveEventsPreference(lang);
    applyEventDirection();
    invalidateCache();
    buildTagFilterUI();
    refreshMainView();
    populateCampaignDropdown();
    refreshDeepView();
  });
}

function bindScrollButtons() {
  document.getElementById("scrollLeftCards").addEventListener("click", () => {
    document.getElementById("cardsScrollContainer").scrollBy({ left: -350, behavior: "smooth" });
  });
  document.getElementById("scrollRightCards").addEventListener("click", () => {
    document.getElementById("cardsScrollContainer").scrollBy({ left: 350, behavior: "smooth" });
  });
  document.getElementById("scrollLeftArrow").addEventListener("click", () => {
    document.getElementById("arrowScrollContainer").scrollBy({ left: -350, behavior: "smooth" });
  });
  document.getElementById("scrollRightArrow").addEventListener("click", () => {
    document.getElementById("arrowScrollContainer").scrollBy({ left: 350, behavior: "smooth" });
  });
  document.getElementById("scrollLeftDeep").addEventListener("click", () => {
    const active = document.querySelector(".deep-view-container.active-deep-view");
    if (active) {
      const scrollDiv = active.querySelector(".deep-cards-scroll, .deep-arrow-scroll");
      if (scrollDiv) scrollDiv.scrollBy({ left: -300, behavior: "smooth" });
    }
  });
  document.getElementById("scrollRightDeep").addEventListener("click", () => {
    const active = document.querySelector(".deep-view-container.active-deep-view");
    if (active) {
      const scrollDiv = active.querySelector(".deep-cards-scroll, .deep-arrow-scroll");
      if (scrollDiv) scrollDiv.scrollBy({ left: 300, behavior: "smooth" });
    }
  });
}

function init() {
  loadEventsModules();
  buildUILanguages();
  loadSavedPreferences();

  populateEventsDropdown();
  populateUILangDropdown();
  buildTagFilterUI();
  populateCampaignDropdown();
  initTheme();
  applyEventDirection();
  
  const initialLangMeta = uiModulesList.find(l => l.code === currentUILang);
  if (initialLangMeta && initialLangMeta.dir === 'rtl') {
    document.body.classList.add('ui-rtl');
  } else {
    document.body.classList.remove('ui-rtl');
  }
  
  const initialLang = document.getElementById("languageSelect").value;
  if (initialLang && uiTranslations[initialLang]) currentUILang = initialLang;
  else if (uiModulesList.length) currentUILang = uiModulesList[0].code;
  setUILanguage(currentUILang);
  updateUI();

  document.querySelectorAll(".type-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".type-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentTypeFilter = btn.getAttribute("data-type");
      invalidateCache();
      refreshMainView();
      refreshDeepView();
    });
    btn.setAttribute('aria-pressed', btn.classList.contains('active') ? 'true' : 'false');
  });

  document.getElementById("resetFiltersBtn").addEventListener("click", resetFilters);
  
  document.querySelectorAll(".view-btn").forEach(btn => {
    btn.addEventListener("click", () => switchView(btn.getAttribute("data-view")));
    btn.setAttribute('aria-pressed', btn.classList.contains('active') ? 'true' : 'false');
  });

  document.getElementById("campaignDeepSelect").addEventListener("change", () => refreshDeepView());
  
  bindScrollButtons();
  
  document.getElementById("languageSelect").addEventListener("change", e => setUILanguage(e.target.value));
  document.getElementById("eventsLangSelect").addEventListener("change", e => setEventsLanguage(e.target.value));
  
  initRovingTabindex('#arrowTrack', '.arrow-node');
  initRovingTabindex('#deepTimelineTrack', '.deep-arrow-node');

  refreshMainView();
  refreshDeepView();

  window.addEventListener('hashchange', highlightEventFromHash);
  
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
  // Welcome toast (translatable)
  showToast(formatUIText('toastWelcome'), 4000);
}

init();
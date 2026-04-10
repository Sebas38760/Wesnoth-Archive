
# Wesnoth Chronicle – Modular Timeline

This is a multilingual, interactive timeline for the **Wesnoth** universe (mainline campaigns and UMC). It separates **UI translations** (button labels, headings, theme names) from **event content** (historical events, character arcs). Both are modular: you can add new languages without touching the core JavaScript.

---

## 🚀 Quick Start

1. Open `Chronicle.html` in a browser (preferably via a local web server to avoid `file://` restrictions).
2. Use the dropdowns to change UI language, event language, and theme.
3. Filter events by type (Campaign/Global) and tags.
4. Switch between Cards, Table, and Arrow Timeline views.
5. The **Deep Chronicle** section shows character‑specific events for selected campaigns.

---

## 🌐 Adding a New UI Language

UI strings are stored in `i18n/ui_XX.js` files. To add a new language (e.g., Italian):

1. Create `i18n/ui_it.js` with the following structure:
   ```javascript
   translation_ui.it = {
     code: "it",
     name: "Italiano",
     dir: "ltr",
     translations: {
       siteTitle: "🐉 Cronaca di Wesnoth",
       siteSubtitle: "✦ linea temporale per Wesnoth (campagne ufficiali e UMC)",
       uiLangLabel: "🌐 Lingua UI:",
       eventsLangLabel: "📖 Lingua eventi:",
       themeLabel: "🎨 Tema:",
       themeLight: "Chiaro",
       themeDark: "Scuro",
       themeHighContrast: "Alto contrasto",
       // ... copy all other keys from ui_en.js and translate values
     }
   };
   ```
2. Add a `<script>` tag in `Chronicle.html` after the other UI modules:
   ```html
   <script src="i18n/ui_it.js"></script>
   ```
3. That's it! The language will appear automatically in the UI language dropdown.

**Important:** The `translations` object must contain **all keys** present in `ui_en.js`. Missing keys will fall back to English.

---

## 📖 Adding a New Event Language

Event data is stored in `i18n/events_XX.js`. To add event content in a new language (e.g., French):

1. Create `i18n/events_fr.js` with:
   ```javascript
   window.eventsDB_fr = {
     name: "Français",
     dir: "ltr",
     campaigns: [
       { id: "argothor_main", name: "⚔️ Campagne Principale d'Argothor" },
       { id: "solar_attack", name: "☀️ Attaque Solaire" }
     ],
     events: [
       // Array of event objects (see below)
     ]
   };

   window.campaignsDeep_fr = [
     {
       id: "argothor_main",
       deepEvents_fr: [
         // Array of deep event objects
       ]
     }
   ];
   ```

2. **Event Object Structure** (required fields):
   ```javascript
   {
     id: 1,                     // Unique number (same across languages for the same event)
     yearNumeric: -1000,        // Used for sorting (negative for BE, positive for AE)
     yearDisplay: "1000 BE",    // Human-readable year
     title: "Event Title",
     description: "What happened...",
     tags: ["campaign", "magic"], // Array of strings
     isCampaign: true           // true = campaign event, false = global lore
   }
   ```

3. **Deep Event Structure** (for character arcs):
   ```javascript
   {
     id: 1001,
     yearNumeric: 1460,
     yearDisplay: "1460 AE",
     title: "Hero's Father Born",
     description: "Eldrin Vane is born."
   }
   ```

4. Add the script tag to `Chronicle.html`:
   ```html
   <script src="i18n/events_fr.js"></script>
   ```

The event language dropdown will automatically include "Français". If some events are missing translations, the system falls back to English (so ensure `eventsDB_en` exists).

---

## 🎭 Adding a New Campaign (for Deep Chronicle)

Campaigns are defined inside each `eventsDB_XX` module's `campaigns` array. To add a new campaign:

1. In every `eventsDB_XX.js` file, add an entry to the `campaigns` array:
   ```javascript
   campaigns: [
     { id: "argothor_main", name: "Argothor Main Campaign" },
     { id: "my_new_campaign", name: "My New Campaign" }  // <-- new
   ]
   ```
2. In every `campaignsDeep_XX` array (same file), add a corresponding object:
   ```javascript
   window.campaignsDeep_en = [
     // ... existing campaigns
     {
       id: "my_new_campaign",
       deepEvents_en: [
         // deep events for this campaign
       ]
     }
   ];
   ```
3. The campaign selector in the Deep Chronicle section will now list the new campaign.

---

## 🎨 Theming

Themes are defined in `chronicle-colors.css` (CSS variables) and layout in `chronicle-light.css`, `chronicle-dark.css`, `chronicle-high.css`. Theme names are **translatable** via the UI language files (`themeLight`, `themeDark`, `themeHighContrast`). To add a new theme:

1. Add a new `body.theme-<name>` block in `chronicle-colors.css`.
2. Duplicate one of the layout CSS files, rename it, and change the body class selector.
3. Add the new theme option to the UI translation files (e.g., `themeCustom: "Custom Theme"`) and ensure it appears in the `populateThemeSelect()` function in `chronicle.js`.
4. The theme is automatically persisted in `localStorage`.

---

## 🛠️ Troubleshooting

### "No event languages loaded" or dropdowns empty
- Ensure you are not using `file://` protocol without a local server. Browsers may block script execution. Use a simple HTTP server (e.g., `npx serve`).
- Check the browser console for errors. All event modules must use `window.eventsDB_xx = {...}` (not `const`).

### Events appear in wrong language
- The system merges events by `id`. If the same event has different IDs across languages, it won't merge correctly. Keep IDs consistent.

### Deep Chronicle empty
- Verify that the selected campaign exists in both `campaigns` and `campaignsDeep_XX`.
- Check that `deepEvents_XX` array is present and correctly named (e.g., `deepEvents_fr` for French).

---

## 📁 File Structure

```
.
├── Chronicle.html
├── styles/
│   ├── chronicle-colors.css
│   ├── chronicle-light.css
│   ├── chronicle-dark.css
│   └── chronicle-high.css
├── scripts/
│   ├── init.js
│   └── chronicle.js
└── i18n/
    ├── ui_en.js
    ├── ui_es.js
    ├── ui_fr.js
    ├── ui_de.js
    ├── events_en.js
    └── events_ar.js
```

---

## ✅ Validation

A diagnostic page `test.html` is included. Open it to verify that all modules are loaded correctly and that event structures are valid.

---

## 📝 License

Feel free to adapt for your own worldbuilding or TTRPG campaigns.
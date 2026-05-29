const translations = {
  en: {
    subtitle: 'Knowledge Capture',
    langBtn: 'فارسی',
    searchTags: 'Search tags...',
    emptyTitle: 'No tags yet ✨',
    emptyText: 'Right-click web selections to automatically capture and tag notes.',
    newNoteBtn: '＋ New Note',
    notesCount: 'notes',
    noteCount: 'note',
    settingsTitle: 'AI Settings',
    settingsSubtitle: 'Gemini API Configuration',
    apiKeyLabel: 'Gemini API Key',
    modelLabel: 'Gemini Model',
    testConnBtn: 'Test Connection',
    saveSettingsBtn: 'Save Settings',
    newNoteTitle: 'New Note',
    newNoteSubtitle: 'Manual entry with AI auto-tagging',
    noteTextPlaceholder: 'Write or paste your content here...',
    noteSourcePlaceholder: 'Source link / title (optional)',
    saveManualNoteBtn: 'Save & Tag Note',
    toastSaved: 'Saved ✓',
    toastDeleted: 'Deleted ✓',
    testing: 'Testing connection...',
    testSuccess: 'Connected successfully!',
    testError: 'Connection failed: ',
    enterKey: 'Please enter an API Key first',
    uncategorized: 'Uncategorized',
    tagPlaceholder: 'General',
    saving: 'Saving & Tagging...'
  },
  fa: {
    subtitle: 'ثبت سریع اطلاعات',
    langBtn: 'EN',
    searchTags: 'جستجوی تگ‌ها...',
    emptyTitle: 'هنوز تگی نداری ✨',
    emptyText: 'متن‌های مورد نظرت در وب را راست کلیک کن تا به صورت خودکار ذخیره و تگ‌گذاری شوند.',
    newNoteBtn: '＋ یادداشت جدید',
    notesCount: 'یادداشت',
    noteCount: 'یادداشت',
    settingsTitle: 'تنظیمات هوش مصنوعی',
    settingsSubtitle: 'تنظیمات کلید اختصاصی Gemini',
    apiKeyLabel: 'کلید API جمینای (Gemini)',
    modelLabel: 'مدل جمینای',
    testConnBtn: 'تست اتصال',
    saveSettingsBtn: 'ذخیره تنظیمات',
    newNoteTitle: 'یادداشت جدید',
    newNoteSubtitle: 'ثبت دستی همراه با تگ‌گذاری خودکار هوش مصنوعی',
    noteTextPlaceholder: 'متن خود را اینجا بنویسید یا بچسبانید...',
    noteSourcePlaceholder: 'عنوان یا لینک منبع (اختیاری)',
    saveManualNoteBtn: 'ذخیره و تگ‌گذاری با هوش مصنوعی',
    toastSaved: 'ذخیره شد ✓',
    toastDeleted: 'حذف شد ✓',
    testing: 'در حال بررسی اتصال...',
    testSuccess: 'اتصال با موفقیت برقرار شد!',
    testError: 'خطا در اتصال: ',
    enterKey: 'لطفاً ابتدا کلید API را وارد کنید',
    uncategorized: 'دسته‌بندی‌نشده',
    tagPlaceholder: 'عمومی',
    saving: 'در حال ذخیره و تگ‌گذاری...'
  }
};

function getStorage() {
  if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
    return {
      get: (key, cb) => chrome.storage.local.get([key], cb),
      set: (data, cb) => chrome.storage.local.set(data, cb),
    };
  }
  return {
    get: (key, cb) => {
      const data = localStorage.getItem(key);
      cb({ [key]: data ? JSON.parse(data) : [] });
    },
    set: (data, cb) => {
      Object.keys(data).forEach((k) => localStorage.setItem(k, JSON.stringify(data[k])));
      cb && cb();
    },
  };
}

const storage = getStorage();

// State
let currentLanguage = 'en';
let currentTheme = 'dark';
let notes = [];
let activeTag = null;
let currentView = 'tags'; // tags, notes, settings, add-note

// UI Containers
const popupContainer = document.getElementById('popup-container');
const views = {
  tags: document.getElementById('view-tags'),
  notes: document.getElementById('view-notes'),
  settings: document.getElementById('view-settings'),
  addNote: document.getElementById('view-add-note')
};

// General Elements
const langBtn = document.getElementById('lang-btn');
const dashboardBtn = document.getElementById('dashboard-btn');
const settingsBtn = document.getElementById('settings-btn');
const addNoteBtn = document.getElementById('add-note-btn');
const toastDiv = document.getElementById('toast');
const popupSubtitle = document.getElementById('popup-subtitle');

// View 1 (Tags View)
const tagSearchInput = document.getElementById('tag-search');
const tagsGrid = document.getElementById('tags-grid');
const tagsEmptyState = document.getElementById('tags-empty-state');
const tagsEmptyText = document.getElementById('tags-empty-text');

// View 2 (Notes View)
const notesBackBtn = document.getElementById('notes-back-btn');
const activeTagTitle = document.getElementById('active-tag-title');
const activeTagCount = document.getElementById('active-tag-count');
const notesList = document.getElementById('notes-list');

// View 3 (Settings View)
const settingsBackBtn = document.getElementById('settings-back-btn');
const settingsTitle = document.getElementById('settings-title');
const settingsSubtitle = document.getElementById('settings-subtitle');
const lblApiKey = document.getElementById('lbl-api-key');
const apiKeyInput = document.getElementById('api-key-input');
const toggleKeyVisibility = document.getElementById('toggle-key-visibility');
const linkGetKey = document.getElementById('link-get-key');
const lblModel = document.getElementById('lbl-model');
const modelSelect = document.getElementById('model-select');
const testConnBtn = document.getElementById('test-conn-btn');
const testStatus = document.getElementById('test-status');
const saveSettingsBtn = document.getElementById('save-settings-btn');

// View 4 (Add Note View)
const addNoteBackBtn = document.getElementById('add-note-back-btn');
const addNoteTitle = document.getElementById('add-note-title');
const addNoteSubtitle = document.getElementById('add-note-subtitle');
const manualNoteText = document.getElementById('manual-note-text');
const manualNoteSource = document.getElementById('manual-note-source');
const saveManualNoteBtn = document.getElementById('save-manual-note-btn');

// Router
function showView(viewName) {
  currentView = viewName;
  Object.keys(views).forEach(key => {
    if (key === viewName) {
      views[key].classList.add('active');
    } else {
      views[key].classList.remove('active');
    }
  });

  if (viewName === 'tags') {
    renderTags();
  } else if (viewName === 'notes' && activeTag) {
    renderNotesForTag();
  } else if (viewName === 'settings') {
    loadSettingsIntoForm();
  } else if (viewName === 'addNote') {
    manualNoteText.value = '';
    manualNoteSource.value = '';
    saveManualNoteBtn.disabled = false;
    saveManualNoteBtn.textContent = translations[currentLanguage].saveManualNoteBtn;
  }
}

// Translations
function applyLanguage(lang) {
  currentLanguage = lang;
  const t = translations[lang] || translations.en;

  langBtn.textContent = t.langBtn;
  popupSubtitle.textContent = t.subtitle;
  
  // View 1
  tagSearchInput.placeholder = t.searchTags;
  tagsEmptyText.textContent = t.emptyText;
  addNoteBtn.textContent = t.newNoteBtn;

  // View 3
  settingsTitle.textContent = t.settingsTitle;
  settingsSubtitle.textContent = t.settingsSubtitle;
  lblApiKey.textContent = t.apiKeyLabel;
  linkGetKey.textContent = t.apiKeyLabel === 'Gemini API Key' ? 'Get a free key from Google AI Studio' : 'دریافت کلید رایگان از Google AI Studio';
  lblModel.textContent = t.modelLabel;
  testConnBtn.textContent = t.testConnBtn;
  saveSettingsBtn.textContent = t.saveSettingsBtn;

  // View 4
  addNoteTitle.textContent = t.newNoteTitle;
  addNoteSubtitle.textContent = t.newNoteSubtitle;
  manualNoteText.placeholder = t.noteTextPlaceholder;
  manualNoteSource.placeholder = t.noteSourcePlaceholder;
  saveManualNoteBtn.textContent = t.saveManualNoteBtn;

  if (lang === 'fa') {
    popupContainer.classList.add('rtl');
  } else {
    popupContainer.classList.remove('rtl');
  }

  // Refresh active view to redraw translations
  showView(currentView);
}

// Theme
function applyTheme(theme) {
  currentTheme = theme;
  popupContainer.className = `popup-app ${theme} ${currentLanguage === 'fa' ? 'rtl' : ''}`;
}

// Show Toast
function showToast(msg) {
  toastDiv.textContent = msg;
  toastDiv.style.display = 'block';
  setTimeout(() => {
    toastDiv.style.display = 'none';
  }, 2000);
}

// Tag Aggregation
function getAggregatedTags() {
  const tagGroups = {};
  const t = translations[currentLanguage] || translations.en;
  const uncategorizedLabel = t.uncategorized;

  notes.forEach(note => {
    let noteTags = [];
    if (Array.isArray(note.tags) && note.tags.length > 0) {
      noteTags = note.tags;
    } else if (note.category && note.category.trim().length > 0) {
      noteTags = [note.category];
    } else {
      noteTags = [uncategorizedLabel];
    }

    noteTags.forEach(tag => {
      const cleanTag = tag.trim();
      if (!tagGroups[cleanTag]) {
        tagGroups[cleanTag] = [];
      }
      tagGroups[cleanTag].push(note);
    });
  });

  return tagGroups;
}

// Render Tag Cards
function renderTags() {
  tagsGrid.innerHTML = '';
  const searchVal = tagSearchInput.value.toLowerCase().trim();
  const tagGroups = getAggregatedTags();
  
  const sortedTags = Object.keys(tagGroups).sort((a, b) => tagGroups[b].length - tagGroups[a].length);
  const filteredTags = sortedTags.filter(tag => tag.toLowerCase().includes(searchVal));

  if (filteredTags.length === 0) {
    tagsEmptyState.style.display = 'block';
    tagsGrid.style.display = 'none';
    return;
  }

  tagsEmptyState.style.display = 'none';
  tagsGrid.style.display = 'grid';

  const t = translations[currentLanguage];

  filteredTags.forEach(tagName => {
    const noteCount = tagGroups[tagName].length;
    const countText = `${noteCount} ${noteCount === 1 ? t.noteCount : t.notesCount}`;

    const card = document.createElement('div');
    card.className = 'tag-card';
    card.innerHTML = `
      <div class="tag-icon" style="display: flex; align-items: center; height: 20px;">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="16" height="16" fill="none">
          <path d="M50 12 C50 12, 85 45, 85 65 A35 35 0 1 1 15 65 C15 45, 50 12, 50 12 Z" fill="url(#dropGradCard)" />
          <defs>
            <linearGradient id="dropGradCard" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#c084fc" />
              <stop offset="100%" stop-color="#6366f1" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div class="tag-name" title="${tagName}">${tagName}</div>
      <div class="tag-count">${countText}</div>
    `;

    card.addEventListener('click', () => {
      activeTag = tagName;
      showView('notes');
    });

    tagsGrid.appendChild(card);
  });
}

// Render Notes under Active Tag
function renderNotesForTag() {
  notesList.innerHTML = '';
  const tagGroups = getAggregatedTags();
  const tagNotes = tagGroups[activeTag] || [];

  activeTagTitle.innerHTML = `
    <span style="display: inline-flex; align-items: center; gap: 6px;">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="18" height="18" fill="none">
        <path d="M50 12 C50 12, 85 45, 85 65 A35 35 0 1 1 15 65 C15 45, 50 12, 50 12 Z" fill="url(#dropGradActiveTag)" />
        <defs>
          <linearGradient id="dropGradActiveTag" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#c084fc" />
            <stop offset="100%" stop-color="#6366f1" />
          </linearGradient>
        </defs>
      </svg>
      <span>${activeTag}</span>
    </span>
  `;
  const t = translations[currentLanguage];
  activeTagCount.textContent = `${tagNotes.length} ${tagNotes.length === 1 ? t.noteCount : t.notesCount}`;

  // Sort notes by date descending
  tagNotes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  tagNotes.forEach(item => {
    const card = document.createElement('div');
    card.className = 'popup-note-card';

    // Content Text
    const textP = document.createElement('p');
    textP.className = 'popup-note-text';
    textP.textContent = item.note;
    
    // Toggle expand/collapse on text click
    textP.addEventListener('click', () => {
      textP.classList.toggle('expanded');
    });
    card.appendChild(textP);

    // Meta Section
    const metaDiv = document.createElement('div');
    metaDiv.className = 'popup-note-meta';

    // Source link or text
    if (item.sourceUrl) {
      const link = document.createElement('a');
      link.className = 'popup-note-link';
      link.href = item.sourceUrl;
      link.target = '_blank';
      link.textContent = item.source || item.sourceUrl;
      link.title = item.source || item.sourceUrl;
      metaDiv.appendChild(link);
    } else if (item.source) {
      const sourceSpan = document.createElement('span');
      sourceSpan.textContent = item.source;
      sourceSpan.title = item.source;
      sourceSpan.style.maxWidth = '180px';
      sourceSpan.style.overflow = 'hidden';
      sourceSpan.style.textOverflow = 'ellipsis';
      sourceSpan.style.whiteSpace = 'nowrap';
      metaDiv.appendChild(sourceSpan);
    } else {
      const emptySpan = document.createElement('span');
      emptySpan.textContent = t.uncategorized;
      metaDiv.appendChild(emptySpan);
    }

    // Actions (Delete)
    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'popup-note-actions';

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'popup-note-delete';
    deleteBtn.textContent = '🗑️';
    deleteBtn.title = currentLanguage === 'fa' ? 'حذف یادداشت' : 'Delete note';
    deleteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      deleteNote(item.id);
    });
    actionsDiv.appendChild(deleteBtn);
    metaDiv.appendChild(actionsDiv);

    card.appendChild(metaDiv);
    notesList.appendChild(card);
  });
}

// Delete Note
function deleteNote(id) {
  const updatedNotes = notes.filter(n => n.id !== id);
  storage.set({ notes: updatedNotes }, () => {
    notes = updatedNotes;
    showToast(translations[currentLanguage].toastDeleted);
    
    const tagGroups = getAggregatedTags();
    if (!tagGroups[activeTag] || tagGroups[activeTag].length === 0) {
      // If tag is now empty, go back to Tags View
      showView('tags');
    } else {
      renderNotesForTag();
    }
  });
}

// Settings Forms
function loadSettingsIntoForm() {
  storage.get(['geminiApiKey', 'geminiModel'], res => {
    apiKeyInput.value = res.geminiApiKey || '';
    if (res.geminiModel) {
      modelSelect.value = res.geminiModel;
    }
    testStatus.textContent = '';
    testStatus.className = 'status-msg';
  });
}

// Test Gemini Connection
async function testConnection() {
  const key = apiKeyInput.value.trim();
  const model = modelSelect.value;
  const t = translations[currentLanguage];

  if (!key) {
    testStatus.textContent = t.enterKey;
    testStatus.className = 'status-msg error';
    return;
  }

  testStatus.textContent = t.testing;
  testStatus.className = 'status-msg';
  testConnBtn.disabled = true;

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: "Hello. Respond in exactly one word."
          }]
        }]
      })
    });

    if (response.ok) {
      testStatus.textContent = t.testSuccess;
      testStatus.className = 'status-msg success';
    } else {
      const errData = await response.json().catch(() => ({}));
      const msg = errData.error?.message || response.statusText;
      testStatus.textContent = t.testError + msg;
      testStatus.className = 'status-msg error';
    }
  } catch (err) {
    testStatus.textContent = t.testError + err.message;
    testStatus.className = 'status-msg error';
  } finally {
    testConnBtn.disabled = false;
  }
}

// Save Settings
function saveSettings() {
  const key = apiKeyInput.value.trim();
  const model = modelSelect.value;
  
  storage.set({
    geminiApiKey: key,
    geminiModel: model
  }, () => {
    showToast(translations[currentLanguage].toastSaved);
    showView('tags');
  });
}

// AI Tagging for Manual Note
async function requestManualAiTags(text, apiKey, model) {
  const promptText = `Analyze the following text captured by a user.
Generate 1 to 3 relevant tags (topics, categories, or keywords) for this text.
The tags should be simple and concise (1-2 words each) and in the same language as the text (English or Persian/Farsi).
Respond ONLY with a valid JSON array of strings containing the tags, e.g. ["tag1", "tag2"]. Do not include markdown code block formatting, backticks, or any other text outside the JSON array.

Text:
${text}`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: promptText
        }]
      }],
      generationConfig: {
        responseMimeType: "application/json"
      }
    })
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  const data = await response.json();
  const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!rawText) return ["Uncategorized"];

  let tags = [];
  const cleaned = rawText.trim();
  try {
    tags = JSON.parse(cleaned);
  } catch (e) {
    const match = cleaned.match(/\[\s*".*?"\s*(?:,\s*".*?"\s*)*\]/s);
    if (match) {
      try { tags = JSON.parse(match[0]); } catch(inner) {}
    }
  }

  if (!Array.isArray(tags)) {
    tags = cleaned.replace(/[\[\]"]/g, '').split(',').map(t => t.trim()).filter(Boolean);
  }

  tags = tags
    .map(t => typeof t === 'string' ? t.trim() : "")
    .filter(t => t.length > 0 && t.length < 30);

  return tags.length > 0 ? tags : ["Uncategorized"];
}

// Save Manual Note
async function saveManualNote() {
  const text = manualNoteText.value.trim();
  const source = manualNoteSource.value.trim();
  const t = translations[currentLanguage];

  if (!text) return;

  saveManualNoteBtn.disabled = true;
  saveManualNoteBtn.textContent = t.saving;

  storage.get(['geminiApiKey', 'geminiModel', 'notes'], async (res) => {
    const apiKey = res.geminiApiKey;
    const model = res.geminiModel || 'gemini-2.5-flash';
    const currentNotes = res.notes || [];

    let tags = [];
    if (apiKey && apiKey.trim().length > 0) {
      try {
        tags = await requestManualAiTags(text, apiKey, model);
      } catch (err) {
        tags = ["Uncategorized"];
      }
    } else {
      tags = ["Uncategorized"];
    }

    const newNote = {
      id: Date.now(),
      note: text,
      source: source || "Manual Entry",
      sourceUrl: source.startsWith('http') ? source : "",
      tags: tags,
      createdAt: new Date().toISOString()
    };

    const updatedNotes = [newNote, ...currentNotes];
    storage.set({ notes: updatedNotes }, () => {
      notes = updatedNotes;
      showToast(t.toastSaved);
      showView('tags');
    });
  });
}

// Init Setup
function init() {
  // Load Theme
  storage.get('theme', (res) => {
    if (res.theme) {
      applyTheme(res.theme);
    }
  });

  // Load Language
  storage.get('language', (res) => {
    const sysLang = res.language || 'en';
    applyLanguage(sysLang);
  });

  // Load Notes
  storage.get('notes', (res) => {
    notes = res.notes || [];
    renderTags();
  });

  // Sync Storage
  if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.onChanged) {
    chrome.storage.onChanged.addListener((changes) => {
      if (changes.notes) {
        notes = changes.notes.newValue || [];
        if (currentView === 'tags') {
          renderTags();
        } else if (currentView === 'notes') {
          renderNotesForTag();
        }
      }
      if (changes.language) {
        applyLanguage(changes.language.newValue || 'en');
      }
      if (changes.theme) {
        applyTheme(changes.theme.newValue || 'dark');
      }
    });
  }
}

// Event Listeners
langBtn.addEventListener('click', () => {
  const nextLang = currentLanguage === 'en' ? 'fa' : 'en';
  storage.set({ language: nextLang }, () => {
    applyLanguage(nextLang);
  });
});

dashboardBtn.addEventListener('click', () => {
  if (typeof chrome !== 'undefined' && chrome.tabs && chrome.tabs.create) {
    chrome.tabs.create({ url: 'dashboard.html' });
  } else {
    window.open('dashboard.html', '_blank');
  }
});

settingsBtn.addEventListener('click', () => showView('settings'));
addNoteBtn.addEventListener('click', () => showView('addNote'));

notesBackBtn.addEventListener('click', () => showView('tags'));
settingsBackBtn.addEventListener('click', () => showView('tags'));
addNoteBackBtn.addEventListener('click', () => showView('tags'));

// Password toggle
toggleKeyVisibility.addEventListener('click', () => {
  if (apiKeyInput.type === 'password') {
    apiKeyInput.type = 'text';
    toggleKeyVisibility.textContent = '🙈';
  } else {
    apiKeyInput.type = 'password';
    toggleKeyVisibility.textContent = '👁️';
  }
});

testConnBtn.addEventListener('click', testConnection);
saveSettingsBtn.addEventListener('click', saveSettings);
saveManualNoteBtn.addEventListener('click', saveManualNote);

// Dynamic Tag Filter Search
tagSearchInput.addEventListener('input', renderTags);

init();

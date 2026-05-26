const translations = {
  en: {
    subtitle: 'Quick Capture',
    source: 'Source',
    category: 'Category',
    note: 'Write your note...',
    dashboard: 'Dashboard',
    save: 'Save Note',
    toast: 'Saved ✓',
    langBtn: 'فارسی'
  },
  fa: {
    subtitle: 'ثبت سریع یادداشت',
    source: 'منبع',
    category: 'دسته‌بندی',
    note: 'یادداشتت را بنویس...',
    dashboard: 'داشبورد',
    save: 'ذخیره یادداشت',
    toast: 'ذخیره شد ✓',
    langBtn: 'EN'
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

// UI Elements
const popupContainer = document.getElementById('popup-container');
const popupSubtitle = document.getElementById('popup-subtitle');
const langBtn = document.getElementById('lang-btn');
const sourceInput = document.getElementById('popup-source');
const categoryInput = document.getElementById('popup-category');
const noteTextarea = document.getElementById('popup-note');
const dashboardBtn = document.getElementById('dashboard-btn');
const saveBtn = document.getElementById('save-btn');
const toastDiv = document.getElementById('toast');

// State
let currentLanguage = 'en';
let currentTheme = 'dark';
let notes = [];

// Apply Language & Translations
function applyLanguage(lang) {
  currentLanguage = lang;
  const t = translations[lang] || translations.en;
  
  popupSubtitle.textContent = t.subtitle;
  langBtn.textContent = t.langBtn;
  sourceInput.placeholder = t.source;
  categoryInput.placeholder = t.category;
  noteTextarea.placeholder = t.note;
  dashboardBtn.textContent = t.dashboard;
  saveBtn.textContent = t.save;
  toastDiv.textContent = t.toast;

  if (lang === 'fa') {
    popupContainer.classList.add('rtl');
  } else {
    popupContainer.classList.remove('rtl');
  }
}

// Apply Theme
function applyTheme(theme) {
  currentTheme = theme;
  popupContainer.className = `popup-app ${theme} ${currentLanguage === 'fa' ? 'rtl' : ''}`;
}

// Show Toast Notification
function showToast() {
  toastDiv.style.display = 'block';
  setTimeout(() => {
    toastDiv.style.display = 'none';
  }, 2000);
}

// Initial Load
function init() {
  // Load Theme
  storage.get('theme', (res) => {
    if (res.theme) {
      applyTheme(res.theme);
    }
  });

  // Load Language
  storage.get('language', (res) => {
    if (res.language) {
      applyLanguage(res.language);
    } else {
      applyLanguage('en');
    }
  });

  // Load Notes
  storage.get('notes', (res) => {
    notes = res.notes || [];
  });

  // Handle Context Menu (pendingCapture)
  storage.get('pendingCapture', (res) => {
    if (res.pendingCapture) {
      noteTextarea.value = res.pendingCapture.selectedText || '';
      sourceInput.value = res.pendingCapture.pageTitle || '';
      // Clear pendingCapture since we consumed it
      storage.set({ pendingCapture: null });
    }
  });
}

// Toggle Language
langBtn.addEventListener('click', () => {
  const nextLang = currentLanguage === 'en' ? 'fa' : 'en';
  applyLanguage(nextLang);
  storage.set({ language: nextLang });
});

// Open Dashboard
dashboardBtn.addEventListener('click', () => {
  if (typeof chrome !== 'undefined' && chrome.tabs && chrome.tabs.create) {
    chrome.tabs.create({ url: 'dashboard.html' });
  } else {
    window.open('dashboard.html', '_blank');
  }
});

// Save Note
saveBtn.addEventListener('click', () => {
  const noteText = noteTextarea.value.trim();
  if (!noteText) return;

  const newNote = {
    id: Date.now(),
    source: sourceInput.value.trim(),
    category: categoryInput.value.trim(),
    note: noteText,
    createdAt: new Date().toISOString()
  };

  // Reload notes first to make sure we don't overwrite concurrently saved notes
  storage.get('notes', (res) => {
    const currentNotes = res.notes || [];
    const updatedNotes = [newNote, ...currentNotes];
    
    storage.set({ notes: updatedNotes }, () => {
      notes = updatedNotes;
      sourceInput.value = '';
      categoryInput.value = '';
      noteTextarea.value = '';
      showToast();
    });
  });
});

init();

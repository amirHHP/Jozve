const translations = {
  en: {
    subtitle: 'Your knowledge workspace',
    all: 'All Notes',
    recent: 'Recent',
    sources: 'Sources',
    categories: 'Tags',
    search: 'Search notes...',
    emptyTitle: 'No notes yet ✨',
    emptyText: 'Start capturing ideas with DropIt',
    source: 'Source',
    category: 'Tag',
    noSource: 'No source',
    noCategory: 'Untagged',
    edit: 'Edit',
    delete: 'Delete',
    notesSaved: 'notes saved',
    noteSaved: 'note saved',
    takeNote: 'Take a note...',
    close: 'Close',
    save: 'Save Note',
    update: 'Update Note',
    note: 'Write your note...',
    allSources: 'All Sources',
    allCategories: 'All Categories',
    showAllSources: 'Show all sources',
    showAllCategories: 'Show all categories',
    savedSuccess: 'Saved ✓',
    searchBtn: 'Search',
    newNotePlaceholder: 'Take a note...',
  },
  fa: {
    subtitle: 'فضای کاری دانش شما',
    all: 'همه یادداشت‌ها',
    recent: 'اخیر',
    sources: 'منابع',
    categories: 'تگ‌ها',
    search: 'جستجو در یادداشت‌ها...',
    emptyTitle: 'هنوز یادداشتی نداری ✨',
    emptyText: 'شروع کن به ذخیره ایده‌ها با DropIt',
    source: 'منبع',
    category: 'تگ',
    noSource: 'بدون منبع',
    noCategory: 'بدون تگ',
    edit: 'ویرایش',
    delete: 'حذف',
    notesSaved: 'یادداشت ذخیره شده',
    noteSaved: 'یادداشت ذخیره شده',
    takeNote: 'یادداشت جدید...',
    close: 'بستن',
    save: 'ذخیره یادداشت',
    update: 'ویرایش یادداشت',
    note: 'یادداشتت را بنویس...',
    allSources: 'همه منابع',
    allCategories: 'همه دسته‌ها',
    showAllSources: 'نمایش همه منابع',
    showAllCategories: 'نمایش همه دسته‌ها',
    savedSuccess: 'ذخیره شد ✓',
    searchBtn: 'جستجو',
    newNotePlaceholder: 'یادداشت جدید...',
  }
};

function isPersianText(text) {
  if (!text) return false;
  const persianRegex = /[\u0600-\u06FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
  return persianRegex.test(text);
}

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
let language = 'en';
let theme = 'dark';
let notes = [];
let filteredNotes = [];
let currentFilter = { type: 'all' }; // all, recent, source, category
let currentFilterValue = null;
let editingId = null;
let selectedNote = null;
let filterModalType = 'sources'; // sources, categories
let filterModalSearchQuery = '';

// UI Elements
const dashboardContainer = document.getElementById('dashboard-container');
const sidebar = document.getElementById('sidebar');
const brandTitle = document.getElementById('brand-title');
const brandSubtitle = document.getElementById('brand-subtitle');
const langToggleBtn = document.getElementById('lang-toggle-btn');
const langSpanEn = document.getElementById('lang-span-en');
const langSpanFa = document.getElementById('lang-span-fa');
const themeToggleBtn = document.getElementById('theme-toggle-btn');
const navAllBtn = document.getElementById('nav-all-btn');
const navRecentBtn = document.getElementById('nav-recent-btn');
const sourcesSecTitle = document.getElementById('sources-sec-title');
const categoriesSecTitle = document.getElementById('categories-sec-title');
const sourcesList = document.getElementById('sources-list');
const categoriesList = document.getElementById('categories-list');

const dashboardHeaderTitle = document.getElementById('dashboard-header-title');
const notesCountLabel = document.getElementById('notes-count-label');
const searchInput = document.getElementById('search-input');
const quickAddBtn = document.getElementById('quick-add-btn');

// Composer elements
const composerCard = document.getElementById('composer-card');
const composerCollapsedBtn = document.getElementById('composer-collapsed-btn');
const composerExpandedView = document.getElementById('composer-expanded-view');
const composerSource = document.getElementById('composer-source');
const composerCategory = document.getElementById('composer-category');
const composerNote = document.getElementById('composer-note');
const composerCancelBtn = document.getElementById('composer-cancel-btn');
const composerSaveBtn = document.getElementById('composer-save-btn');

const cardsGrid = document.getElementById('cards-grid');

// Note detail modal elements
const noteModalOverlay = document.getElementById('note-modal-overlay');
const modalSourceLabel = document.getElementById('modal-source-label');
const modalSourceVal = document.getElementById('modal-source-val');
const modalCategoryVal = document.getElementById('modal-category-val');
const modalNoteContent = document.getElementById('modal-note-content');
const modalTimestampVal = document.getElementById('modal-timestamp-val');
const modalEditBtn = document.getElementById('modal-edit-btn');
const modalDeleteBtn = document.getElementById('modal-delete-btn');
const modalCloseBtn = document.getElementById('modal-close-btn');

// Filter modal elements
const filterModalOverlay = document.getElementById('filter-modal-overlay');
const filterModalTitle = document.getElementById('filter-modal-title');
const filterModalSearch = document.getElementById('filter-modal-search');
const filterModalList = document.getElementById('filter-modal-list');
const filterModalCloseBtn = document.getElementById('filter-modal-close-btn');

// Helper to translate text
const getTranslation = (key) => {
  return translations[language][key] || translations.en[key] || key;
};

// UI translation updater
function updateUI() {
  brandSubtitle.textContent = getTranslation('subtitle');
  navAllBtn.textContent = getTranslation('all');
  navRecentBtn.textContent = getTranslation('recent');
  sourcesSecTitle.textContent = getTranslation('sources');
  categoriesSecTitle.textContent = getTranslation('categories');
  dashboardHeaderTitle.textContent = language === 'fa' ? 'داشبورد DropIt' : 'DropIt Dashboard';
  searchInput.placeholder = getTranslation('search');
  quickAddBtn.textContent = language === 'fa' ? '＋ یادداشت' : '+ Note';
  composerCollapsedBtn.textContent = getTranslation('takeNote');
  composerSource.placeholder = getTranslation('source');
  composerCategory.placeholder = getTranslation('category');
  composerNote.placeholder = getTranslation('note');
  composerCancelBtn.textContent = getTranslation('close');
  composerSaveBtn.textContent = editingId ? getTranslation('update') : getTranslation('save');
  modalSourceLabel.textContent = getTranslation('source');
  modalEditBtn.textContent = getTranslation('edit');
  modalDeleteBtn.textContent = getTranslation('delete');
  filterModalSearch.placeholder = language === 'fa' ? 'جستجو...' : 'Search...';

  // Toggle buttons language highlight
  if (language === 'fa') {
    langSpanFa.classList.add('active');
    langSpanEn.classList.remove('active');
    dashboardContainer.classList.add('rtl');
  } else {
    langSpanEn.classList.add('active');
    langSpanFa.classList.remove('active');
    dashboardContainer.classList.remove('rtl');
  }

  // Header notes count
  const count = notes.length;
  const countText = count + ' ' + (count === 1 ? getTranslation('noteSaved') : getTranslation('notesSaved'));
  notesCountLabel.textContent = countText;
}

// Apply theme class
function applyTheme(t) {
  theme = t;
  themeToggleBtn.textContent = theme === 'dark' ? '☀️' : '🌙';
  if (theme === 'light') {
    dashboardContainer.classList.add('light');
  } else {
    dashboardContainer.classList.remove('light');
  }
}

// Group notes by source
function getGroupedSources() {
  const noSourceLabel = getTranslation('noSource');
  return notes.reduce((acc, n) => {
    const src = n.source || noSourceLabel;
    acc[src] = acc[src] || [];
    acc[src].push(n);
    return acc;
  }, {});
}

// Group notes by tags (supporting multiple tags array with legacy category fallback)
function getGroupedCategories() {
  const noCategoryLabel = getTranslation('noCategory');
  const groups = {};
  notes.forEach(n => {
    let noteTags = [];
    if (Array.isArray(n.tags) && n.tags.length > 0) {
      noteTags = n.tags;
    } else if (n.category && n.category.trim().length > 0) {
      noteTags = [n.category];
    } else {
      noteTags = [noCategoryLabel];
    }

    noteTags.forEach(tag => {
      const cleanTag = tag.trim();
      groups[cleanTag] = groups[cleanTag] || [];
      groups[cleanTag].push(n);
    });
  });
  return groups;
}

// Render the sidebar filters
function renderSidebarFilters() {
  sourcesList.innerHTML = '';
  categoriesList.innerHTML = '';

  const groupedSources = getGroupedSources();
  const sortedSources = Object.entries(groupedSources).sort((a, b) => b[1].length - a[1].length);

  const groupedCategories = getGroupedCategories();
  const sortedCategories = Object.entries(groupedCategories).sort((a, b) => b[1].length - a[1].length);

  // Render top 5 sources
  sortedSources.slice(0, 5).forEach(([name, items]) => {
    const btn = createSidebarItemButton('sources', name, items.length);
    sourcesList.appendChild(btn);
  });

  // Render Show All Sources button if count > 5
  if (sortedSources.length > 5) {
    const showAllBtn = document.createElement('button');
    showAllBtn.className = 'show-all-btn';
    showAllBtn.textContent = getTranslation('showAllSources');
    showAllBtn.addEventListener('click', () => openFilterModal('sources'));
    sourcesList.appendChild(showAllBtn);
  }

  // Render top 5 categories
  sortedCategories.slice(0, 5).forEach(([name, items]) => {
    const btn = createSidebarItemButton('categories', name, items.length);
    categoriesList.appendChild(btn);
  });

  // Render Show All Categories button if count > 5
  if (sortedCategories.length > 5) {
    const showAllBtn = document.createElement('button');
    showAllBtn.className = 'show-all-btn';
    showAllBtn.textContent = getTranslation('showAllCategories');
    showAllBtn.addEventListener('click', () => openFilterModal('categories'));
    categoriesList.appendChild(showAllBtn);
  }
}

// Helper to create filter buttons with edit/delete icons
function createSidebarItemButton(type, name, count) {
  const container = document.createElement('button');
  container.className = 'sidebar-filter';
  if (currentFilter.type === type && currentFilterValue === name) {
    container.classList.add('active');
  }

  container.addEventListener('click', () => {
    setFilter(type, name);
  });

  const labelSpan = document.createElement('span');
  labelSpan.className = 'truncate-label';
  labelSpan.style.display = 'inline-flex';
  labelSpan.style.alignItems = 'center';
  labelSpan.style.gap = '6px';
  if (type === 'categories') {
    labelSpan.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="10" height="10" fill="none" style="flex-shrink:0;">
        <path d="M50 12 C50 12, 85 45, 85 65 A35 35 0 1 1 15 65 C15 45, 50 12, 50 12 Z" fill="currentColor" />
      </svg>
      <span>${name}</span>
    `;
  } else {
    labelSpan.textContent = name;
  }
  container.appendChild(labelSpan);

  const actionsDiv = document.createElement('div');
  actionsDiv.className = 'sidebar-item-actions';

  const editBtn = document.createElement('button');
  editBtn.className = 'mini-icon-btn';
  editBtn.textContent = '✏️';
  editBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    renameGroup(type, name);
  });
  actionsDiv.appendChild(editBtn);

  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'mini-icon-btn';
  deleteBtn.textContent = '🗑';
  deleteBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    clearGroup(type, name);
  });
  actionsDiv.appendChild(deleteBtn);

  const countSpan = document.createElement('span');
  countSpan.textContent = count;
  actionsDiv.appendChild(countSpan);

  container.appendChild(actionsDiv);
  return container;
}

// Filter notes selection logic
function setFilter(type, value = null) {
  currentFilter = { type };
  currentFilterValue = value;

  // Update active states on sidebar main navigation buttons
  navAllBtn.classList.remove('active');
  navRecentBtn.classList.remove('active');
  if (type === 'all') navAllBtn.classList.add('active');
  if (type === 'recent') navRecentBtn.classList.add('active');

  applyNotesFiltering();
}

// Refresh cards grid & list rendering
function applyNotesFiltering() {
  const query = searchInput.value.toLowerCase().trim();
  let baseNotes = [...notes];

  // Apply Sidebar Filter
  if (currentFilter.type === 'recent') {
    baseNotes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    baseNotes = baseNotes.slice(0, 10);
  } else if (currentFilter.type === 'sources') {
    const noSourceLabel = getTranslation('noSource');
    baseNotes = baseNotes.filter(n => (n.source || noSourceLabel) === currentFilterValue);
  } else if (currentFilter.type === 'categories') {
    const noCategoryLabel = getTranslation('noCategory');
    baseNotes = baseNotes.filter(n => {
      let noteTags = [];
      if (Array.isArray(n.tags) && n.tags.length > 0) {
        noteTags = n.tags;
      } else if (n.category && n.category.trim().length > 0) {
        noteTags = [n.category];
      } else {
        noteTags = [noCategoryLabel];
      }
      return noteTags.some(t => t.trim() === currentFilterValue);
    });
  }

  // Apply Search Query Filter
  if (query) {
    baseNotes = baseNotes.filter(n => 
      (n.note || '').toLowerCase().includes(query) ||
      (n.source || '').toLowerCase().includes(query) ||
      (n.category || '').toLowerCase().includes(query) ||
      (Array.isArray(n.tags) && n.tags.some(t => t.toLowerCase().includes(query)))
    );
  }

  // Sort notes by date descending
  baseNotes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  filteredNotes = baseNotes;

  renderNotesGrid();
  renderSidebarFilters();
}

// Render dynamic grid cards
function renderNotesGrid() {
  cardsGrid.innerHTML = '';

  if (filteredNotes.length === 0) {
    const emptyDiv = document.createElement('div');
    emptyDiv.className = 'empty-state';
    emptyDiv.innerHTML = `
      <div class="empty-icon">✨</div>
      <h3>${getTranslation('emptyTitle')}</h3>
      <p>${getTranslation('emptyText')}</p>
    `;
    cardsGrid.appendChild(emptyDiv);
    return;
  }

  filteredNotes.forEach(item => {
    const card = document.createElement('div');
    card.className = 'card';
    card.addEventListener('click', () => {
      openDetailModal(item);
    });

    const header = document.createElement('div');
    header.className = 'card-header';

    const sourceDiv = document.createElement('div');
    sourceDiv.className = 'card-source';
    sourceDiv.innerHTML = `
      <span class="card-label">${getTranslation('source')}</span>
      <span class="source-value">${item.source || getTranslation('noSource')}</span>
    `;
    header.appendChild(sourceDiv);

    const tagsContainer = document.createElement('div');
    tagsContainer.className = 'card-tags-container';
    tagsContainer.style.display = 'flex';
    tagsContainer.style.flexWrap = 'wrap';
    tagsContainer.style.gap = '6px';

    let noteTags = [];
    if (Array.isArray(item.tags) && item.tags.length > 0) {
      noteTags = item.tags;
    } else if (item.category && item.category.trim().length > 0) {
      noteTags = [item.category];
    } else {
      noteTags = [getTranslation('noCategory')];
    }

    noteTags.forEach(tag => {
      const pill = document.createElement('div');
      pill.className = 'category-pill';
      pill.textContent = tag;
      tagsContainer.appendChild(pill);
    });
    header.appendChild(tagsContainer);

    card.appendChild(header);

    const body = document.createElement('div');
    body.className = 'card-body';
    const noteText = document.createElement('p');
    noteText.className = 'note-content';
    noteText.textContent = item.note;
    
    if (isPersianText(item.note)) {
      noteText.dir = 'rtl';
      noteText.style.textAlign = 'right';
      noteText.style.fontFamily = 'var(--font-fa)';
    } else {
      noteText.dir = 'ltr';
      noteText.style.textAlign = 'left';
      noteText.style.fontFamily = 'var(--font-en)';
    }
    
    body.appendChild(noteText);
    card.appendChild(body);

    const footer = document.createElement('div');
    footer.className = 'card-footer';

    const dateStr = item.createdAt ? new Date(item.createdAt).toLocaleString() : '';
    const dateSpan = document.createElement('span');
    dateSpan.className = 'timestamp';
    dateSpan.textContent = dateStr;
    footer.appendChild(dateSpan);

    const actions = document.createElement('div');
    actions.className = 'card-actions';

    const editBtn = document.createElement('button');
    editBtn.className = 'ghost-btn';
    editBtn.textContent = getTranslation('edit');
    editBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      startEditingNote(item);
    });
    actions.appendChild(editBtn);

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'danger-btn';
    deleteBtn.textContent = getTranslation('delete');
    deleteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      deleteNote(item.id);
    });
    actions.appendChild(deleteBtn);

    footer.appendChild(actions);
    card.appendChild(footer);

    cardsGrid.appendChild(card);
  });
}

// Composer control functions
function closeComposer() {
  composerExpandedView.style.display = 'none';
  composerCollapsedBtn.style.display = 'block';
  composerSource.value = '';
  composerCategory.value = '';
  composerNote.value = '';
  composerNote.removeAttribute('dir');
  composerNote.style.textAlign = '';
  composerNote.style.fontFamily = '';
  editingId = null;
  updateUI();
}

function openComposer() {
  composerCollapsedBtn.style.display = 'none';
  composerExpandedView.style.display = 'flex';
  composerNote.focus();
}

function startEditingNote(item) {
  editingId = item.id;
  composerSource.value = item.source || '';
  
  let noteTags = [];
  if (Array.isArray(item.tags) && item.tags.length > 0) {
    noteTags = item.tags;
  } else if (item.category && item.category.trim().length > 0) {
    noteTags = [item.category];
  }
  composerCategory.value = noteTags.join(', ');
  
  composerNote.value = item.note || '';
  if (isPersianText(item.note)) {
    composerNote.dir = 'rtl';
    composerNote.style.textAlign = 'right';
    composerNote.style.fontFamily = 'var(--font-fa)';
  } else {
    composerNote.dir = 'ltr';
    composerNote.style.textAlign = 'left';
    composerNote.style.fontFamily = 'var(--font-en)';
  }
  openComposer();
  updateUI();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Save/Update note
function saveNote() {
  const noteText = composerNote.value.trim();
  if (!noteText) return;

  const srcText = composerSource.value.trim();
  const catText = composerCategory.value.trim();
  const tagsArray = catText.split(',')
    .map(t => t.trim())
    .filter(t => t.length > 0);

  if (editingId) {
    notes = notes.map(n => n.id === editingId ? { ...n, source: srcText, tags: tagsArray, category: tagsArray[0] || '', note: noteText } : n);
  } else {
    notes.unshift({
      id: Date.now(),
      source: srcText,
      tags: tagsArray,
      category: tagsArray[0] || '',
      note: noteText,
      createdAt: new Date().toISOString()
    });
  }

  storage.set({ notes }, () => {
    closeComposer();
    applyNotesFiltering();
  });
}

// Delete individual note
function deleteNote(id) {
  notes = notes.filter(n => n.id !== id);
  storage.set({ notes }, () => {
    applyNotesFiltering();
  });
}

// Rename Group (source or tag)
function renameGroup(type, oldName) {
  const promptMsg = language === 'fa' 
    ? (type === 'sources' ? 'نام جدید منبع:' : 'نام جدید تگ:')
    : (type === 'sources' ? 'New source name:' : 'New tag name:');
    
  const next = prompt(promptMsg, oldName);
  if (!next || !next.trim()) return;

  const nextName = next.trim();

  if (type === 'sources') {
    const noSourceLabel = getTranslation('noSource');
    notes = notes.map(n => {
      const match = (n.source || noSourceLabel) === oldName;
      return match ? { ...n, source: nextName } : n;
    });
  } else {
    const noCategoryLabel = getTranslation('noCategory');
    notes = notes.map(n => {
      let noteTags = [];
      if (Array.isArray(n.tags) && n.tags.length > 0) {
        noteTags = n.tags;
      } else if (n.category && n.category.trim().length > 0) {
        noteTags = [n.category];
      } else {
        noteTags = [noCategoryLabel];
      }

      const nextTags = noteTags.map(t => t.trim() === oldName ? nextName : t);
      return { ...n, tags: nextTags, category: nextTags[0] || '' };
    });
  }

  storage.set({ notes }, () => {
    if (currentFilter.type === type && currentFilterValue === oldName) {
      currentFilterValue = nextName;
    }
    applyNotesFiltering();
  });
}

// Clear Group (remove tag from note tags list)
function clearGroup(type, oldName) {
  if (type === 'sources') {
    const noSourceLabel = getTranslation('noSource');
    notes = notes.map(n => {
      const match = (n.source || noSourceLabel) === oldName;
      return match ? { ...n, source: '' } : n;
    });
  } else {
    const noCategoryLabel = getTranslation('noCategory');
    notes = notes.map(n => {
      let noteTags = [];
      if (Array.isArray(n.tags) && n.tags.length > 0) {
        noteTags = n.tags;
      } else if (n.category && n.category.trim().length > 0) {
        noteTags = [n.category];
      } else {
        noteTags = [noCategoryLabel];
      }

      const nextTags = noteTags.filter(t => t.trim() !== oldName);
      return { ...n, tags: nextTags, category: nextTags[0] || '' };
    });
  }

  storage.set({ notes }, () => {
    if (currentFilter.type === type && currentFilterValue === oldName) {
      currentFilter.type = 'all';
      currentFilterValue = null;
    }
    applyNotesFiltering();
  });
}

// Detail Modal Management
function openDetailModal(item) {
  selectedNote = item;
  modalSourceVal.textContent = item.source || getTranslation('noSource');
  
  let noteTags = [];
  if (Array.isArray(item.tags) && item.tags.length > 0) {
    noteTags = item.tags;
  } else if (item.category && item.category.trim().length > 0) {
    noteTags = [item.category];
  } else {
    noteTags = [getTranslation('noCategory')];
  }
  modalCategoryVal.textContent = noteTags.join(', ');
  
  modalNoteContent.textContent = item.note;
  if (isPersianText(item.note)) {
    modalNoteContent.dir = 'rtl';
    modalNoteContent.style.textAlign = 'right';
    modalNoteContent.style.fontFamily = 'var(--font-fa)';
  } else {
    modalNoteContent.dir = 'ltr';
    modalNoteContent.style.textAlign = 'left';
    modalNoteContent.style.fontFamily = 'var(--font-en)';
  }
  modalTimestampVal.textContent = item.createdAt ? new Date(item.createdAt).toLocaleString() : '';
  noteModalOverlay.style.display = 'flex';
}

function closeDetailModal() {
  selectedNote = null;
  noteModalOverlay.style.display = 'none';
}

// Filter modal (Show All) Management
function openFilterModal(type) {
  filterModalType = type;
  filterModalSearchQuery = '';
  filterModalSearch.value = '';
  
  if (type === 'sources') {
    filterModalTitle.textContent = getTranslation('allSources');
  } else {
    filterModalTitle.textContent = getTranslation('allCategories');
  }

  renderFilterModalList();
  filterModalOverlay.style.display = 'flex';
  filterModalSearch.focus();
}

function closeFilterModal() {
  filterModalOverlay.style.display = 'none';
}

function renderFilterModalList() {
  filterModalList.innerHTML = '';
  
  const entries = filterModalType === 'sources' ? Object.entries(getGroupedSources()) : Object.entries(getGroupedCategories());
  const query = filterModalSearchQuery.toLowerCase().trim();

  const filteredEntries = entries.filter(([name]) => 
    name.toLowerCase().includes(query)
  );

  filteredEntries.forEach(([name, items]) => {
    const btn = document.createElement('button');
    btn.className = 'sidebar-filter';
    btn.innerHTML = `<span>${name}</span><span>${items.length}</span>`;
    btn.addEventListener('click', () => {
      setFilter(filterModalType, name);
      closeFilterModal();
    });
    filterModalList.appendChild(btn);
  });
}

// Init Function
function init() {
  // Load Theme
  storage.get('theme', (res) => {
    applyTheme(res.theme || 'dark');
  });

  // Load Language
  storage.get('language', (res) => {
    language = res.language || 'en';
    updateUI();
    applyNotesFiltering();
  });

  // Load Notes
  storage.get('notes', (res) => {
    notes = res.notes || [];
    applyNotesFiltering();
  });

  // Listener to dynamic changes from background or popup
  if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.onChanged) {
    chrome.storage.onChanged.addListener((changes) => {
      if (changes.notes) {
        notes = changes.notes.newValue || [];
        applyNotesFiltering();
      }
      if (changes.language) {
        language = changes.language.newValue || 'en';
        updateUI();
        applyNotesFiltering();
      }
      if (changes.theme) {
        applyTheme(changes.theme.newValue || 'dark');
      }
    });
  }
}

// Global Event Listeners
langToggleBtn.addEventListener('click', () => {
  const nextLang = language === 'en' ? 'fa' : 'en';
  language = nextLang;
  storage.set({ language: nextLang }, () => {
    updateUI();
    applyNotesFiltering();
  });
});

themeToggleBtn.addEventListener('click', () => {
  const nextTheme = theme === 'dark' ? 'light' : 'dark';
  applyTheme(nextTheme);
  storage.set({ theme: nextTheme });
});

navAllBtn.addEventListener('click', () => setFilter('all'));
navRecentBtn.addEventListener('click', () => setFilter('recent'));

searchInput.addEventListener('input', () => {
  applyNotesFiltering();
});

quickAddBtn.addEventListener('click', () => {
  openComposer();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

composerCollapsedBtn.addEventListener('click', openComposer);
composerCancelBtn.addEventListener('click', closeComposer);
composerSaveBtn.addEventListener('click', saveNote);

// Dynamic direction for composer textarea based on text content
composerNote.addEventListener('input', () => {
  if (isPersianText(composerNote.value)) {
    composerNote.dir = 'rtl';
    composerNote.style.textAlign = 'right';
    composerNote.style.fontFamily = 'var(--font-fa)';
  } else {
    composerNote.dir = 'ltr';
    composerNote.style.textAlign = 'left';
    composerNote.style.fontFamily = 'var(--font-en)';
  }
});

// Close modals triggers
modalCloseBtn.addEventListener('click', closeDetailModal);
noteModalOverlay.addEventListener('click', (e) => {
  if (e.target === noteModalOverlay) closeDetailModal();
});

filterModalCloseBtn.addEventListener('click', closeFilterModal);
filterModalOverlay.addEventListener('click', (e) => {
  if (e.target === filterModalOverlay) closeFilterModal();
});

filterModalSearch.addEventListener('input', (e) => {
  filterModalSearchQuery = e.target.value;
  renderFilterModalList();
});

// Edit/Delete within Detail Modal
modalEditBtn.addEventListener('click', () => {
  if (selectedNote) {
    const noteToEdit = selectedNote;
    closeDetailModal();
    startEditingNote(noteToEdit);
  }
});

modalDeleteBtn.addEventListener('click', () => {
  if (selectedNote) {
    deleteNote(selectedNote.id);
    closeDetailModal();
  }
});

init();

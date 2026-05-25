import { useEffect, useState } from 'react';
import './App.css';

const isDashboard = new URLSearchParams(window.location.search).get('dashboard') === '1';

function getStorage() {
  if (typeof chrome !== 'undefined' && chrome.storage?.local) {
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
const translations = {
  en: { search:'Search notes...', searchBtn:'Search', source:'Source', category:'Category', note:'Write your note...', save:'Save Note', update:'Update Note', all:'All Notes', sources:'Sources', categories:'Categories', noSource:'No source', noCategory:'No category', edit:'Edit', delete:'Delete', openDashboard:'Open Dashboard', subtitle:'Your knowledge workspace' },
  fa: { search:'جستجو در یادداشت‌ها...', searchBtn:'جستجو', source:'منبع', category:'دسته‌بندی', note:'یادداشتت را بنویس...', save:'ذخیره یادداشت', update:'ویرایش یادداشت', all:'همه یادداشت‌ها', sources:'منابع', categories:'دسته‌بندی‌ها', noSource:'بدون منبع', noCategory:'بدون دسته‌بندی', edit:'ویرایش', delete:'حذف', openDashboard:'باز کردن داشبورد', subtitle:'فضای کاری دانش شما' }
};

export default function App() {
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [source, setSource] = useState('');
  const [category, setCategory] = useState('');
  const [note, setNote] = useState('');
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState('all');
  const [editingId, setEditingId] = useState(null);
  const [language, setLanguage] = useState('en');
  const [showToast, setShowToast] = useState(false);
  const [composerOpen, setComposerOpen] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [showFilterModal, setShowFilterModal] =
  useState(false);

const [filterModalType, setFilterModalType] =
  useState('sources');

const [filterSearch, setFilterSearch] =
  useState('');
  const [sidebarCollapsed, setSidebarCollapsed] =
  useState(false);
  const [selectedNote, setSelectedNote] =
  useState(null);
  const t = translations[language] || translations.en;

  useEffect(() => {
    storage.get('notes', (r) => { const saved = r.notes || []; setNotes(saved); setFilteredNotes(saved); });
    storage.get('language', (r) => r.language && setLanguage(r.language));
    storage.get('theme', (r) => {
      if (r.theme) setTheme(r.theme);
    });
    storage.get('pendingCapture', (r) => {
      if (r.pendingCapture && !isDashboard) {
        setNote(r.pendingCapture.selectedText || '');
        setSource(r.pendingCapture.pageTitle || '');
        storage.set({ pendingCapture: null });
      }
    });
  }, []);

  const persist = (updated) => storage.set({ notes: updated }, () => { setNotes(updated); setFilteredNotes(updated); });
  const runSearch = () => {
    const q = search.toLowerCase().trim();
    if (!q) return setFilteredNotes(notes);
    setFilteredNotes(notes.filter(n => [n.note,n.source,n.category].some(v => (v||'').toLowerCase().includes(q))));
  };
  const saveNote = () => {
    if (!note.trim()) return;
    const updated = editingId
      ? notes.map(n => n.id === editingId ? { ...n, source, category, note } : n)
      : [{ id: Date.now(), source, category, note, createdAt: new Date().toISOString() }, ...notes];
    persist(updated); setEditingId(null); setSource(''); setCategory(''); setNote(''); setShowToast(true); setTimeout(()=>setShowToast(false),2000);
  };
  const deleteNote = (id) => persist(notes.filter(n => n.id !== id));
  const renameSource = (oldSource) => {
    const next = prompt(
      language === 'fa'
        ? 'نام جدید منبع:'
        : 'New source name:',
      oldSource
    );
  
    if (!next || !next.trim()) return;
  
    const updated = notes.map((note) =>
      note.source === oldSource
        ? {
            ...note,
            source: next.trim(),
          }
        : note
    );
  
    setNotes(updated);
    setFilteredNotes(updated);
    storage.set({ notes: updated });
  };
  
  const clearSource = (targetSource) => {
    const updated = notes.map((note) =>
      note.source === targetSource
        ? {
            ...note,
            source: '',
          }
        : note
    );
  
    setNotes(updated);
    setFilteredNotes(updated);
    storage.set({ notes: updated });
  };
  
  const renameCategory = (oldCategory) => {
    const next = prompt(
      language === 'fa'
        ? 'نام جدید دسته‌بندی:'
        : 'New category name:',
      oldCategory
    );
  
    if (!next || !next.trim()) return;
  
    const updated = notes.map((note) =>
      note.category === oldCategory
        ? {
            ...note,
            category: next.trim(),
          }
        : note
    );
  
    setNotes(updated);
    setFilteredNotes(updated);
    storage.set({ notes: updated });
  };
  
  const clearCategory = (targetCategory) => {
    const updated = notes.map((note) =>
      note.category === targetCategory
        ? {
            ...note,
            category: '',
          }
        : note
    );
  
    setNotes(updated);
    setFilteredNotes(updated);
    storage.set({ notes: updated });
  };
  const editNote = (item) => {
    setSource(item.source || '');
    setCategory(item.category || '');
    setNote(item.note || '');
    setEditingId(item.id);
  
    if (isDashboard) {
      setComposerOpen(true);
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    } else {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  };
  const toggleLang = () => { const nl = language === 'en' ? 'fa' : 'en'; setLanguage(nl); storage.set({ language:nl }); };
  const toggleTheme = () => {
    const next =
      theme === 'dark'
        ? 'light'
        : 'dark';
  
    setTheme(next);
    storage.set({ theme: next });
  };
  const groupedBySource = notes.reduce(
    (a, n) => (
      (a[n.source || t.noSource] ||= []).push(n),
      a
    ),
    {}
  );
  
  const groupedByCategory = notes.reduce(
    (a, n) => (
      (a[n.category || t.noCategory] ||= []).push(n),
      a
    ),
    {}
  );
  
  const sourceEntries = Object.entries(groupedBySource)
  .sort((a, b) => b[1].length - a[1].length);
  
  const categoryEntries = Object.entries(groupedByCategory)
  .sort((a, b) => b[1].length - a[1].length);
    const modalEntries =
  filterModalType === 'sources'
    ? Object.entries(groupedBySource)
    : Object.entries(groupedByCategory);

const filteredModalEntries =
  modalEntries.filter(([name]) =>
    name
      .toLowerCase()
      .includes(filterSearch.toLowerCase())
  );



  const sortedNotes = [...filteredNotes].sort(
    (a, b) =>
      new Date(b.createdAt) -
      new Date(a.createdAt)
  );
  const openDashboard = () => window.open(`${window.location.origin}${window.location.pathname}?dashboard=1`, '_blank');

  const renderCard = (item) => (
    <div
  key={item.id}
  className="card"
  onClick={() => setSelectedNote(item)}
>
      <div className="card-header">
        <div className="card-source">
          <span className="card-label">
            {t.source}
          </span>
  
          <span className="source-value">
            {item.source || t.noSource}
          </span>
        </div>
  
        <div className="category-pill">
          {item.category || t.noCategory}
        </div>
      </div>
  
      <div className="card-body">
        <p className="note-content">
          {item.note}
        </p>
      </div>
  
      <div className="card-footer">
        <span className="timestamp">
          {item.createdAt
            ? new Date(
                item.createdAt
              ).toLocaleString()
            : ''}
        </span>
  
        <div className="card-actions">
          <button
            className="ghost-btn"
            onClick={(e) => {
              e.stopPropagation();
              editNote(item);
            }}
          >
            {t.edit}
          </button>
  
          <button
            className="danger-btn"
            onClick={(e) => {
              e.stopPropagation();
              deleteNote(item.id);
            }}
          >
            {t.delete}
          </button>
        </div>
      </div>
    </div>
  );

  if (isDashboard) {
    return (
      <div
      className={`dashboard ${
        language === 'fa' ? 'rtl' : ''
      } ${theme}`}
    >
      <aside
  className={`sidebar ${
    sidebarCollapsed ? 'collapsed' : ''
  }`}
>
<div className="brand">
  <h1>
    {sidebarCollapsed
      ? (language === 'fa' ? 'ج' : 'J')
      : (language === 'fa'
          ? 'جزوه'
          : 'Jozve')}
  </h1>
</div>



<button
  className="lang-toggle"
  onClick={toggleLang}
>
  <span
    className={
      language === 'en'
        ? 'active'
        : ''
    }
  >
    EN
  </span>

  <span
    className={
      language === 'fa'
        ? 'active'
        : ''
    }
  >
    فا
  </span>
</button>
<button
  className="theme-toggle"
  onClick={toggleTheme}
>
  {theme === 'dark'
    ? '☀️'
    : '🌙'}
</button>

  <nav className="nav">
  <button
    className={viewMode === 'all' ? 'active' : ''}
    onClick={() => {
      setViewMode('all');
      setFilteredNotes(notes);
    }}
  >
    {t.all}
  </button>

  <button
    onClick={() => {
      const recent = [...notes]
        .sort(
          (a, b) =>
            new Date(b.createdAt) -
            new Date(a.createdAt)
        )
        .slice(0, 10);

      setViewMode('all');
      setFilteredNotes(recent);
    }}
  >
    {language === 'fa'
      ? 'اخیر'
      : 'Recent'}
  </button>
  {!sidebarCollapsed && (
  <div className="sidebar-section-title">
    {language === 'fa'
      ? 'منابع'
      : 'Sources'}
  </div>
)}

{sourceEntries.slice(0, 5).map(([name, items]) => (
  <button
    key={name}
    className="sidebar-filter"
    onClick={() => {
      setViewMode('all');
      setFilteredNotes(items);
    }}
  >
    {sidebarCollapsed ? (
      <span>📚</span>
    ) : (
      <>
        <span className="truncate-label">
          {name}
        </span>

        <div className="sidebar-item-actions">
          <button
            className="mini-icon-btn"
            onClick={(e) => {
              e.stopPropagation();
              renameSource(name);
            }}
          >
            ✏️
          </button>

          <button
            className="mini-icon-btn"
            onClick={(e) => {
              e.stopPropagation();
              clearSource(name);
            }}
          >
            🗑
          </button>

          <span>{items.length}</span>
        </div>
      </>
    )}
  </button>
))}
{Object.keys(groupedBySource).length > 5 && (
  <button
    className="show-all-btn"
    onClick={() => {
      setFilterModalType('sources');
      setFilterSearch('');
      setShowFilterModal(true);
    }}
  >
    {language === 'fa'
      ? 'نمایش همه منابع'
      : 'Show all sources'}
  </button>
)}
{!sidebarCollapsed && (
  <div className="sidebar-section-title">
    {language === 'fa'
      ? 'دسته‌بندی‌ها'
      : 'Categories'}
  </div>
)}
{categoryEntries.slice(0, 5).map(([name, items]) => (
  <button
    key={name}
    className="sidebar-filter"
    onClick={() => {
      setViewMode('all');
      setFilteredNotes(items);
    }}
  >
    {sidebarCollapsed ? (
      <span>🏷️</span>
    ) : (
      <>
        <span className="truncate-label">
          {name}
        </span>

        <div className="sidebar-item-actions">
          <button
            className="mini-icon-btn"
            onClick={(e) => {
              e.stopPropagation();
              renameCategory(name);
            }}
          >
            ✏️
          </button>

          <button
            className="mini-icon-btn"
            onClick={(e) => {
              e.stopPropagation();
              clearCategory(name);
            }}
          >
            🗑
          </button>

          <span>{items.length}</span>
        </div>
      </>
    )}
  </button>
))}
  {Object.keys(groupedByCategory).length > 5 && (
  <button
    className="show-all-btn"
    onClick={() => {
      setFilterModalType('categories');
      setFilterSearch('');
      setShowFilterModal(true);
    }}
  >
    {language === 'fa'
      ? 'نمایش همه دسته‌ها'
      : 'Show all categories'}
  </button>
)}
</nav>
        </aside>
  
        <main className="main">
        {selectedNote && (
  <div
    className="note-modal-overlay"
    onClick={() =>
      setSelectedNote(null)
    }
  >
    <div
      className="note-modal"
      onClick={(e) =>
        e.stopPropagation()
      }
    >
      <div className="note-modal-header">
        <div>
          <div className="card-label">
            {t.source}
          </div>

          <div className="source-value">
            {selectedNote.source ||
              t.noSource}
          </div>
        </div>

        <button
          className="modal-close"
          onClick={() =>
            setSelectedNote(null)
          }
        >
          ✕
        </button>
      </div>

      <div className="note-modal-category">
        {selectedNote.category ||
          t.noCategory}
      </div>

      <div className="note-modal-content">
        {selectedNote.note}
      </div>

      <div className="note-modal-footer">
        <span className="timestamp">
          {selectedNote.createdAt
            ? new Date(
                selectedNote.createdAt
              ).toLocaleString()
            : ''}
        </span>

        <div className="card-actions">
          <button
            className="ghost-btn"
            onClick={() => {
              editNote(selectedNote);
              setSelectedNote(null);
            }}
          >
            {t.edit}
          </button>

          <button
            className="danger-btn"
            onClick={() => {
              deleteNote(selectedNote.id);
              setSelectedNote(null);
            }}
          >
            {t.delete}
          </button>
        </div>
      </div>
    </div>
  </div>
)}
        <div className="dashboard-topbar">
  <div className="dashboard-title">
    <h2>
      {language === 'fa'
        ? 'داشبورد جزوه'
        : 'Jozve Dashboard'}
    </h2>

    <p>
      {notes.length}{' '}
      {language === 'fa'
        ? 'یادداشت ذخیره شده'
        : 'notes saved'}
    </p>
  </div>

  <div className="dashboard-actions">
    <div className="dashboard-search">
      <input
        className="search-input"
        placeholder={t.search}
        value={search}
        onChange={(e) => {
          const value = e.target.value;
          setSearch(value);

          if (!value.trim()) {
            setFilteredNotes(notes);
          } else {
            const q =
              value.toLowerCase();

            setFilteredNotes(
              notes.filter(
                (item) =>
                  (item.note || '')
                    .toLowerCase()
                    .includes(q) ||
                  (item.source || '')
                    .toLowerCase()
                    .includes(q) ||
                  (item.category || '')
                    .toLowerCase()
                    .includes(q)
              )
            );
          }
        }}
      />
    </div>

    <button
      className="quick-add-btn"
      onClick={() => {
        setComposerOpen(true);
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
      }}
    >
      {language === 'fa'
        ? '＋ یادداشت'
        : '+ Note'}
    </button>
  </div>
</div>
  
          <div className="composer-card">
            {!composerOpen ? (
              <button
                className="composer-collapsed"
                onClick={() =>
                  setComposerOpen(true)
                }
              >
                {language === 'fa'
                  ? 'یادداشت جدید...'
                  : 'Take a note...'}
              </button>
            ) : (
              <div className="composer-expanded">
                <input
                  className="composer-input"
                  placeholder={t.source}
                  value={source}
                  onChange={(e) =>
                    setSource(e.target.value)
                  }
                />
  
                <input
                  className="composer-input"
                  placeholder={t.category}
                  value={category}
                  onChange={(e) =>
                    setCategory(e.target.value)
                  }
                />
  
                <textarea
                  className="composer-textarea"
                  placeholder={t.note}
                  value={note}
                  onChange={(e) =>
                    setNote(e.target.value)
                  }
                />
  
                <div className="composer-actions">
                  <button
                    className="composer-cancel"
                    onClick={() => {
                      setComposerOpen(false);
                      setEditingId(null);
                      setSource('');
                      setCategory('');
                      setNote('');
                    }}
                  >
                    {language === 'fa'
                      ? 'بستن'
                      : 'Close'}
                  </button>
  
                  <button
                    className="composer-save"
                    onClick={() => {
                      saveNote();
                      setComposerOpen(false);
                    }}
                  >
                    {editingId
                      ? t.update
                      : t.save}
                  </button>
                </div>
              </div>
            )}
          </div>
  
          {viewMode === 'all' && (
            <div className="cards-grid">
              {sortedNotes.map(renderCard)}
            </div>
          )}
  
          {viewMode === 'sources' &&
            Object.entries(groupedBySource).map(
              ([g, items]) => (
                <section
                  key={g}
                  className="group-section"
                >
                  <h2 className="group-title">
                    {g}
                  </h2>
  
                  <div className="cards-grid">
                    {items.map(renderCard)}
                  </div>
                </section>
              )
            )}
  
          {viewMode === 'categories' &&
            Object.entries(
              groupedByCategory
            ).map(([g, items]) => (
              <section
                key={g}
                className="group-section"
              >
                <h2 className="group-title">
                  {g}
                </h2>
  
                <div className="cards-grid">
                  {items.map(renderCard)}
                </div>
              </section>
            ))}
            {showFilterModal && (
  <div
    className="note-modal-overlay"
    onClick={() =>
      setShowFilterModal(false)
    }
  >
    <div
      className="note-modal"
      onClick={(e) =>
        e.stopPropagation()
      }
    >
      <div className="note-modal-header">
        <h3>
          {filterModalType === 'sources'
            ? (language === 'fa'
                ? 'همه منابع'
                : 'All Sources')
            : (language === 'fa'
                ? 'همه دسته‌ها'
                : 'All Categories')}
        </h3>

        <button
          className="modal-close"
          onClick={() =>
            setShowFilterModal(false)
          }
        >
          ✕
        </button>
      </div>

      <input
        className="search-input"
        placeholder={
          language === 'fa'
            ? 'جستجو...'
            : 'Search...'
        }
        value={filterSearch}
        onChange={(e) =>
          setFilterSearch(e.target.value)
        }
      />

      <div className="filter-modal-list">
        {filteredModalEntries.map(
          ([name, items]) => (
            <button
              key={name}
              className="sidebar-filter"
              onClick={() => {
                setFilteredNotes(items);
                setShowFilterModal(false);
              }}
            >
              <span>{name}</span>
              <span>{items.length}</span>
            </button>
          )
        )}
      </div>
    </div>
  </div>
)}
        </main>
      </div>
    );
  }

return (
<div
  className={`popup-app ${
    language === 'fa' ? 'rtl' : ''
  } ${theme}`}
>
    <div className="popup-header">
      <div>
        <h2>Jozve</h2>
        <p>
          {language === 'fa'
            ? 'ثبت سریع یادداشت'
            : 'Quick Capture'}
        </p>
      </div>

      <button
        className="lang-btn"
        onClick={toggleLang}
      >
        {language === 'en'
          ? 'فارسی'
          : 'EN'}
      </button>
    </div>

    <input
      className="popup-input"
      placeholder={t.source}
      value={source}
      onChange={(e) =>
        setSource(e.target.value)
      }
    />

    <input
      className="popup-input"
      placeholder={t.category}
      value={category}
      onChange={(e) =>
        setCategory(e.target.value)
      }
    />

    <textarea
      className="popup-textarea"
      placeholder={t.note}
      value={note}
      onChange={(e) =>
        setNote(e.target.value)
      }
    />

    <div className="popup-actions">
      <button
        className="popup-secondary"
        onClick={openDashboard}
      >
        {language === 'fa'
          ? 'داشبورد'
          : 'Dashboard'}
      </button>

      <button
        className="popup-primary"
        onClick={saveNote}
      >
        {editingId
          ? t.update
          : t.save}
      </button>
    </div>

    {showToast && (
      <div className="toast">
        {language === 'fa'
          ? 'ذخیره شد ✓'
          : 'Saved ✓'}
      </div>
    )}
  </div>
);
}

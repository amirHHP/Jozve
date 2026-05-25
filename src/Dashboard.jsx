import { useEffect, useState } from "react";

function getStorage() {
  if (
    typeof chrome !== "undefined" &&
    chrome.storage &&
    chrome.storage.local
  ) {
    return {
      get: (key, callback) => chrome.storage.local.get([key], callback),
      set: (data, callback) => chrome.storage.local.set(data, callback),
    };
  }

  return {
    get: (key, callback) => {
      const data = localStorage.getItem(key);
      callback({ [key]: data ? JSON.parse(data) : [] });
    },
    set: (data, callback) => {
      Object.keys(data).forEach((key) => {
        localStorage.setItem(key, JSON.stringify(data[key]));
      });
      if (callback) callback();
    },
  };
}

const storage = getStorage();

const translations = {
  en: {
    subtitle: "Your knowledge workspace",
    all: "All Notes",
    sources: "Sources",
    categories: "Categories",
    search: "Search notes...",
    searchBtn: "Search",
    emptyTitle: "No notes yet ✨",
    emptyText: "Start capturing ideas with Jozve",
    source: "Source",
    category: "Category",
    noSource: "No source",
    noCategory: "No category",
    edit: "Edit",
    delete: "Delete",
  },
  fa: {
    subtitle: "فضای کاری دانش شما",
    all: "همه یادداشت‌ها",
    sources: "منابع",
    categories: "دسته‌بندی‌ها",
    search: "جستجو در یادداشت‌ها...",
    searchBtn: "جستجو",
    emptyTitle: "هنوز یادداشتی نداری ✨",
    emptyText: "شروع کن به ذخیره ایده‌ها با Jozve",
    source: "منبع",
    category: "دسته‌بندی",
    noSource: "بدون منبع",
    noCategory: "بدون دسته‌بندی",
    edit: "ویرایش",
    delete: "حذف",
  },
};

function Dashboard() {
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [viewMode, setViewMode] = useState("all");
  const [search, setSearch] = useState("");
  const [language, setLanguage] = useState("en");

  const t = translations[language];

  useEffect(() => {
    storage.get("notes", (result) => {
      const saved = result.notes || [];
      setNotes(saved);
      setFilteredNotes(saved);
    });

    storage.get("language", (result) => {
      if (result.language) {
        setLanguage(result.language);
      }
    });
  }, []);

  const saveNotes = (updated) => {
    storage.set({ notes: updated }, () => {
      setNotes(updated);
      setFilteredNotes(updated);
    });
  };

  const deleteNote = (id) => {
    const updated = notes.filter((item) => item.id !== id);
    saveNotes(updated);
  };

  const runSearch = () => {
    const q = search.toLowerCase().trim();

    if (!q) {
      setFilteredNotes(notes);
      return;
    }

    const results = notes.filter(
      (item) =>
        (item.note || "").toLowerCase().includes(q) ||
        (item.source || "").toLowerCase().includes(q) ||
        (item.category || "").toLowerCase().includes(q)
    );

    setFilteredNotes(results);
  };

  const editNote = (item) => {
    const newText = prompt(
      language === "fa"
        ? "یادداشت را ویرایش کن:"
        : "Edit your note:",
      item.note
    );

    if (newText === null) return;

    const updated = notes.map((n) =>
      n.id === item.id
        ? {
            ...n,
            note: newText,
          }
        : n
    );

    saveNotes(updated);
  };

  const groupedBySource = filteredNotes.reduce((acc, note) => {
    const key = note.source || t.noSource;
    if (!acc[key]) acc[key] = [];
    acc[key].push(note);
    return acc;
  }, {});

  const groupedByCategory = filteredNotes.reduce((acc, note) => {
    const key = note.category || t.noCategory;
    if (!acc[key]) acc[key] = [];
    acc[key].push(note);
    return acc;
  }, {});

  const sortedNotes = [...filteredNotes].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const renderCard = (item) => (
    <div key={item.id} className="card">
      <div className="meta-row">
        <div className="source-block">
          <span className="meta-label">{t.source}</span>
          <span className="source-value">
            {item.source || t.noSource}
          </span>
        </div>

        <div className="category-chip">
          <span className="meta-label">{t.category}</span>
          <span className="category-value">
            {item.category || t.noCategory}
          </span>
        </div>
      </div>

      <p className="note-content">{item.note}</p>

      <div className="footer-row">
        <span className="timestamp">
          {item.createdAt
            ? new Date(item.createdAt).toLocaleString()
            : ""}
        </span>

        <div className="actions">
          <button onClick={() => editNote(item)}>
            {t.edit}
          </button>

          <button onClick={() => deleteNote(item.id)}>
            {t.delete}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`dashboard ${language === "fa" ? "rtl" : ""}`}>
      <aside className="sidebar">
        <div className="brand">
          <h1>Jozve</h1>
          <p>{t.subtitle}</p>
        </div>

        <button
          className="lang-btn"
          onClick={() => {
            const newLang = language === "en" ? "fa" : "en";
            setLanguage(newLang);
            storage.set({ language: newLang });
          }}
        >
          {language === "en" ? "فارسی" : "EN"}
        </button>

        <nav className="nav">
          <button
            className={viewMode === "all" ? "active" : ""}
            onClick={() => setViewMode("all")}
          >
            {t.all}
          </button>

          <button
            className={viewMode === "sources" ? "active" : ""}
            onClick={() => setViewMode("sources")}
          >
            {t.sources}
          </button>

          <button
            className={viewMode === "categories" ? "active" : ""}
            onClick={() => setViewMode("categories")}
          >
            {t.categories}
          </button>
        </nav>
      </aside>

      <main className="main">
        <div className="toolbar">
          <input
            className="search-input"
            placeholder={t.search}
            value={search}
            onChange={(e) => {
              const value = e.target.value;
              setSearch(value);

              if (!value.trim()) {
                setFilteredNotes(notes);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                runSearch();
              }
            }}
          />

          <button
            className="search-btn"
            onClick={runSearch}
          >
            {t.searchBtn}
          </button>
        </div>

        {sortedNotes.length === 0 ? (
          <div className="empty-state">
            <h2>{t.emptyTitle}</h2>
            <p>{t.emptyText}</p>
          </div>
        ) : (
          <>
            {viewMode === "all" && (
              <div className="cards-grid">
                {sortedNotes.map(renderCard)}
              </div>
            )}

            {viewMode === "sources" &&
              Object.entries(groupedBySource).map(
                ([group, items]) => (
                  <section
                    key={group}
                    className="group-section"
                  >
                    <h2 className="group-title">{group}</h2>

                    <div className="cards-grid">
                      {items.map(renderCard)}
                    </div>
                  </section>
                )
              )}

            {viewMode === "categories" &&
              Object.entries(groupedByCategory).map(
                ([group, items]) => (
                  <section
                    key={group}
                    className="group-section"
                  >
                    <h2 className="group-title">{group}</h2>

                    <div className="cards-grid">
                      {items.map(renderCard)}
                    </div>
                  </section>
                )
              )}
          </>
        )}
      </main>
    </div>
  );
}

export default Dashboard;
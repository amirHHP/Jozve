
const translations = {
  en: {
    langBtn: 'فارسی',

    heroTitle:
      'Capture knowledge before it disappears.',

    heroSubtitle:
      'Jozve is a bilingual Chrome extension for capturing, organizing, and revisiting notes, ideas, and research.',

    storyTitle: 'Why I built Jozve',

    storyText:
      'I constantly collect ideas, references, articles, and fleeting thoughts while browsing. Most tools felt too heavy or too disconnected from the browsing workflow. Jozve was built as a lightweight personal knowledge layer that stays close to the browser.',

    featuresTitle: 'Features',

    howTitle: 'How to use',

    ctaTitle: 'Explore the project',

    githubBtn: 'View GitHub',

    howBtn: 'How to use',

    featureCards: [
      'Quick Capture Popup',
      'Full Dashboard Workspace',
      'Source & Category Filters',
      'Dark / Light Mode',
      'English / Persian Support',
      'Offline-first Storage',
    ],

    steps: [
      'Clone or download the GitHub repository',
      'Open Chrome Extensions',
      'Enable Developer Mode',
      'Click Load unpacked',
      'Select the extension folder',
      'Start capturing knowledge',
    ],
  },

  fa: {
    langBtn: 'EN',

    heroTitle:
      'دانش و ایده‌ها را قبل از فراموش شدن ثبت کنید.',

    heroSubtitle:
      'جزوه یک افزونه کروم دو زبانه برای ثبت، سازماندهی و مرور دوباره یادداشت‌ها، ایده‌ها و دانش شخصی شماست.',

    storyTitle: 'چرا جزوه را ساختم',

    storyText:
      'من دائماً هنگام وب‌گردی ایده‌ها، منابع، مقاله‌ها و فکرهای لحظه‌ای را جمع می‌کنم. بیشتر ابزارها یا بیش از حد سنگین بودند یا از جریان واقعی کار فاصله داشتند. جزوه را به‌عنوان یک لایه سبک مدیریت دانش ساختم که کنار مرورگر بماند.',

    featuresTitle: 'ویژگی‌ها',

    howTitle: 'روش استفاده',

    ctaTitle: 'مشاهده پروژه',

    githubBtn: 'مشاهده گیت‌هاب',

    howBtn: 'روش استفاده',

    featureCards: [
      'ثبت سریع از طریق پاپ‌آپ',
      'داشبورد کامل مدیریت یادداشت',
      'فیلتر بر اساس منبع و دسته‌بندی',
      'حالت تاریک و روشن',
      'پشتیبانی فارسی و انگلیسی',
      'ذخیره‌سازی آفلاین',
    ],

    steps: [
      'پروژه را از گیت‌هاب دانلود یا کلون کنید',
      'بخش Chrome Extensions را باز کنید',
      'Developer Mode را فعال کنید',
      'روی Load unpacked کلیک کنید',
      'پوشه افزونه را انتخاب کنید',
      'شروع به ثبت دانش کنید',
    ],
  },
};

let currentLang = 'en';

const applyLanguage = () => {
  const t = translations[currentLang];

  document.getElementById('heroTitle').textContent =
    t.heroTitle;

  document.getElementById('heroSubtitle').textContent =
    t.heroSubtitle;

  document.getElementById('storyTitle').textContent =
    t.storyTitle;

  document.getElementById('storyText').textContent =
    t.storyText;

  document.getElementById('featuresTitle').textContent =
    t.featuresTitle;

  document.getElementById('howTitle').textContent =
    t.howTitle;

  document.getElementById('ctaTitle').textContent =
    t.ctaTitle;

  document.getElementById('langToggle').textContent =
    t.langBtn;

  document.querySelector('.primary-btn').textContent =
    t.githubBtn;

  document.querySelector('.secondary-btn').textContent =
    t.howBtn;

  document
    .querySelectorAll('.feature-card')
    .forEach((card, i) => {
      card.textContent = t.featureCards[i];
    });

  document
    .querySelectorAll('.steps li')
    .forEach((step, i) => {
      step.textContent = t.steps[i];
    });

  if (currentLang === 'fa') {
    document.body.classList.add('rtl');
    document.querySelector('.brand').textContent =
      'جزوه';
  } else {
    document.body.classList.remove('rtl');
    document.querySelector('.brand').textContent =
      'Jozve';
  }
};

document
  .getElementById('langToggle')
  .addEventListener('click', () => {
    currentLang =
      currentLang === 'en' ? 'fa' : 'en';

    applyLanguage();
  });

applyLanguage();

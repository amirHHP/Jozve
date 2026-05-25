const translations = {
  en: {
    langBtn: 'فارسی',
    navFeatures: 'Features',
    navHow: 'How to use',

    heroTitle:
      'Capture knowledge before it disappears.',

    heroSubtitle:
      'Jozve helps you capture, organize, and revisit knowledge without leaving your browser.',

    screensTitle:
      'See Jozve in action',

    storyTitle:
      'Why I built Jozve',

    storyText:
      'I constantly collect ideas, references, research notes, and fleeting thoughts while browsing. Most tools felt too heavy or too disconnected from the actual workflow. So I built Jozve.',

    howTitle:
      'How to use',

    ctaTitle:
      'Explore the project',

    githubBtn:
      'View GitHub',

    howBtn:
      'How to use',

    miniFeatures: [
      'Quick Capture',
      'Bilingual',
      'Dark / Light',
      'Offline-first',
    ],

    steps: [
      'Download or clone the repository',
      'Open Chrome Extensions',
      'Enable Developer Mode',
      'Click Load unpacked',
      'Select the extension folder',
      'Start capturing knowledge',
    ],

    images: {
      hero: './assets/create-note-en.png',
      screen1: './assets/create-note-en.png',
      screen2: './assets/dashboard-light-en.png',
      screen3: './assets/dashboard-dark-en.png',
    },
  },

  fa: {
    langBtn: 'EN',
    navFeatures: 'ویژگی‌ها',
    navHow: 'روش استفاده',

    heroTitle:
      'دانش و ایده‌ها را قبل از فراموش شدن ثبت کنید.',

    heroSubtitle:
      'جزوه به شما کمک می‌کند بدون خروج از مرورگر، دانش، یادداشت‌ها و ایده‌های خود را ثبت، سازماندهی و مرور کنید.',

    screensTitle:
      'جزوه در عمل',

    storyTitle:
      'چرا جزوه را ساختم',

    storyText:
      'من دائماً هنگام وب‌گردی ایده‌ها، منابع، یادداشت‌های تحقیقاتی و فکرهای لحظه‌ای را جمع می‌کنم. بیشتر ابزارها یا بیش از حد سنگین بودند یا از جریان واقعی کار فاصله داشتند. برای همین جزوه را ساختم.',

    howTitle:
      'روش استفاده',

    ctaTitle:
      'مشاهده پروژه',

    githubBtn:
      'مشاهده گیت‌هاب',

    howBtn:
      'روش استفاده',

    miniFeatures: [
      'ثبت سریع',
      'دو زبانه',
      'حالت روشن / تاریک',
      'ذخیره آفلاین',
    ],

    steps: [
      'پروژه را از گیت‌هاب دانلود یا کلون کنید',
      'بخش Chrome Extensions را باز کنید',
      'Developer Mode را فعال کنید',
      'روی Load unpacked کلیک کنید',
      'پوشه افزونه را انتخاب کنید',
      'شروع به ثبت دانش کنید',
    ],

    images: {
      hero: './assets/create-note-fa.png',
      screen1: './assets/create-note-fa.png',
      screen2: './assets/dashboard-light-fa.png',
      screen3: './assets/dashboard-dark-fa.png',
    },
  },
};

let currentLang = 'en';

const applyLanguage = () => {
  const t = translations[currentLang];

  document.getElementById('langToggle').textContent =
    t.langBtn;

  document.getElementById('navFeatures').textContent =
    t.navFeatures;

  document.getElementById('navHow').textContent =
    t.navHow;

  document.getElementById('heroTitle').textContent =
    t.heroTitle;

  document.getElementById('heroSubtitle').textContent =
    t.heroSubtitle;

  document.getElementById('screensTitle').textContent =
    t.screensTitle;

  document.getElementById('storyTitle').textContent =
    t.storyTitle;

  document.getElementById('storyText').textContent =
    t.storyText;

  document.getElementById('howTitle').textContent =
    t.howTitle;

  document.getElementById('ctaTitle').textContent =
    t.ctaTitle;

  document.getElementById('githubBtn').textContent =
    t.githubBtn;

  document.getElementById('howBtn').textContent =
    t.howBtn;

  document
    .querySelectorAll('.mini-feature')
    .forEach((item, i) => {
      item.textContent = t.miniFeatures[i];
    });

  document
    .querySelectorAll('.steps li')
    .forEach((step, i) => {
      step.textContent = t.steps[i];
    });

  document.getElementById('heroPreview').src =
    t.images.hero;

  document.getElementById('screen1').src =
    t.images.screen1;

  document.getElementById('screen2').src =
    t.images.screen2;

  document.getElementById('screen3').src =
    t.images.screen3;

  if (currentLang === 'fa') {
    document.body.classList.add('rtl');
    document.documentElement.lang = 'fa';
    document.querySelector('.brand').textContent =
      'جزوه';
  } else {
    document.body.classList.remove('rtl');
    document.documentElement.lang = 'en';
    document.querySelector('.brand').textContent =
      'Jozve';
  }
};

document
  .getElementById('langToggle')
  .addEventListener('click', () => {
    currentLang =
      currentLang === 'en'
        ? 'fa'
        : 'en';

    applyLanguage();
  });

applyLanguage();

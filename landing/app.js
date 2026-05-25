const translations = {
  en: {
    langBtn: 'فارسی',
    eyebrow: 'Personal Knowledge Workspace',
    navFeatures: 'Features',
    navHow: 'How to use',

    heroTitle:
      'Never lose an idea or note again. Capture it quickly, right where you work.',

    heroSubtitle:
      'Jozve is a Chrome extension I designed to capture notes, research, and fleeting ideas without interrupting the natural flow of browsing.',

    screensTitle:
      'See Jozve in action',

    storyTitle:
      'Why I built Jozve',

    storyText:
      'I wanted a place to keep my notes organized by source and category—something that feels more like a digital notebook built around the way I actually read and browse. I also wanted it to be lightweight, offline, and always within reach—something that helps learning instead of interrupting it.',

    howTitle:
      'How to use',

    ctaTitle:
      'View project on GitHub',

    githubBtn:
      'View project on GitHub',

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
    eyebrow: 'فضای شخصی دانش',
    navFeatures: 'ویژگی‌ها',
    navHow: 'روش استفاده',

    heroTitle:
      'با جزوه، هیچ ایده یا یادداشتی را از دست ندهید؛ سریع ثبت کنید و همیشه کنار خودتان داشته باشید.',

    heroSubtitle:
      'جزوه افزونه‌ای است که برای ثبت سریع یادداشت‌ها، تحقیقات و ایده‌های لحظه‌ای طراحی کردم؛ بدون اینکه جریان طبیعی مطالعه و وب‌گردی را مختل کند.',

    screensTitle:
      'جزوه در عمل',

    storyTitle:
      'چرا جزوه را ساختم',

    storyText:
      'همیشه دوست داشتم جایی داشته باشم که یادداشت‌هایم را بر اساس منبع و دسته‌بندی کنار هم نگه دارم؛ چیزی شبیه یک دفترچه یادداشت دیجیتال که واقعاً با سبک مطالعه و وب‌گردی من جور باشد. همین‌طور برایم مهم بود که این ابزار سبک، آفلاین و همیشه دم دست باشد؛ چیزی که وسط یادگیری مزاحم نشود، بلکه کمکم کند.',

    howTitle:
      'روش استفاده',

    ctaTitle:
      'مشاهده پروژه در گیت‌هاب',

    githubBtn:
      'مشاهده پروژه در گیت‌هاب',

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

  document.getElementById('eyebrowText').textContent =
    t.eyebrow;

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

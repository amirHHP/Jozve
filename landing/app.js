const translations = {
  en: {
    langBtn: 'فارسی',
    eyebrow: 'Personal Knowledge Workspace',
    navFeatures: 'Features',
    navHow: 'How to use',
    heroTitle: 'Never lose an idea or note again. Capture it quickly, right where you work.',
    heroSubtitle: 'DropIt is a Chrome extension designed to capture notes, research, and fleeting ideas without interrupting the natural flow of browsing.',
    howBtn: 'How to use',
    githubBtn: 'GitHub',
    windowTabTitle: 'DropIt Extension',
    screensSectionTitle: 'See DropIt in action',
    descQuick: 'Instantly capture any selected text, ideas, or annotations from your browser without leaving your active tab.',
    descLang: 'Complete dual-language Farsi (RTL) and English (LTR) workspace design supporting your preferred layout.',
    descTheme: 'Beautiful visual styling modes optimized for daylight note taking and night-time research sessions.',
    descOffline: 'Your notes are stored locally and securely in Chrome storage. No remote servers, 100% private and accessible offline.',
    titleMock1: 'Quick Popup',
    titleMock2: 'Dashboard Light',
    titleMock3: 'Dashboard Dark',
    storyTitle: 'Why I built DropIt',
    storyText: 'I wanted a place to keep my notes organized by source and category—something that feels more like a digital notebook built around the way I actually read and browse. I also wanted it to be lightweight, offline, and always within reach—something that helps learning instead of interrupting it.',
    howTitle: 'How to use',
    ctaTitle: 'View project on GitHub',
    ctaDesc: 'Interested in contributing, reading the code, or submitting an issue? Visit the GitHub repository.',
    footerText: 'Built for thinkers, readers, and curious minds',
    miniFeatures: [
      'Quick Capture',
      'Bilingual',
      'Dark / Light',
      'Offline-first'
    ],
    steps: [
      'Download or clone the repository',
      'Open Chrome Extensions (chrome://extensions)',
      'Enable Developer Mode in the top right',
      'Click "Load unpacked" button',
      'Select the DropIt extension directory',
      'Start capturing your knowledge effortlessly!'
    ],
    images: {
      hero: './assets/create-note-en.png',
      screen1: './assets/create-note-en.png',
      screen2: './assets/dashboard-light-en.png',
      screen3: './assets/dashboard-dark-en.png'
    }
  },

  fa: {
    langBtn: 'EN',
    eyebrow: 'فضای شخصی دانش',
    navFeatures: 'ویژگی‌ها',
    navHow: 'روش استفاده',
    heroTitle: 'با DropIt، هیچ ایده یا یادداشتی را از دست ندهید؛ سریع ثبت کنید و همیشه کنار خودتان داشته باشید.',
    heroSubtitle: 'DropIt افزونه‌ای است که برای ثبت سریع یادداشت‌ها، تحقیقات و ایده‌های لحظه‌ای طراحی کردم؛ بدون اینکه جریان طبیعی مطالعه و وب‌گردی را مختل کند.',
    howBtn: 'روش استفاده',
    githubBtn: 'گیت‌هاب',
    windowTabTitle: 'افزونه DropIt',
    screensSectionTitle: 'DropIt در عمل',
    descQuick: 'هر متن انتخابی، ایده یا حاشیه‌نویسی را فوراً از مرورگر خود بدون خروج از تب فعال ثبت کنید.',
    descLang: 'پشتیبانی کامل از دو زبان فارسی (راست‌چین) و انگلیسی (چپ‌چین) برای راحتی کار شما.',
    descTheme: 'حالت‌های بصری زیبا و بهینه‌سازی شده برای یادداشت‌برداری در روز و مطالعه در شب.',
    descOffline: 'یادداشت‌های شما به صورت محلی در حافظه کروم ذخیره می‌شوند. بدون سرور راه دور، ۱۰۰٪ خصوصی و آفلاین.',
    titleMock1: 'پنجره سریع ثبت یادداشت',
    titleMock2: 'داشبورد - پوسته روشن',
    titleMock3: 'داشبورد - پوسته تاریک',
    storyTitle: 'چرا DropIt را ساختم',
    storyText: 'همیشه دوست داشتم جایی داشته باشم که یادداشت‌هایم را بر اساس منبع و دسته‌بندی کنار هم نگه دارم؛ چیزی شبیه یک دفترچه یادداشت دیجیتال که واقعاً با سبک مطالعه و وب‌گردی من جور باشد. همین‌طور برایم مهم بود که این ابزار سبک، آفلاین و همیشه دم دست باشد؛ چیزی که وسط یادگیری مزاحم نشود، بلکه کمکم کند.',
    howTitle: 'روش استفاده',
    ctaTitle: 'مشاهده پروژه در گیت‌هاب',
    ctaDesc: 'علاقه‌مند به مشارکت، مطالعه کد یا ثبت گزارش خطا هستید؟ به مخزن گیت‌هاب سر بزنید.',
    footerText: 'ساخته شده برای اندیشمندان، خوانندگان و ذهن‌های کنجکاو',
    miniFeatures: [
      'ثبت سریع',
      'دو زبانه',
      'حالت روشن / تاریک',
      'ذخیره آفلاین'
    ],
    steps: [
      'پروژه را از گیت‌هاب دانلود یا کلون کنید',
      'بخش افزونه‌های کروم (chrome://extensions) را باز کنید',
      'گزینه Developer Mode را در بالا سمت راست فعال کنید',
      'روی دکمه "Load unpacked" کلیک کنید',
      'پوشه افزونه DropIt را انتخاب کنید',
      'شروع به ثبت بدون دغدغه دانش خود کنید!'
    ],
    images: {
      hero: './assets/create-note-fa.png',
      screen1: './assets/create-note-fa.png',
      screen2: './assets/dashboard-light-fa.png',
      screen3: './assets/dashboard-dark-fa.png'
    }
  }
};

let currentLang = 'en';

const applyLanguage = () => {
  const t = translations[currentLang];

  // Buttons & Controls
  document.getElementById('langToggle').textContent = t.langBtn;

  // Header Nav Links
  document.getElementById('navFeatures').textContent = t.navFeatures;
  document.getElementById('navHow').textContent = t.navHow;

  // Hero Section
  document.getElementById('eyebrowText').textContent = t.eyebrow;
  document.getElementById('heroTitle').textContent = t.heroTitle;
  document.getElementById('heroSubtitle').textContent = t.heroSubtitle;
  document.getElementById('howBtn').textContent = t.howBtn;
  document.getElementById('githubBtn').lastChild.textContent = ' ' + t.githubBtn;
  document.getElementById('windowTabTitle').textContent = t.windowTabTitle;

  // Key Features
  document.querySelectorAll('.mini-feature').forEach((item, i) => {
    item.textContent = t.miniFeatures[i];
  });
  document.getElementById('descQuick').textContent = t.descQuick;
  document.getElementById('descLang').textContent = t.descLang;
  document.getElementById('descTheme').textContent = t.descTheme;
  document.getElementById('descOffline').textContent = t.descOffline;

  // Showcase
  document.getElementById('screensSectionTitle').textContent = t.screensSectionTitle;
  document.getElementById('titleMock1').textContent = t.titleMock1;
  document.getElementById('titleMock2').textContent = t.titleMock2;
  document.getElementById('titleMock3').textContent = t.titleMock3;

  // Story & How-To
  document.getElementById('storyTitle').textContent = t.storyTitle;
  document.getElementById('storyText').textContent = t.storyText;
  document.getElementById('howTitle').textContent = t.howTitle;

  // Steps
  document.querySelectorAll('.steps li .step-content').forEach((step, i) => {
    step.textContent = t.steps[i];
  });

  // Footer CTA
  document.getElementById('ctaTitle').textContent = t.ctaTitle;
  document.getElementById('ctaDesc').textContent = t.ctaDesc;
  document.querySelector('.footer-cta .primary-btn').lastChild.textContent = ' ' + t.ctaTitle;

  // Footer
  document.getElementById('footerText').textContent = t.footerText;

  // Images
  document.getElementById('heroPreview').src = t.images.hero;
  document.getElementById('screen1').src = t.images.screen1;
  document.getElementById('screen2').src = t.images.screen2;
  document.getElementById('screen3').src = t.images.screen3;

  // RTL/LTR layout management
  if (currentLang === 'fa') {
    document.body.classList.add('rtl');
    document.documentElement.lang = 'fa';
    document.querySelector('.brand span').textContent = 'DropIt';
  } else {
    document.body.classList.remove('rtl');
    document.documentElement.lang = 'en';
    document.querySelector('.brand span').textContent = 'DropIt';
  }
};

// Theme Toggling Mechanism
const themeToggle = document.getElementById('themeToggle');

const initTheme = () => {
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
    document.body.classList.add('dark-theme');
  } else {
    document.body.classList.remove('dark-theme');
  }
};

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-theme');
  const isDark = document.body.classList.contains('dark-theme');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// Language Toggle
document.getElementById('langToggle').addEventListener('click', () => {
  currentLang = currentLang === 'en' ? 'fa' : 'en';
  applyLanguage();
});

// Initialization
initTheme();
applyLanguage();

export const translations = {
  en: {
    appName: 'LaptopMarket',
    logout: 'Logout',
    modeTitle: 'How would you like to search?',
    modeSubtitle: 'Choose the mode that suits you best. You can switch anytime.',
    easyMode: 'Easy Mode',
    easyDesc: 'Tap pictures. No reading needed.',
    simpleMode: 'Simple',
    simpleDesc: 'Answer in plain language.',
    proMode: 'Pro',
    proDesc: 'Full control over every spec.',
    yourRecommendations: 'Your Recommendations',
    startOver: 'Start over',
    listen: 'Listen',
    contact: 'Contact',
    match: 'match',
  },
  ur: {
    appName: 'لیپ ٹاپ مارکیٹ',
    logout: 'لاگ آؤٹ',
    modeTitle: 'آپ کیسے تلاش کرنا چاہیں گے؟',
    modeSubtitle: 'اپنی پسند کا طریقہ منتخب کریں۔',
    easyMode: 'آسان طریقہ',
    easyDesc: 'تصویروں پر کلک کریں۔',
    simpleMode: 'سادہ',
    simpleDesc: 'آسان زبان میں جواب دیں۔',
    proMode: 'پروفیشنل',
    proDesc: 'ہر تفصیل پر مکمل کنٹرول۔',
    yourRecommendations: 'آپ کی تجاویز',
    startOver: 'دوبارہ شروع کریں',
    listen: 'سنیں',
    contact: 'رابطہ',
    match: 'میچ',
  },
};

export function getTranslation(lang, key) {
  return translations[lang]?.[key] || translations.en[key] || key;
}

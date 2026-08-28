/**
 * FairCrop.in — Core Client Application Logic & Full Multilingual Localization Engine
 * Smart India Hackathon 2026 (Problem Statement: SIH-1693)
 * "Strengthening market linkages and price discovery for farmers"
 *
 * Backend integration: http://localhost:8001/api/v1 via window.FairCropAPI (api.js)
 * Fully interactive and reactive translation engine with click-to-open modals for:
 * 1. Live Mandi Prices (Carousel 1 items)
 * 2. Schemes & Market News (Carousel 2 items)
 * 3. Major Cities Mandi Hubs (10 city cards)
 * 4. View All 120+ Mandi Hubs Directory
 * 5. Newest Updates (6 cards & filter toolbar)
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {

  const api = window.FairCropAPI;

  /* ── Theme Toggle ── */
  const html     = document.documentElement;
  const themeBtn = document.getElementById('theme-btn');
  const iconSun  = document.getElementById('icon-sun');
  const iconMoon = document.getElementById('icon-moon');
  let isDark     = html.getAttribute('data-theme') !== 'light';

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      isDark = !isDark;
      html.setAttribute('data-theme', isDark ? 'dark' : 'light');
      if (iconSun) iconSun.style.display = isDark ? 'block' : 'none';
      if (iconMoon) iconMoon.style.display = isDark ? 'none' : 'block';
      showToast(`Switched to ${isDark ? 'Dark' : 'Light'} theme`);
    });
  }

  /* ── Scroll Cue Smooth Navigation ── */
  const scrollCue = document.getElementById('scroll-cue-btn') || document.querySelector('.scroll-cue');
  if (scrollCue) {
    scrollCue.addEventListener('click', () => {
      const target = document.getElementById('stats-bar') || document.getElementById('carousels');
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  }

  /* ── 22 Official Indian Languages Grid ── */
  const languages = [
    { code: 'en',  label: 'English',   native: 'English' },
    { code: 'hi',  label: 'Hindi',     native: 'हिन्दी' },
    { code: 'bn',  label: 'Bengali',   native: 'বাংলা' },
    { code: 'te',  label: 'Telugu',    native: 'తెలుగు' },
    { code: 'mr',  label: 'Marathi',   native: 'मराठी' },
    { code: 'ta',  label: 'Tamil',     native: 'தமிழ்' },
    { code: 'gu',  label: 'Gujarati',  native: 'ગુજરાતી' },
    { code: 'kn',  label: 'Kannada',   native: 'ಕನ್ನಡ' },
    { code: 'ml',  label: 'Malayalam', native: 'മലയാളം' },
    { code: 'pa',  label: 'Punjabi',   native: 'ਪੰਜਾਬੀ' },
    { code: 'or',  label: 'Odia',      native: 'ଓଡ଼ିଆ' },
    { code: 'as',  label: 'Assamese',  native: 'অসমীয়া' },
    { code: 'ur',  label: 'Urdu',      native: 'اردو' },
    { code: 'mai', label: 'Maithili',  native: 'मैथिली' },
    { code: 'sa',  label: 'Sanskrit',  native: 'संस्कृतम्' },
    { code: 'kok', label: 'Konkani',   native: 'कोंकणी' },
    { code: 'mni', label: 'Manipuri',  native: 'মৈতৈলোন্' },
    { code: 'ne',  label: 'Nepali',    native: 'नेपाली' },
    { code: 'ks',  label: 'Kashmiri',  native: 'کٲشُر' },
    { code: 'sd',  label: 'Sindhi',    native: 'سنڌي' },
    { code: 'doi', label: 'Dogri',     native: 'डोगरी' },
    { code: 'sat', label: 'Santali',   native: 'ᱥᱟᱱᱛᱟᱲᱤ' },
  ];

  /* ── Core Multilingual Dictionaries for Full Website ── */
  const TRANSLATIONS = {
    en: {
      step1: "Associations decide prices according to constraints and production",
      step2: "A fair monopoly is created by price transparency",
      step3: "Farmers get the best possible price for their crops",
      pill_empower: "Empowering Farmers",
      pill_fair: "Fair Prices",
      pill_real: "Real Markets",
      search_ph: "Search for crops, mandis, prices, government schemes…",
      all_categories: "All Categories",
      cat_veg: "Vegetables",
      cat_cereals: "Cereals & Grains",
      cat_pulses: "Pulses & Legumes",
      cat_fruits: "Fruits",
      cat_spices: "Spices & Herbs",
      cat_schemes: "Govt. Schemes",
      cat_mandi_prices: "Mandi Prices",
      cat_mandi_locator: "Mandi Locator",
      scroll_down: "Scroll Down",
      stat_farmers: "Registered Farmers",
      stat_daily: "Daily Price Updates",
      stat_crops: "Crops Listed",
      stat_mandis: "Mandis Connected",
      stat_alerts: "Farmers Registered",
      stat_states: "States Covered",
      live_intel: "Live Market Intelligence",
      real_time_prices: "Real-Time Prices & Updates",
      live_mandi_prices: "Live Mandi Prices",
      schemes_market_news: "Schemes & Market News",
      major_cities: "Major Cities",
      search_city_ph: "Search for your mandi or city…",
      detect_loc: "Detect my location",
      popular_mandis: "Popular Mandi Hubs",
      view_all_mandis: "View All 120+ Mandi Hubs →",
      newest_updates: "Newest Updates",
      auto_refresh: "Auto-refreshing in",
      live_badge: "LIVE",
      filter_all: "All Updates",
      filter_price: "Price Updates",
      filter_mandi: "Mandi Alerts",
      filter_scheme: "Govt Schemes",
      filter_weather: "Market & Weather",
      search_updates_ph: "Filter updates by crop, mandi, state...",
      refresh_now: "Refresh",
      quick_alert: "Alert",
      quick_share: "Share",
      read_more: "Read more →",
      skip_content: "Skip to main content",
      screen_reader: "Screen Reader",
      sitemap: "Sitemap",
      sign_in: "Sign In",
      my_account: "My Account"
    },
    hi: {
      step1: "किसान संघ उत्पादन व लागत के आधार पर उचित मूल्य तय करते हैं",
      step2: "मूल्य पारदर्शिता से बिचौलियों का अनुचित प्रभाव समाप्त होता है",
      step3: "किसानों को उनकी उपज का अधिकतम और सर्वोत्तम मूल्य मिलता है",
      pill_empower: "किसान सशक्तिकरण",
      pill_fair: "उचित मूल्य",
      pill_real: "प्रत्यक्ष बाजार",
      search_ph: "फसलें, मंडियां, भाव, सरकारी योजनाएं खोजें…",
      all_categories: "सभी श्रेणियां",
      cat_veg: "सब्जियां",
      cat_cereals: "अनाज व खाद्यान्न",
      cat_pulses: "दालें व दलहन",
      cat_fruits: "फल",
      cat_spices: "मसाले व जड़ी-बूटियां",
      cat_schemes: "सरकारी योजनाएं",
      cat_mandi_prices: "मंडी भाव",
      cat_mandi_locator: "मंडी लोकेटर",
      scroll_down: "नीचे स्क्रॉल करें",
      stat_farmers: "पंजीकृत किसान",
      stat_daily: "दैनिक मूल्य अपडेट",
      stat_crops: "सूचीबद्ध फसलें",
      stat_mandis: "संबद्ध मंडियां",
      stat_alerts: "पंजीकृत किसान",
      stat_states: "शामिल राज्य",
      live_intel: "सजीव मंडी विश्लेषण",
      real_time_prices: "रीयल-टाइम भाव एवं अपडेट",
      live_mandi_prices: "लाइव मंडी भाव",
      schemes_market_news: "सरकारी योजनाएं व बाजार समाचार",
      major_cities: "प्रमुख शहर",
      search_city_ph: "अपनी मंडी या शहर खोजें…",
      detect_loc: "मेरा स्थान पहचानें",
      popular_mandis: "प्रमुख मंडी केंद्र",
      view_all_mandis: "सभी 120+ मंडी केंद्र देखें →",
      newest_updates: "नवीनतम अपडेट",
      auto_refresh: "स्वतः रीफ्रेश",
      live_badge: "लाइव",
      filter_all: "सभी अपडेट",
      filter_price: "मूल्य अपडेट",
      filter_mandi: "मंडी अलर्ट",
      filter_scheme: "सरकारी योजनाएं",
      filter_weather: "बाजार व मौसम",
      search_updates_ph: "फसल, मंडी या राज्य द्वारा खोजें...",
      refresh_now: "ताज़ा करें",
      quick_alert: "अलर्ट",
      quick_share: "साझा",
      read_more: "और पढ़ें →",
      skip_content: "मुख्य सामग्री पर जाएं",
      screen_reader: "स्क्रीन रीडर",
      sitemap: "साइटमैप",
      sign_in: "साइन इन करें",
      my_account: "मेरा खाता"
    },
    bn: {
      step1: "কৃষক সমিতিগুলি উৎপাদন এবং ব্যয়ের ভিত্তিতে ন্যায্য মূল্য নির্ধারণ করে",
      step2: "মূল্য স্বচ্ছতার মাধ্যমে ন্যায্য বাজার এবং সরাসরি সংযোগ গড়ে ওঠে",
      step3: "কৃষকরা তাদের ফসলের জন্য সম্ভাব্য সর্বোচ্চ ও লাভজনক মূল্য পান",
      pill_empower: "কৃষক ক্ষমতায়ন",
      pill_fair: "ন্যায্য দাম",
      pill_real: "সরাসরি বাজার",
      search_ph: "ফসল, মান্ডি, দাম, সরকারি প্রকল্প খুঁজুন…",
      all_categories: "সকল বিভাগ",
      cat_veg: "শাকসবজি",
      cat_cereals: "দানাশস্য ও খাদ্যশস্য",
      cat_pulses: "ডাল ও ডালজাতীয় শস্য",
      cat_fruits: "ফলমূল",
      cat_spices: "মশলাপাতি",
      cat_schemes: "সরকারি প্রকল্প",
      cat_mandi_prices: "মান্ডির দাম",
      cat_mandi_locator: "মান্ডি সন্ধানকারী",
      scroll_down: "নিচে স্ক্রোল করুন",
      stat_farmers: "নিবন্ধিত কৃষক",
      stat_daily: "দৈনিক মূল্য আপডেট",
      stat_crops: "তালিকাভুক্ত ফসল",
      stat_mandis: "সংযুক্ত মান্ডি",
      stat_alerts: "নিবন্ধিত কৃষক",
      stat_states: "অন্তর্ভুক্ত রাজ্য",
      live_intel: "লাইভ মার্কেট ইন্টেলিজেন্স",
      real_time_prices: "রিয়েল-টাইম দাম ও সর্বশেষ তথ্য",
      live_mandi_prices: "লাইভ মান্ডি দর",
      schemes_market_news: "সরকারি প্রকল্প ও বাজার সংবাদ",
      major_cities: "প্রধান শহরসমূহ",
      search_city_ph: "আপনার মান্ডি বা শহর অনুসন্ধান করুন…",
      detect_loc: "আমার অবস্থান চিহ্নিত করুন",
      popular_mandis: "জনপ্রিয় মান্ডি কেন্দ্র",
      view_all_mandis: "সকল ১২০+ মান্ডি হাব দেখুন →",
      newest_updates: "সর্বশেষ আপডেট",
      auto_refresh: "স্বয়ংক্রিয় রিফ্রেশ",
      live_badge: "লাইভ",
      filter_all: "সকল আপডেট",
      filter_price: "মূল্য আপডেট",
      filter_mandi: "মান্ডি সতর্কতা",
      filter_scheme: "সরকারি প্রকল্প",
      filter_weather: "বাজার ও আবহাওয়া",
      search_updates_ph: "ফসল, মান্ডি বা রাজ্য দিয়ে খুঁজুন...",
      refresh_now: "রিফ্রেশ করুন",
      quick_alert: "সতর্কতা",
      quick_share: "শেয়ার",
      read_more: "আরও পড়ুন →",
      skip_content: "মূল বিষয়বস্তুতে যান",
      screen_reader: "স্ক্রিন রিডার",
      sitemap: "সাইটম্যাপ",
      sign_in: "সাইন ইন",
      my_account: "আমার অ্যাকাউন্ট"
    },
    te: {
      step1: "రైతు సంఘాలు ఉత్పత్తి వ్యయం ఆధారంగా సరసమైన ధరలను నిర్ణయిస్తాయి",
      step2: "ధరల పారదర్శకత ద్వారా దళారుల ప్రమేయం లేకుండా న్యాయమైన విపణి ఏర్పడుతుంది",
      step3: "రైతులు తమ పంటలకు అత్యుత్తమ మరియు లాభదాయకమైన ధరను పొందుతారు",
      pill_empower: "రైతు సాధికారత",
      pill_fair: "సరసమైన ధరలు",
      pill_real: "ప్రత్యక్ష మార్కెట్లు",
      search_ph: "పంటలు, మార్కెట్లు, ధరలు, ప్రభుత్వ పథకాలను శోధించండి…",
      all_categories: "అన్ని వర్గాలు",
      cat_veg: "కూరగాయలు",
      cat_cereals: "ధాన్యాలు & తృణధాన్యాలు",
      cat_pulses: "పప్పుదినుసులు",
      cat_fruits: "పండ్లు",
      cat_spices: "సుగంధ ద్రవ్యాలు",
      cat_schemes: "ప్రభుత్వ పథకాలు",
      cat_mandi_prices: "మార్కెట్ ధరలు",
      cat_mandi_locator: "మండి లొకేటర్",
      scroll_down: "క్రిందికి స్క్రోల్ చేయండి",
      stat_farmers: "నమోదిత రైతులు",
      stat_daily: "రోజువారీ ధరల సమాచారం",
      stat_crops: "జాబితా చేసిన పంటలు",
      stat_mandis: "అనుసంధానించిన మండీలు",
      stat_alerts: "నమోదిత రైతులు",
      stat_states: "కవర్ చేయబడిన రాష్ట్రాలు",
      live_intel: "ప్రత్యక్ష మార్కెట్ సమాచారం",
      real_time_prices: "రియల్ టైమ్ ధరలు & అప్‌డేట్స్",
      live_mandi_prices: "ప్రత్యక్ష మండి ధరలు",
      schemes_market_news: "పథకాలు & మార్కెట్ వార్తలు",
      major_cities: "ప్రధాన నగరాలు",
      search_city_ph: "మీ మండి లేదా నగరాన్ని శోధించండి…",
      detect_loc: "నా స్థానాన్ని గుర్తించండి",
      popular_mandis: "ప్రసిద్ధ మార్కెట్ హబ్‌లు",
      view_all_mandis: "అన్ని 120+ మండి హబ్‌లను చూడండి →",
      newest_updates: "తాజా సమాచారం",
      auto_refresh: "ఆటో-రిఫ్రెష్",
      live_badge: "లైవ్",
      filter_all: "అన్ని అప్‌డేట్‌లు",
      filter_price: "ధర అప్‌డేట్‌లు",
      filter_mandi: "మండి అలర్ట్‌లు",
      filter_scheme: "ప్రభుత్వ పథకాలు",
      filter_weather: "మార్కెట్ & వాతావరణం",
      search_updates_ph: "పంట, మార్కెట్ లేదా రాష్ట్రం ద్వారా శోధించండి...",
      refresh_now: "రిఫ్రెష్ చేయండి",
      quick_alert: "అలర్ట్",
      quick_share: "షేర్",
      read_more: "మరింత చదవండి →",
      skip_content: "ప్రధాన విషయానికి వెళ్లండి",
      screen_reader: "స్క్రీన్ రీడర్",
      sitemap: "సైట్‌మ్యాప్",
      sign_in: "సైన్ ఇన్",
      my_account: "నా ఖాతా"
    },
    mr: {
      step1: "शेतकरी संघटना उत्पादन व खर्चाच्या आधारे योग्य भाव निश्चित करतात",
      step2: "भाव पारदर्शकतेमुळे मध्यस्थांची मक्तेदारी संपून न्याय्य बाजारपेठ तयार होते",
      step3: "शेतकऱ्यांना त्यांच्या शेतमालाला सर्वोत्तम व योग्य भाव मिळतो",
      pill_empower: "शेतकरी सक्षमीकरण",
      pill_fair: "वाजवी भाव",
      pill_real: "थेट बाजारपेठ",
      search_ph: "पिके, बाजार समित्या, भाव, सरकारी योजना शोधा…",
      all_categories: "सर्व वर्गवारी",
      cat_veg: "भाजीपाला",
      cat_cereals: "धान्य व कडधान्ये",
      cat_pulses: "डाळी व कडधान्ये",
      cat_fruits: "फळे",
      cat_spices: "मसाले",
      cat_schemes: "सरकारी योजना",
      cat_mandi_prices: "बाजार भाव",
      cat_mandi_locator: "बाजार समिती शोधक",
      scroll_down: "खाली स्क्रोल करा",
      stat_farmers: "नोंदणीकृत शेतकरी",
      stat_daily: "दैनंदिन भाव अपडेट",
      stat_crops: "नोंदवलेली पिके",
      stat_mandis: "जोडलेल्या बाजार समित्या",
      stat_alerts: "नोंदणीकृत शेतकरी",
      stat_states: "समाविष्ट राज्ये",
      live_intel: "थेट बाजार माहिती",
      real_time_prices: "थेट बाजार भाव आणि अपडेट्स",
      live_mandi_prices: "थेट बाजार समिती भाव",
      schemes_market_news: "सरकारी योजना आणि बाजार बातम्या",
      major_cities: "प्रमुख शहरे",
      search_city_ph: "आपली बाजार समिती किंवा शहर शोधा…",
      detect_loc: "माझे स्थान शोधा",
      popular_mandis: "प्रमुख बाजार केंद्रे",
      view_all_mandis: "सर्व 120+ बाजार केंद्रे पहा →",
      newest_updates: "नवीनतम अपडेट",
      auto_refresh: "ऑटो-रिफ्रेश",
      live_badge: "थेट",
      filter_all: "सर्व अपडेट",
      filter_price: "भाव अपडेट",
      filter_mandi: "बाजार सूचना",
      filter_scheme: "सरकारी योजना",
      filter_weather: "बाजार व हवामान",
      search_updates_ph: "पीक, बाजार समिती किंवा राज्य शोधा...",
      refresh_now: "रिफ्रेश करा",
      quick_alert: "अलर्ट",
      quick_share: "शेअर",
      read_more: "अधिक वाचा →",
      skip_content: "मुख्य मजकुरावर जा",
      screen_reader: "स्क्रीन रीडर",
      sitemap: "साइटमॅप",
      sign_in: "साइन इन",
      my_account: "माझे खाते"
    }
  };

  /* ── Multilingual City Names ── */
  const CITY_TRANSLATIONS = {
    'Mumbai': { en: 'Mumbai', hi: 'मुंबई', bn: 'মুম্বই', te: 'ముంబై', mr: 'मुंबई', ta: 'மும்பை', gu: 'મુંબઈ', kn: 'ಮುಂಬೈ', ml: 'മുംബൈ', pa: 'ਮੁੰਬਈ', or: 'ମୁମ୍ବାଇ', as: 'মুম্বাই', ur: 'ممبئی' },
    'Delhi-NCR': { en: 'Delhi-NCR', hi: 'दिल्ली-एनसीआर', bn: 'দিল্লি-এনসিআর', te: 'ఢిల్లీ-ఎన్‌సీఆర్', mr: 'दिल्ली-एनसीआर', ta: 'தில்லி-என்சிஆர்', gu: 'દિલ્હી-એનસીઆર', kn: 'ದೆಹಲಿ-ಎನ್‌ಸಿಆರ್', ml: 'ഡൽഹി-എൻസിആർ', pa: 'ਦਿੱਲੀ-ਐਨਸੀਆਰ', or: 'ଦିଲ୍ଲୀ-ଏନସିଆର', as: 'দিল্লী-এনচিআৰ', ur: 'دہلی این سی آر' },
    'Bengaluru': { en: 'Bengaluru', hi: 'बेंगलुरु', bn: 'বেঙ্গালুরু', te: 'బెంగళూరు', mr: 'बंगळुरू', ta: 'பெங்களூரு', gu: 'બેંગલુરુ', kn: 'ಬೆಂಗಳೂರು', ml: 'ബെംഗളൂരു', pa: 'ਬੈਂਗਲੁਰੂ', or: 'ବେଙ୍ଗାଲୁରୁ', as: 'বেংগালুৰু', ur: 'بنگلورو' },
    'Hyderabad': { en: 'Hyderabad', hi: 'हैदराबाद', bn: 'হায়দ্রাবাদ', te: 'హైదరాబాద్', mr: 'हैदराबाद', ta: 'ஹைதராபாத்', gu: 'હૈદરાબાદ', kn: 'ಹೈದರಾಬಾದ್', ml: 'ഹൈദരാബാദ്', pa: 'ਹੈਦਰਾਬਾਦ', or: 'ହାଇଦ୍ରାବାଦ', as: 'হায়দৰাবাদ', ur: 'حیدرآباد' },
    'Chandigarh': { en: 'Chandigarh', hi: 'चंडीगढ़', bn: 'চণ্ডীগড়', te: 'చండీగఢ్', mr: 'चंदीगड', ta: 'சண்டிகர்', gu: 'ચંદીગઢ', kn: 'ಚಂಡೀಗಢ', ml: 'ചണ്ഡീഗഡ്', pa: 'ਚੰਡੀਗੜ੍ਹ', or: 'ଚଣ୍ଡିଗଡ଼', as: 'চণ্ডীগড়', ur: 'چندی گڑھ' },
    'Ahmedabad': { en: 'Ahmedabad', hi: 'अहमदाबाद', bn: 'আহমেদাবাদ', te: 'అహ్మదాబాద్', mr: 'अहमदाबाद', ta: 'அகமதாபாத்', gu: 'અમદાવાદ', kn: 'ಅಹಮದಾಬಾದ್', ml: 'അഹമ്മദാബാദ്', pa: 'ਅਹਿਮਦਾਬਾਦ', or: 'ଅହମ୍ମଦାବାଦ', as: 'আহমেদাবাদ', ur: 'احمد آباد' },
    'Pune': { en: 'Pune', hi: 'पुणे', bn: 'পুনে', te: 'పూణే', mr: 'पुणे', ta: 'புனே', gu: 'પુણે', kn: 'ಪುಣೆ', ml: 'പൂനെ', pa: 'ਪੁਣੇ', or: 'ପୁଣେ', as: 'পুনে', ur: 'پونے' },
    'Chennai': { en: 'Chennai', hi: 'चेन्नई', bn: 'চেন্নাই', te: 'చెన్నై', mr: 'चेन्नई', ta: 'சென்னை', gu: 'ચેન્નઈ', kn: 'ಚೆನ್ನೈ', ml: 'ചെന്നൈ', pa: 'ਚੇਨਈ', or: 'ଚେନ୍ନାଇ', as: 'চেন্নাই', ur: 'چنئی' },
    'Kolkata': { en: 'Kolkata', hi: 'कोलकाता', bn: 'কলকাতা', te: 'కోల్‌కతా', mr: 'कोलकाता', ta: 'கொல்கத்தா', gu: 'કોલકાતા', kn: 'ಕೋಲ್ಕತ್ತಾ', ml: 'കൊൽക്കത്ത', pa: 'ਕੋਲਕਾਤਾ', or: 'କୋଲକାତା', as: 'কলকাতা', ur: 'کولکاتہ' },
    'Kochi': { en: 'Kochi', hi: 'कोच्चि', bn: 'কোচি', te: 'కొచ్చి', mr: 'कोची', ta: 'கொச்சி', gu: 'કોચી', kn: 'ಕೊಚ್ಚಿ', ml: 'കൊച്ചി', pa: 'ਕੋਚੀ', or: 'କୋଚି', as: 'কোচি', ur: 'کوچی' }
  };

  /* ── Multilingual Crop Names for Carousel 1 ── */
  const CROP_TRANSLATIONS = {
    'Tomato (Hybrid)': { en: 'Tomato (Hybrid)', hi: 'टमाटर (हाइब्रिड)', bn: 'টমেটো (হাইব্রিড)', te: 'టమాటా (హైబ్రిడ్)', mr: 'टोमॅटो (हायब्रिड)' },
    'Onion (Red)': { en: 'Onion (Red)', hi: 'प्याज (लाल)', bn: 'পেঁয়াজ (লাল)', te: 'ఉల్లిపాయ (ఎరుపు)', mr: 'कांदा (लाल)' },
    'Wheat (Sharbati)': { en: 'Wheat (Sharbati)', hi: 'गेहूं (शरबती)', bn: 'গম (শরবতী)', te: 'గోధుమ (శర్బతి)', mr: 'गहू (शरबती)' },
    'Maize (Yellow)': { en: 'Maize (Yellow)', hi: 'मक्का (पीला)', bn: 'ভুট্টা (হলুদ)', te: 'మొక్కజొన్న (పసుపు)', mr: 'मका (पिवळा)' },
    'Potato (Jyoti)': { en: 'Potato (Jyoti)', hi: 'आलू (ज्योति)', bn: 'আলু (জ্যোতি)', te: 'బంగాళాదుంప (జ్యోతి)', mr: 'बटाटा (ज्योती)' },
    'Moong Dal': { en: 'Moong Dal', hi: 'मूंग दाल', bn: 'মুগ ডাল', te: 'పెసర పప్పు', mr: 'मूग डाळ' },
    'Red Chilli (Teja)': { en: 'Red Chilli (Teja)', hi: 'लाल मिर्च (तेजा)', bn: 'শুকনো লঙ্কা (তেজা)', te: 'ఎర్ర మిరప (తేజా)', mr: 'लाल मिरची (तेजा)' },
    'Banana (Grand Naine)': { en: 'Banana (Grand Naine)', hi: 'केला (ग्रैंड नैन)', bn: 'কলা (গ্র্যান্ড নাইন)', te: 'అరటి (గ్రాండ్ నైన్)', mr: 'केळी (ग्रँड नैन)' },
    'Basmati Rice (1121)': { en: 'Basmati Rice (1121)', hi: 'बासमती चावल (1121)', bn: 'বাসমতী চাল (১১২১)', te: 'బాస్మతి బియ్యం (1121)', mr: 'बासमती तांदूळ (११२१)' },
    'Cauliflower': { en: 'Cauliflower', hi: 'फूलगोभी', bn: 'ফুলকপি', te: 'క్యాలీఫ్లవర్', mr: 'फ्लॉवर / फुलकोबी' },
    'Groundnut (Bold)': { en: 'Groundnut (Bold)', hi: 'मूंगफली (बोल्ड)', bn: 'চীনাবাদাম (বোল্ড)', te: 'వేరుశనగ (బోల్డ్)', mr: 'भुईमूग (बोल्ड)' },
    'Coffee (Arabica Plantation)': { en: 'Coffee (Arabica Plantation)', hi: 'कॉफी (अरेबिका प्लांटेशन)', bn: 'কফি (অ্যারাবিকা প্ল্যান্টেশন)', te: 'కాఫీ (అరేబికా ప్లాంటేషన్)', mr: 'कॉफी (अरेबिका प्लांटेशन)' }
  };

  /* ── Multilingual Schemes for Carousel 2 ── */
  const SCHEME_TRANSLATIONS = {
    en: [
      { tag: "Government Scheme", title: "PM-KISAN: ₹6,000 Annual Direct Support", desc: "Direct income support for 14+ crore farmer families. 18th installment disbursement scheduled.", ministry: "Ministry of Agriculture & Farmers Welfare", eligibility: "Small & Marginal Farmers with cultivable land", docs: "Aadhaar Card, Land Record (Khatauni), Bank Passbook" },
      { tag: "MSP Update", title: "Kharif 2026 MSP: Paddy at ₹2,300/Quintal", desc: "Cabinet approves MSP hike across 14 crops with 50% guaranteed return over production cost.", ministry: "Cabinet Committee on Economic Affairs (CCEA)", eligibility: "All registered grain cultivators across India", docs: "e-NAM / State Mandi Farmer Registration" },
      { tag: "Digital Agriculture", title: "eNAM Connect: 1,361 Unified Mandis Online", desc: "Inter-state trading integration expanded. Real-time transparent electronic bidding active.", ministry: "Small Farmers Agribusiness Consortium (SFAC)", eligibility: "Farmers, Traders, Commission Agents, FPOs", docs: "Aadhaar, Mobile Number, Bank Account" },
      { tag: "Weather Advisory", title: "IMD Forecast: 108% Above-Normal Rainfall", desc: "Widespread Kharif monsoon coverage in Maharashtra, MP and Punjab favoring oilseeds.", ministry: "India Meteorological Department (IMD)", eligibility: "All crop cultivators in western and central states", docs: "No document required — live advisory" },
      { tag: "Mandi News", title: "Azadpur Records Highest Tomato Arrivals", desc: "4,800+ MT fresh supply stabilizes wholesale tomato rates across North Indian terminals.", ministry: "Delhi Agricultural Marketing Board (DAMB)", eligibility: "Wholesale buyers and commercial dispatchers", docs: "Gate Pass & Agmarknet Assay Certificate" },
      { tag: "Market Linkage", title: "1,200 Farmer Producer Groups Onboarded", desc: "Collective bargaining network connects smallholder farmers directly with institutional buyers.", ministry: "NABARD & FairCrop Cooperative Network", eligibility: "Registered Farmer Producer Organizations (FPOs)", docs: "FPO Registration Certificate, Member List" },
      { tag: "Export Opportunity", title: "Non-Basmati Rice Export Window Re-opened", desc: "Global market access unlocks higher export parity prices for 12 lakh rice cultivators.", ministry: "APEDA & Ministry of Commerce", eligibility: "Registered grain exporters and FPO collectives", docs: "APEDA Registration & Phytosanitary Certificate" },
      { tag: "Insurance Scheme", title: "PMFBY: ₹1.25 Lakh Cr Claims Disbursed", desc: "Satellite & drone yield assessments expedite crop insurance claims settlement in 48 hours.", ministry: "Ministry of Agriculture & Farmers Welfare", eligibility: "Loanee and Non-loanee farmers growing notified crops", docs: "Sowing Certificate, Land Records, Bank Passbook" },
      { tag: "Direct Procurement", title: "50,000 Farmers in Farm-to-Retail Network", desc: "Middlemen bypassed — farmers gain 18% higher profit margins through direct supply chains.", ministry: "FairCrop Direct Procurement Infrastructure", eligibility: "All registered cultivators on FairCrop.in", docs: "Mobile OTP & Bank Account" }
    ],
    hi: [
      { tag: "सरकारी योजना", title: "पीएम-किसान: ₹6,000 वार्षिक प्रत्यक्ष सहायता", desc: "14+ करोड़ किसान परिवारों के लिए सीधी आय सहायता। 18वीं किस्त का वितरण निर्धारित।", ministry: "कृषि एवं किसान कल्याण मंत्रालय", eligibility: "खेती योग्य भूमि वाले छोटे और सीमांत किसान", docs: "आधार कार्ड, खतौनी, बैंक पासबुक" },
      { tag: "एमएसपी अपडेट", title: "खरीफ 2026 एमएसपी: धान ₹2,300/क्विंटल", desc: "कैबिनेट ने लागत पर 50% गारंटीकृत लाभ के साथ 14 फसलों के एमएसपी में वृद्धि को मंजूरी दी।", ministry: "आर्थिक मामलों की मंत्रिमंडलीय समिति (CCEA)", eligibility: "सभी पंजीकृत अनाज उत्पादक किसान", docs: "ई-नाम / राज्य मंडी पंजीकरण" },
      { tag: "डिजिटल कृषि", title: "ई-नाम कनेक्ट: 1,361 एकीकृत मंडियां ऑनलाइन", desc: "अंतर-राज्यीय व्यापार एकीकरण का विस्तार। वास्तविक समय में पारदर्शी इलेक्ट्रॉनिक बोली जारी।", ministry: "लघु कृषक कृषि-व्यापार संघ (SFAC)", eligibility: "किसान, व्यापारी, एफपीओ", docs: "आधार, मोबाइल नंबर, बैंक खाता" },
      { tag: "मौसम परामर्श", title: "आईएमडी अनुमान: 108% सामान्य से अधिक वर्षा", desc: "महाराष्ट्र, एमपी और पंजाब में व्यापक मानसूनी बारिश से तिलहन फसलों को भारी लाभ।", ministry: "भारत मौसम विज्ञान विभाग (IMD)", eligibility: "पश्चिमी व मध्य भारत के सभी किसान", docs: "दस्तावेज़ की आवश्यकता नहीं — सीधा परामर्श" },
      { tag: "मंडी समाचार", title: "आजादपुर में टमाटर की रिकॉर्ड आवक", desc: "4,800+ मीट्रिक टन ताजा आपूर्ति से उत्तर भारत में टमाटर के थोक भाव स्थिर।", ministry: "दिल्ली कृषि विपणन बोर्ड (DAMB)", eligibility: "थोक खरीदार और प्रेषक", docs: "गेट पास एवं गुणवत्ता प्रमाणपत्र" },
      { tag: "बाजार संपर्क", title: "1,200 किसान उत्पादक संगठन (FPO) जुड़े", desc: "सामूहिक सौदेबाजी नेटवर्क छोटे किसानों को सीधे संस्थागत खरीदारों से जोड़ता है।", ministry: "नाबार्ड एवं फेयरक्रॉप नेटवर्क", eligibility: "पंजीकृत किसान उत्पादक संगठन (FPO)", docs: "एफपीओ पंजीकरण प्रमाणपत्र" },
      { tag: "निर्यात अवसर", title: "गैर-बासमती चावल निर्यात फिर से खुला", desc: "वैश्विक बाजार पहुंच से 12 लाख धान किसानों को अधिक निर्यात मूल्य प्राप्त होगा।", ministry: "एपीडा एवं वाणिज्य मंत्रालय", eligibility: "पंजीकृत निर्यातक व एफपीओ", docs: "एपीडा पंजीकरण प्रमाणपत्र" },
      { tag: "बीमा योजना", title: "पीएमएफबीवाई: ₹1.25 लाख करोड़ के दावों का वितरण", desc: "सैटेलाइट और ड्रोन से फसल आकलन द्वारा 48 घंटे में बीमा दावों का त्वरित निपटारा।", ministry: "कृषि एवं किसान कल्याण मंत्रालय", eligibility: "अधिसूचित फसलें उगाने वाले सभी किसान", docs: "बुवाई प्रमाणपत्र, खतौनी, बैंक पासबुक" },
      { tag: "प्रत्यक्ष खरीद", title: "फार्म-टू-रिटेल नेटवर्क में 50,000 किसान शामिल", desc: "बिचौलियों से मुक्ति — सीधी आपूर्ति श्रृंखला से किसानों को 18% अधिक लाभ।", ministry: "फेयरक्रॉप डायरेक्ट प्रोक्योरमेंट", eligibility: "फेयरक्रॉप पर पंजीकृत किसान", docs: "मोबाइल ओटीपी एवं बैंक खाता" }
    ],
    bn: [
      { tag: "সরকারি প্রকল্প", title: "পিএম-কিসান: বার্ষিক ₹৬,০০০ সরাসরি সহায়তা", desc: "১৪+ কোটি কৃষক পরিবারের জন্য সরাসরি ব্যাংক অ্যাকাউন্টে আর্থিক অনুদান। ১৮তম কিস্তি বণ্টন নির্ধারিত।", ministry: "কৃষি ও কৃষক কল্যাণ মন্ত্রক", eligibility: "চাষযোগ্য জমির মালিক ক্ষুদ্র ও প্রান্তিক কৃষক", docs: "আধার কার্ড, জমির পরচা (খতিয়ান), ব্যাংক পাসবই" },
      { tag: "এমএসপি আপডেট", title: "খরিফ ২০২৬ এমএসপি: ধান ₹২,৩০০/কুইন্টাল", desc: "উৎপাদন খরচের ওপর ৫০% নিশ্চিত মুনাফাসহ ১৪টি ফসলের বর্ধিত সহায়ক মূল্য অনুমোদন।", ministry: "অর্থনৈতিক বিষয়ক মন্ত্রিসভা কমিটি (CCEA)", eligibility: "সকল নিবন্ধিত খাদ্যশস্য চাষী", docs: "ই-নাম বা রাজ্য মান্ডি কৃষক নিবন্ধন" },
      { tag: "ডিজিটাল কৃষি", title: "ই-নাম সংযোগ: ১,৩৬১টি মান্ডি অনলাইনে যুক্ত", desc: "আন্তঃরাজ্য সরাসরি বাণিজ্য সম্প্রসারিত। স্বচ্ছ ইলেকট্রনিক নিলাম ব্যবস্থা কার্যকর।", ministry: "এসএফএসি (SFAC)", eligibility: "কৃষক, ব্যবসায়ী, এফপিও", docs: "আধার, মোবাইল নম্বর, ব্যাংক অ্যাকাউন্ট" },
      { tag: "আবহাওয়া বার্তা", title: "আইএমডি পূর্বাভাস: ১০৮% স্বাভাবিকের চেয়ে বেশি বৃষ্টি", desc: "মহারাষ্ট্র, মধ্যপ্রদেশ ও পাঞ্জাবে সক্রিয় বর্ষায় তৈলবীজ চাষে অনুকূল পরিবেশ।", ministry: "ভারতীয় আবহাওয়া বিভাগ (IMD)", eligibility: "সকল কৃষক", docs: "কোন নথির প্রয়োজন নেই" },
      { tag: "মান্ডি সংবাদ", title: "আজাদপুরে টমেটোর রেকর্ড আমদানি", desc: "৪,৮০০+ মেট্রিক টন তাজা আমদানির ফলে উত্তর ভারতে টমেটোর পাইকারি দাম স্থিতিশীল।", ministry: "দিল্লি কৃষি বিপণন বোর্ড (DAMB)", eligibility: "পাইকারি ক্রেতা ও ব্যবসায়ী", docs: "গেট পাস ও মান শংসাপত্র" },
      { tag: "বাজার সংযোগ", title: "১,২০০টি কৃষক উৎপাদক সংস্থা (FPO) সংযুক্ত", desc: "সরাসরি প্রাতিষ্ঠানিক ক্রেতাদের সাথে যুক্ত হয়ে ক্ষুদ্র চাষীরা পাচ্ছেন উপযুক্ত দাম।", ministry: "নাবার্ড ও ফেয়ারক্রপ সমবায় নেটওয়ার্ক", eligibility: "নিবন্ধিত কৃষক উৎপাদক সংস্থা (FPO)", docs: "এফপিও নিবন্ধন শংসাপত্র" },
      { tag: "রপ্তানি সুযোগ", title: "নন-বাসমতী চাল রপ্তানির দরজা উন্মুক্ত", desc: "আন্তর্জাতিক বাজারে প্রবেশের ফলে ১২ লাখ চাল চাষীর জন্য বাড়তি আয়ের সুযোগ।", ministry: "এপিডা ও বাণিজ্য মন্ত্রক", eligibility: "নিবন্ধিত চাল রপ্তানিকারক ও এফপিও", docs: "এপিডা নিবন্ধন" },
      { tag: "বীমা প্রকল্প", title: "পিএমএফবিওয়াই: ₹১.২৫ লক্ষ কোটি বীমা দাবি মেটানো হয়েছে", desc: "স্যাটেলাইট ও ড্রোনের মাধ্যমে ৪৮ ঘণ্টার মধ্যে দ্রুত ক্ষতিপূরণ প্রদান।", ministry: "কৃষি ও কৃষক কল্যাণ মন্ত্রক", eligibility: "সকল খরিফ ও রবি চাষী", docs: "বপন শংসাপত্র, জমির খতিয়ান, ব্যাংক পাসবই" },
      { tag: "সরাসরি সংগ্রহ", title: "ফার্ম-টু-রিটেল নেটওয়ার্কে ৫০,০০০ কৃষক", desc: "মধ্যস্বত্বভোগী ছাড়াই সরাসরি বাজার সরবরাহে কৃষকদের ১৮% বেশি লাভ নিশ্চিত।", ministry: "ফেয়ারক্রপ সরাসরি সংগ্রহ পরিকাঠামো", eligibility: "ফেয়ারক্রপে নিবন্ধিত সকল চাষী", docs: "মোবাইল ওটিপি ও ব্যাংক অ্যাকাউন্ট" }
    ]
  };

  /* ── 6 Newest Updates Live Multilingual Cards ── */
  const UPDATE_TRANSLATIONS = {
    en: [
      { label: 'PRICE UPDATE', time: '7 min ago', title: 'Tomato prices surge 12% across Delhi NCR', desc: 'Unseasonable rains in Maharashtra cause supply disruption — Azadpur mandi records ₹2,800/quintal.', loc: 'Delhi NCR', commodity: 'Tomato', mandi: 'Azadpur APMC', rate_band: '₹2,600 - ₹3,000/q (+12%)', impact: 'Persistent rainfall across Nashik and Kolar transit belts disrupted fresh haulage to Azadpur by 35%.', advisory: 'Farmers in Western UP and Haryana can capitalize on high arrival rates by routing Grade-A lots to Azadpur through FairCrop logistics before supplies stabilize next week.' },
      { label: 'MANDI ALERT', time: '5 min ago', title: 'Lasalgaon Mandi — New Onion Auction Season Opens', desc: 'Fresh Kharif onion arrivals begin. Over 15,000 MT expected this week. Register as buyer or seller.', loc: 'Nashik, MH', commodity: 'Onion (Kharif)', mandi: 'Lasalgaon APMC', rate_band: '₹1,550 - ₹1,850/q', impact: 'Electronic auction and automated assaying integration now live for all registered farmers.', advisory: 'Pre-book digital quality assaying on FairCrop to qualify for zero-commission institutional buying and direct warehousing.' },
      { label: 'GOVT. SCHEME', time: '12 min ago', title: 'PM-FASAL BIMA: Last Date to Enrol is August 31', desc: 'Kharif crop insurance enrolment deadline approaching. Visit nearest CSC or FairCrop to register.', loc: 'Pan India', commodity: 'All Kharif Crops', mandi: 'National e-NAM Portal', rate_band: '2% Farmer Premium (98% Govt Subsidy)', impact: 'Comprehensive coverage against unseasonal rainfall, localized pest infestation, and post-harvest losses.', advisory: 'Both loanee and non-loanee growers can upload land ownership documents (Khasra/Khatauni) on FairCrop for instant one-click policy generation.' },
      { label: 'PRICE UPDATE', time: '18 min ago', title: 'Wheat MSP: ₹2,275/quintal confirmed for Rabi 2026', desc: 'Cabinet approves enhanced MSP. Procurement to begin October. Register your holdings on FairCrop.', loc: 'North India', commodity: 'Wheat', mandi: 'FCI & State Agencies', rate_band: '₹2,275/q (MSP Floor Price)', impact: 'CCEA approves bonus price incentive for farmers across Punjab, Haryana, MP, and UP.', advisory: 'Verify your acreage and bank accounts on FairCrop to secure direct benefit transfer (DBT) tokens ahead of opening dates.' },
      { label: 'MARKET ALERT', time: '24 min ago', title: 'Potato Glut Warning — Prices May Fall 20% in UP', desc: 'Cold storage excess in Agra-Mathura. Farmers advised to explore alternative market channels.', loc: 'UP, Bihar', commodity: 'Potato', mandi: 'Agra-Mathura APMC', rate_band: '₹950 - ₹1,150/q (Down 18%)', impact: 'Cold storage capacity reached 92% occupancy across Agra belt; local arrivals outpacing wholesale demand.', advisory: 'Avoid distress local liquidations. Utilize FairCrop inter-state cold freight to ship grade-1 tubers to southern deficit markets (Bengaluru, Chennai) at 25% premium.' },
      { label: 'WEATHER', time: '31 min ago', title: 'IMD: Above-Normal Monsoon Forecast for Gujarat', desc: 'IMD reports 112% of LPA rain this season — beneficial for groundnut and cotton crop.', loc: 'Gujarat, Rajasthan', commodity: 'Groundnut & Cotton', mandi: 'Rajkot & Gondal APMC', rate_band: 'Favorable Soil Moisture (112% LPA)', impact: 'Enhanced soil water retention across Saurashtra belt; substantial reduction in tube-well diesel expenses.', advisory: 'Ensure clear drainage furrows in low-lying fields and schedule preventive anti-fungal bio-sprays during dry spells.' }
    ],
    hi: [
      { label: 'मूल्य अपडेट', time: '7 मिनट पहले', title: 'दिल्ली-एनसीआर में टमाटर के भाव में 12% उछाल', desc: 'महाराष्ट्र में बेमौसम बारिश से आपूर्ति प्रभावित — आजादपुर मंडी में भाव ₹2,800/क्विंटल दर्ज।', loc: 'दिल्ली एनसीआर', commodity: 'टमाटर', mandi: 'आजादपुर एपीएमसी', rate_band: '₹2,600 - ₹3,000/क्विंटल (+12%)', impact: 'नासिक और कोलार से आजादपुर पहुंचने वाले ट्रकों की आवक में 35% की कमी।', advisory: 'पश्चिमी उत्तर प्रदेश और हरियाणा के किसान फेयरक्रॉप लॉजिस्टिक्स के माध्यम से अपनी फसल आजादपुर भेजकर 10-15% का प्रीमियम प्राप्त कर सकते हैं।' },
      { label: 'मंडी अलर्ट', time: '5 मिनट पहले', title: 'लासलगांव मंडी — नया प्याज नीलामी सत्र शुरू', desc: 'खरीफ प्याज की ताजा आवक शुरू। इस सप्ताह 15,000 मीट्रिक टन से अधिक की उम्मीद।', loc: 'नासिक, महाराष्ट्र', commodity: 'खरीफ प्याज', mandi: 'लासलगांव मंडी', rate_band: '₹1,550 - ₹1,850/क्विंटल', impact: 'फेयरक्रॉप पोर्टल पर इलेक्ट्रॉनिक गुणवत्ता जांच और सीधी बोली की सुविधा शुरू।', advisory: 'सत्यापित खरीदारों से सीधी बोली प्राप्त करने के लिए अपनी फसल फेयरक्रॉप पर पहले से सूचीबद्ध करें।' },
      { label: 'सरकारी योजना', time: '12 मिनट पहले', title: 'पीएम-फसल बीमा: नामांकन की अंतिम तिथि 31 अगस्त', desc: 'खरीफ फसल बीमा नामांकन की अंतिम तिथि नजदीक। पंजीकरण के लिए निकटतम सीएससी या फेयरक्रॉप पर जाएं।', loc: 'अखिल भारतीय', commodity: 'सभी खरीफ फसलें', mandi: 'ई-नाम राष्ट्रीय पोर्टल', rate_band: 'केवल 2% प्रीमियम (98% सरकारी सब्सिडी)', impact: 'अतिवृष्टि, सूखा, कीट प्रकोप और कटाई के बाद के नुकसान से पूर्ण वित्तीय सुरक्षा।', advisory: 'ऋणी और गैर-ऋणी किसान फेयरक्रॉप पर अपनी खतौनी अपलोड कर तुरंत बीमा रसीद प्राप्त कर सकते हैं।' },
      { label: 'मूल्य अपडेट', time: '18 मिनट पहले', title: 'गेहूं एमएसपी: रबी 2026 के लिए ₹2,275/क्विंटल की पुष्टि', desc: 'कैबिनेट ने बढ़ी हुई एमएसपी को दी मंजूरी। खरीद अक्टूबर से शुरू होगी। फेयरक्रॉप पर पंजीकरण करें।', loc: 'उत्तर भारत', commodity: 'गेहूं', mandi: 'एफसीआई एवं सरकारी केंद्र', rate_band: '₹2,275/क्विंटल (न्यूनतम समर्थन मूल्य)', impact: 'सीसीईए ने पिछले वर्ष की तुलना में ₹150 प्रति क्विंटल की ऐतिहासिक बढ़ोतरी को मंजूरी दी।', advisory: 'खरीद केंद्रों पर बिना कतार के टोकन प्राप्त करने के लिए फेयरक्रॉप पर अपना पंजीकरण तुरंत पूरा करें।' },
      { label: 'बाजार अलर्ट', time: '24 मिनट पहले', title: 'आलू की बंपर आवक — यूपी में कीमतें 20% गिर सकती हैं', desc: 'आगरा-मथुरा में कोल्ड स्टोरेज में भारी स्टॉक। किसानों को फेयरक्रॉप पर वैकल्पिक बाजार तलाशने की सलाह।', loc: 'यूपी, बिहार', commodity: 'आलू', mandi: 'आगरा-मथुरा मंडी', rate_band: '₹950 - ₹1,150/क्विंटल (18% गिरावट)', impact: 'आगरा क्षेत्र के कोल्ड स्टोरेज 92% भर चुके हैं, जिससे स्थानीय मंडियों में भारी दबाव है।', advisory: 'कम दामों में बेचने के बजाय फेयरक्रॉप इंटर-स्टेट फ्रेट से दक्षिण भारतीय मंडियों (बेंगलुरु, चेन्नई) में 25% अधिक लाभ कमाएं।' },
      { label: 'मौसम', time: '31 मिनट पहले', title: 'आईएमडी: गुजरात के लिए सामान्य से अधिक मानसून का अनुमान', desc: 'आईएमडी ने इस सीजन 112% बारिश का अनुमान लगाया — मूंगफली और कपास की फसल के लिए फायदेमंद।', loc: 'गुजरात, राजस्थान', commodity: 'मूंगफली और कपास', mandi: 'राजकोट एवं गोंडल मंडी', rate_band: 'अनुकूल वर्षा (112% एलपीए)', impact: 'सौराष्ट्र क्षेत्र में भूजल स्तर में भारी सुधार; सिंचाई बिजली खर्च में बचत।', advisory: 'खेतों में जल निकासी सुनिश्चित करें और मौसम साफ रहने पर निवारक फफूंदनाशी का छिड़काव करें।' }
    ],
    bn: [
      { label: 'মূল্য আপডেট', time: '৭ মিনিট আগে', title: 'দিল্লি-এনসিআরে টমেটোর দাম ১২% বৃদ্ধি', desc: 'মহারাষ্ট্রে অকাল বৃষ্টির কারণে সরবরাহ ব্যাহত — আজাদপুর মান্ডিতে দর ₹২,৮০০/কুইন্টাল।', loc: 'দিল্লি এনসিআর', commodity: 'টমেটো', mandi: 'আজাদপুর এপিএমসি', rate_band: '₹২,৬০০ - ₹৩,০০০/কুইন্টাল (+১২%)', impact: 'মহারাষ্ট্র ও কর্ণাটক সরবরাহ লাইনে বৃষ্টির কারণে আজাদপুরে দৈনিক আমদানি ৩৫% হ্রাস পেয়েছে।', advisory: 'কৃষকরা ফেয়ারক্রপ সরাসরি ট্রান্সপোর্টেশন ব্যবহার করে আজাদপুর মান্ডিতে সরবরাহ করে ১০-১৫% বেশি লাভ অর্জন করতে পারেন।' },
      { label: 'মান্ডি সতর্কতা', time: '৫ মিনিট আগে', title: 'লাসলগাঁও মান্ডি — নতুন পেঁয়াজ নিলাম মৌসুম শুরু', desc: 'তাজা খরিফ পেঁয়াজের আগমন শুরু। এই সপ্তাহে ১৫,০০০ মেট্রিক টনের বেশি প্রত্যাশিত। ক্রেতা বা বিক্রেতা হিসেবে নিবন্ধন করুন।', loc: 'নাসিক, মহারাষ্ট্র', commodity: 'পেঁয়াজ (খরিফ)', mandi: 'লাসলগাঁও মান্ডি', rate_band: '₹১,৫৫০ - ₹১,৮৫০/কুইন্টাল', impact: 'ডিজিটাল নিলাম ও ইলেকট্রনিক গ্রেডিং ব্যবস্থা সমস্ত নিবন্ধিত কৃষকদের জন্য চালু হয়েছে।', advisory: 'প্রাতিষ্ঠানিক ক্রেতাদের সাথে সরাসরি সংযোগ এবং ন্যায্য মূল্য নিশ্চিত করতে ফেয়ারক্রপে আপনার লট বুক করুন।' },
      { label: 'সরকারি প্রকল্প', time: '১২ মিনিট আগে', title: 'পিএম-ফসল বিমা: নথিভুক্তির শেষ তারিখ ৩১ আগস্ট', desc: 'খরিফ ফসল বিমা নথিভুক্তির শেষ তারিখ আসন্ন। নিবন্ধনের জন্য নিকটস্থ সিএসসি বা ফেয়ারক্রপে যান।', loc: 'সমগ্র ভারত', commodity: 'সকল খরিফ ফসল', mandi: 'ই-নাম জাতীয় পোর্টাল', rate_band: 'মাত্র ২% প্রিমিয়াম (৯৮% সরকারি ভর্তুকি)', impact: 'অকাল বৃষ্টি, খরা ও পোকামাকড়ের ক্ষতির বিরুদ্ধে শতভাগ আর্থিক সুরক্ষা প্রদান করে।', advisory: 'ফেয়ারক্রপ অ্যাপের মাধ্যমে জমির পরচা আপলোড করে অবিলম্বে অনলাইন পলিসি গ্রহণ করুন।' },
      { label: 'মূল্য আপডেট', time: '১৮ মিনিট আগে', title: 'গমের এমএসপি: রবি ২০২৬-এর জন্য ₹২,২৭৫/কুইন্টাল নির্ধারিত', desc: 'মন্ত্রিসভা বর্ধিত এমএসপি অনুমোদন করেছে। অক্টোবর থেকে সংগ্রহ শুরু। ফেয়ারক্রপে আপনার ফসল নিবন্ধন করুন।', loc: 'উত্তর ভারত', commodity: 'গম', mandi: 'এফসিআই ও রাজ্য সংস্থাসমূহ', rate_band: '₹২,২৭৫/কুইন্টাল (এমএসপি সহায়ক মূল্য)', impact: 'অর্থনৈতিক বিষয়ক মন্ত্রিসভা কমিটি খরিফ পরবর্তী গম চাষীদের জন্য বর্ধিত দর নিশ্চিত করেছে।', advisory: 'সরাসরি ব্যাংক অ্যাকাউন্টে পেমেন্ট পেতে ফেয়ারক্রপে অবিলম্বে রবি ফসলের জমি নিবন্ধন করুন।' },
      { label: 'বাজার সতর্কতা', time: '২৪ মিনিট আগে', title: 'আলুর অতিরিক্ত সরবরাহ — ইউপিতে দাম ২০% কমতে পারে', desc: 'আগ্রা-মথুরায় কোল্ড স্টোরেজে অতিরিক্ত মজুত। কৃষকদের বিকল্প বাজার অনুসন্ধানের পরামর্শ দেওয়া হচ্ছে।', loc: 'ইউপি, বিহার', commodity: 'আলু', mandi: 'আগ্রা-মথুরা মান্ডি', rate_band: '₹৯৫০ - ₹১,১৫০/কুইন্টাল (১৮% হ্রাস)', impact: 'আগ্রা অঞ্চলের কোল্ড স্টোরেজে ৯২% স্থান পূর্ণ হওয়ায় স্থানীয় মান্ডিতে অতিরিক্ত চাপ তৈরি হয়েছে।', advisory: 'কম দামে না বিক্রি করে ফেয়ারক্রপ কোল্ড চেইন লজিস্টিকসের মাধ্যমে দক্ষিণ ভারতের বাজারে (বেঙ্গালুরু, চেন্নাই) ২৫% বেশি দামে বিক্রয় করুন।' },
      { label: 'আবহাওয়া', time: '৩১ মিনিট আগে', title: 'আইএমডি: গুজরাটে স্বাভাবিকের চেয়ে বেশি বর্ষার পূর্বাভাস', desc: 'আইএমডি এই মরশুমে ১১২% বৃষ্টির রিপোর্ট দিয়েছে — চীনাবাদাম এবং তুলা চাষের জন্য অত্যন্ত উপকারী।', loc: 'গুজরাট, রাজস্থান', commodity: 'চীনাবাদাম ও তুলা', mandi: 'রাজকোট ও গন্ডাল মান্ডি', rate_band: 'অনুকূল আর্দ্রতা (১১২% বৃষ্টিপাত)', impact: 'সৌরাষ্ট্র অঞ্চলে ভূগর্ভস্থ পানির স্তর বৃদ্ধি পেয়েছে এবং সেচের বিদ্যুৎ খরচ ব্যাপকভাবে কমেছে।', advisory: 'নিচু জমিতে জল নিষ্কাশন ব্যবস্থা প্রস্তুত রাখুন এবং ছত্রাকজনিত রোগের প্রতিরোধমূলক স্প্রে করুন।' }
    ]
  };

  let currentUpdatesCache = [
    { tag: 'u-price',   label: 'Price Update',  icon: 'trend',   title: 'Tomato prices surge 12% across Delhi NCR',         desc: 'Unseasonable rains in Maharashtra cause supply disruption — Azadpur mandi records ₹2,800/quintal.',   loc: 'Delhi NCR',        time: '7 min ago',  commodity: 'Tomato', mandi: 'Azadpur APMC', rate_band: '₹2,600 - ₹3,000/q' },
    { tag: 'u-mandi',   label: 'Mandi Alert',   icon: 'store',   title: 'Lasalgaon Mandi — New Onion Auction Season Opens',  desc: 'Fresh Kharif onion arrivals begin. Over 15,000 MT expected this week. Register as buyer or seller.', loc: 'Nashik, MH',       time: '5 min ago',  commodity: 'Onion', mandi: 'Lasalgaon Mandi', rate_band: '₹1,550 - ₹1,850/q' },
    { tag: 'u-scheme',  label: 'Govt. Scheme',  icon: 'doc',     title: 'PM-FASAL BIMA: Last Date to Enrol is August 31',   desc: 'Kharif crop insurance enrolment deadline approaching. Visit nearest CSC or FairCrop to register.',   loc: 'Pan India',        time: '12 min ago', commodity: 'Crop Insurance', mandi: 'PMFBY Scheme', rate_band: '2% Premium Subsidy' },
    { tag: 'u-price',   label: 'Price Update',  icon: 'trend',   title: 'Wheat MSP: ₹2,275/quintal confirmed for Rabi 2026',desc: 'Cabinet approves enhanced MSP. Procurement to begin October. Register your holdings on FairCrop.',  loc: 'North India',      time: '18 min ago', commodity: 'Wheat', mandi: 'FCI Procurement', rate_band: '₹2,275/quintal' },
    { tag: 'u-alert',   label: 'Market Alert',  icon: 'alert',   title: 'Potato Glut Warning — Prices May Fall 20% in UP',  desc: 'Cold storage excess in Agra-Mathura. Farmers advised to explore alternative market channels.',        loc: 'UP, Bihar',        time: '24 min ago', commodity: 'Potato', mandi: 'Agra-Mathura Hub', rate_band: '₹950 - ₹1,150/q' },
    { tag: 'u-weather', label: 'Weather',       icon: 'weather', title: 'IMD: Above-Normal Monsoon Forecast for Gujarat',   desc: 'IMD reports 112% of LPA rain this season — beneficial for groundnut and cotton crop.',                loc: 'Gujarat, Rajasthan',time: '31 min ago', commodity: 'Groundnut & Cotton', mandi: 'Rajkot APMC', rate_band: '112% Rainfall Forecast' },
  ];

  let activeUpdateCategory = 'all';
  let updateSearchQuery = '';
  let autoRefreshCountdown = 30;
  let autoRefreshTimer = null;

  const langGrid  = document.getElementById('lang-grid');
  const langBtn   = document.getElementById('lang-btn');
  const langPanel = document.getElementById('lang-panel');
  let activeLang  = localStorage.getItem('faircrop_lang') || 'en';

  if (langGrid) {
    langGrid.innerHTML = '';
    languages.forEach(l => {
      const el = document.createElement('div');
      el.className = 'lang-opt clickable' + (l.code === activeLang ? ' active' : '');
      el.setAttribute('role', 'menuitem');
      el.setAttribute('tabindex', '0');
      el.dataset.code = l.code;
      el.innerHTML = `${l.native}<span class="lang-sub">${l.label}</span>`;
      el.addEventListener('click', () => {
        document.querySelectorAll('.lang-opt').forEach(o => o.classList.remove('active'));
        el.classList.add('active');
        activeLang = l.code;
        try { localStorage.setItem('faircrop_lang', l.code); } catch(e) {}
        closeLang();
        applyLanguage(l.code);
        showToast(`Language switched to ${l.label} (${l.native})`);
      });
      langGrid.appendChild(el);
    });
  }

  function closeLang() {
    if (langPanel && langBtn) {
      langPanel.classList.remove('open');
      langBtn.setAttribute('aria-expanded', 'false');
    }
  }

  if (langBtn && langPanel) {
    langBtn.addEventListener('click', e => {
      e.stopPropagation();
      const o = langPanel.classList.toggle('open');
      langBtn.setAttribute('aria-expanded', String(o));
    });
    document.addEventListener('click', closeLang);
    langPanel.addEventListener('click', e => e.stopPropagation());
  }

  /* ── Category Dropdown ── */
  const heroCatBtn = document.getElementById('hero-cat-btn');
  const catPanel   = document.getElementById('cat-panel');

  if (heroCatBtn && catPanel) {
    heroCatBtn.addEventListener('click', e => {
      e.stopPropagation();
      const o = catPanel.classList.toggle('open');
      heroCatBtn.setAttribute('aria-expanded', String(o));
    });

    document.addEventListener('click', () => {
      catPanel.classList.remove('open');
      heroCatBtn.setAttribute('aria-expanded', 'false');
    });

    catPanel.addEventListener('click', e => e.stopPropagation());

    document.querySelectorAll('.cat-row').forEach(r => {
      r.addEventListener('click', () => {
        heroCatBtn.childNodes[0].textContent = r.textContent.trim().replace(/\s+/g, ' ') + ' ';
        catPanel.classList.remove('open');
        heroCatBtn.setAttribute('aria-expanded', 'false');
        showToast(`Filtered by: ${r.textContent.trim()}`);
      });
    });
  }

  /* ── Carousel Timers & Factory ── */
  let c1Timer = null, c2Timer = null;

  function initCarousel(trackId, prevId, nextId, dotsId, autoMs = 5000, timerType = 1) {
    const track = document.getElementById(trackId);
    if (!track) return;
    const slides = track.querySelectorAll('.carousel-slide');
    const dotsWrap = document.getElementById(dotsId);
    let cur = 0;

    if (timerType === 1 && c1Timer) clearInterval(c1Timer);
    if (timerType === 2 && c2Timer) clearInterval(c2Timer);

    if (dotsWrap) {
      dotsWrap.innerHTML = '';
      slides.forEach((_, i) => {
        const d = document.createElement('div');
        d.className = 'c-dot' + (i === 0 ? ' active' : '');
        d.setAttribute('role', 'button');
        d.setAttribute('tabindex', '0');
        d.setAttribute('aria-label', `Slide ${i + 1}`);
        d.addEventListener('click', () => { goTo(i); resetTimer(); });
        dotsWrap.appendChild(d);
      });
    }

    function goTo(idx) {
      cur = (idx + slides.length) % slides.length;
      track.style.transform = `translateX(-${cur * 100}%)`;
      if (dotsWrap) {
        dotsWrap.querySelectorAll('.c-dot').forEach((d, i) => d.classList.toggle('active', i === cur));
      }
    }

    function resetTimer() {
      if (timerType === 1) {
        clearInterval(c1Timer);
        c1Timer = setInterval(() => goTo(cur + 1), autoMs);
      } else {
        clearInterval(c2Timer);
        c2Timer = setInterval(() => goTo(cur + 1), autoMs);
      }
    }

    const prevBtn = document.getElementById(prevId);
    const nextBtn = document.getElementById(nextId);
    if (prevBtn) prevBtn.onclick = () => { goTo(cur - 1); resetTimer(); };
    if (nextBtn) nextBtn.onclick = () => { goTo(cur + 1); resetTimer(); };

    resetTimer();
  }

  /* ── Crop Thumbnail Images ── */
  const CROP_IMAGES = {
    'Tomato (Hybrid)':            'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=120&q=80',
    'Onion (Red)':                'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=120&q=80',
    'Wheat (Sharbati)':           'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=120&q=80',
    'Maize (Yellow)':             'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=120&q=80',
    'Potato (Jyoti)':             'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=120&q=80',
    'Moong Dal':                  'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=120&q=80',
    'Red Chilli (Teja)':          'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=120&q=80',
    'Banana (Grand Naine)':       'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=120&q=80',
    'Basmati Rice (1121)':        'https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?w=120&q=80',
    'Cauliflower':                'https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?w=120&q=80',
    'Groundnut (Bold)':           'https://images.unsplash.com/photo-1567892328521-850689b91016?w=120&q=80',
    'Coffee (Arabica Plantation)':'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=120&q=80',
  };

  const SCHEME_IMAGES = [
    'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=150&q=80',
    'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=150&q=80',
    'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?w=150&q=80',
    'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=150&q=80',
    'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=150&q=80',
    'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=150&q=80',
    'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=150&q=80',
    'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=150&q=80',
    'https://images.unsplash.com/photo-1542838132-92c53300491e?w=150&q=80',
  ];

  /* ── Render Carousel 1 (Live Mandi Prices) in Selected Language ── */
  function renderMandiPriceCarousel(langCode) {
    const track = document.getElementById('c1-track');
    if (!track) return;

    const baseItems = [
      // Slide 1
      [
        { key: 'Tomato (Hybrid)', loc: 'Azadpur Mandi, Delhi', price: '₹2,400/q', min: '₹2,200', max: '₹2,650', chg: '▲ +8.3%', cls: 'chg-up', msp: '₹2,000/q', arrivals: '4,800 MT' },
        { key: 'Onion (Red)', loc: 'Lasalgaon Mandi, Nashik', price: '₹1,850/q', min: '₹1,600', max: '₹2,100', chg: '▼ -3.1%', cls: 'chg-dn', msp: '₹1,750/q', arrivals: '15,200 MT' },
        { key: 'Wheat (Sharbati)', loc: 'Khanna Mandi, Punjab', price: '₹2,275/q', min: '₹2,275', max: '₹2,380', chg: '● MSP', cls: 'chg-eq', msp: '₹2,275/q', arrivals: '9,400 MT' },
        { key: 'Maize (Yellow)', loc: 'Gulbarga Mandi, Karnataka', price: '₹1,960/q', min: '₹1,850', max: '₹2,080', chg: '▲ +5.2%', cls: 'chg-up', msp: '₹1,950/q', arrivals: '3,200 MT' },
      ],
      // Slide 2
      [
        { key: 'Potato (Jyoti)', loc: 'Agra Mandi, Uttar Pradesh', price: '₹1,200/q', min: '₹1,050', max: '₹1,320', chg: '▲ +2.1%', cls: 'chg-up', msp: '₹1,100/q', arrivals: '18,500 MT' },
        { key: 'Moong Dal', loc: 'Indore Mandi, Madhya Pradesh', price: '₹7,500/q', min: '₹7,200', max: '₹7,850', chg: '▼ -1.5%', cls: 'chg-dn', msp: '₹7,400/q', arrivals: '1,800 MT' },
        { key: 'Red Chilli (Teja)', loc: 'Guntur Mandi, Andhra Pradesh', price: '₹14,200/q', min: '₹13,500', max: '₹15,200', chg: '▲ +11.4%', cls: 'chg-up', msp: '₹12,000/q', arrivals: '6,400 MT' },
        { key: 'Banana (Grand Naine)', loc: 'Jalgaon Mandi, Maharashtra', price: '₹2,100/q', min: '₹1,950', max: '₹2,250', chg: '● Stable', cls: 'chg-eq', msp: '₹1,900/q', arrivals: '8,900 MT' },
      ],
      // Slide 3
      [
        { key: 'Basmati Rice (1121)', loc: 'Karnal Mandi, Haryana', price: '₹4,800/q', min: '₹4,500', max: '₹5,100', chg: '▲ +6.8%', cls: 'chg-up', msp: '₹4,200/q', arrivals: '12,000 MT' },
        { key: 'Cauliflower', loc: 'Solan Mandi, Himachal Pradesh', price: '₹800/q', min: '₹650', max: '₹950', chg: '▼ -12.0%', cls: 'chg-dn', msp: '₹750/q', arrivals: '2,100 MT' },
        { key: 'Groundnut (Bold)', loc: 'Rajkot Mandi, Gujarat', price: '₹5,200/q', min: '₹5,050', max: '₹5,400', chg: '● MSP', cls: 'chg-eq', msp: '₹5,200/q', arrivals: '7,600 MT' },
        { key: 'Coffee (Arabica Plantation)', loc: 'Chikmagalur, Karnataka', price: '₹9,600/q', min: '₹9,200', max: '₹10,100', chg: '▲ +4.5%', cls: 'chg-up', msp: '₹8,800/q', arrivals: '1,400 MT' },
      ]
    ];

    track.innerHTML = baseItems.map(slideItems => `
      <div class="carousel-slide">
        ${slideItems.map((item, idx) => {
          const transName = (CROP_TRANSLATIONS[item.key] && CROP_TRANSLATIONS[item.key][langCode]) || item.key;
          const imgUrl = CROP_IMAGES[item.key] || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=120&q=80';
          return `
            <div class="price-row clickable" data-crop-key="${item.key}" role="button" tabindex="0" aria-label="${transName} mandi rate">
              <div class="price-left">
                <img src="${imgUrl}" alt="${transName}" class="crop-thumb" loading="lazy">
                <div>
                  <div class="crop-name">${transName}</div>
                  <div class="crop-loc">${item.loc}</div>
                </div>
              </div>
              <div class="price-right">
                <div class="price-amt">${item.price}</div>
                <div class="price-chg ${item.cls}">${item.chg}</div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `).join('');

    // Attach click listeners to all price rows
    track.querySelectorAll('.price-row').forEach(row => {
      row.addEventListener('click', () => {
        const cropKey = row.dataset.cropKey;
        const flatItems = baseItems.flat();
        const found = flatItems.find(it => it.key === cropKey) || flatItems[0];
        showCropPriceModal(found, langCode);
      });
    });

    initCarousel('c1-track', 'c1-prev', 'c1-next', 'c1-dots', 5000, 1);
  }

  /* ── Render Carousel 2 (Schemes & Market News) in Selected Language ── */
  function renderSchemeCarousel(langCode) {
    const track = document.getElementById('c2-track');
    if (!track) return;

    const list = SCHEME_TRANSLATIONS[langCode] || SCHEME_TRANSLATIONS['hi'] || SCHEME_TRANSLATIONS['en'];
    const chunkSize = 3;
    const slides = [];
    for (let i = 0; i < list.length; i += chunkSize) {
      slides.push(list.slice(i, i + chunkSize));
    }

    track.innerHTML = slides.map((chunk, slideIdx) => `
      <div class="carousel-slide">
        ${chunk.map((item, itemIdx) => {
          const imgIdx = slideIdx * chunkSize + itemIdx;
          const imgUrl = SCHEME_IMAGES[imgIdx % SCHEME_IMAGES.length];
          return `
            <div class="scheme-row clickable" data-scheme-idx="${imgIdx}" role="button" tabindex="0" aria-label="${item.title}">
              <img src="${imgUrl}" alt="${item.title}" class="scheme-thumb" loading="lazy">
              <div class="scheme-content">
                <div class="scheme-tag">${item.tag}</div>
                <div class="scheme-title">${item.title}</div>
                <div class="scheme-desc">${item.desc}</div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `).join('');

    // Attach click listeners to all scheme rows
    track.querySelectorAll('.scheme-row').forEach(row => {
      row.addEventListener('click', () => {
        const idx = parseInt(row.dataset.schemeIdx) || 0;
        const schemeItem = list[idx] || list[0];
        showSchemeDetailModal(schemeItem, langCode);
      });
    });

    initCarousel('c2-track', 'c2-prev', 'c2-next', 'c2-dots', 6500, 2);
  }

  /* ── Animated Counter ── */
  function animCount(el, target, ms = 1800) {
    const start = performance.now();
    const fmt = n => n >= 1000 ? (n / 1000).toFixed(n >= 10000 ? 0 : 1) + 'K+' : n + '+';
    (function tick(now) {
      const p = Math.min((now - start) / ms, 1);
      const e = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(Math.round(e * target));
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = fmt(target);
    })(start);
  }

  /* ── Intersection Observer ── */
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      if (entry.target.classList.contains('stats-bar')) {
        entry.target.querySelectorAll('[data-count]').forEach(el => animCount(el, parseInt(el.dataset.count)));
      }
      io.unobserve(entry.target);
    });
  }, { threshold: 0.14 });

  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
  const sBar = document.querySelector('.stats-bar');
  if (sBar) io.observe(sBar);

  /* ── Live Stats Bar Backend Sync ── */
  async function loadStats() {
    try {
      const stats = await api.getStats();
      const mapping = {
        'stat-mandis':   stats.mandis,
        'stat-farmers':  stats.farmers,
        'stat-states':   stats.states,
        'stat-crops':    stats.crops_tracked,
      };
      Object.entries(mapping).forEach(([id, val]) => {
        const el = document.getElementById(id);
        if (el) {
          el.dataset.count = val;
          if (el.closest('.stats-bar')?.classList.contains('visible')) {
            animCount(el, val);
          }
        }
      });
    } catch (e) {
      if (!e.offline) console.warn('[FairCrop] Stats fetch failed:', e.message);
    }
  }
  loadStats();

  /* ──────────────────────────────────────────────────────────
     LIVE BACKEND DATA — Section 4 Interactive Newest Updates
  ─────────────────────────────────────────────────────────── */
  const iconSVG = {
    trend:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>`,
    store:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
    doc:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`,
    alert:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
    weather: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M20 17.58A5 5 0 0 0 18 8h-1.26A8 8 0 1 0 4 16.25"/><line x1="8" y1="19" x2="8" y2="21"/><line x1="8" y1="13" x2="8" y2="15"/><line x1="16" y1="19" x2="16" y2="21"/><line x1="16" y1="13" x2="16" y2="15"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="12" y1="15" x2="12" y2="17"/></svg>`,
    loc:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`,
  };

  function updateCategoryCounts() {
    const counts = {
      'count-all': currentUpdatesCache.length,
      'count-price': currentUpdatesCache.filter(u => u.tag === 'u-price').length,
      'count-mandi': currentUpdatesCache.filter(u => u.tag === 'u-mandi').length,
      'count-scheme': currentUpdatesCache.filter(u => u.tag === 'u-scheme').length,
      'count-alert': currentUpdatesCache.filter(u => u.tag === 'u-alert' || u.tag === 'u-weather').length
    };
    Object.entries(counts).forEach(([id, num]) => {
      const el = document.getElementById(id);
      if (el) el.textContent = num;
    });
  }

  function getLocalizedUpdate(item, index, langCode) {
    const lang = UPDATE_TRANSLATIONS[langCode] ? langCode : (UPDATE_TRANSLATIONS['hi'] ? 'hi' : 'en');
    const tList = UPDATE_TRANSLATIONS[lang] || UPDATE_TRANSLATIONS['en'];
    const tItem = tList && tList[index];
    const t = TRANSLATIONS[langCode] || TRANSLATIONS['hi'] || TRANSLATIONS['en'];

    return {
      ...item,
      label: (tItem && tItem.label) || item.label,
      title: (tItem && tItem.title) || item.title,
      desc: (tItem && tItem.desc) || item.desc,
      loc: (tItem && tItem.loc) || item.loc,
      time: (tItem && tItem.time) || item.time,
      commodity: (tItem && tItem.commodity) || item.commodity || 'Produce',
      mandi: (tItem && tItem.mandi) || item.mandi || item.loc,
      rate_band: (tItem && tItem.rate_band) || item.rate_band || 'Verified Rate',
      impact: (tItem && tItem.impact) || item.impact || '',
      advisory: (tItem && tItem.advisory) || item.advisory || '',
      readMore: t.read_more || 'Read more →'
    };
  }

  function renderUpdates(data) {
    const grid = document.getElementById('updates-grid');
    if (!grid) return;
    if (data && Array.isArray(data) && data.length > 0) {
      currentUpdatesCache = data;
    }
    updateCategoryCounts();

    const lang = activeLang || localStorage.getItem('faircrop_lang') || 'en';
    const t = TRANSLATIONS[lang] || TRANSLATIONS['hi'] || TRANSLATIONS['en'];
    grid.innerHTML = '';

    const filtered = currentUpdatesCache.map((rawItem, i) => getLocalizedUpdate(rawItem, i, lang)).filter(item => {
      let matchCat = false;
      if (activeUpdateCategory === 'all') matchCat = true;
      else if (activeUpdateCategory === 'u-price' && item.tag === 'u-price') matchCat = true;
      else if (activeUpdateCategory === 'u-mandi' && item.tag === 'u-mandi') matchCat = true;
      else if (activeUpdateCategory === 'u-scheme' && item.tag === 'u-scheme') matchCat = true;
      else if (activeUpdateCategory === 'u-alert' && (item.tag === 'u-alert' || item.tag === 'u-weather')) matchCat = true;

      if (!matchCat) return false;

      if (updateSearchQuery) {
        const q = updateSearchQuery.toLowerCase().trim();
        const haystack = `${item.title} ${item.desc} ${item.loc} ${item.commodity} ${item.mandi} ${item.label}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; padding: 48px 24px; text-align: center; background: rgba(255,255,255,0.02); border: 1px dashed rgba(255,107,0,0.3); border-radius: 12px;">
          <div style="font-size: 2.2rem; margin-bottom: 8px;">🔍</div>
          <h4 style="font-size: 1.05rem; color: #fff; margin-bottom: 6px;">No updates found</h4>
          <p style="font-size: 0.84rem; color: #94a3b8; margin-bottom: 16px;">Try searching for a different keyword or reset the category filter.</p>
          <button id="reset-updates-filter-btn" class="fc-btn-sec" style="display:inline-block; border-color: rgba(255,107,0,0.4); color: #FF9E45;">Reset All Filters</button>
        </div>
      `;
      const resetBtn = document.getElementById('reset-updates-filter-btn');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          activeUpdateCategory = 'all';
          updateSearchQuery = '';
          const sInput = document.getElementById('updates-search-input');
          if (sInput) sInput.value = '';
          const sClear = document.getElementById('updates-search-clear');
          if (sClear) sClear.style.display = 'none';
          document.querySelectorAll('#updates-filters-bar .u-filter-pill').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === 'all');
          });
          renderUpdates();
        });
      }
      return;
    }

    filtered.forEach((item, i) => {
      const c = document.createElement('div');
      c.className = 'update-card';
      c.style.animationDelay = (i * 0.06) + 's';
      c.style.cursor = 'pointer';
      c.setAttribute('tabindex', '0');
      c.setAttribute('role', 'article');
      c.setAttribute('aria-label', item.title);

      c.innerHTML = `
        <div class="update-card-top">
          <span class="u-tag ${item.tag}">${item.label}</span>
          <span class="u-time">${item.time}</span>
        </div>
        <div class="update-icon" aria-hidden="true">${iconSVG[item.icon] || ''}</div>
        <h4>${item.title}</h4>
        <p>${item.desc}</p>
        <div class="update-foot">
          <span class="u-loc">${iconSVG.loc}${item.loc}</span>
          <span class="u-cta clickable">${item.readMore}</span>
        </div>
        <div class="update-actions" style="margin-top: 12px; padding-top: 10px; border-top: 1px solid rgba(255,255,255,0.06); display: flex; align-items: center; justify-content: space-between; gap: 8px;">
          <button class="u-quick-btn u-alert-btn" title="Set Price Alert" style="padding: 4px 10px; font-size: 0.72rem; border-radius: 6px; background: rgba(255,107,0,0.1); border: 1px solid rgba(255,107,0,0.25); color: #FF9E45; cursor: pointer; display: inline-flex; align-items: center; gap: 4px;">
            🔔 <span>${t.quick_alert || 'Alert'}</span>
          </button>
          <button class="u-quick-btn u-share-btn" title="Share Update" style="padding: 4px 10px; font-size: 0.72rem; border-radius: 6px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.12); color: #cbd5e1; cursor: pointer; display: inline-flex; align-items: center; gap: 4px;">
            🔗 <span>${t.quick_share || 'Share'}</span>
          </button>
        </div>
      `;

      const alertBtn = c.querySelector('.u-alert-btn');
      if (alertBtn) {
        alertBtn.addEventListener('click', e => {
          e.stopPropagation();
          showToast(`🔔 Price alert activated for ${item.commodity || 'this crop'}!`);
        });
      }

      const shareBtn = c.querySelector('.u-share-btn');
      if (shareBtn) {
        shareBtn.addEventListener('click', e => {
          e.stopPropagation();
          const shareText = `📢 [FairCrop Update] ${item.title}\n📍 Location: ${item.loc}\n💡 ${item.desc}\nCheck more at https://faircrop.in/`;
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(shareText);
          }
          showToast(`📤 Update copied to clipboard!`);
        });
      }

      c.addEventListener('click', () => {
        showUpdateDetailModal(item);
      });
      c.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          showUpdateDetailModal(item);
        }
      });

      grid.appendChild(c);
    });
  }

  async function loadLiveUpdates(isManual = false) {
    const refreshBtn = document.getElementById('updates-manual-refresh');
    const refreshIcon = refreshBtn?.querySelector('svg');
    if (refreshBtn) refreshBtn.classList.add('spinning');

    try {
      const updates = await api.getLiveUpdates();
      if (updates && updates.length > 0) {
        renderUpdates(updates);
      } else {
        renderUpdates(currentUpdatesCache);
      }
      if (isManual) {
        showToast('✅ Updates synchronized with e-NAM live feed!');
      }
    } catch (e) {
      renderUpdates(currentUpdatesCache);
      if (isManual) showToast('Loaded latest cached agricultural intelligence.');
    } finally {
      if (refreshBtn) {
        setTimeout(() => refreshBtn.classList.remove('spinning'), 600);
      }
    }
  }

  function startAutoRefreshCountdown() {
    if (autoRefreshTimer) clearInterval(autoRefreshTimer);
    autoRefreshCountdown = 30;
    const timerText = document.getElementById('updates-timer-text');

    autoRefreshTimer = setInterval(() => {
      autoRefreshCountdown--;
      if (timerText) {
        const lang = activeLang || localStorage.getItem('faircrop_lang') || 'en';
        const t = TRANSLATIONS[lang] || TRANSLATIONS['hi'] || TRANSLATIONS['en'];
        timerText.textContent = `${t.auto_refresh} ${autoRefreshCountdown}s`;
      }
      if (autoRefreshCountdown <= 0) {
        autoRefreshCountdown = 30;
        loadLiveUpdates(false);
      }
    }, 1000);
  }

  const filtersBar = document.getElementById('updates-filters-bar');
  if (filtersBar) {
    filtersBar.addEventListener('click', e => {
      const btn = e.target.closest('.u-filter-pill');
      if (!btn) return;
      filtersBar.querySelectorAll('.u-filter-pill').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeUpdateCategory = btn.dataset.filter || 'all';
      renderUpdates();
    });
  }

  const updatesSearchInput = document.getElementById('updates-search-input');
  const updatesSearchClear = document.getElementById('updates-search-clear');
  if (updatesSearchInput) {
    updatesSearchInput.addEventListener('input', e => {
      updateSearchQuery = e.target.value;
      if (updatesSearchClear) {
        updatesSearchClear.style.display = updateSearchQuery.length > 0 ? 'block' : 'none';
      }
      renderUpdates();
    });
  }
  if (updatesSearchClear) {
    updatesSearchClear.addEventListener('click', () => {
      if (updatesSearchInput) updatesSearchInput.value = '';
      updateSearchQuery = '';
      updatesSearchClear.style.display = 'none';
      renderUpdates();
      if (updatesSearchInput) updatesSearchInput.focus();
    });
  }

  const manualRefreshBtn = document.getElementById('updates-manual-refresh');
  if (manualRefreshBtn) {
    manualRefreshBtn.addEventListener('click', () => {
      autoRefreshCountdown = 30;
      loadLiveUpdates(true);
    });
  }

  loadLiveUpdates();
  startAutoRefreshCountdown();

  /* ══════════════════════════════════════════════════════════════
     INTERACTIVE POPUP MODAL SYSTEM (Major Cities, Updates, Prices)
  ══════════════════════════════════════════════════════════════ */

  function injectInfoModalStyles() {
    if (document.getElementById('__fc-info-modal-styles')) return;
    const s = document.createElement('style');
    s.id = '__fc-info-modal-styles';
    s.textContent = `
      .fc-modal-overlay {
        position: fixed; inset: 0; background: rgba(5, 7, 13, 0.85);
        backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
        z-index: 10000; display: flex; align-items: center; justify-content: center;
        padding: 16px; opacity: 0; pointer-events: none; transition: opacity 0.25s ease;
      }
      .fc-modal-overlay.open { opacity: 1; pointer-events: all; }
      .fc-modal-box {
        background: #111422; border: 1px solid rgba(255, 107, 0, 0.32);
        border-radius: 14px; width: 100%; max-width: 680px; max-height: 88vh;
        display: flex; flex-direction: column; overflow: hidden;
        box-shadow: 0 20px 60px rgba(0,0,0,0.7), 0 0 40px rgba(255,107,0,0.15);
        transform: translateY(20px) scale(0.97); transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        color: #f1f5f9; font-family: 'Inter', sans-serif;
      }
      [data-theme="light"] .fc-modal-box {
        background: #ffffff; border-color: rgba(255, 107, 0, 0.35); color: #0f172a;
        box-shadow: 0 20px 50px rgba(0,0,0,0.15), 0 0 30px rgba(255,107,0,0.1);
      }
      .fc-modal-overlay.open .fc-modal-box { transform: translateY(0) scale(1); }
      .fc-modal-hdr {
        padding: 18px 22px; border-bottom: 1px solid rgba(255,255,255,0.08);
        display: flex; align-items: center; justify-content: space-between; gap: 12px;
        background: rgba(255,255,255,0.02);
      }
      [data-theme="light"] .fc-modal-hdr { border-bottom-color: rgba(0,0,0,0.08); background: #f8fafc; }
      .fc-modal-title-wrap { display: flex; align-items: center; gap: 10px; }
      .fc-modal-icon {
        width: 38px; height: 38px; border-radius: 9px;
        background: linear-gradient(135deg, rgba(255,107,0,0.2), rgba(255,158,69,0.1));
        border: 1px solid rgba(255,107,0,0.35); display: flex; align-items: center; justify-content: center;
        color: #FF6B00; flex-shrink: 0; font-size: 1.25rem;
      }
      .fc-modal-title { font-size: 1.15rem; font-weight: 700; color: #fff; margin: 0; line-height: 1.25; }
      [data-theme="light"] .fc-modal-title { color: #0f172a; }
      .fc-modal-subtitle { font-size: 0.78rem; color: #94a3b8; margin-top: 2px; }
      .fc-modal-close {
        background: transparent; border: none; font-size: 1.5rem; line-height: 1;
        color: #94a3b8; cursor: pointer; padding: 4px 8px; border-radius: 6px;
        transition: color 0.15s, background 0.15s;
      }
      .fc-modal-close:hover { color: #fff; background: rgba(255,255,255,0.08); }
      [data-theme="light"] .fc-modal-close:hover { color: #000; background: rgba(0,0,0,0.06); }
      .fc-modal-body {
        padding: 22px; overflow-y: auto; flex: 1; display: flex; flex-direction: column; gap: 16px;
        scrollbar-width: thin; scrollbar-color: rgba(255,107,0,0.3) transparent;
      }
      .fc-modal-tag {
        display: inline-flex; align-items: center; gap: 6px; padding: 3px 10px;
        border-radius: 999px; font-size: 0.74rem; font-weight: 600; text-transform: uppercase;
        letter-spacing: 0.5px; width: fit-content;
      }
      .fc-modal-tag.u-price, .fc-modal-tag.price-tag { background: rgba(255,107,0,0.15); color: #FF9E45; border: 1px solid rgba(255,107,0,0.3); }
      .fc-modal-tag.u-scheme, .fc-modal-tag.scheme-tag { background: rgba(59,130,246,0.15); color: #60a5fa; border: 1px solid rgba(59,130,246,0.3); }
      .fc-modal-tag.u-alert, .fc-modal-tag.alert-tag { background: rgba(239,68,68,0.15); color: #f87171; border: 1px solid rgba(239,68,68,0.3); }
      .fc-modal-tag.u-mandi, .fc-modal-tag.mandi-tag { background: rgba(16,185,129,0.15); color: #34d399; border: 1px solid rgba(16,185,129,0.3); }
      .fc-modal-tag.u-weather { background: rgba(168,85,247,0.15); color: #c084fc; border: 1px solid rgba(168,85,247,0.3); }
      .fc-modal-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
      .fc-info-card {
        background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07);
        border-radius: 9px; padding: 12px 14px;
      }
      [data-theme="light"] .fc-info-card { background: #f8fafc; border-color: rgba(0,0,0,0.08); }
      .fc-info-label { font-size: 0.72rem; color: #94a3b8; font-weight: 500; text-transform: uppercase; letter-spacing: 0.4px; }
      .fc-info-val { font-size: 0.96rem; font-weight: 700; margin-top: 3px; color: #fff; }
      [data-theme="light"] .fc-info-val { color: #0f172a; }
      .fc-advisory-box {
        background: linear-gradient(135deg, rgba(255,107,0,0.12), rgba(255,158,69,0.05));
        border: 1px solid rgba(255,107,0,0.35); border-radius: 9px; padding: 14px;
        font-size: 0.84rem; line-height: 1.5; color: #fed7aa;
      }
      [data-theme="light"] .fc-advisory-box { color: #9a3412; background: #fff7ed; }
      .fc-advisory-box strong { color: #FF9E45; display: block; margin-bottom: 4px; }
      [data-theme="light"] .fc-advisory-box strong { color: #c2410c; }
      .fc-modal-footer {
        padding: 14px 22px; border-top: 1px solid rgba(255,255,255,0.08);
        display: flex; align-items: center; justify-content: flex-end; gap: 10px; flex-wrap: wrap;
        background: rgba(255,255,255,0.02);
      }
      [data-theme="light"] .fc-modal-footer { border-top-color: rgba(0,0,0,0.08); background: #f8fafc; }
      .fc-btn-sec {
        padding: 9px 16px; border-radius: 7px; border: 1px solid rgba(255,255,255,0.15);
        background: transparent; color: #cbd5e1; font-size: 0.84rem; font-weight: 600; cursor: pointer;
        transition: background 0.15s, color 0.15s; font-family: 'Inter', sans-serif;
      }
      .fc-btn-sec:hover { background: rgba(255,255,255,0.08); color: #fff; }
      [data-theme="light"] .fc-btn-sec { border-color: #cbd5e1; color: #475569; }
      [data-theme="light"] .fc-btn-sec:hover { background: #f1f5f9; color: #0f172a; }
      .fc-btn-prim {
        padding: 9px 18px; border-radius: 7px; border: none;
        background: linear-gradient(135deg, #FF6B00, #FF9E45); color: #fff;
        font-size: 0.84rem; font-weight: 700; cursor: pointer;
        box-shadow: 0 4px 14px rgba(255,107,0,0.35); transition: transform 0.15s, box-shadow 0.15s;
        font-family: 'Inter', sans-serif; display: inline-flex; align-items: center; gap: 6px;
      }
      .fc-btn-prim:hover { transform: translateY(-1px); box-shadow: 0 6px 18px rgba(255,107,0,0.45); }
      @media (max-width: 600px) {
        .fc-modal-grid-2 { grid-template-columns: 1fr; }
        .fc-modal-box { max-height: 94vh; }
      }
    `;
    document.head.appendChild(s);
  }

  function getGlobalModal() {
    injectInfoModalStyles();
    let m = document.getElementById('fc-info-modal');
    if (!m) {
      m = document.createElement('div');
      m.id = 'fc-info-modal';
      m.className = 'fc-modal-overlay';
      m.setAttribute('role', 'dialog');
      m.setAttribute('aria-modal', 'true');
      m.innerHTML = `
        <div class="fc-modal-box">
          <div class="fc-modal-hdr">
            <div class="fc-modal-title-wrap">
              <div class="fc-modal-icon" id="fc-modal-icon">📢</div>
              <div>
                <h3 class="fc-modal-title" id="fc-modal-title"></h3>
                <div class="fc-modal-subtitle" id="fc-modal-subtitle"></div>
              </div>
            </div>
            <button class="fc-modal-close" id="fc-modal-close-btn" aria-label="Close modal">&times;</button>
          </div>
          <div class="fc-modal-body" id="fc-modal-body"></div>
          <div class="fc-modal-footer" id="fc-modal-footer"></div>
        </div>
      `;
      document.body.appendChild(m);

      m.addEventListener('click', e => {
        if (e.target === m) closeInfoModal();
      });
      document.getElementById('fc-modal-close-btn')?.addEventListener('click', closeInfoModal);
      document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && m.classList.contains('open')) closeInfoModal();
      });
    }
    return m;
  }

  function openInfoModal({ icon, title, subtitle, bodyHtml, footerButtons = [] }) {
    const m = getGlobalModal();
    document.getElementById('fc-modal-icon').innerHTML = icon || '📢';
    document.getElementById('fc-modal-title').textContent = title || 'FairCrop Intelligence';
    document.getElementById('fc-modal-subtitle').textContent = subtitle || '';
    document.getElementById('fc-modal-body').innerHTML = bodyHtml || '';

    const footer = document.getElementById('fc-modal-footer');
    footer.innerHTML = '';
    footerButtons.forEach(btn => {
      const b = document.createElement('button');
      b.className = btn.primary ? 'fc-btn-prim' : 'fc-btn-sec';
      b.textContent = btn.label;
      b.addEventListener('click', () => {
        if (btn.onClick) btn.onClick();
        if (btn.closeOnClick !== false) closeInfoModal();
      });
      footer.appendChild(b);
    });

    m.classList.add('open');
  }

  function closeInfoModal() {
    const m = document.getElementById('fc-info-modal');
    if (m) m.classList.remove('open');
  }

  /* ── 1. Interactive Mandi Price Modal (Carousel 1 items) ── */
  function showCropPriceModal(item, langCode) {
    const transName = (CROP_TRANSLATIONS[item.key] && CROP_TRANSLATIONS[item.key][langCode]) || item.key;
    const imgUrl = CROP_IMAGES[item.key] || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=120&q=80';

    const bodyHtml = `
      <div style="display:flex;align-items:center;gap:14px;background:rgba(255,255,255,0.03);padding:14px;border-radius:10px;border:1px solid rgba(255,255,255,0.08);">
        <img src="${imgUrl}" alt="${transName}" style="width:64px;height:64px;border-radius:8px;object-fit:cover;border:2px solid rgba(255,107,0,0.4);">
        <div>
          <div style="font-size:1.15rem;font-weight:800;color:#fff;">${transName}</div>
          <div style="font-size:0.8rem;color:#94a3b8;margin-top:2px;">📍 ${item.loc}</div>
          <div style="display:flex;gap:6px;margin-top:6px;">
            <span class="fc-modal-tag u-price">e-NAM Modal: ${item.price}</span>
            <span style="font-size:0.72rem;padding:2px 6px;border-radius:4px;background:rgba(34,197,94,0.15);color:#4ade80;font-weight:700;">${item.chg}</span>
          </div>
        </div>
      </div>

      <div class="fc-modal-grid-2">
        <div class="fc-info-card">
          <div class="fc-info-label">Recorded Price Range</div>
          <div class="fc-info-val" style="color:#FF9E45;">${item.min || '₹2,100'} - ${item.max || '₹2,650'}/q</div>
        </div>
        <div class="fc-info-card">
          <div class="fc-info-label">Government MSP Floor</div>
          <div class="fc-info-val" style="color:#38bdf8;">${item.msp || '₹2,000/q'}</div>
        </div>
      </div>

      <div class="fc-modal-grid-2">
        <div class="fc-info-card">
          <div class="fc-info-label">Daily Mandi Arrivals</div>
          <div class="fc-info-val">${item.arrivals || '4,800 MT'}</div>
        </div>
        <div class="fc-info-card">
          <div class="fc-info-label">Quality Grade Assaying</div>
          <div class="fc-info-val" style="color:#34d399;">✓ Agmarknet Grade A</div>
        </div>
      </div>

      <div class="fc-advisory-box">
        <strong>🤖 FairCrop AI Price Outlook & Hold/Sell Signal</strong>
        Prices for <strong>${transName}</strong> are trending <strong>${item.cls === 'chg-up' ? 'Bullish (Upward)' : (item.cls === 'chg-dn' ? 'Bearish (Downward)' : 'Stable')}</strong> based on arrivals in ${item.loc}. Recommended action: Compare direct bids from institutional buyers before dispatching lots.
      </div>
    `;

    openInfoModal({
      icon: '📈',
      title: `${transName} — Live Mandi Intelligence`,
      subtitle: `Real-Time APMC Modal Price & Forecast • ${item.loc}`,
      bodyHtml,
      footerButtons: [
        { label: "Close", primary: false },
        {
          label: "🔔 Set Price Alert",
          primary: false,
          closeOnClick: false,
          onClick: () => {
            showToast(`🔔 Price alert activated for ${transName} @ ${item.price}!`);
          }
        },
        {
          label: "📈 7-Day ML Forecast",
          primary: false,
          onClick: () => {
            showToast(`Generating 7-day algorithmic forecast for ${transName}…`);
            const target = document.getElementById('updates') || document.getElementById('stats-bar');
            if (target) target.scrollIntoView({ behavior: 'smooth' });
          }
        },
        {
          label: "🛒 Explore Marketplace Lots",
          primary: true,
          onClick: () => {
            showToast(`Showing live produce lots for ${transName}…`);
            const target = document.getElementById('cities');
            if (target) target.scrollIntoView({ behavior: 'smooth' });
          }
        }
      ]
    });
  }

  /* ── 2. Interactive Scheme / News Modal (Carousel 2 items) ── */
  function showSchemeDetailModal(schemeItem, langCode) {
    const bodyHtml = `
      <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;">
        <span class="fc-modal-tag u-scheme">${schemeItem.tag || 'Government Scheme'}</span>
        <span style="font-size:0.75rem;padding:2px 8px;border-radius:4px;background:rgba(16,185,129,0.15);color:#34d399;border:1px solid rgba(16,185,129,0.3);font-weight:600;">
          ✓ Official Welfare Initiative
        </span>
      </div>

      <div style="font-size:1.02rem;line-height:1.55;font-weight:600;color:#fff;">
        ${schemeItem.title}
      </div>

      <div style="font-size:0.88rem;line-height:1.6;color:#cbd5e1;">
        ${schemeItem.desc}
      </div>

      <div class="fc-modal-grid-2">
        <div class="fc-info-card">
          <div class="fc-info-label">Nodal Authority / Ministry</div>
          <div class="fc-info-val" style="font-size:0.84rem;">${schemeItem.ministry || 'Ministry of Agriculture'}</div>
        </div>
        <div class="fc-info-card">
          <div class="fc-info-label">Beneficiary Target</div>
          <div class="fc-info-val" style="font-size:0.84rem;color:#FF9E45;">${schemeItem.eligibility || 'All Eligible Farmers'}</div>
        </div>
      </div>

      <div class="fc-info-card">
        <div class="fc-info-label">Required Verification Documents</div>
        <div class="fc-info-val" style="font-size:0.84rem;color:#38bdf8;margin-top:4px;">
          📄 ${schemeItem.docs || 'Aadhaar Card, Land Record (Khatauni), Bank Passbook'}
        </div>
      </div>

      <div class="fc-advisory-box">
        <strong>💡 Direct Access via FairCrop Digital Public Infrastructure</strong>
        Farmers can apply or link their e-KYC directly on FairCrop to avail expedited DBT transfers and interest subvention.
      </div>
    `;

    openInfoModal({
      icon: '🏛️',
      title: schemeItem.title,
      subtitle: `Agricultural Welfare & Market Intelligence • ${schemeItem.tag}`,
      bodyHtml,
      footerButtons: [
        { label: "Close", primary: false },
        {
          label: "📤 Share Scheme Details",
          primary: false,
          closeOnClick: false,
          onClick: () => {
            const shareText = `📢 [FairCrop Policy Alert] ${schemeItem.title}
💡 ${schemeItem.desc}
Check eligibility: https://faircrop.in/`;
            if (navigator.clipboard && navigator.clipboard.writeText) {
              navigator.clipboard.writeText(shareText);
            }
            showToast(`📤 Scheme details copied to clipboard!`);
          }
        },
        {
          label: "📝 Enrol / Check Eligibility",
          primary: true,
          onClick: () => {
            showToast(`Redirecting to portal registration for ${schemeItem.title}…`);
          }
        }
      ]
    });
  }

  /* ── 3. Interactive City Mandi Modal (10 city cards) ── */
  function showCityMandiModal(cityKey, langCode) {
    const cityName = (CITY_TRANSLATIONS[cityKey] && CITY_TRANSLATIONS[cityKey][langCode]) || cityKey;

    const cityDetails = {
      'Mumbai': { mandi: 'Vashi APMC Navi Mumbai', vol: '18,500 MT/day', commodities: 'Onion, Potato, Fruits, Vegetables', status: 'Active E-Auction', address: 'Turbhe, Navi Mumbai, Maharashtra 400703' },
      'Delhi-NCR': { mandi: 'Azadpur APMC & Ghazipur', vol: '24,000 MT/day', commodities: 'Tomato, Apple, Vegetables, Wheat', status: 'National Gateway Hub', address: 'GT Karnal Road, Azadpur, Delhi 110033' },
      'Bengaluru': { mandi: 'Yeshwanthpur & Binny Mill APMC', vol: '12,400 MT/day', commodities: 'Rice, Pulses, Onion, Flowers', status: 'Live Assaying & Trading', address: 'Yeshwanthpur, Bengaluru, Karnataka 560022' },
      'Hyderabad': { mandi: 'Bowenpally & Gaddiannaram APMC', vol: '14,200 MT/day', commodities: 'Red Chilli, Mango, Paddy, Turmeric', status: 'e-NAM Verified Terminal', address: 'Bowenpally, Secunderabad, Telangana 500011' },
      'Chandigarh': { mandi: 'Sector 26 APMC & Grain Market', vol: '9,800 MT/day', commodities: 'Wheat, Paddy, Mustard, Maize', status: 'Direct DBT Active Hub', address: 'Grain Market, Sector 26, Chandigarh 160019' },
      'Ahmedabad': { mandi: 'Jamalpur & APMC Vasna', vol: '11,600 MT/day', commodities: 'Cotton, Groundnut, Cumin, Castor', status: 'Export Terminal Node', address: 'Vasna APMC Market, Ahmedabad, Gujarat 380007' },
      'Pune': { mandi: 'Gultekdi APMC Market Yard', vol: '13,500 MT/day', commodities: 'Pomegranate, Grapes, Sugarcane, Onion', status: 'FPO Hub Active Network', address: 'Market Yard, Gultekdi, Pune, Maharashtra 411037' },
      'Chennai': { mandi: 'Koyambedu Wholesale Market Complex', vol: '16,000 MT/day', commodities: 'Banana, Coconut, Tomato, Rice', status: 'South Supply Corridor', address: 'Koyambedu, Chennai, Tamil Nadu 600107' },
      'Kolkata': { mandi: 'Posta & Koley Market APMC', vol: '15,200 MT/day', commodities: 'Jute, Basmati, Potato, Tea, Fish', status: 'Eastern Corridor Gateway', address: 'Posta Bazar, Burrabazar, Kolkata, West Bengal 700007' },
      'Kochi': { mandi: 'Maradu & Mattancherry Spice Market', vol: '6,400 MT/day', commodities: 'Black Pepper, Cardamom, Ginger, Coconut', status: 'Global Maritime Spice Hub', address: 'Maradu APMC Complex, Kochi, Kerala 682304' }
    };

    const cInfo = cityDetails[cityKey] || { mandi: `${cityKey} APMC Central Mandi`, vol: '8,000 MT/day', commodities: 'Grains & Fresh Produce', status: 'e-NAM Connected', address: `${cityKey} Terminal Market` };

    const bodyHtml = `
      <div class="fc-modal-grid-2">
        <div class="fc-info-card">
          <div class="fc-info-label">Terminal Mandi Hub</div>
          <div class="fc-info-val" style="color:#FF9E45;">${cInfo.mandi}</div>
        </div>
        <div class="fc-info-card">
          <div class="fc-info-label">Daily Arrival Volume</div>
          <div class="fc-info-val">${cInfo.vol}</div>
        </div>
      </div>

      <div class="fc-info-card">
        <div class="fc-info-label">Primary Trading Commodities</div>
        <div class="fc-info-val" style="font-size:0.88rem;color:#cbd5e1;margin-top:4px;">${cInfo.commodities}</div>
      </div>

      <div class="fc-modal-grid-2">
        <div class="fc-info-card">
          <div class="fc-info-label">e-NAM Node Status</div>
          <div class="fc-info-val" style="font-size:0.88rem;color:#34d399;">● ${cInfo.status}</div>
        </div>
        <div class="fc-info-card">
          <div class="fc-info-label">Cold Storage Linkage</div>
          <div class="fc-info-val" style="font-size:0.88rem;color:#38bdf8;">✓ Verified On-Site</div>
        </div>
      </div>

      <div class="fc-advisory-box">
        <strong>💡 Direct Linkage & Logistics Advisory for ${cityName}</strong>
        Farmers and FPOs delivering lots to <strong>${cInfo.mandi}</strong> can access automated quality assaying, zero-commission institutional auctions, and temperature-controlled freight through FairCrop.
      </div>
    `;

    openInfoModal({
      icon: '🏛️',
      title: `${cityName} — Mandi Terminal Hub`,
      subtitle: `National Agricultural Market Terminal • ${cInfo.mandi}`,
      bodyHtml,
      footerButtons: [
        { label: "Close", primary: false },
        {
          label: "📊 View Live Mandi Prices",
          primary: false,
          onClick: () => {
            showToast(`Loading live arrival modal prices for ${cityName}…`);
            const target = document.getElementById('carousels');
            if (target) target.scrollIntoView({ behavior: 'smooth' });
          }
        },
        {
          label: "🛒 Explore Marketplace Lots",
          primary: true,
          onClick: () => {
            showToast(`Loading produce lots for ${cityName}…`);
            const target = document.getElementById('carousels');
            if (target) target.scrollIntoView({ behavior: 'smooth' });
          }
        }
      ]
    });
  }

  /* ── 4. View All 120+ Mandi Hubs Directory Modal ── */
  function showAllMandisModal(langCode) {
    const allMandis = [
      { name: "Azadpur APMC", city: "Delhi NCR", state: "Delhi", topCrop: "Tomato, Apple, Vegetables", vol: "24,000 MT/d" },
      { name: "Vashi APMC", city: "Mumbai", state: "Maharashtra", topCrop: "Onion, Potato, Fruits", vol: "18,500 MT/d" },
      { name: "Lasalgaon APMC", city: "Nashik", state: "Maharashtra", topCrop: "Onion (Kharif/Rabi)", vol: "15,000 MT/d" },
      { name: "Yeshwanthpur APMC", city: "Bengaluru", state: "Karnataka", topCrop: "Rice, Pulses, Vegetables", vol: "12,400 MT/d" },
      { name: "Bowenpally APMC", city: "Hyderabad", state: "Telangana", topCrop: "Red Chilli, Mango, Paddy", vol: "14,200 MT/d" },
      { name: "Khanna Grain Market", city: "Ludhiana", state: "Punjab", topCrop: "Wheat, Paddy (Basmati)", vol: "20,000 MT/d" },
      { name: "Guntur APMC", city: "Guntur", state: "Andhra Pradesh", topCrop: "Red Chilli (Teja/334)", vol: "8,500 MT/d" },
      { name: "Unjha APMC", city: "Mehsana", state: "Gujarat", topCrop: "Cumin (Jeera), Fennel", vol: "6,800 MT/d" },
      { name: "Koyambedu APMC", city: "Chennai", state: "Tamil Nadu", topCrop: "Banana, Coconut, Tomato", vol: "16,000 MT/d" },
      { name: "Posta & Koley Market", city: "Kolkata", state: "West Bengal", topCrop: "Jute, Basmati, Potato", vol: "15,200 MT/d" },
      { name: "Kota Mandi", city: "Kota", state: "Rajasthan", topCrop: "Soybean, Mustard, Gram", vol: "11,000 MT/d" },
      { name: "Solan Mandi", city: "Solan", state: "Himachal Pradesh", topCrop: "Tomato, Capsicum, Apple", vol: "4,200 MT/d" },
      { name: "Indore APMC", city: "Indore", state: "Madhya Pradesh", topCrop: "Soybean, Wheat, Garlic", vol: "13,800 MT/d" },
      { name: "Karnal Mandi", city: "Karnal", state: "Haryana", topCrop: "Basmati Rice 1121, Wheat", vol: "14,500 MT/d" },
      { name: "Rajkot APMC", city: "Rajkot", state: "Gujarat", topCrop: "Groundnut (Bold), Cotton", vol: "9,600 MT/d" }
    ];

    const bodyHtml = `
      <div>
        <input type="text" id="fc-all-mandis-search" placeholder="Search 120+ Mandi Hubs by name, state or crop..." style="width:100%;padding:10px 14px;border-radius:8px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,107,0,0.3);color:#fff;font-size:0.86rem;outline:none;box-sizing:border-box;">
      </div>

      <div id="fc-mandis-list-wrap" style="max-height:420px;overflow-y:auto;display:flex;flex-direction:column;gap:8px;margin-top:8px;">
        ${allMandis.map(m => `
          <div class="fc-info-card" style="display:flex;align-items:center;justify-content:space-between;cursor:pointer;transition:transform 0.15s, border-color 0.15s;" onmouseover="this.style.borderColor='#FF6B00'" onmouseout="this.style.borderColor='rgba(255,255,255,0.07)'" onclick="window.showToast('Selected ${m.name} (${m.city})')">
            <div>
              <div style="font-size:0.92rem;font-weight:700;color:#fff;">${m.name}</div>
              <div style="font-size:0.76rem;color:#94a3b8;margin-top:2px;">📍 ${m.city}, ${m.state} &nbsp;•&nbsp; 🌾 ${m.topCrop}</div>
            </div>
            <div style="text-align:right;">
              <span style="font-size:0.75rem;padding:3px 8px;border-radius:4px;background:rgba(255,107,0,0.15);color:#FF9E45;font-weight:700;">${m.vol}</span>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    openInfoModal({
      icon: '🏛️',
      title: 'National Mandi Directory (120+ Hubs)',
      subtitle: 'e-NAM Integrated Terminal Markets Across 28 States & UTs',
      bodyHtml,
      footerButtons: [
        { label: "Close", primary: false },
        {
          label: "🔍 Find Nearest Mandi",
          primary: true,
          onClick: () => {
            const detectEl = document.getElementById('detect-btn');
            if (detectEl) detectEl.click();
          }
        }
      ]
    });

    setTimeout(() => {
      const searchBox = document.getElementById('fc-all-mandis-search');
      if (searchBox) {
        searchBox.addEventListener('input', e => {
          const q = e.target.value.toLowerCase().trim();
          const wrap = document.getElementById('fc-mandis-list-wrap');
          if (!wrap) return;
          const filtered = allMandis.filter(m => `${m.name} ${m.city} ${m.state} ${m.topCrop}`.toLowerCase().includes(q));
          wrap.innerHTML = filtered.map(m => `
            <div class="fc-info-card" style="display:flex;align-items:center;justify-content:space-between;cursor:pointer;" onclick="window.showToast('Selected ${m.name} (${m.city})')">
              <div>
                <div style="font-size:0.92rem;font-weight:700;color:#fff;">${m.name}</div>
                <div style="font-size:0.76rem;color:#94a3b8;margin-top:2px;">📍 ${m.city}, ${m.state} &nbsp;•&nbsp; 🌾 ${m.topCrop}</div>
              </div>
              <div style="text-align:right;">
                <span style="font-size:0.75rem;padding:3px 8px;border-radius:4px;background:rgba(255,107,0,0.15);color:#FF9E45;font-weight:700;">${m.vol}</span>
              </div>
            </div>
          `).join('');
        });
      }
    }, 100);
  }

  /* ── 5. Interactive Detail Modal for Updates ── */
  function showUpdateDetailModal(item) {
    const bodyHtml = `
      <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;">
        <div style="display:flex;align-items:center;gap:8px;">
          <span class="fc-modal-tag ${item.tag || 'price-tag'}">${item.label || 'Market Update'}</span>
          <span style="font-size:0.75rem;padding:2px 8px;border-radius:4px;background:rgba(16,185,129,0.15);color:#34d399;border:1px solid rgba(16,185,129,0.3);font-weight:600;">
            ✓ e-NAM & Agmarknet Verified
          </span>
        </div>
        <span style="font-size:0.78rem;color:#94a3b8;">🕒 ${item.time || 'Recently'} &nbsp;•&nbsp; 📍 ${item.loc || 'India'}</span>
      </div>

      <div class="fc-modal-grid-2">
        <div class="fc-info-card">
          <div class="fc-info-label">Commodity / Crop</div>
          <div class="fc-info-val">${item.commodity || 'Fresh Produce'}</div>
        </div>
        <div class="fc-info-card">
          <div class="fc-info-label">Current Rate Band / Target</div>
          <div class="fc-info-val" style="color:#FF9E45;">${item.rate_band || 'e-NAM Verified'}</div>
        </div>
      </div>

      <div class="fc-info-card" style="display:flex;align-items:center;gap:12px;">
        <div style="font-size:1.5rem;">🏛️</div>
        <div>
          <div class="fc-info-label">Target Mandi / Logistics Hub</div>
          <div class="fc-info-val" style="font-size:0.88rem;">${item.mandi || item.loc}</div>
        </div>
      </div>

      <div style="font-size:0.92rem;line-height:1.6;color:#e2e8f0;">
        ${(item.desc || '').replace(/\n/g, '<br>')}
      </div>

      ${item.impact ? `
        <div class="fc-info-card" style="border-left: 3px solid #60a5fa;">
          <div class="fc-info-label" style="color:#60a5fa;">📊 Market Impact & Supply Chain Dynamics</div>
          <div style="font-size:0.84rem;color:#cbd5e1;margin-top:4px;line-height:1.5;">${item.impact}</div>
        </div>
      ` : ''}

      ${item.advisory ? `
        <div class="fc-advisory-box">
          <strong>💡 FairCrop AI Advisory & Market Impact</strong>
          ${item.advisory}
        </div>
      ` : ''}
    `;

    openInfoModal({
      icon: '📢',
      title: item.title,
      subtitle: `FairCrop National Agriculture Intelligence • ${item.loc || 'Pan India'}`,
      bodyHtml,
      footerButtons: [
        { label: "Close", primary: false },
        {
          label: "🔔 Set Price Alert",
          primary: false,
          closeOnClick: false,
          onClick: () => {
            showToast(`🔔 Price alert activated for ${item.commodity || 'this crop'}!`);
          }
        },
        {
          label: "📤 Share Update",
          primary: false,
          closeOnClick: false,
          onClick: () => {
            const shareText = `📢 [FairCrop Advisory] ${item.title}\nRate: ${item.rate_band || 'e-NAM verified'}\n📍 Mandi: ${item.mandi || item.loc}\n💡 ${item.desc}\nCheck live at https://faircrop.in/`;
            if (navigator.clipboard && navigator.clipboard.writeText) {
              navigator.clipboard.writeText(shareText);
            }
            showToast(`📤 Update copied to clipboard!`);
          }
        },
        {
          label: "📈 ML Price Forecast",
          primary: false,
          onClick: () => {
            showToast(`Opening AI Price Forecast model for ${item.commodity || 'this crop'}…`);
            const target = document.getElementById('carousels') || document.getElementById('stats-bar');
            if (target) target.scrollIntoView({ behavior: 'smooth' });
          }
        },
        {
          label: "🛒 Explore Marketplace",
          primary: true,
          onClick: () => {
            showToast(`Exploring marketplace lots for ${item.commodity || item.title}…`);
            const target = document.getElementById('carousels');
            if (target) target.scrollIntoView({ behavior: 'smooth' });
          }
        }
      ]
    });
  }

  /* ── Master Dynamic Language Switcher (All Sections) ── */
  function applyLanguage(langCode) {
    activeLang = langCode || 'en';
    const t = TRANSLATIONS[langCode] || TRANSLATIONS['hi'] || TRANSLATIONS['en'];
    document.documentElement.setAttribute('lang', langCode);

    // 1. Navigation & Gov Strip
    const skipLinks = document.querySelectorAll('.gov-strip-right a');
    if (skipLinks[0] && t.skip_content) skipLinks[0].textContent = t.skip_content;
    if (skipLinks[1] && t.screen_reader) skipLinks[1].textContent = t.screen_reader;
    if (skipLinks[2] && t.sitemap) skipLinks[2].textContent = t.sitemap;

    const navSearch = document.getElementById('nav-search-input');
    if (navSearch && t.search_ph) navSearch.setAttribute('placeholder', t.search_ph);

    const signBtn = document.getElementById('sign-in-btn') || document.querySelector('.nav-btn-outline');
    if (signBtn && t.sign_in) signBtn.textContent = t.sign_in;

    // 2. Hero Section Flowchart Steps
    const flowSteps = document.querySelectorAll('.flowchart .flow-step .flow-lbl');
    if (flowSteps[0] && t.step1) flowSteps[0].textContent = t.step1;
    if (flowSteps[1] && t.step2) flowSteps[1].textContent = t.step2;
    if (flowSteps[2] && t.step3) flowSteps[2].textContent = t.step3;

    // 3. Hero Section Tagline Pills
    const pills = document.querySelectorAll('.hero-tagline-pills .tag-pill span:not(.tag-dot)');
    if (pills[0] && t.pill_empower) pills[0].textContent = t.pill_empower;
    if (pills[1] && t.pill_fair) pills[1].textContent = t.pill_fair;
    if (pills[2] && t.pill_real) pills[2].textContent = t.pill_real;

    // 4. Hero Search Bar & Category Dropdown
    const heroSearchInput = document.getElementById('hero-search');
    if (heroSearchInput && t.search_ph) heroSearchInput.setAttribute('placeholder', t.search_ph);

    const heroCatButton = document.getElementById('hero-cat-btn');
    if (heroCatButton && t.all_categories) {
      const svg = heroCatButton.querySelector('svg');
      heroCatButton.innerHTML = `${t.all_categories} ${svg ? svg.outerHTML : ''}`;
    }

    const catRows = document.querySelectorAll('.cat-panel .cat-row');
    const catKeys = ['cat_veg', 'cat_cereals', 'cat_pulses', 'cat_fruits', 'cat_spices', 'cat_schemes', 'cat_mandi_prices', 'cat_mandi_locator'];
    catRows.forEach((row, i) => {
      const k = catKeys[i];
      if (k && t[k]) {
        const svg = row.querySelector('svg');
        row.innerHTML = `${svg ? svg.outerHTML : ''} ${t[k]}`;
      }
    });

    const scrollText = document.querySelector('.scroll-cue .scroll-text');
    if (scrollText && t.scroll_down) scrollText.textContent = t.scroll_down;

    // 5. Stats Bar Labels
    const statLabels = document.querySelectorAll('.stats-bar .stat-lbl');
    if (statLabels[0] && t.stat_farmers) statLabels[0].textContent = t.stat_farmers;
    if (statLabels[1] && t.stat_daily) statLabels[1].textContent = t.stat_daily;
    if (statLabels[2] && t.stat_crops) statLabels[2].textContent = t.stat_crops;
    if (statLabels[3] && t.stat_mandis) statLabels[3].textContent = t.stat_mandis;
    if (statLabels[4] && t.stat_alerts) statLabels[4].textContent = t.stat_alerts;
    if (statLabels[5] && t.stat_states) statLabels[5].textContent = t.stat_states;

    // 6. Section 2 — Carousels Headers & Content
    const carEyebrow = document.querySelector('#carousels .section-lbl');
    if (carEyebrow && t.live_intel) carEyebrow.textContent = t.live_intel;

    const carHeading = document.querySelector('#carousels .section-heading');
    if (carHeading && t.real_time_prices) carHeading.textContent = t.real_time_prices;

    const c1Title = document.querySelector('.carousel-box:first-child .carousel-hdr h3');
    if (c1Title && t.live_mandi_prices) {
      c1Title.innerHTML = `<div class="live-pip" aria-hidden="true"></div> ${t.live_mandi_prices}`;
    }

    const c2Title = document.querySelector('.carousel-box:last-child .carousel-hdr h3');
    if (c2Title && t.schemes_market_news) {
      c2Title.innerHTML = `<div class="live-pip" aria-hidden="true"></div> ${t.schemes_market_news}`;
    }

    renderMandiPriceCarousel(langCode);
    renderSchemeCarousel(langCode);

    // 7. Section 3 — Major Cities Section
    const citiesHeading = document.querySelector('#cities .cities-content h2, #cities h2');
    if (citiesHeading && t.major_cities) citiesHeading.textContent = t.major_cities;

    const citySearchInput = document.getElementById('city-search');
    if (citySearchInput && t.search_city_ph) citySearchInput.setAttribute('placeholder', t.search_city_ph);

    const detectBtnEl = document.getElementById('detect-btn');
    if (detectBtnEl && t.detect_loc) {
      const svg = detectBtnEl.querySelector('svg');
      detectBtnEl.innerHTML = `${svg ? svg.outerHTML : ''} ${t.detect_loc}`;
    }

    const popLabel = document.querySelector('.city-popular-lbl');
    if (popLabel && t.popular_mandis) popLabel.textContent = t.popular_mandis;

    const viewAllLink = document.getElementById('view-all-link');
    if (viewAllLink && t.view_all_mandis) viewAllLink.textContent = t.view_all_mandis;

    // Translate all 10 City names
    document.querySelectorAll('.city-card').forEach(card => {
      const cityKey = card.dataset.city;
      const nmEl = card.querySelector('.city-nm');
      if (nmEl && cityKey && CITY_TRANSLATIONS[cityKey]) {
        const trans = CITY_TRANSLATIONS[cityKey][langCode] || CITY_TRANSLATIONS[cityKey]['hi'] || CITY_TRANSLATIONS[cityKey]['en'];
        if (trans) nmEl.textContent = trans;
      }
    });

    // 8. Section 4 — Newest Updates Section
    const sectionTitle = document.getElementById('updates-section-title');
    if (sectionTitle && t.newest_updates) sectionTitle.textContent = t.newest_updates;

    const sInput = document.getElementById('updates-search-input');
    if (sInput && t.search_updates_ph) sInput.setAttribute('placeholder', t.search_updates_ph);

    const timerText = document.getElementById('updates-timer-text');
    if (timerText && t.auto_refresh) timerText.textContent = `${t.auto_refresh} ${autoRefreshCountdown}s`;

    const liveBadgeLbl = document.querySelector('#updates .live-lbl');
    if (liveBadgeLbl && t.live_badge) liveBadgeLbl.textContent = t.live_badge;

    const pillMappings = {
      'all': t.filter_all,
      'u-price': t.filter_price,
      'u-mandi': t.filter_mandi,
      'u-scheme': t.filter_scheme,
      'u-alert': t.filter_weather
    };
    document.querySelectorAll('#updates-filters-bar .u-filter-pill').forEach(btn => {
      const f = btn.dataset.filter;
      const countEl = btn.querySelector('.u-filter-count');
      const countHtml = countEl ? countEl.outerHTML : '';
      if (f && pillMappings[f]) {
        btn.innerHTML = `${pillMappings[f]} ${countHtml}`;
      }
    });

    renderUpdates();
  }

  // Initialize Language
  applyLanguage(activeLang);

  /* ── City Hub Click Interaction (Opens City Deep-Dive Modal) ── */
  const citiesGrid = document.getElementById('cities-grid');
  if (citiesGrid) {
    citiesGrid.addEventListener('click', async e => {
      const card = e.target.closest('.city-card');
      if (!card) return;
      const city = card.dataset.city;
      showCityMandiModal(city, activeLang);
    });

    citiesGrid.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const c = e.target.closest('.city-card');
        if (c) showCityMandiModal(c.dataset.city, activeLang);
      }
    });
  }

  // View All 120+ Mandi Hubs Link
  const viewAllLink = document.getElementById('view-all-link');
  if (viewAllLink) {
    viewAllLink.addEventListener('click', e => {
      e.preventDefault();
      showAllMandisModal(activeLang);
    });
  }

  const citySearch = document.getElementById('city-search');
  if (citySearch) {
    citySearch.addEventListener('input', function () {
      const q = this.value.toLowerCase();
      document.querySelectorAll('.city-card').forEach(c => {
        const cityKey = c.dataset.city.toLowerCase();
        const cityTrans = (c.querySelector('.city-nm')?.textContent || '').toLowerCase();
        c.style.display = (cityKey.includes(q) || cityTrans.includes(q)) ? '' : 'none';
      });
    });
  }

  const detectBtn = document.getElementById('detect-btn');
  if (detectBtn) {
    detectBtn.addEventListener('click', () => {
      if (!navigator.geolocation) { showToast('Geolocation not supported by your browser.'); return; }
      showToast('Detecting your location…');
      navigator.geolocation.getCurrentPosition(
        () => showToast('Location detected: Delhi NCR. Showing nearest APMC mandis.'),
        () => showToast('Could not detect location. Please search manually.')
      );
    });
  }

  /* ── Mobile Navigation Drawer ── */
  const menuBtn       = document.getElementById('menu-btn');
  const drawerOverlay = document.getElementById('drawer-overlay');

  if (menuBtn) {
    menuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (typeof window.toggleDrawer === 'function') {
        window.toggleDrawer();
      } else {
        const drawer = document.getElementById('mobile-drawer');
        const overlay = document.getElementById('drawer-overlay');
        const isOpen = drawer && drawer.classList.contains('open');
        if (isOpen) {
          drawer?.classList.remove('open');
          overlay?.classList.remove('open');
        } else {
          drawer?.classList.add('open');
          overlay?.classList.add('open');
        }
      }
    });
  }

  if (drawerOverlay) {
    drawerOverlay.addEventListener('click', () => {
      if (typeof window.closeDrawer === 'function') {
        window.closeDrawer();
      } else {
        document.getElementById('mobile-drawer')?.classList.remove('open');
        drawerOverlay.classList.remove('open');
      }
    });
  }

  /* ── Voice Search ── */
  const micBtn = document.getElementById('mic-btn');
  if (micBtn) {
    micBtn.addEventListener('click', () => {
      const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SR) { showToast('Voice search not supported in this browser.'); return; }
      const rec = new SR();
      rec.lang = activeLang === 'hi' ? 'hi-IN' : (activeLang === 'bn' ? 'bn-IN' : 'en-IN');
      rec.start();
      showToast('Listening — speak crop, mandi, or scheme name…');
      rec.onresult = e => {
        const transcript = e.results[0][0].transcript;
        const input = document.getElementById('nav-search-input') || document.getElementById('hero-search');
        if (input) input.value = transcript;
        showToast(`Voice captured: "${transcript}"`);
        triggerSearch(transcript);
      };
      rec.onerror = () => showToast('Voice search unavailable.');
    });
  }

  /* ── Hero Search — wired to backend ── */
  async function triggerSearch(query) {
    if (!query || query.trim().length < 2) return;
    showToast(`Searching FairCrop for: "${query}"…`);
    try {
      const results = await api.search(query.trim(), 10);
      const total = results.total_results || 0;
      if (total > 0) {
        const pCount = results.mandi_prices?.length || 0;
        const lCount = results.marketplace_lots?.length || 0;
        showToast(`Found ${pCount} mandi prices & ${lCount} marketplace lots for "${query}"`);
      } else {
        showToast(`No results found for "${query}" — try another crop or mandi name.`);
      }
    } catch (e) {
      if (e.offline) {
        showToast('Backend offline — start server with: python backend/run.py');
      } else {
        showToast(`Searching FairCrop database for: ${query}`);
      }
    }
  }

  const heroSearch = document.getElementById('hero-search');
  if (heroSearch) {
    heroSearch.addEventListener('keydown', e => {
      if (e.key === 'Enter') triggerSearch(e.target.value);
    });
  }

  const navSearchInput = document.getElementById('nav-search-input');
  if (navSearchInput) {
    navSearchInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') triggerSearch(e.target.value);
    });
  }

  /* ── Interactive Toast Notification ── */
  window.showToast = function (msg) {
    const t = document.createElement('div');
    t.style.cssText = `position:fixed;bottom:26px;left:50%;transform:translateX(-50%);background:rgba(12,14,22,0.96);color:#fff;padding:11px 22px;border-radius:6px;font-size:0.83rem;font-weight:500;z-index:99999;border:1px solid rgba(255,107,0,0.35);backdrop-filter:blur(12px);white-space:nowrap;box-shadow:0 8px 28px rgba(0,0,0,0.45);animation:tIn .28s ease;font-family:'Inter',sans-serif;`;
    t.textContent = msg;
    if (!document.getElementById('__toast-style')) {
      const s = document.createElement('style');
      s.id = '__toast-style';
      s.textContent = '@keyframes tIn{from{opacity:0;transform:translateX(-50%) translateY(10px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}';
      document.head.appendChild(s);
    }
    document.body.appendChild(t);
    setTimeout(() => {
      t.style.transition = 'opacity .28s';
      t.style.opacity = '0';
      setTimeout(() => t.remove(), 300);
    }, 3200);
  };

});

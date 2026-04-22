// Bilingual string map — Myanmar (mm) + English (en)
export const strings = {
  en: {
    appName: 'Myanmar Zata',
    appSubtitle: 'Traditional Horoscope',
    home: {
      hero: 'Discover Your Myanmar Zata',
      heroSub: 'Ancient wisdom meets modern insight. Enter your birth details to receive your traditional horoscope reading.',
      cta: 'Calculate My Zata',
      features: [
        { title: '12-House Chart', desc: 'Authentic South Indian style Zata chart' },
        { title: 'AI Reading', desc: 'Detailed interpretation from our AI assistant' },
        { title: 'Chat & Ask', desc: 'Ask questions about your chart in depth' },
        { title: 'Print Ready', desc: 'Save your reading as a printable document' },
      ],
    },
    form: {
      title: 'Enter Birth Details',
      name: 'Your Name',
      namePlaceholder: 'Enter your name',
      date: 'Date of Birth',
      time: 'Time of Birth',
      timeNote: 'Exact birth time is required for Lagna calculation',
      city: 'Place of Birth',
      cityPlaceholder: 'Search for city…',
      submit: 'Calculate Chart',
      searching: 'Searching…',
      noResults: 'No city found. Try a different name.',
    },
    chart: {
      title: 'Your Zata Chart',
      lagna: 'Lagna',
      planets: 'Planets',
      dasha: 'Current Period',
      mahadasha: 'Mahadasha',
      antardasha: 'Antardasha',
      remaining: 'remaining',
      yogas: 'Active Yogas',
      noYogas: 'No prominent yogas detected',
      reading: 'General Reading',
      generating: 'Generating your reading…',
      print: 'Print Reading',
      askMore: 'Ask Questions',
    },
    chat: {
      title: 'Ask About Your Chart',
      placeholder: 'Ask anything about your Zata…',
      send: 'Send',
      suggestions: [
        'Tell me about my career prospects',
        'What does my current Dasha indicate?',
        'Describe my personality from the chart',
        'What are my relationship patterns?',
        'How is my health indicated?',
        'What are my financial strengths?',
      ],
    },
    nav: { home: 'Home', chart: 'Chart', chat: 'Chat' },
    planets: {
      Sun: 'Sun', Moon: 'Moon', Mars: 'Mars', Mercury: 'Mercury',
      Jupiter: 'Jupiter', Venus: 'Venus', Saturn: 'Saturn',
      Rahu: 'Rahu', Ketu: 'Ketu',
    },
    signs: [
      'Aries','Taurus','Gemini','Cancer','Leo','Virgo',
      'Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'
    ],
  },
  mm: {
    appName: 'မြန်မာ ဇာတာ',
    appSubtitle: 'ရိုးရာဗေဒင်ပညာ',
    home: {
      hero: 'သင်၏ မြန်မာ ဇာတာကို ရှာဖွေပါ',
      heroSub: 'ရှေးရိုးရာ ဗဟုသုတနှင့် ခေတ်မီ AI ကို ပေါင်းစပ်ကာ သင်၏ ဇာတာ ဖတ်ရှုနိုင်ပါသည်။',
      cta: 'ဇာတာ တွက်မည်',
      features: [
        { title: 'ဘာဝ ၁၂ ဇာတာခွင်', desc: 'မြန်မာ ဆန်းသသော ဇာတာ ပုံစံ' },
        { title: 'AI ဟောကိန်း', desc: 'AI ဆရာ၏ အသေးစိတ် ဖတ်ရှုချက်' },
        { title: 'မေးမြန်းနိုင်', desc: 'သင့် ဇာတာနှင့် ပတ်သက်၍ မေးနိုင်သည်' },
        { title: 'ပရင့်ထုတ်နိုင်', desc: 'သင်၏ ဟောကိန်းကို ပရင့်ထုတ်နိုင်သည်' },
      ],
    },
    form: {
      title: 'မွေးဖွားချက် ထည့်သွင်းပါ',
      name: 'အမည်',
      namePlaceholder: 'သင်၏ အမည် ထည့်ပါ',
      date: 'မွေးသောရက်',
      time: 'မွေးသောအချိန်',
      timeNote: 'လဂ် တွက်ရန် မွေးချိန် အတိအကျ လိုအပ်သည်',
      city: 'မွေးသောမြို့',
      cityPlaceholder: 'မြို့နာမည် ရှာပါ…',
      submit: 'ဇာတာ တွက်မည်',
      searching: 'ရှာဖွေနေသည်…',
      noResults: 'မြို့ မတွေ့ပါ။ အခြားနာမည် ကြိုးစားကြည့်ပါ။',
    },
    chart: {
      title: 'သင်၏ ဇာတာ',
      lagna: 'လဂ်',
      planets: 'ဂြိုဟ်များ',
      dasha: 'ယခုကာလ',
      mahadasha: 'မဟာဒဿ',
      antardasha: 'အန္တဒဿ',
      remaining: 'ကျန်သည်',
      yogas: 'ယောဂများ',
      noYogas: 'ထူးချွန်သောယောဂ မတွေ့ရပါ',
      reading: 'ဟောကိန်း အကြမ်းဖျဉ်း',
      generating: 'ဟောကိန်း ထုတ်နေသည်…',
      print: 'ပရင့်ထုတ်မည်',
      askMore: 'မေးမြန်းမည်',
    },
    chat: {
      title: 'ဇာတာနှင့် ပတ်သက်၍ မေးပါ',
      placeholder: 'ဇာတာနှင့် ပတ်သက်သမျှ မေးနိုင်သည်…',
      send: 'ပို့မည်',
      suggestions: [
        'ကျွန်ုပ်၏ အသက်မွေးဝမ်းကြောင်း ဘယ်လိုလဲ',
        'ယခု ဒဿ ကာလ ဘာကို ဆိုလိုသနည်း',
        'ကျွန်ုပ်၏ ပင်ကိုစရိုက် ဘယ်လိုလဲ',
        'ကျွန်ုပ်၏ ချစ်ကြည်ရေး မည်သို့လဲ',
        'ကျွန်ုပ်၏ ကျန်းမာရေး မည်သို့ဖြစ်မည်လဲ',
        'ကျွန်ုပ်၏ ငွေကြေး ကံကြမ္မာ',
      ],
    },
    nav: { home: 'ပင်မ', chart: 'ဇာတာ', chat: 'မေးမြန်း' },
    planets: {
      Sun: 'နေ', Moon: 'လ', Mars: 'အင်္ဂါ', Mercury: 'ဗုဒ္ဓဟူး',
      Jupiter: 'ကြာသပတေး', Venus: 'သောကြာ', Saturn: 'စနေ',
      Rahu: 'ရာဟု', Ketu: 'ကိတ်',
    },
    signs: [
      'မိဿ','ပြိဿ','မေထုန်','ကရကဋ်','သိဟ်','ကန်',
      'တူ','ဗြိစ္ဆာ','ဓနု','မကာရ','ကုံ','မိန်'
    ],
  },
}

export const t = (lang, path) => {
  const keys = path.split('.')
  let val = strings[lang] || strings.en
  for (const k of keys) val = val?.[k]
  return val ?? path
}

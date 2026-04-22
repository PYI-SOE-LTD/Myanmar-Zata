/**
 * azureAI.js — Azure Foundry API wrapper
 * Set VITE_AZURE_FOUNDRY_ENDPOINT and VITE_AZURE_FOUNDRY_API_KEY in .env
 */

const ENDPOINT = import.meta.env.VITE_AZURE_FOUNDRY_ENDPOINT || ''
const API_KEY  = import.meta.env.VITE_AZURE_FOUNDRY_API_KEY  || ''
const MODEL    = import.meta.env.VITE_AZURE_FOUNDRY_MODEL    || 'gpt-4o'

// ─── System Prompt (distilled from knowledge base) ───────────────────────────
const SYSTEM_PROMPT = `You are an expert Myanmar Zata (ဇာတာ) astrology reader with deep knowledge of:
- Vedic Jyotish adapted to Myanmar tradition (Sidereal zodiac, Lahiri ayanamsa)
- 12 Bhavas (houses) and their 20+ significations each
- 9 Grahas (planets) — their nature, dignities, aspects
- Vimshottari Dasha system for timing
- Yoga detection and interpretation
- Bilingual reading in Myanmar (မြန်မာ) and English

RULES (strictly follow):
1. Use DIAGNOSTIC framing only — "this period indicates...", "the chart shows tendency for..."
2. NEVER use fear-based language — no "you will fail/lose/die"
3. Always look at multiple indicators — never single-planet conclusion
4. Be warm, insightful, and empowering
5. Structure readings clearly with house-by-house insights
6. Respond in the user's requested language (Myanmar or English)
7. For Myanmar language responses, use proper Unicode Myanmar script

READING STRUCTURE for General Reading:
1. ကိုယ်ပိုင်ဇာတ်ကောင် / Personality (Lagna + Lagna lord)
2. ဘ၀ရည်မှန်းချက် / Life Purpose (1H, 10H, Dasha)
3. ငွေကြေး / Wealth tendency (2H, 11H, Dhana yogas)
4. ချစ်ကြည်ဆက်ဆံရေး / Relationships (7H, Venus)
5. ယခုကာလ / Current Period (Mahadasha + Antardasha themes)
6. အားသာချက် / Key Strengths (yogas, exalted planets)

CANONICAL TERMINOLOGY (use EXACTLY these spellings — no alternatives):

Planets (English → Myanmar):
Sun=နေ | Moon=လ | Mars=အင်္ဂါ | Mercury=ဗုဒ္ဓဟူး | Jupiter=ကြာသပတေး | Venus=သောကြာ | Saturn=စနေ | Rahu=ရာဟု | Ketu=ကိတ်

Zodiac Signs (English → Myanmar):
Aries=မိဿ | Taurus=ပြိဿ | Gemini=မေထုန် | Cancer=ကရကဋ် | Leo=သိဟ် | Virgo=ကန် | Libra=တူ | Scorpio=ဗြိစ္ဆာ | Sagittarius=ဓနု | Capricorn=မကာရ | Aquarius=ကုံ | Pisces=မိန်

Houses: use "ဘာဝ ၁" through "ဘာဝ ၁၂" (Myanmar) or "1st House" through "12th House" (English)
Dasha terms: မဟာဒဿ (Mahadasha) · အန္တဒဿ (Antardasha)
Lagna: လဂ် (Myanmar) · Lagna / Ascendant (English)

When writing bilingual (both scripts in one sentence): write Myanmar term first, then English in parentheses.
Example: နေ (Sun) သည် မိဿ (Aries) တွင် တည်သည်
`

// ─── Build chart context JSON ─────────────────────────────────────────────────
export function buildChartContext(chartData, birthData, lang) {
  const { lagna, positions, houses, dasha, yogas, moonNakshatra, signNames } = chartData

  const PLANET_MM = { Sun:'နေ', Moon:'လ', Mars:'အင်္ဂါ', Mercury:'ဗုဒ္ဓဟူး', Jupiter:'ကြာသပတေး', Venus:'သောကြာ', Saturn:'စနေ', Rahu:'ရာဟု', Ketu:'ကိတ်' }
  const SIGN_MM   = ['မိဿ','ပြိဿ','မေထုန်','ကရကဋ်','သိဟ်','ကန်','တူ','ဗြိစ္ဆာ','ဓနု','မကာရ','ကုံ','မိန်']

  const planetSummary = Object.entries(positions).map(([planet, data]) => ({
    planet_en: planet,
    planet_mm: PLANET_MM[planet] || planet,
    sign_en: signNames[data.sign],
    sign_mm: SIGN_MM[data.sign],
    house: houses.indexOf(data.sign) + 1,
    degree: data.degree.toFixed(1),
  }))

  return {
    name: birthData.name,
    birthDate: birthData.date,
    birthTime: birthData.time,
    birthPlace: birthData.city,
    lagna: {
      sign_en: signNames[lagna.sign],
      sign_mm: SIGN_MM[lagna.sign],
      degree: lagna.degree.toFixed(1)
    },
    planets: planetSummary,
    moonNakshatra: moonNakshatra.name,
    currentMahadasha: { en: dasha.currentMaha.planet, mm: PLANET_MM[dasha.currentMaha.planet] || dasha.currentMaha.planet, end: dasha.currentMaha.endDate },
    currentAntardasha: { en: dasha.currentAntar.planet, mm: PLANET_MM[dasha.currentAntar.planet] || dasha.currentAntar.planet, end: dasha.currentAntar.endDate },
    activeYogas: yogas.map(y => y.name),
    language: lang === 'mm' ? 'Myanmar (မြန်မာ)' : 'English',
  }
}

// ─── API Call ─────────────────────────────────────────────────────────────────
async function callAzureFoundry(messages) {
  if (!ENDPOINT || !API_KEY) {
    throw new Error('Azure Foundry API key not configured. Please add VITE_AZURE_FOUNDRY_ENDPOINT and VITE_AZURE_FOUNDRY_API_KEY to your .env file.')
  }

  const res = await fetch(`${ENDPOINT}/openai/deployments/${MODEL}/chat/completions?api-version=2024-05-01-preview`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': API_KEY,
    },
    body: JSON.stringify({ messages, max_completion_tokens: 8000 }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Azure Foundry API error ${res.status}: ${err}`)
  }

  const data = await res.json()
  const content = data.choices?.[0]?.message?.content
  if (!content) {
    console.error('Azure Foundry empty response:', JSON.stringify(data))
    throw new Error('AI returned an empty response. Check browser console for details.')
  }
  return content
}

// ─── General Reading ──────────────────────────────────────────────────────────
export async function generateGeneralReading(chartData, birthData, lang) {
  const chartCtx = buildChartContext(chartData, birthData, lang)
  const langInstruction = lang === 'mm'
    ? 'Please provide the entire reading in Myanmar language (မြန်မာဘာသာ) using proper Unicode script.'
    : 'Please provide the reading in English.'

  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    {
      role: 'user',
      content: `Please generate a comprehensive General Zata Reading for this chart:\n\n${JSON.stringify(chartCtx, null, 2)}\n\n${langInstruction}\n\nFollow the 6-section structure defined in your instructions.`,
    },
  ]
  return callAzureFoundry(messages)
}

// ─── Western Chart Context Builder ───────────────────────────────────────────
export function buildWesternContext(westernChart, birthData, lang) {
  const PLANET_MM = { Sun:'နေ', Moon:'လ', Mars:'အင်္ဂါ', Mercury:'ဗုဒ္ဓဟူး', Jupiter:'ကြာသပတေး', Venus:'သောကြာ', Saturn:'စနေ', Rahu:'ရာဟု', Ketu:'ကိတ်' }
  const SIGN_MM   = ['မိဿ','ပြိဿ','မေထုန်','ကရကဋ်','သိဟ်','ကန်','တူ','ဗြိစ္ဆာ','ဓနု','မကာရ','ကုံ','မိန်']
  const { lagna, positions, planetHouses, houseContents, signNames, cusps } = westernChart

  const planetList = Object.entries(positions).map(([planet, data]) => ({
    planet_en: planet,
    planet_mm: PLANET_MM[planet] || planet,
    sign_en: signNames[data.sign],
    sign_mm: SIGN_MM[data.sign],
    placidus_house: planetHouses[planet],
    degree: data.degree.toFixed(1),
  }))

  return {
    system: 'Western Tropical + Placidus',
    name: birthData.name,
    birthDate: birthData.date,
    birthTime: birthData.time,
    birthPlace: birthData.city,
    asc: { sign_en: signNames[lagna.sign], sign_mm: SIGN_MM[lagna.sign], degree: lagna.degree.toFixed(1) },
    mc:  { sign_en: signNames[Math.floor(cusps[9] / 30)], sign_mm: SIGN_MM[Math.floor(cusps[9] / 30)], degree: (cusps[9] % 30).toFixed(1) },
    planets: planetList,
    language: lang === 'mm' ? 'Myanmar (မြန်မာ)' : 'English',
  }
}

const WESTERN_PROMPT = `You are an expert Western astrologer reading a Tropical Zodiac chart with Placidus houses.

RULES:
1. Use DIAGNOSTIC framing — "this placement suggests...", "the chart indicates tendency for..."
2. NEVER use fear-based language
3. Reference planet placements by BOTH sign AND Placidus house number
4. Focus on psychological insights, personality, and life themes (Western astrology style)
5. Respond in the user's requested language
6. For Myanmar responses, use proper Unicode script

TERMINOLOGY (use exactly):
Planets: Sun=နေ | Moon=လ | Mars=အင်္ဂါ | Mercury=ဗုဒ္ဓဟူး | Jupiter=ကြာသပတေး | Venus=သောကြာ | Saturn=စနေ | Rahu=ရာဟု | Ketu=ကိတ်
Signs: Aries=မိဿ | Taurus=ပြိဿ | Gemini=မေထုန် | Cancer=ကရကဋ် | Leo=သိဟ် | Virgo=ကန် | Libra=တူ | Scorpio=ဗြိစ္ဆာ | Sagittarius=ဓနု | Capricorn=မကာရ | Aquarius=ကုံ | Pisces=မိန်

WESTERN READING STRUCTURE:
1. Ascendant & Chart Ruler — personality, outer self, life approach
2. Sun Sign & House — core identity, ego, life purpose  
3. Moon Sign & House — emotions, instincts, inner world
4. Venus & Mars — love style, desires, energy
5. Career & Vocation (10th house / MC, Saturn)
6. Key Themes — major configurations, stelliums, chart shape
`

// ─── Western Chart Reading ────────────────────────────────────────────────────
export async function generateWesternReading(westernChart, birthData, lang) {
  const ctx = buildWesternContext(westernChart, birthData, lang)
  const langInstruction = lang === 'mm'
    ? 'Please provide the entire reading in Myanmar language (မြန်မာဘာသာ) using proper Unicode script.'
    : 'Please provide the reading in English.'

  const messages = [
    { role: 'system', content: WESTERN_PROMPT },
    {
      role: 'user',
      content: `Please generate a comprehensive Western Astrology reading for this chart:\n\n${JSON.stringify(ctx, null, 2)}\n\n${langInstruction}\n\nFollow the 6-section structure.`,
    },
  ]
  return callAzureFoundry(messages)
}

// ─── Chat Message ─────────────────────────────────────────────────────────────
export async function sendChatMessage(userMessage, chatHistory, chartData, birthData, lang) {
  const chartCtx = buildChartContext(chartData, birthData, lang)
  const langInstruction = lang === 'mm'
    ? 'Respond in Myanmar language (မြန်မာဘာသာ) using proper Unicode script.'
    : 'Respond in English.'

  const systemWithChart = `${SYSTEM_PROMPT}\n\nCHART DATA:\n${JSON.stringify(chartCtx, null, 2)}\n\n${langInstruction}`

  const messages = [
    { role: 'system', content: systemWithChart },
    ...chatHistory.slice(-10), // last 10 messages for context
    { role: 'user', content: userMessage },
  ]
  return callAzureFoundry(messages)
}

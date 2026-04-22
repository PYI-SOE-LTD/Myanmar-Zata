/**
 * zataCalculator.js
 * Client-side sidereal Zata calculations using approximate VSOP87 algorithms.
 * Uses Lahiri ayanamsa for sidereal conversion.
 * Whole Sign house system (standard in Indian/Myanmar Jyotish).
 */

// ─── Constants ───────────────────────────────────────────────────────────────
const PLANET_NAMES = ['Sun','Moon','Mars','Mercury','Jupiter','Venus','Saturn','Rahu','Ketu']

const NAKSHATRA_LORDS = [
  'Ketu','Venus','Sun','Moon','Mars','Rahu','Jupiter','Saturn','Mercury', // 1–9
  'Ketu','Venus','Sun','Moon','Mars','Rahu','Jupiter','Saturn','Mercury', // 10–18
  'Ketu','Venus','Sun','Moon','Mars','Rahu','Jupiter','Saturn','Mercury', // 19–27
]

const DASHA_YEARS = { Ketu:7, Venus:20, Sun:6, Moon:10, Mars:7, Rahu:18, Jupiter:16, Saturn:19, Mercury:17 }
const DASHA_ORDER = ['Ketu','Venus','Sun','Moon','Mars','Rahu','Jupiter','Saturn','Mercury']

const SIGN_NAMES_EN = ['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces']
const SIGN_LORDS  = ['Mars','Venus','Mercury','Moon','Sun','Mercury','Venus','Mars','Jupiter','Saturn','Saturn','Jupiter']

const NAKSHATRA_NAMES = [
  'Ashwini','Bharani','Krittika','Rohini','Mrigashira','Ardra','Punarvasu','Pushya','Ashlesha',
  'Magha','Purva Phalguni','Uttara Phalguni','Hasta','Chitra','Swati','Vishakha','Anuradha','Jyeshtha',
  'Mula','Purva Ashadha','Uttara Ashadha','Shravana','Dhanishtha','Shatabhisha','Purva Bhadrapada','Uttara Bhadrapada','Revati',
]

// ─── Julian Date ─────────────────────────────────────────────────────────────
export function toJulianDate(year, month, day, hourUTC) {
  if (month <= 2) { year -= 1; month += 12 }
  const A = Math.floor(year / 100)
  const B = 2 - A + Math.floor(A / 4)
  return Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + B - 1524.5 + hourUTC / 24
}

// ─── Lahiri Ayanamsa (approximate) ───────────────────────────────────────────
export function lahiriAyanamsa(jd) {
  const T = (jd - 2451545.0) / 36525
  return 23.85 + 0.013605 * ((jd - 2396758) / 365.25)
}

// ─── Tropical → Sidereal ─────────────────────────────────────────────────────
function toSidereal(tropicalDeg, jd) {
  return ((tropicalDeg - lahiriAyanamsa(jd)) % 360 + 360) % 360
}

// ─── Approximate Tropical Positions (VSOP87-lite) ────────────────────────────
function sunLongitude(jd) {
  const T = (jd - 2451545.0) / 36525
  const L0 = 280.46646 + 36000.76983 * T
  const M  = (357.52911 + 35999.05029 * T) * Math.PI / 180
  const C  = (1.914602 - 0.004817 * T) * Math.sin(M)
             + 0.019993 * Math.sin(2 * M)
  return ((L0 + C) % 360 + 360) % 360
}

function moonLongitude(jd) {
  const T = (jd - 2451545.0) / 36525
  const D  = (297.85036 + 445267.111480 * T) * Math.PI / 180
  const M  = (357.52772 + 35999.050340 * T) * Math.PI / 180
  const Mp = (134.96298 + 477198.867398 * T) * Math.PI / 180
  const F  = (93.27191  + 483202.017538 * T) * Math.PI / 180
  const L0 = 218.3165 + 481267.8813 * T
  const corr = 6.289  * Math.sin(Mp)
              - 1.274 * Math.sin(2*D - Mp)
              + 0.658 * Math.sin(2*D)
              - 0.186 * Math.sin(M)
              - 0.059 * Math.sin(2*D - 2*Mp)
              - 0.057 * Math.sin(2*D - M - Mp)
              + 0.053 * Math.sin(2*D + Mp)
              + 0.046 * Math.sin(2*D - M)
              + 0.041 * Math.sin(Mp - M)
              - 0.035 * Math.sin(D)
              - 0.031 * Math.sin(Mp + M)
  return ((L0 + corr) % 360 + 360) % 360
}

function marsLongitude(jd) {
  const T = (jd - 2451545.0) / 36525
  const L = 355.433275 + 19140.2993313 * T
  const M = (19.387358 + 19140.299 * T) * Math.PI / 180
  return ((L + 10.691 * Math.sin(M) + 0.623 * Math.sin(2*M)) % 360 + 360) % 360
}

function mercuryLongitude(jd) {
  const T = (jd - 2451545.0) / 36525
  const L = 252.250906 + 149474.0722491 * T
  const M = (174.7948 + 149472.5159 * T) * Math.PI / 180
  return ((L + 23.440 * Math.sin(M) + 2.858 * Math.sin(2*M)) % 360 + 360) % 360
}

function jupiterLongitude(jd) {
  const T = (jd - 2451545.0) / 36525
  const L = 34.351484 + 3034.9056746 * T
  const M = (20.020 + 3034.906 * T) * Math.PI / 180
  return ((L + 5.555 * Math.sin(M) + 0.168 * Math.sin(2*M)) % 360 + 360) % 360
}

function venusLongitude(jd) {
  const T = (jd - 2451545.0) / 36525
  const L = 181.979801 + 58519.2130302 * T
  const M = (212.2794 + 58517.8039 * T) * Math.PI / 180
  return ((L + 0.7758 * Math.sin(M) + 0.0033 * Math.sin(2*M)) % 360 + 360) % 360
}

function saturnLongitude(jd) {
  const T = (jd - 2451545.0) / 36525
  const L = 50.077444 + 1223.5110686 * T
  const M = (317.020 + 1221.552 * T) * Math.PI / 180
  return ((L + 6.3585 * Math.sin(M) + 0.2204 * Math.sin(2*M)) % 360 + 360) % 360
}

function rahuLongitude(jd) {
  // Mean ascending node (Rahu moves retrograde)
  const T = (jd - 2451545.0) / 36525
  return ((125.04452 - 1934.136261 * T) % 360 + 360) % 360
}

// ─── Sidereal Positions ───────────────────────────────────────────────────────
export function getPlanetaryPositions(jd) {
  const fn = [sunLongitude, moonLongitude, marsLongitude, mercuryLongitude,
              jupiterLongitude, venusLongitude, saturnLongitude]
  const tropicals = fn.map(f => f(jd))
  const rahuTrop = rahuLongitude(jd)

  const positions = {}
  const names = ['Sun','Moon','Mars','Mercury','Jupiter','Venus','Saturn']
  names.forEach((name, i) => {
    const sid = toSidereal(tropicals[i], jd)
    positions[name] = { longitude: sid, sign: Math.floor(sid / 30), degree: sid % 30 }
  })

  const rahuSid = toSidereal(rahuTrop, jd)
  positions.Rahu = { longitude: rahuSid, sign: Math.floor(rahuSid / 30), degree: rahuSid % 30 }
  const ketuSid = (rahuSid + 180) % 360
  positions.Ketu = { longitude: ketuSid, sign: Math.floor(ketuSid / 30), degree: ketuSid % 30 }

  return positions
}

// ─── Lagna (Ascendant) ────────────────────────────────────────────────────────
export function calcLagna(jd, latDeg, lonDeg) {
  const T  = (jd - 2451545.0) / 36525
  // RAMC (Right Ascension of Midheaven)
  const GMST = 280.46061837 + 360.98564736629 * (jd - 2451545) + 0.000387933 * T * T
  const LST  = ((GMST + lonDeg) % 360 + 360) % 360  // Local Sidereal Time in degrees
  const RAMC = LST

  // Obliquity of ecliptic
  const eps = (23.439291111 - 0.013004167 * T) * Math.PI / 180
  const ramcRad = RAMC * Math.PI / 180
  const latRad  = latDeg * Math.PI / 180

  // Ascendant tropical longitude
  const y = -Math.cos(ramcRad)
  const x = Math.sin(ramcRad) * Math.cos(eps) + Math.tan(latRad) * Math.sin(eps)
  let ascTrop = (Math.atan2(y, x) * 180 / Math.PI + 360) % 360

  // Convert to sidereal
  const lagnaLon = toSidereal(ascTrop, jd)
  return { longitude: lagnaLon, sign: Math.floor(lagnaLon / 30), degree: lagnaLon % 30 }
}

// ─── Whole Sign Houses ────────────────────────────────────────────────────────
export function getHouses(lagnaSign) {
  // In Whole Sign, house 1 = Lagna sign, each subsequent house is next sign
  return Array.from({ length: 12 }, (_, i) => (lagnaSign + i) % 12)
}

// ─── Nakshatra ────────────────────────────────────────────────────────────────
export function getNakshatra(longitude) {
  const idx = Math.floor(longitude / (360 / 27))  // 27 nakshatras × 13.333°
  const pada = Math.floor((longitude % (360 / 27)) / (360 / 108)) + 1
  return {
    index: idx,
    name: NAKSHATRA_NAMES[idx],
    lord: NAKSHATRA_LORDS[idx],
    pada,
    degree: longitude % (360 / 27),
  }
}

// ─── Vimshottari Dasha ────────────────────────────────────────────────────────
export function calcDasha(moonLongitude, birthDate) {
  const nakshatra = getNakshatra(moonLongitude)
  const lord = nakshatra.lord
  const totalYears = DASHA_YEARS[lord]

  // Fraction of nakshatra completed
  const nakshatraSize = 360 / 27
  const completedFraction = nakshatra.degree / nakshatraSize
  const remainingYears = totalYears * (1 - completedFraction)

  // Build full dasha timeline
  const birthMs = new Date(birthDate).getTime()
  const lordIdx = DASHA_ORDER.indexOf(lord)
  const timeline = []
  let curMs = birthMs

  // First dasha is partial
  const firstEndMs = birthMs + remainingYears * 365.25 * 24 * 3600 * 1000
  timeline.push({
    planet: lord,
    startDate: new Date(curMs).toISOString().slice(0, 10),
    endDate: new Date(firstEndMs).toISOString().slice(0, 10),
    years: remainingYears,
  })
  curMs = firstEndMs

  // Remaining full dashas (enough for 120-year cycle)
  for (let i = 1; i < 9; i++) {
    const planet = DASHA_ORDER[(lordIdx + i) % 9]
    const yrs = DASHA_YEARS[planet]
    const endMs = curMs + yrs * 365.25 * 24 * 3600 * 1000
    timeline.push({
      planet,
      startDate: new Date(curMs).toISOString().slice(0, 10),
      endDate: new Date(endMs).toISOString().slice(0, 10),
      years: yrs,
    })
    curMs = endMs
  }

  // Find current dasha
  const now = Date.now()
  const currentMaha = timeline.find(d =>
    new Date(d.startDate).getTime() <= now && new Date(d.endDate).getTime() > now
  ) || timeline[0]

  // Antardasha within current Mahadasha
  const mahaStart = new Date(currentMaha.startDate).getTime()
  const mahaEnd   = new Date(currentMaha.endDate).getTime()
  const mahaYrs   = currentMaha.years
  const mahaLordIdx = DASHA_ORDER.indexOf(currentMaha.planet)

  const antarDashas = []
  let aStart = mahaStart
  for (let i = 0; i < 9; i++) {
    const aPlanet = DASHA_ORDER[(mahaLordIdx + i) % 9]
    const aYrs = (DASHA_YEARS[currentMaha.planet] * DASHA_YEARS[aPlanet]) / 120
    const aEnd = aStart + aYrs * 365.25 * 24 * 3600 * 1000
    antarDashas.push({
      planet: aPlanet,
      startDate: new Date(aStart).toISOString().slice(0, 10),
      endDate: new Date(aEnd).toISOString().slice(0, 10),
    })
    aStart = aEnd
  }

  const currentAntar = antarDashas.find(d =>
    new Date(d.startDate).getTime() <= now && new Date(d.endDate).getTime() > now
  ) || antarDashas[0]

  return { timeline, currentMaha, currentAntar, antarDashas }
}

// ─── Yoga Detection ───────────────────────────────────────────────────────────
export function detectYogas(positions, houses) {
  const yogas = []
  const houseOf = (planet) => {
    const sign = positions[planet]?.sign
    if (sign == null) return null
    return houses.indexOf(sign) + 1
  }
  const signOf = (planet) => positions[planet]?.sign

  // Gajakesari: Jupiter in Kendra from Moon
  const moonSign = signOf('Moon')
  const jupSign  = signOf('Jupiter')
  if (moonSign != null && jupSign != null) {
    const diff = Math.abs(jupSign - moonSign)
    if ([0, 3, 6, 9].includes(diff) || [0, 3, 6, 9].includes(12 - diff)) {
      yogas.push({ name: 'Gajakesari Yoga', mm: 'ဂဇကေသရီ ယောဂ', type: 'benefic',
        desc: 'Jupiter in Kendra from Moon — wisdom, fame, prosperity' })
    }
  }

  // Budha-Aditya: Sun + Mercury in same sign
  if (signOf('Sun') === signOf('Mercury')) {
    yogas.push({ name: 'Budha-Aditya Yoga', mm: 'ဗုဓ-အာဒိတျ ယောဂ', type: 'benefic',
      desc: 'Sun + Mercury conjunct — sharp intellect, communication skills' })
  }

  // Raja Yoga: Lord of Kendra + Lord of Trikona in same house/aspect
  const lagnaSign = houses[0]
  const kendra = [0, 3, 6, 9].map(i => houses[i])  // signs of houses 1,4,7,10
  const trikona = [0, 4, 8].map(i => houses[i])     // signs of houses 1,5,9
  const kendraLords = kendra.map(s => SIGN_LORDS[s])
  const trikonaLords = trikona.map(s => SIGN_LORDS[s])
  const rajaCombo = kendraLords.some(k => trikonaLords.includes(k) && k !== kendraLords[0] )
  if (rajaCombo) {
    yogas.push({ name: 'Raja Yoga', mm: 'ရာဇယောဂ', type: 'benefic',
      desc: 'Kendra & Trikona lords connected — authority, status, recognition' })
  }

  // Dhana Yoga: Lords of 2H and 11H connected
  const lord2 = SIGN_LORDS[houses[1]]
  const lord11 = SIGN_LORDS[houses[10]]
  if (signOf(lord2) === signOf(lord11) || houseOf(lord2) === houseOf(lord11)) {
    yogas.push({ name: 'Dhana Yoga', mm: 'ဓနယောဂ', type: 'benefic',
      desc: '2nd & 11th house lords connected — wealth accumulation' })
  }

  // Pancha Mahapurusha Yogas
  const mahapurusha = [
    { planet: 'Jupiter', name: 'Hamsa', mm: 'ဟမ္သ ယောဂ', desc: 'Wisdom, spirituality, noble character' },
    { planet: 'Venus',   name: 'Malavya', mm: 'မာလဗျ ယောဂ', desc: 'Beauty, luxury, artistic talent' },
    { planet: 'Mars',    name: 'Ruchaka', mm: 'ရုချ ယောဂ', desc: 'Courage, leadership, martial prowess' },
    { planet: 'Mercury', name: 'Bhadra', mm: 'ဘဒြ ယောဂ', desc: 'Intellect, communication, business acumen' },
    { planet: 'Saturn',  name: 'Shasha', mm: 'ဆသ ယောဂ', desc: 'Discipline, authority, endurance' },
  ]
  const ownSigns = {
    Jupiter: [8, 11], Venus: [1, 6], Mars: [0, 7],
    Mercury: [2, 5], Saturn: [9, 10],
  }
  const exaltedSign = { Jupiter: 3, Venus: 11, Mars: 9, Mercury: 5, Saturn: 6 }

  for (const { planet, name, mm, desc } of mahapurusha) {
    const sign = signOf(planet)
    if (sign == null) continue
    const inOwnOrExalted = ownSigns[planet].includes(sign) || exaltedSign[planet] === sign
    const house = houseOf(planet)
    if (inOwnOrExalted && [1, 4, 7, 10].includes(house)) {
      yogas.push({ name, mm, type: 'benefic', desc })
    }
  }

  // Kemadruma Yoga: Moon with no planets in adjacent signs
  const adj = [(moonSign + 1) % 12, (moonSign + 11) % 12]
  const planetsExceptRahuKetu = ['Sun','Moon','Mars','Mercury','Jupiter','Venus','Saturn']
  const hasAdj = planetsExceptRahuKetu.some(p => p !== 'Moon' && adj.includes(signOf(p)))
  if (!hasAdj) {
    yogas.push({ name: 'Kemadruma Yoga', mm: 'ကေမဒ္ရုမ ယောဂ', type: 'malefic',
      desc: 'Moon isolated — emotional struggles, instability' })
  }

  return yogas
}

// ─── Main Calculator ──────────────────────────────────────────────────────────
export function calculateZata(birthData) {
  const { date, time, lat, lon } = birthData
  const [year, month, day] = date.split('-').map(Number)
  const [hour, minute] = time.split(':').map(Number)

  // Convert local time to UTC using timezone offset
  const tzOffsetHours = birthData.tzOffset ?? 6.5  // default Myanmar UTC+6:30
  const hourUTC = hour + minute / 60 - tzOffsetHours

  const jd = toJulianDate(year, month, day, hourUTC)
  const positions = getPlanetaryPositions(jd)
  const lagna = calcLagna(jd, lat, lon)
  const houses = getHouses(lagna.sign)

  // Assign planets to houses
  const planetHouses = {}
  for (const [planet, data] of Object.entries(positions)) {
    planetHouses[planet] = houses.indexOf(data.sign) + 1
  }

  const moonNak = getNakshatra(positions.Moon.longitude)
  const dasha   = calcDasha(positions.Moon.longitude, date)
  const yogas   = detectYogas(positions, houses)

  // Build house-to-planets map for chart rendering
  const houseContents = {}
  for (let i = 1; i <= 12; i++) houseContents[i] = []
  for (const [planet, house] of Object.entries(planetHouses)) {
    houseContents[house].push(planet)
  }

  return {
    jd, lagna, houses, positions, planetHouses,
    houseContents, moonNakshatra: moonNak, dasha, yogas,
    signNames: SIGN_NAMES_EN,
  }
}


// ─── Tropical Positions (no ayanamsa) ────────────────────────────────────────
export function getTropicalPositions(jd) {
  const fn = [sunLongitude, moonLongitude, marsLongitude, mercuryLongitude,
              jupiterLongitude, venusLongitude, saturnLongitude]
  const tropicals = fn.map(f => f(jd))
  const rahuTrop  = rahuLongitude(jd)

  const positions = {}
  const names = ['Sun','Moon','Mars','Mercury','Jupiter','Venus','Saturn']
  names.forEach((name, i) => {
    const lon = ((tropicals[i] % 360) + 360) % 360
    positions[name] = { longitude: lon, sign: Math.floor(lon / 30), degree: lon % 30 }
  })

  const rahuLon = ((rahuTrop % 360) + 360) % 360
  positions.Rahu = { longitude: rahuLon, sign: Math.floor(rahuLon / 30), degree: rahuLon % 30 }
  const ketuLon  = (rahuLon + 180) % 360
  positions.Ketu = { longitude: ketuLon, sign: Math.floor(ketuLon / 30), degree: ketuLon % 30 }
  return positions
}

// ─── Placidus Houses ──────────────────────────────────────────────────────────
function raToEcliptic(ra, epsRad) {
  const raRad = (((ra % 360) + 360) % 360) * Math.PI / 180
  return ((Math.atan2(Math.sin(raRad) * Math.cos(epsRad), Math.cos(raRad)) * 180 / Math.PI) % 360 + 360) % 360
}

function placidusAbove(RAMC, epsRad, latRad, frac) {
  let lon = raToEcliptic(RAMC + frac * 90, epsRad)
  for (let i = 0; i < 30; i++) {
    const lr  = (((lon % 360) + 360) % 360) * Math.PI / 180
    const dec = Math.asin(Math.sin(epsRad) * Math.sin(lr))
    const arg = Math.max(-0.9999, Math.min(0.9999, -Math.tan(latRad) * Math.tan(dec)))
    const DSA = Math.acos(arg) * 180 / Math.PI
    const next = raToEcliptic(RAMC + frac * DSA, epsRad)
    if (Math.abs(next - lon) < 0.0001) { lon = next; break }
    lon = next
  }
  return ((lon % 360) + 360) % 360
}

function placidusBelow(RAMC, epsRad, latRad, frac) {
  const icRAMC = RAMC + 180
  let lon = raToEcliptic(icRAMC + frac * 90, epsRad)
  for (let i = 0; i < 30; i++) {
    const lr  = (((lon % 360) + 360) % 360) * Math.PI / 180
    const dec = Math.asin(Math.sin(epsRad) * Math.sin(lr))
    const arg = Math.max(-0.9999, Math.min(0.9999, -Math.tan(latRad) * Math.tan(dec)))
    const DSA = Math.acos(arg) * 180 / Math.PI
    const NSA = 180 - DSA
    const next = raToEcliptic(icRAMC + frac * NSA, epsRad)
    if (Math.abs(next - lon) < 0.0001) { lon = next; break }
    lon = next
  }
  return ((lon % 360) + 360) % 360
}

export function calcPlacidusHouses(jd, latDeg, lonDeg) {
  const T      = (jd - 2451545.0) / 36525
  const GMST   = 280.46061837 + 360.98564736629 * (jd - 2451545) + 0.000387933 * T * T
  const RAMC   = ((GMST + lonDeg) % 360 + 360) % 360
  const eps    = 23.439291111 - 0.013004167 * T
  const epsRad = eps * Math.PI / 180
  const latRad = latDeg * Math.PI / 180
  const ramcRad = RAMC * Math.PI / 180

  const mc  = ((Math.atan2(Math.sin(ramcRad), Math.cos(ramcRad) * Math.cos(epsRad)) * 180 / Math.PI) % 360 + 360) % 360
  const asc = ((Math.atan2(-Math.cos(ramcRad), Math.sin(ramcRad) * Math.cos(epsRad) + Math.tan(latRad) * Math.sin(epsRad)) * 180 / Math.PI) % 360 + 360) % 360

  const c11 = placidusAbove(RAMC, epsRad, latRad, 1/3)
  const c12 = placidusAbove(RAMC, epsRad, latRad, 2/3)
  const c2  = placidusBelow(RAMC, epsRad, latRad, 1/3)
  const c3  = placidusBelow(RAMC, epsRad, latRad, 2/3)

  const ic   = (mc  + 180) % 360
  const dsc  = (asc + 180) % 360
  const c5   = (c11 + 180) % 360
  const c6   = (c12 + 180) % 360
  const c8   = (c2  + 180) % 360
  const c9   = (c3  + 180) % 360

  return [asc, c2, c3, ic, c5, c6, dsc, c8, c9, mc, c11, c12]
}

function lonIsBetween(lon, start, end) {
  lon   = ((lon   % 360) + 360) % 360
  start = ((start % 360) + 360) % 360
  end   = ((end   % 360) + 360) % 360
  return start < end ? (lon >= start && lon < end) : (lon >= start || lon < end)
}

function getPlacidusHouseOf(longitude, cusps) {
  for (let i = 0; i < 12; i++) {
    if (lonIsBetween(longitude, cusps[i], cusps[(i + 1) % 12])) return i + 1
  }
  return 1
}

// ─── Natal Aspects ────────────────────────────────────────────────────────────
const ASPECT_DEFS = [
  { name: 'Conjunction',  angle: 0,   orb: 8,  symbol: '☌', nature: 'variable' },
  { name: 'Sextile',      angle: 60,  orb: 6,  symbol: '⚹', nature: 'harmonious' },
  { name: 'Square',       angle: 90,  orb: 8,  symbol: '□', nature: 'tense' },
  { name: 'Trine',        angle: 120, orb: 8,  symbol: '△', nature: 'harmonious' },
  { name: 'Opposition',   angle: 180, orb: 8,  symbol: '☍', nature: 'tense' },
  { name: 'Quincunx',     angle: 150, orb: 3,  symbol: '⚻', nature: 'variable' },
]

export function detectAspects(positions) {
  const planets = Object.keys(positions)
  const aspects = []
  for (let i = 0; i < planets.length; i++) {
    for (let j = i + 1; j < planets.length; j++) {
      const p1 = planets[i], p2 = planets[j]
      const lon1 = positions[p1].longitude
      const lon2 = positions[p2].longitude
      let diff = Math.abs(lon1 - lon2)
      if (diff > 180) diff = 360 - diff
      for (const asp of ASPECT_DEFS) {
        const orb = Math.abs(diff - asp.angle)
        if (orb <= asp.orb) {
          aspects.push({ planet1: p1, planet2: p2, aspect: asp.name, symbol: asp.symbol, nature: asp.nature, orb: orb.toFixed(1), angle: asp.angle })
          break
        }
      }
    }
  }
  return aspects
}

// ─── Western Chart Calculator (Tropical + Placidus) ──────────────────────────
export function calculateWesternChart(birthData) {
  const { date, time, lat, lon } = birthData
  const [year, month, day]  = date.split('-').map(Number)
  const [hour, minute]      = time.split(':').map(Number)
  const tzOffsetHours       = birthData.tzOffset ?? 6.5
  const hourUTC             = hour + minute / 60 - tzOffsetHours

  const jd        = toJulianDate(year, month, day, hourUTC)
  const positions = getTropicalPositions(jd)
  const cusps     = calcPlacidusHouses(jd, lat, lon)

  const lagna = { longitude: cusps[0], sign: Math.floor(cusps[0] / 30), degree: cusps[0] % 30 }

  const planetHouses = {}
  for (const [planet, data] of Object.entries(positions)) {
    planetHouses[planet] = getPlacidusHouseOf(data.longitude, cusps)
  }

  const signContents = {}
  for (let i = 0; i < 12; i++) signContents[i] = []
  for (const [planet, data] of Object.entries(positions)) {
    signContents[data.sign].push(planet)
  }

  const houseContents = {}
  for (let i = 1; i <= 12; i++) houseContents[i] = []
  for (const [planet, house] of Object.entries(planetHouses)) {
    houseContents[house].push(planet)
  }

  const cuspInSign = {}
  for (let i = 0; i < 12; i++) cuspInSign[i] = []
  cusps.forEach((cuspLon, idx) => {
    const norm   = ((cuspLon % 360) + 360) % 360
    const sign   = Math.floor(norm / 30)
    const degree = norm % 30
    cuspInSign[sign].push({ house: idx + 1, degree })
  })

  const aspects = detectAspects(positions)
  return {
    jd, lagna, cusps, positions, planetHouses,
    signContents, houseContents, cuspInSign, aspects,
    signNames: SIGN_NAMES_EN,
    zodiacType: 'tropical',
    houseSystem: 'Placidus',
  }
}
// ─── Current Transits ─────────────────────────────────────────────────────────
export function calculateTransits(natalPositions) {
  const nowJD = toJulianDate(...getCurrentUTCParts())
  const transitPositions = getTropicalPositions(nowJD)
  const aspects = []
  for (const [tPlanet, tData] of Object.entries(transitPositions)) {
    for (const [nPlanet, nData] of Object.entries(natalPositions)) {
      let diff = Math.abs(tData.longitude - nData.longitude)
      if (diff > 180) diff = 360 - diff
      for (const asp of ASPECT_DEFS) {
        const orb = Math.abs(diff - asp.angle)
        if (orb <= asp.orb * 0.75) {
          aspects.push({ transitPlanet: tPlanet, natalPlanet: nPlanet, aspect: asp.name, symbol: asp.symbol, nature: asp.nature, orb: orb.toFixed(1) })
          break
        }
      }
    }
  }
  return { transitPositions, aspects, date: new Date().toISOString().slice(0, 10) }
}

function getCurrentUTCParts() {
  const now = new Date()
  return [now.getUTCFullYear(), now.getUTCMonth() + 1, now.getUTCDate(), now.getUTCHours() + now.getUTCMinutes()/60]
}

// ─── Julian to Calendar Date ──────────────────────────────────────────────────
function julianToDate(jd) {
  const z = Math.floor(jd + 0.5)
  const a = z < 2299161 ? z : (() => { const alpha = Math.floor((z - 1867216.25) / 36524.25); return z + 1 + alpha - Math.floor(alpha / 4) })()
  const b = a + 1524
  const c = Math.floor((b - 122.1) / 365.25)
  const d = Math.floor(365.25 * c)
  const e = Math.floor((b - d) / 30.6001)
  const day   = b - d - Math.floor(30.6001 * e)
  const month = e < 14 ? e - 1 : e - 13
  const yr    = month > 2 ? c - 4716 : c - 4715
  return `${yr}-${String(month).padStart(2,'0')}-${String(day).padStart(2,'0')}`
}

// ─── Solar Return ─────────────────────────────────────────────────────────────
export function calculateSolarReturn(birthData) {
  const { date, time, lat, lon } = birthData
  const [year, month, day] = date.split('-').map(Number)
  const [hour, minute]     = time.split(':').map(Number)
  const tzOffset           = birthData.tzOffset ?? 6.5
  const hourUTC            = hour + minute / 60 - tzOffset
  const birthJD            = toJulianDate(year, month, day, hourUTC)

  const natalPositions = getTropicalPositions(birthJD)
  const natalSunLon    = natalPositions.Sun.longitude

  const currentYear = new Date().getUTCFullYear()
  let lo = toJulianDate(currentYear, 1, 1, 0)
  let hi = toJulianDate(currentYear + 1, 1, 1, 0)

  for (let i = 0; i < 50; i++) {
    const mid = (lo + hi) / 2
    const sunLon = getTropicalPositions(mid).Sun.longitude
    let diff = sunLon - natalSunLon
    if (diff > 180) diff -= 360
    if (diff < -180) diff += 360
    if (Math.abs(diff) < 0.0001) { lo = mid; break }
    if (diff < 0) lo = mid; else hi = mid
  }
  const srJD = (lo + hi) / 2
  const srDate = julianToDate(srJD)

  const srPositions = getTropicalPositions(srJD)
  const srCusps     = calcPlacidusHouses(srJD, lat, lon)
  const srLagna     = { longitude: srCusps[0], sign: Math.floor(srCusps[0] / 30), degree: srCusps[0] % 30 }

  const signContents = {}
  for (let i = 0; i < 12; i++) signContents[i] = []
  for (const [planet, data] of Object.entries(srPositions)) signContents[data.sign].push(planet)

  const cuspInSign = {}
  for (let i = 0; i < 12; i++) cuspInSign[i] = []
  srCusps.forEach((cuspLon, idx) => {
    const norm   = ((cuspLon % 360) + 360) % 360
    const sign   = Math.floor(norm / 30)
    const degree = norm % 30
    cuspInSign[sign].push({ house: idx + 1, degree })
  })

  return { date: srDate, lagna: srLagna, positions: srPositions, cusps: srCusps, signContents, cuspInSign, signNames: SIGN_NAMES_EN }
}

// ─── Secondary Progressions ───────────────────────────────────────────────────
export function calculateProgressions(birthData) {
  const { date, time } = birthData
  const [year, month, day] = date.split('-').map(Number)
  const [hour, minute]     = time.split(':').map(Number)
  const tzOffset           = birthData.tzOffset ?? 6.5
  const hourUTC            = hour + minute / 60 - tzOffset
  const birthJD            = toJulianDate(year, month, day, hourUTC)

  const now        = new Date()
  const birthDate  = new Date(date)
  const ageInYears = (now - birthDate) / (365.25 * 24 * 3600 * 1000)
  const progJD     = birthJD + ageInYears

  const progPositions = getTropicalPositions(progJD)
  const progCusps     = calcPlacidusHouses(progJD, birthData.lat, birthData.lon)
  const progLagna     = { longitude: progCusps[0], sign: Math.floor(progCusps[0] / 30), degree: progCusps[0] % 30 }

  const signContents = {}
  for (let i = 0; i < 12; i++) signContents[i] = []
  for (const [planet, data] of Object.entries(progPositions)) signContents[data.sign].push(planet)

  const cuspInSign = {}
  for (let i = 0; i < 12; i++) cuspInSign[i] = []
  progCusps.forEach((cuspLon, idx) => {
    const norm   = ((cuspLon % 360) + 360) % 360
    const sign   = Math.floor(norm / 30)
    const degree = norm % 30
    cuspInSign[sign].push({ house: idx + 1, degree })
  })

  const natalPositions = getTropicalPositions(birthJD)
  const progToNatal    = []
  for (const [pPlanet, pData] of Object.entries(progPositions)) {
    for (const [nPlanet, nData] of Object.entries(natalPositions)) {
      let diff = Math.abs(pData.longitude - nData.longitude)
      if (diff > 180) diff = 360 - diff
      for (const asp of ASPECT_DEFS) {
        const orb = Math.abs(diff - asp.angle)
        if (orb <= 1.5) {
          progToNatal.push({ progPlanet: pPlanet, natalPlanet: nPlanet, aspect: asp.name, symbol: asp.symbol, nature: asp.nature, orb: orb.toFixed(2) })
          break
        }
      }
    }
  }

  const ageStr = `${Math.floor(ageInYears)} years`
  return { progDate: julianToDate(progJD), age: ageStr, lagna: progLagna, positions: progPositions, cusps: progCusps, signContents, cuspInSign, progToNatal, signNames: SIGN_NAMES_EN }
}
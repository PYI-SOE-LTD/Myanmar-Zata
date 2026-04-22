import { useZata } from '../../context/ZataContext'
import { t } from '../../services/i18n'

// Sidereal: rotating grid — house 1 = ASC sign, cells follow house order
const SIDEREAL_GRID = [
  [12, 1, 2, 3],
  [11, 0, 0, 4],
  [10, 0, 0, 5],
  [ 9, 8, 7, 6],
]

// Western: fixed sign grid — Aries(0) at top, signs go COUNTER-clockwise
// ← Gemini | Taurus | Aries | Pisces →  (top row: right-to-left sequence)
//   Cancer              Aquarius
//   Leo                 Capricorn
// → Virgo | Libra | Scorpio | Sagittarius ←
const WESTERN_GRID = [
  [ 2,  1,  0, 11],  // Gemini, Taurus, Aries, Pisces
  [ 3, -1, -1, 10],  // Cancer, —, —, Aquarius
  [ 4, -1, -1,  9],  // Leo, —, —, Capricorn
  [ 5,  6,  7,  8],  // Virgo, Libra, Scorpio, Sagittarius
]

const PLANET_GLYPHS = {
  Sun: '☉', Moon: '☽', Mars: '♂', Mercury: '☿',
  Jupiter: '♃', Venus: '♀', Saturn: '♄', Rahu: '☊', Ketu: '☋',
}

// Myanmar sign names from canonical table
const SIGNS_MM = ['မိဿ','ပြိဿ','မေထုန်','ကရကဋ်','သိဟ်','ကန်','တူ','ဗြိစ္ဆာ','ဓနု','မကာရ','ကုံ','မိန်']

export default function ZataChart({ chartData, westernChart, chartMode }) {
  const { state } = useZata()
  const { lang } = state
  const isWestern = chartMode === 'western'

  const activeData = isWestern ? westernChart : chartData
  if (!activeData) return null

  const { lagna, signNames } = activeData
  const signs = lang === 'mm' ? SIGNS_MM : signNames

  // ── Sidereal helpers (house-based rotating grid) ──────────────────────────
  function getSiderealSign(houseNum)    { return chartData.houses[houseNum - 1] }
  function getSiderealPlanets(houseNum) { return chartData.houseContents[houseNum] || [] }

  // ── Western helpers (fixed sign grid) ─────────────────────────────────────
  function getWesternPlanets(signIdx)   { return westernChart.signContents[signIdx] || [] }
  function getWesternCusps(signIdx)     { return westernChart.cuspInSign[signIdx] || [] }
  function getPlacidusHouse(planet)     { return westernChart?.planetHouses?.[planet] }

  // Highlight the ASC sign cell in Western mode
  const ascSignIdx = isWestern ? westernChart.lagna.sign : null

  return (
    <div className="zata-chart-wrap">
      <div className="zata-grid">
        {(isWestern ? WESTERN_GRID : SIDEREAL_GRID).map((row, ri) =>
          row.map((cell, ci) => {
            // Center cells: sidereal uses 0, western uses -1
            if ((!isWestern && cell === 0) || (isWestern && cell === -1)) return (
              <div key={`${ri}-${ci}`} className="chart-center">
                {isWestern && <span className="zodiac-badge">Tropical<br/>Placidus</span>}
              </div>
            )

            if (isWestern) {
              const signIdx = cell  // 0=Aries…11=Pisces
              const planets = getWesternPlanets(signIdx)
              const cusps   = getWesternCusps(signIdx)
              const isAsc   = signIdx === ascSignIdx
              return (
                <div key={`${ri}-${ci}`} className={`chart-cell ${isAsc ? 'lagna-cell' : ''}`}>
                  <div className="cell-top">
                    <span className="sign-num">{signIdx + 1}</span>
                    <span className="sign-name">{signs[signIdx]}</span>
                  </div>
                  {isAsc && <div className="lagna-tag">{t(lang, 'chart.lagna')} (ASC)</div>}
                  {cusps.length > 0 && (
                    <div className="cusp-info">
                      {cusps.map(c => (
                        <span key={c.house} className="cusp-tag">
                          {c.house}▲{c.degree.toFixed(0)}°
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="cell-planets">
                    {planets.map(p => (
                      <span key={p} className={`planet-tag planet-${p.toLowerCase()}`} title={t(lang, `planets.${p}`)}>
                        {PLANET_GLYPHS[p]}{' '}
                        <span className="planet-abbr">{t(lang, `planets.${p}`)}</span>
                        <sup className="planet-house-num">H{getPlacidusHouse(p)}</sup>
                      </span>
                    ))}
                  </div>
                </div>
              )
            } else {
              // Sidereal: cell = house number
              const houseNum = cell
              const houseSign = getSiderealSign(houseNum)
              const planets   = getSiderealPlanets(houseNum)
              const isLagna   = houseNum === 1
              return (
                <div key={`${ri}-${ci}`} className={`chart-cell ${isLagna ? 'lagna-cell' : ''}`}>
                  <div className="cell-top">
                    <span className="house-num">{houseNum}</span>
                    <span className="sign-name">{signs[houseSign]}</span>
                  </div>
                  {isLagna && <div className="lagna-tag">{t(lang, 'chart.lagna')}</div>}
                  <div className="cell-planets">
                    {planets.map(p => (
                      <span key={p} className={`planet-tag planet-${p.toLowerCase()}`} title={t(lang, `planets.${p}`)}>
                        {PLANET_GLYPHS[p]}{' '}
                        <span className="planet-abbr">{t(lang, `planets.${p}`)}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )
            }
          })
        )}
      </div>

      <div className="lagna-info">
        {isWestern ? (
          <span>
            ASC: <strong>{signs[westernChart.lagna.sign]} {westernChart.lagna.degree.toFixed(1)}°</strong>
            {' — '}MC: <strong>{signs[Math.floor(westernChart.cusps[9] / 30)]} {(westernChart.cusps[9] % 30).toFixed(1)}°</strong>
          </span>
        ) : (
          <span>{t(lang, 'chart.lagna')}: <strong>{signs[lagna.sign]} {lagna.degree.toFixed(1)}°</strong></span>
        )}
      </div>
    </div>
  )
}
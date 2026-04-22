import { useState } from 'react'
import { useZata } from '../../context/ZataContext'
import ZataChart from '../ZataChart/ZataChart'

const PLANET_MM = { Sun:'နေ', Moon:'လ', Mars:'အင်္ဂါ', Mercury:'ဗုဒ္ဓဟူး', Jupiter:'ကြာသပတေး', Venus:'သောကြာ', Saturn:'စနေ', Rahu:'ရာဟု', Ketu:'ကိတ်' }
const NATURE_CLASS = { harmonious: 'aspect-good', tense: 'aspect-bad', variable: 'aspect-var' }

export default function WesternAnalysis() {
  const { state } = useZata()
  const { lang, westernChart, transits, solarReturn, progressions } = state
  const [tab, setTab] = useState('aspects')

  if (!westernChart) return null
  const pname = (p) => lang === 'mm' ? (PLANET_MM[p] || p) : p

  return (
    <div className="western-analysis">
      <div className="analysis-tabs">
        {['aspects','transits','solar','progressions'].map(t => (
          <button key={t} className={`tab-btn ${tab === t ? 'tab-active' : ''}`} onClick={() => setTab(t)}>
            { t === 'aspects'      ? (lang === 'mm' ? 'ဆက်ဆံချက်' : 'Aspects')
            : t === 'transits'     ? (lang === 'mm' ? 'ယနေ့ဂြိုဟ်' : 'Transits')
            : t === 'solar'        ? (lang === 'mm' ? 'နေပြန်ဇာတာ' : 'Solar Return')
            :                        (lang === 'mm' ? 'တိုးချဲ့ဇာတာ' : 'Progressions') }
          </button>
        ))}
      </div>

      {tab === 'aspects' && (
        <div className="analysis-section">
          <h4 className="section-label">{lang === 'mm' ? 'နတ်ကတ် ဆက်ဆံချက်များ' : 'Natal Aspects'}</h4>
          {westernChart.aspects.length === 0
            ? <p className="muted">No major aspects found</p>
            : <div className="aspect-list">
                {westernChart.aspects.map((a, i) => (
                  <div key={i} className={`aspect-row ${NATURE_CLASS[a.nature] || ''}`}>
                    <span className="aspect-symbol">{a.symbol}</span>
                    <span className="aspect-planets">{pname(a.planet1)} — {pname(a.planet2)}</span>
                    <span className="aspect-name">{a.aspect}</span>
                    <span className="aspect-orb">{a.orb}°</span>
                  </div>
                ))}
              </div>
          }
        </div>
      )}

      {tab === 'transits' && transits && (
        <div className="analysis-section">
          <h4 className="section-label">{lang === 'mm' ? `ယနေ့ဂြိုဟ်ခြင်း ဆက်ဆံချက် (${transits.date})` : `Current Transits — ${transits.date}`}</h4>
          {transits.aspects.length === 0
            ? <p className="muted">{lang === 'mm' ? 'ဆက်ဆံချက် မတွေ့ပါ' : 'No significant transit aspects active'}</p>
            : <div className="aspect-list">
                {transits.aspects.map((a, i) => (
                  <div key={i} className={`aspect-row ${NATURE_CLASS[a.nature] || ''}`}>
                    <span className="aspect-symbol">{a.symbol}</span>
                    <span className="aspect-planets">{pname(a.transitPlanet)} → {pname(a.natalPlanet)}</span>
                    <span className="aspect-name">{a.aspect}</span>
                    <span className="aspect-orb">{a.orb}°</span>
                  </div>
                ))}
              </div>
          }
        </div>
      )}

      {tab === 'solar' && solarReturn && (
        <div className="analysis-section">
          <h4 className="section-label">{lang === 'mm' ? `နေပြန်ဇာတာ — ${solarReturn.date}` : `Solar Return — ${solarReturn.date}`}</h4>
          <ZataChart chartData={null} westernChart={solarReturn} chartMode="western" />
        </div>
      )}

      {tab === 'progressions' && progressions && (
        <div className="analysis-section">
          <h4 className="section-label">{lang === 'mm' ? `တိုးချဲ့ဇာတာ — ${progressions.age}` : `Secondary Progressions — Age ${progressions.age}`}</h4>
          <p className="chart-mode-note">{lang === 'mm' ? `တိုးချဲ့ရက်: ${progressions.progDate}` : `Progressed date: ${progressions.progDate}`}</p>
          <ZataChart chartData={null} westernChart={progressions} chartMode="western" />
          {progressions.progToNatal.length > 0 && (
            <>
              <h4 className="section-label" style={{marginTop:'12px'}}>{lang === 'mm' ? 'တိုးချဲ့ → နတ်ကတ် ဆက်ဆံချက်' : 'Progressed → Natal Aspects'}</h4>
              <div className="aspect-list">
                {progressions.progToNatal.map((a, i) => (
                  <div key={i} className={`aspect-row ${NATURE_CLASS[a.nature] || ''}`}>
                    <span className="aspect-symbol">{a.symbol}</span>
                    <span className="aspect-planets">{pname(a.progPlanet)} → {pname(a.natalPlanet)}</span>
                    <span className="aspect-name">{a.aspect}</span>
                    <span className="aspect-orb">{a.orb}°</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
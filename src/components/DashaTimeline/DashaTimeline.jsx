import { useZata } from '../../context/ZataContext'
import { t } from '../../services/i18n'

export default function DashaTimeline({ dasha }) {
  const { state } = useZata()
  const { lang } = state
  const { currentMaha, currentAntar, timeline } = dasha

  const now = Date.now()
  const mahaStart = new Date(currentMaha.startDate).getTime()
  const mahaEnd   = new Date(currentMaha.endDate).getTime()
  const progress  = Math.round(((now - mahaStart) / (mahaEnd - mahaStart)) * 100)
  const remaining = formatRemaining(mahaEnd - now)

  const next3 = timeline.filter(d => new Date(d.startDate).getTime() > now).slice(0, 3)

  return (
    <div className="dasha-section">
      <h3 className="section-label">{t(lang, 'chart.dasha')}</h3>
      <div className="dasha-current">
        <div className="dasha-row">
          <span className="dasha-label">{t(lang, 'chart.mahadasha')}</span>
          <span className="dasha-planet">{currentMaha.planet}</span>
          <span className="dasha-dates">{currentMaha.startDate} → {currentMaha.endDate}</span>
        </div>
        <div className="dasha-bar-wrap">
          <div className="dasha-bar" style={{ width: `${progress}%` }} />
        </div>
        <p className="dasha-remaining">{remaining} {t(lang, 'chart.remaining')}</p>

        <div className="dasha-row antar">
          <span className="dasha-label">{t(lang, 'chart.antardasha')}</span>
          <span className="dasha-planet">{currentAntar.planet}</span>
          <span className="dasha-dates">{currentAntar.startDate} → {currentAntar.endDate}</span>
        </div>
      </div>

      {next3.length > 0 && (
        <div className="dasha-upcoming">
          {next3.map(d => (
            <div key={d.startDate} className="dasha-next">
              <span className="dasha-planet">{d.planet}</span>
              <span className="dasha-dates">{d.startDate}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function formatRemaining(ms) {
  if (ms <= 0) return 'Ended'
  const totalDays = Math.floor(ms / (1000 * 3600 * 24))
  const years = Math.floor(totalDays / 365)
  const months = Math.floor((totalDays % 365) / 30)
  const parts = []
  if (years > 0)  parts.push(`${years}y`)
  if (months > 0) parts.push(`${months}m`)
  return parts.join(' ') || '< 1m'
}

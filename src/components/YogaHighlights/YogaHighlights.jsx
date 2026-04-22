import { useZata } from '../../context/ZataContext'
import { t } from '../../services/i18n'

export default function YogaHighlights({ yogas }) {
  const { state } = useZata()
  const { lang } = state

  return (
    <div className="yogas-section">
      <h3 className="section-label">{t(lang, 'chart.yogas')}</h3>
      {yogas.length === 0
        ? <p className="no-yogas">{t(lang, 'chart.noYogas')}</p>
        : (
          <div className="yoga-cards">
            {yogas.map((yoga, i) => (
              <div key={i} className={`yoga-card yoga-${yoga.type}`}>
                <div className="yoga-name">{lang === 'mm' ? yoga.mm : yoga.name}</div>
                <div className="yoga-desc">{yoga.desc}</div>
              </div>
            ))}
          </div>
        )
      }
    </div>
  )
}

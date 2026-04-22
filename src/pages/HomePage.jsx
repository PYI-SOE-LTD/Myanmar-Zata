import { useNavigate } from 'react-router-dom'
import { useZata } from '../context/ZataContext'
import { t } from '../services/i18n'
import { Sparkles, BookOpen, MessageCircle, Printer } from 'lucide-react'

const FEATURE_ICONS = [Sparkles, BookOpen, MessageCircle, Printer]

export default function HomePage() {
  const { state } = useZata()
  const { lang } = state
  const navigate = useNavigate()
  const features = t(lang, 'home.features')

  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-glyph">☽ ✦ ☉</div>
        <h1>{t(lang, 'home.hero')}</h1>
        <p>{t(lang, 'home.heroSub')}</p>
        <button className="btn-primary btn-large" onClick={() => navigate('/input')}>
          {t(lang, 'home.cta')}
        </button>
      </section>

      <section className="features">
        {features.map((f, i) => {
          const Icon = FEATURE_ICONS[i]
          return (
            <div key={i} className="feature-card">
              <div className="feature-icon"><Icon size={22} /></div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          )
        })}
      </section>

      <div className="home-footer">
        <p>မြန်မာ ဇာတာ • Vedic Jyotish • Sidereal Zodiac</p>
      </div>
    </div>
  )
}

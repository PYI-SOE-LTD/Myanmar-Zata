import { useZata } from '../../context/ZataContext'
import { t } from '../../services/i18n'
import { Globe } from 'lucide-react'

export default function Header() {
  const { state, dispatch } = useZata()
  const { lang } = state

  return (
    <header className="app-header">
      <div className="header-inner">
        <div className="brand">
          <span className="brand-icon">☽</span>
          <div>
            <div className="brand-name">{t(lang, 'appName')}</div>
            <div className="brand-sub">{t(lang, 'appSubtitle')}</div>
          </div>
        </div>
        <button
          className="lang-toggle"
          onClick={() => dispatch({ type: 'SET_LANG', payload: lang === 'mm' ? 'en' : 'mm' })}
          title="Toggle language"
        >
          <Globe size={14} />
          <span>{lang === 'mm' ? 'EN' : 'မြန်မာ'}</span>
        </button>
      </div>
    </header>
  )
}

import { useEffect } from 'react'
import { useZata } from '../../context/ZataContext'
import { t } from '../../services/i18n'
import { generateGeneralReading, generateWesternReading } from '../../services/azureAI'
import { Printer, Loader } from 'lucide-react'

export default function AIReading({ chartMode }) {
  const { state, dispatch } = useZata()
  const { lang, chartData, westernChart, birthData, aiReading, aiLoading, westernReading, westernLoading } = state

  const isWestern  = chartMode === 'western'
  const reading    = isWestern ? westernReading  : aiReading
  const loading    = isWestern ? westernLoading  : aiLoading

  useEffect(() => {
    if (!chartData || !birthData) return
    if (!isWestern && !aiReading && !aiLoading) {
      dispatch({ type: 'SET_AI_LOADING', payload: true })
      generateGeneralReading(chartData, birthData, lang)
        .then(text => dispatch({ type: 'SET_AI_READING', payload: text }))
        .catch(err  => dispatch({ type: 'SET_AI_READING', payload: `\u26a0\ufe0f ${err.message}` }))
    }
    if (isWestern && westernChart && !westernReading && !westernLoading) {
      dispatch({ type: 'SET_WESTERN_LOADING', payload: true })
      generateWesternReading(westernChart, birthData, lang)
        .then(text => dispatch({ type: 'SET_WESTERN_READING', payload: text }))
        .catch(err  => dispatch({ type: 'SET_WESTERN_READING', payload: `\u26a0\ufe0f ${err.message}` }))
    }
  }, [chartData, westernChart, birthData, chartMode])

  if (!chartData) return null

  const label = isWestern
    ? (lang === 'mm' ? 'Western \u1037\u1031\u102C\u1000\u102D\u1014\u103A\u1038 \u1021\u1000\u103C\u1019\u103B\u1038\u1016\u100A\u103A\u1038' : 'Western Chart Reading')
    : t(lang, 'chart.reading')

  return (
    <div className="reading-section" id="ai-reading">
      <div className="reading-header">
        <h3 className="section-label">{label}</h3>
        {reading && (
          <button className="btn-print" onClick={() => window.print()}>
            <Printer size={14} /> {t(lang, 'chart.print')}
          </button>
        )}
      </div>

      {loading && (
        <div className="reading-loading">
          <Loader size={24} className="spin" />
          <p>{t(lang, 'chart.generating')}</p>
        </div>
      )}

      {reading && !loading && (
        <div className="reading-body" style={{ whiteSpace: 'pre-wrap' }}>
          {reading}
        </div>
      )}
    </div>
  )
}
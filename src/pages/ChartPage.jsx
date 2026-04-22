import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useZata } from '../context/ZataContext'
import { t } from '../services/i18n'
import ZataChart from '../components/ZataChart/ZataChart'
import DashaTimeline from '../components/DashaTimeline/DashaTimeline'
import YogaHighlights from '../components/YogaHighlights/YogaHighlights'
import AIReading from '../components/AIReading/AIReading'
import WesternAnalysis from '../components/WesternAnalysis/WesternAnalysis'
import { MessageCircle, RefreshCw } from 'lucide-react'

export default function ChartPage() {
  const { state, dispatch } = useZata()
  const { lang, chartData, westernChart, birthData } = state
  const navigate = useNavigate()
  const [chartMode, setChartMode] = useState('sidereal')

  useEffect(() => {
    if (!chartData) navigate('/input')
  }, [chartData])

  if (!chartData) return null

  return (
    <div className="chart-page">
      <div className="print-header">
        <h1>\u1019\u103C\u1014\u103A\u1019\u102C \u1007\u102C\u1010\u102C \u2014 {birthData?.name}</h1>
        <p>{birthData?.date} \u00b7 {birthData?.time} \u00b7 {birthData?.city}</p>
      </div>

      <div className="chart-section">
        <h2 className="page-title">{t(lang, 'chart.title')}</h2>
        <p className="birth-summary">
          {birthData?.name} \u00b7 {birthData?.date} \u00b7 {birthData?.time} \u00b7 {birthData?.city}
        </p>

        {/* Chart mode tabs */}
        <div className="chart-mode-tabs no-print">
          <button
            className={`tab-btn ${chartMode === 'sidereal' ? 'tab-active' : ''}`}
            onClick={() => setChartMode('sidereal')}
          >
            {lang === 'mm' ? '\u1007\u1031\u102C\u1012\u102E\u101B\u101A\u103A (Vedic)' : 'Sidereal / Vedic'}
          </button>
          <button
            className={`tab-btn ${chartMode === 'western' ? 'tab-active' : ''}`}
            onClick={() => setChartMode('western')}
          >
            {lang === 'mm' ? '\u1010\u101B\u1031\u102C\u1015\u102D\u1000\u101A\u103A (Western)' : 'Tropical / Western'}
          </button>
        </div>

        {chartMode === 'sidereal' && (
          <p className="chart-mode-note">
            {lang === 'mm'
              ? '\u101C\u1031\u102C\u1039\u101C\u1005\u103A\u1031\u102C\u1000\u103A\u101B\u1031\u102C\u101B\u102B \u1021\u101E\u102F\u1036\u1038 \u1007\u102C\u1010\u102C \u2022 Lahiri Ayanamsa \u2022 Whole Sign Houses'
              : 'Sidereal zodiac \u2022 Lahiri Ayanamsa \u2022 Whole Sign Houses'}
          </p>
        )}
        {chartMode === 'western' && (
          <p className="chart-mode-note">
            {lang === 'mm'
              ? '\u1000\u101B\u1031\u102C\u1006\u102D\u101C\u102C\u1010\u101B\u1031\u102C\u1015\u102D\u1000\u101A\u103A \u1007\u102C\u1010\u102C \u2022 Tropical Zodiac \u2022 Placidus Houses \u2022 H = Placidus House No.'
              : 'Tropical zodiac \u2022 Placidus Houses \u2022 H# = Placidus house \u2022 \u25b2 = house cusp degree'}
          </p>
        )}

        <ZataChart chartData={chartData} westernChart={westernChart} chartMode={chartMode} />
      </div>

      {/* Dasha & Yogas only for sidereal (Vedic concepts) */}
      {chartMode === 'sidereal' && (
        <>
          <DashaTimeline dasha={chartData.dasha} />
          <YogaHighlights yogas={chartData.yogas} />
        </>
      )}

      <AIReading chartMode={chartMode} />

      {chartMode === 'western' && <WesternAnalysis />}

      <div className="chart-actions no-print">
        <button className="btn-primary" onClick={() => navigate('/chat')}>
          <MessageCircle size={16} /> {t(lang, 'chart.askMore')}
        </button>
        <button className="btn-secondary" onClick={() => { dispatch({ type: 'RESET' }); navigate('/input') }}>
          <RefreshCw size={14} /> New Chart
        </button>
      </div>
    </div>
  )
}
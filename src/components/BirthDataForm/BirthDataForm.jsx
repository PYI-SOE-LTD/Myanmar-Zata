import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useZata } from '../../context/ZataContext'
import { t } from '../../services/i18n'
import { searchCity, getTzOffset } from '../../services/geocoder'
import { calculateZata, calculateWesternChart, calculateTransits, calculateSolarReturn, calculateProgressions } from '../../services/zataCalculator'
import { MapPin, Clock, Calendar, User, Search, Loader } from 'lucide-react'

export default function BirthDataForm() {
  const { state, dispatch } = useZata()
  const { lang } = state
  const navigate = useNavigate()

  const [form, setForm] = useState({ name: '', date: '', time: '', city: '' })
  const [cityResults, setCityResults] = useState([])
  const [selectedCity, setSelectedCity] = useState(null)
  const [searching, setSearching] = useState(false)
  const [calculating, setCalculating] = useState(false)
  const [error, setError] = useState('')
  const searchTimer = useRef(null)

  function handleInput(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
    if (e.target.name === 'city') {
      setSelectedCity(null)
      clearTimeout(searchTimer.current)
      if (e.target.value.length >= 2) {
        setSearching(true)
        searchTimer.current = setTimeout(async () => {
          try {
            const results = await searchCity(e.target.value)
            setCityResults(results)
          } catch { setCityResults([]) }
          finally { setSearching(false) }
        }, 400)
      } else {
        setCityResults([])
        setSearching(false)
      }
    }
  }

  function selectCity(city) {
    setSelectedCity(city)
    setForm(f => ({ ...f, city: city.shortName }))
    setCityResults([])
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!selectedCity) { setError('Please select a city from the list'); return }
    if (!form.time)    { setError(t(lang, 'form.timeNote')); return }
    setError('')
    setCalculating(true)
    try {
      const tzOffset = getTzOffset(selectedCity.lat, selectedCity.lon, form.date)
      const birthData = {
        name: form.name || 'Unknown',
        date: form.date,
        time: form.time,
        city: selectedCity.displayName,
        lat: selectedCity.lat,
        lon: selectedCity.lon,
        tzOffset,
      }
      dispatch({ type: 'SET_BIRTH_DATA', payload: birthData })

      const chartData        = calculateZata(birthData)
      const westernData      = calculateWesternChart(birthData)
      const transitsData     = calculateTransits(westernData.positions)
      const solarReturnData  = calculateSolarReturn(birthData)
      const progressionsData = calculateProgressions(birthData)

      dispatch({ type: 'SET_CHART_DATA',    payload: chartData })
      dispatch({ type: 'SET_WESTERN_CHART', payload: westernData })
      dispatch({ type: 'SET_TRANSITS',      payload: transitsData })
      dispatch({ type: 'SET_SOLAR_RETURN',  payload: solarReturnData })
      dispatch({ type: 'SET_PROGRESSIONS',  payload: progressionsData })
      navigate('/chart')
    } catch (err) {
      setError('Calculation failed: ' + err.message)
    } finally {
      setCalculating(false)
    }
  }

  return (
    <form className="birth-form" onSubmit={handleSubmit} noValidate>
      <h2 className="form-title">{t(lang, 'form.title')}</h2>

      <div className="field-group">
        <label><User size={14} /> {t(lang, 'form.name')}</label>
        <input name="name" type="text" value={form.name}
          placeholder={t(lang, 'form.namePlaceholder')} onChange={handleInput} />
      </div>

      <div className="field-group">
        <label><Calendar size={14} /> {t(lang, 'form.date')}</label>
        <input name="date" type="date" value={form.date} onChange={handleInput} required />
      </div>

      <div className="field-group">
        <label><Clock size={14} /> {t(lang, 'form.time')}</label>
        <input name="time" type="time" value={form.time} onChange={handleInput} required />
        <span className="field-note">{t(lang, 'form.timeNote')}</span>
      </div>

      <div className="field-group city-field">
        <label><MapPin size={14} /> {t(lang, 'form.city')}</label>
        <div className="city-input-wrap">
          <input name="city" type="text" value={form.city} autoComplete="off"
            placeholder={t(lang, 'form.cityPlaceholder')} onChange={handleInput} required />
          {searching && <Loader size={16} className="spin" />}
          {!searching && form.city.length >= 2 && !selectedCity && <Search size={16} />}
        </div>
        {cityResults.length > 0 && (
          <ul className="city-dropdown">
            {cityResults.map((c, i) => (
              <li key={i} onClick={() => selectCity(c)}>
                <MapPin size={12} /> {c.displayName}
              </li>
            ))}
          </ul>
        )}
        {!searching && form.city.length >= 2 && cityResults.length === 0 && !selectedCity && (
          <p className="city-no-results">{t(lang, 'form.noResults')}</p>
        )}
        {selectedCity && (
          <p className="city-selected">&#x2713; {selectedCity.lat.toFixed(2)}&deg;N, {selectedCity.lon.toFixed(2)}&deg;E</p>
        )}
      </div>

      {error && <p className="form-error">{error}</p>}

      <button type="submit" className="btn-primary" disabled={calculating}>
        {calculating ? '&#x27F3; Calculating...' : t(lang, 'form.submit')}
      </button>
    </form>
  )
}
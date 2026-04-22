import { createContext, useContext, useReducer } from 'react'

const ZataContext = createContext(null)

const initialState = {
  lang: 'mm',
  birthData: null,
  chartData: null,
  westernChart: null,
  transits: null,
  solarReturn: null,
  progressions: null,
  aiReading: null,
  aiLoading: false,
  westernReading: null,
  westernLoading: false,
  chatHistory: [],
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_LANG':           return { ...state, lang: action.payload }
    case 'SET_BIRTH_DATA':     return { ...state, birthData: action.payload, chartData: null, westernChart: null, transits: null, solarReturn: null, progressions: null, aiReading: null, westernReading: null, chatHistory: [] }
    case 'SET_CHART_DATA':     return { ...state, chartData: action.payload }
    case 'SET_WESTERN_CHART':  return { ...state, westernChart: action.payload }
    case 'SET_TRANSITS':       return { ...state, transits: action.payload }
    case 'SET_SOLAR_RETURN':   return { ...state, solarReturn: action.payload }
    case 'SET_PROGRESSIONS':   return { ...state, progressions: action.payload }
    case 'SET_AI_READING':     return { ...state, aiReading: action.payload, aiLoading: false }
    case 'SET_AI_LOADING':     return { ...state, aiLoading: action.payload }
    case 'SET_WESTERN_READING':  return { ...state, westernReading: action.payload, westernLoading: false }
    case 'SET_WESTERN_LOADING':  return { ...state, westernLoading: action.payload }
    case 'ADD_CHAT_MSG':       return { ...state, chatHistory: [...state.chatHistory, action.payload] }
    case 'RESET':              return { ...initialState, lang: state.lang }
    default: return state
  }
}

export function ZataProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  return <ZataContext.Provider value={{ state, dispatch }}>{children}</ZataContext.Provider>
}

export function useZata() {
  const ctx = useContext(ZataContext)
  if (!ctx) throw new Error('useZata must be used within ZataProvider')
  return ctx
}
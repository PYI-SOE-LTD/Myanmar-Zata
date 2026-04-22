import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import { ZataProvider, useZata } from './context/ZataContext'
import { t } from './services/i18n'
import Header from './components/Layout/Header'
import HomePage from './pages/HomePage'
import InputPage from './pages/InputPage'
import ChartPage from './pages/ChartPage'
import ChatPage from './pages/ChatPage'
import { Home, Star, MessageCircle } from 'lucide-react'
import './App.css'

function BottomNav() {
  const { state } = useZata()
  const { lang } = state
  return (
    <nav className="bottom-nav no-print">
      <NavLink to="/" end><Home size={18} /><span>{t(lang, 'nav.home')}</span></NavLink>
      <NavLink to="/input"><Star size={18} /><span>{t(lang, 'nav.chart')}</span></NavLink>
      <NavLink to="/chat"><MessageCircle size={18} /><span>{t(lang, 'nav.chat')}</span></NavLink>
    </nav>
  )
}

function AppInner() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/"       element={<HomePage />} />
            <Route path="/input"  element={<InputPage />} />
            <Route path="/chart"  element={<ChartPage />} />
            <Route path="/chat"   element={<ChatPage />} />
          </Routes>
        </main>
        <BottomNav />
      </div>
    </BrowserRouter>
  )
}

export default function App() {
  return <ZataProvider><AppInner /></ZataProvider>
}

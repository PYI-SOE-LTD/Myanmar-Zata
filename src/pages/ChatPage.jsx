import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useZata } from '../context/ZataContext'
import ChatInterface from '../components/ChatInterface/ChatInterface'

export default function ChatPage() {
  const { state } = useZata()
  const navigate = useNavigate()

  useEffect(() => {
    if (!state.chartData) navigate('/input')
  }, [state.chartData])

  if (!state.chartData) return null

  return (
    <div className="chat-page">
      <ChatInterface />
    </div>
  )
}

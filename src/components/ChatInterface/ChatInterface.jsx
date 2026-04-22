import { useState, useRef, useEffect } from 'react'
import { useZata } from '../../context/ZataContext'
import { t } from '../../services/i18n'
import { sendChatMessage } from '../../services/azureAI'
import { Send, Loader } from 'lucide-react'

export default function ChatInterface() {
  const { state, dispatch } = useZata()
  const { lang, chartData, birthData, chatHistory } = state
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const bottomRef = useRef(null)
  const suggestions = t(lang, 'chat.suggestions')

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [chatHistory])

  async function send(text) {
    const msg = text || input.trim()
    if (!msg || sending) return
    setInput('')
    dispatch({ type: 'ADD_CHAT_MSG', payload: { role: 'user', content: msg } })
    setSending(true)
    try {
      const reply = await sendChatMessage(msg, chatHistory, chartData, birthData, lang)
      dispatch({ type: 'ADD_CHAT_MSG', payload: { role: 'assistant', content: reply } })
    } catch (err) {
      dispatch({ type: 'ADD_CHAT_MSG', payload: { role: 'assistant', content: `⚠️ ${err.message}` } })
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="chat-wrap">
      <h2 className="chat-title">{t(lang, 'chat.title')}</h2>

      {/* Suggestions */}
      {chatHistory.length === 0 && (
        <div className="suggestions">
          {suggestions.map((s, i) => (
            <button key={i} className="suggestion-chip" onClick={() => send(s)}>{s}</button>
          ))}
        </div>
      )}

      {/* Messages */}
      <div className="chat-messages">
        {chatHistory.map((msg, i) => (
          <div key={i} className={`chat-bubble ${msg.role}`}>
            <div className="bubble-inner" style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</div>
          </div>
        ))}
        {sending && (
          <div className="chat-bubble assistant">
            <div className="bubble-inner"><Loader size={16} className="spin" /></div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form className="chat-input-row" onSubmit={e => { e.preventDefault(); send() }}>
        <input
          value={input} onChange={e => setInput(e.target.value)}
          placeholder={t(lang, 'chat.placeholder')}
          disabled={sending}
        />
        <button type="submit" className="btn-send" disabled={sending || !input.trim()}>
          <Send size={16} />
        </button>
      </form>
    </div>
  )
}

import { useState, useRef, useEffect } from 'react';
import './App.css';
import ChatMessage from './components/ChatMessage';
import SplashScreen from './components/SplashScreen';
import { queryGemini } from './api/gemini';
import logoImage from './assets/logo-chatbot2.svg';

const MAX_MESSAGES = 7;

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [messages, setMessages] = useState([
    { text: 'Halo! 👋 Selamat datang di Chatbot Edukasi', isBot: true }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatRef = useRef(null);

  useEffect(() => {
    const el = chatRef.current;
    if (!el) return;
    const nearBottom = el.scrollHeight - el.clientHeight <= el.scrollTop + 150;
    if (nearBottom) {
      setTimeout(() => (el.scrollTop = el.scrollHeight), 0);
    }
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    const trimmed = inputText.trim();
    if (!trimmed) return;

    if (messages.length >= MAX_MESSAGES * 2) {
      window.alert('Anda telah mencapai batas maksimum percakapan. Silakan muat ulang untuk memulai percakapan baru.');
      return;
    }

    // Add user message to state immediately
    const newUserMessage = { text: trimmed, isBot: false };
    setMessages(prevMessages => [...prevMessages, newUserMessage]);
    setInputText('');
    setIsTyping(true);

    try {
      // Get last 6 messages (3 exchanges) for context, excluding the latest user message
      const contextMessages = messages.slice(-6);
      // Add the new user message to context
      const fullContext = [...contextMessages, newUserMessage];
      
      const resp = await queryGemini(trimmed, fullContext);
      setMessages(prevMessages => [...prevMessages, { text: resp, isBot: true }]);
    } catch (err) {
      console.error('Gemini error:', err);
      setMessages(prevMessages => [...prevMessages, { 
        text: 'Maaf, saya tidak bisa memberikan respons saat ini. Silakan coba lagi.',
        isBot: true 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="app-wrapper">
      {showSplash ? (
        <SplashScreen onComplete={() => setShowSplash(false)} />
      ) : (
        <div className="App">
          <div className="chat-container">
        <header className="chat-header">
          <div className="header-content">
            <div className="bot-avatar">
              <img src={logoImage} alt="Chatbot Logo" className="bot-logo" />
            </div>
            <div className="header-text">
              <h1>Chatbot Edukasi</h1>
              <p>Asisten Pembelajaran AI</p>
            </div>
          </div>
        </header>            <main className="chat-messages" ref={chatRef}>
              <div className="messages-wrap">
                {messages.map((m, i) => (
                  <ChatMessage key={i} message={m.text} isBot={m.isBot} />
                ))}

                {isTyping && (
                  <div className="typing-indicator bot" aria-hidden>
                    <span className="dot" />
                    <span className="dot" />
                    <span className="dot" />
                  </div>
                )}
              </div>

              <div className="message-counter">{Math.floor(messages.length / 2)}/{MAX_MESSAGES} pesan</div>
            </main>

            <form className="chat-input-form" onSubmit={handleSendMessage}>
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Tanyakan tentang pembelajaran..."
                className="chat-input"
                aria-label="Pesan"
              />
              <button type="submit" className="send-button">
                <span>Kirim</span>
                <svg viewBox="0 0 24 24" className="send-icon" aria-hidden>
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

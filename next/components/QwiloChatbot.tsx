'use client';

import { useState, useRef, useEffect, useCallback, memo } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { IconX, IconRefresh, IconSend } from '@tabler/icons-react';
import { useLocalStorage } from './hooks/useLocalStorage';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const TRANSLATIONS = {
  en: {
    title: 'Chat with Qwilo',
    placeholder: 'Type your message...',
    welcome: "Hi! I'm your Qwilo assistant. How can I help you today?",
    replies: ['Tell me about your services', 'How can you help my business?', 'AI automation options', 'Pricing information'],
  },
  es: {
    title: 'Chatea con Qwilo',
    placeholder: 'Escribe tu mensaje...',
    welcome: '¡Hola! Soy tu asistente de Qwilo. ¿Cómo puedo ayudarte hoy?',
    replies: ['Cuéntame sobre tus servicios', '¿Cómo puedes ayudar a mi negocio?', 'Opciones de automatización IA', 'Información de precios'],
  },
  ca: {
    title: 'Xateja amb Qwilo',
    placeholder: 'Escriu el teu missatge...',
    welcome: 'Hola! Sóc el teu assistent de Qwilo. Com et puc ajudar avui?',
    replies: ["Explica'm els teus serveis", 'Com pots ajudar al meu negoci?', "Opcions d'automatització IA", 'Informació de preus'],
  },
  fr: {
    title: 'Discutez avec Qwilo',
    placeholder: 'Tapez votre message...',
    welcome: "Bonjour! Je suis votre assistant Qwilo. Comment puis-je vous aider aujourd'hui?",
    replies: ['Parlez-moi de vos services', 'Comment pouvez-vous aider mon entreprise?', "Options d'automatisation IA", 'Informations sur les prix'],
  },
} as const;

const FLAGS = {
  en: 'https://flagcdn.com/w40/gb.png',
  es: 'https://flagcdn.com/w40/es.png',
  ca: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Flag_of_Catalonia.svg/40px-Flag_of_Catalonia.svg.png',
  fr: 'https://flagcdn.com/w40/fr.png',
} as const;

const LANG_NAMES = { en: 'English', es: 'Español', ca: 'Català', fr: 'Français' } as const;

const detectBrowserLanguage = () => {
  if (typeof window === 'undefined') return 'en';
  const stored = localStorage.getItem('qwilo_language');
  if (stored) return stored;
  const browserLang = navigator.language.split('-')[0];
  return ['en', 'es', 'ca', 'fr'].includes(browserLang) ? browserLang : 'en';
};

const generateSessionId = () =>
  `session_${Math.random().toString(36).substr(2, 9)}_${Date.now()}`;

const getSessionId = () => {
  if (typeof window === 'undefined') return generateSessionId();
  const stored = localStorage.getItem('qwilo_session_id');
  if (stored) return stored;
  const newId = generateSessionId();
  localStorage.setItem('qwilo_session_id', newId);
  return newId;
};

// Memoized components
const ChatButton = memo(({ onClick, unreadCount }: { onClick: () => void; unreadCount: number }) => (
  <motion.button
    onClick={onClick}
    className="fixed bottom-5 right-5 z-[9999] w-[60px] h-[60px] rounded-full bg-black border-2 border-neutral-800 shadow-lg transition-transform flex items-center justify-center"
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.95 }}
    aria-label="Open chat"
  >
    <Image src="/chatbot-logo.png" alt="Qwilo" width={36} height={36} className="object-contain" priority />
    {unreadCount > 0 && (
      <motion.span
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center border-2 border-black"
      >
        {unreadCount > 9 ? '9+' : unreadCount}
      </motion.span>
    )}
  </motion.button>
));
ChatButton.displayName = 'ChatButton';

const TypingIndicator = memo(() => (
  <div className="flex items-start gap-2">
    <div className="w-8 h-8 rounded-full border border-neutral-800 p-1 bg-neutral-900 flex-shrink-0">
      <Image src="/chatbot-logo.png" alt="" width={24} height={24} className="object-contain" />
    </div>
    <div className="bg-neutral-800 px-4 py-3 rounded-2xl rounded-bl-sm border border-neutral-700">
      <div className="flex gap-1.5">
        {[0, 0.2, 0.4].map((delay, i) => (
          <motion.span
            key={i}
            className="w-2 h-2 bg-neutral-500 rounded-full"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.4, repeat: Infinity, delay }}
          />
        ))}
      </div>
    </div>
  </div>
));
TypingIndicator.displayName = 'TypingIndicator';

export default function QwiloChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showReplies, setShowReplies] = useState(true);

  const [lang, setLang] = useLocalStorage<string>('qwilo_language', detectBrowserLanguage);
  const [messages, setMessages] = useLocalStorage<Message[]>('qwilo_messages', []);
  const [history, setHistory] = useLocalStorage<Message[]>('qwilo_conversation_history', []);

  const sessionId = useRef(getSessionId());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Ensure valid language
  const validLang = (['en', 'es', 'ca', 'fr'].includes(lang) ? lang : 'en') as keyof typeof TRANSLATIONS;
  const t = TRANSLATIONS[validLang];

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (isOpen && inputRef.current) inputRef.current.focus();
  }, [isOpen]);

  const sendMessage = useCallback(async (text?: string, retryCount = 0) => {
    const messageText = text || input.trim();
    if (!messageText || isLoading) return;

    setInput('');
    setShowReplies(false);

    const userMessage: Message = { role: 'user', content: messageText };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageText,
          sessionId: sessionId.current,
          language: validLang,
          conversationHistory: history,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        if (response.status === 429) {
          const data = await response.json();
          throw new Error(`Rate limit exceeded. Please wait ${data.retryAfter || 60} seconds.`);
        }
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      const botMessages = data.messages || [data.message || 'No response received'];

      setHistory(prev => [...prev, userMessage, { role: 'assistant', content: botMessages.join(' ') }]);

      for (let i = 0; i < botMessages.length; i++) {
        if (i > 0) {
          await new Promise(resolve => setTimeout(resolve, 800));
        }

        const msg = botMessages[i];
        if (!msg.startsWith('FOLLOWUP:')) {
          setMessages(prev => [...prev, { role: 'assistant', content: msg }]);
          if (!isOpen) setUnreadCount(prev => prev + 1);
        }
      }

      setShowReplies(true);
    } catch (error: any) {
      if (retryCount < 2 && error.name === 'AbortError') {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return sendMessage(messageText, retryCount + 1);
      }

      let errorMessage = 'Sorry, I encountered an error. Please try again.';
      if (error.name === 'AbortError') errorMessage = 'Request timed out. Please check your connection and try again.';
      else if (error.message.includes('Rate limit')) errorMessage = error.message;
      else if (!navigator.onLine) errorMessage = 'You appear to be offline. Please check your internet connection.';

      setMessages(prev => [...prev, { role: 'assistant', content: errorMessage }]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, validLang, history, isOpen, setMessages, setHistory]);

  const resetChat = useCallback(() => {
    if (!confirm('Are you sure you want to reset the conversation?')) return;
    setMessages([]);
    setHistory([]);
    setShowReplies(true);
    setUnreadCount(0);
  }, [setMessages, setHistory]);

  const handleOpen = useCallback(() => {
    setIsOpen(true);
    setUnreadCount(0);
  }, []);

  return (
    <>
      <ChatButton onClick={handleOpen} unreadCount={unreadCount} />

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-5 right-5 z-[9999] w-[calc(100vw-2.5rem)] sm:w-[380px] h-[85vh] sm:h-[550px] max-h-[600px] bg-neutral-900 rounded-xl shadow-2xl border border-neutral-800 flex flex-col overflow-hidden"
            role="dialog"
            aria-label="Chat with Qwilo"
            aria-modal="true"
          >
            {/* Header */}
            <div className="bg-black text-white px-5 py-4 flex justify-between items-center border-b border-neutral-800">
              <h3 className="text-lg font-semibold">{t.title}</h3>

              <div className="flex items-center gap-2">
                {/* Language Selector */}
                <div className="relative">
                  <button
                    onClick={() => setShowLangDropdown(!showLangDropdown)}
                    className="bg-neutral-900 border border-neutral-800 rounded-full p-1 hover:bg-neutral-800 transition-colors"
                  >
                    <Image src={FLAGS[validLang]} alt={LANG_NAMES[validLang]} width={20} height={20} className="rounded-full object-cover" unoptimized />
                  </button>

                  {showLangDropdown && (
                    <div className="absolute top-full right-0 mt-2 bg-neutral-900 border border-neutral-800 rounded-lg shadow-lg py-2 min-w-[140px] z-10">
                      {Object.keys(TRANSLATIONS).map(l => (
                        <button
                          key={l}
                          onClick={() => { setLang(l); setShowLangDropdown(false); }}
                          className={`w-full text-left px-3 py-2 hover:bg-neutral-800 transition-colors text-sm flex items-center gap-3 ${validLang === l ? 'bg-neutral-800' : ''}`}
                        >
                          <Image src={FLAGS[l as keyof typeof FLAGS]} alt={LANG_NAMES[l as keyof typeof LANG_NAMES]} width={20} height={20} className="rounded-full object-cover border border-neutral-700" unoptimized />
                          <span>{LANG_NAMES[l as keyof typeof LANG_NAMES]}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <button onClick={resetChat} className="p-1.5 hover:bg-neutral-800 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-700" aria-label="Reset conversation">
                  <IconRefresh size={16} />
                </button>

                <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-neutral-800 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-700" aria-label="Close chat">
                  <IconX size={20} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-5 bg-neutral-950 space-y-4">
              {messages.length === 0 && (
                <div className="flex items-start gap-2">
                  <div className="w-8 h-8 rounded-full border border-neutral-800 p-1 bg-neutral-900 flex-shrink-0">
                    <Image src="/chatbot-logo.png" alt="" width={24} height={24} className="object-contain" />
                  </div>
                  <div className="bg-neutral-800 text-white px-4 py-3 rounded-2xl rounded-bl-sm max-w-[75%] border border-neutral-700">{t.welcome}</div>
                </div>
              )}

              {messages.map((msg, idx) => (
                <div key={idx} className={`flex items-start gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  {msg.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-full border border-neutral-800 p-1 bg-neutral-900 flex-shrink-0">
                      <Image src="/chatbot-logo.png" alt="" width={24} height={24} className="object-contain" />
                    </div>
                  )}
                  <div className={`px-4 py-3 rounded-2xl max-w-[75%] ${msg.role === 'user' ? 'bg-black text-white border border-neutral-800 rounded-br-sm' : 'bg-neutral-800 text-white border border-neutral-700 rounded-bl-sm'}`}>
                    {msg.content}
                  </div>
                </div>
              ))}

              {isLoading && <TypingIndicator />}

              {showReplies && !isLoading && (
                <div className="flex flex-wrap gap-2 ml-10">
                  {t.replies.map((reply, idx) => (
                    <button
                      key={idx}
                      onClick={() => sendMessage(reply)}
                      className="bg-neutral-800 text-white px-4 py-2 rounded-full text-sm hover:bg-neutral-700 transition-colors border border-neutral-700"
                    >
                      {reply}
                    </button>
                  ))}
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-5 bg-neutral-900 border-t border-neutral-800 flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                placeholder={t.placeholder}
                maxLength={500}
                className="flex-1 px-4 py-3 bg-black border border-neutral-800 rounded-full text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-700 focus:ring-2 focus:ring-neutral-700"
                aria-label={t.placeholder}
              />
              <button
                onClick={() => sendMessage()}
                disabled={!input.trim() || isLoading}
                className="w-11 h-11 rounded-full bg-black border border-neutral-800 flex items-center justify-center hover:bg-neutral-950 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-700"
                aria-label="Send message"
              >
                <IconSend size={20} className="text-white" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

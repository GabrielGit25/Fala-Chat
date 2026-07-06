import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, CheckCheck, Send, Wifi, WifiOff, Scale } from 'lucide-react';
import {
  type Conversation,
  type Message,
  addMessage,
  getConversation,
  listMessages,
  subscribeMessages,
} from '../services/landing-chat';
import { playMessageSound, playOnlineSound } from '../lib/notification-sound';

const ONLINE_THRESHOLD_MS = 30_000;

function isOnline(conv: Conversation | null): boolean {
  if (!conv?.last_attendant_seen) return false;
  return Date.now() - new Date(conv.last_attendant_seen).getTime() < ONLINE_THRESHOLD_MS;
}

function formatTime(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
}

export default function LandingChat() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [conv, setConv] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [wasOnline, setWasOnline] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const prevCountRef = useRef(0);

  const scrollToEnd = useCallback(() => {
    setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    }, 50);
  }, []);

  useEffect(() => {
    if (!id) return;
    getConversation(id).then(setConv);
    listMessages(id).then(msgs => {
      setMessages(msgs);
      prevCountRef.current = msgs.length;
      setTimeout(scrollToEnd, 100);
    });
  }, [id, scrollToEnd]);

  useEffect(() => {
    if (!id) return;
    const sub = subscribeMessages(id, payload => {
      const newMsg = payload.new as Message;
      if (newMsg.sender !== 'user') {
        setConv(prev => prev ? { ...prev, last_attendant_seen: new Date().toISOString() } : prev);
      }
      setMessages(prev => {
        if (prev.some(m => m.id === newMsg.id)) return prev;
        return [...prev, newMsg];
      });
    });
    return () => { sub.unsubscribe(); };
  }, [id]);

  useEffect(() => {
    if (messages.length > prevCountRef.current) {
      const last = messages[messages.length - 1];
      if (last && last.sender !== 'user') playMessageSound();
      scrollToEnd();
    }
    prevCountRef.current = messages.length;
  }, [messages, scrollToEnd]);

  useEffect(() => {
    const interval = setInterval(() => {
      setConv(prev => prev ? { ...prev } : prev);
    }, 5_000);
    return () => clearInterval(interval);
  }, []);

  const currentlyOnline = isOnline(conv);
  useEffect(() => {
    if (currentlyOnline && !wasOnline) playOnlineSound();
    setWasOnline(currentlyOnline);
  }, [currentlyOnline, wasOnline]);

  const handleSend = async () => {
    if (!input.trim() || !id || sending) return;
    setSending(true);
    try {
      const text = input.trim();
      setInput('');
      await addMessage(id, {
        sender: 'user',
        sender_name: conv?.nome ?? 'Usuário',
        message: text,
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-zinc-100">
      {/* Header */}
      <div className="flex items-center px-4 py-3 border-b border-zinc-200 bg-white pt-4">
        <button onClick={() => navigate('/')} className="mr-3 p-1">
          <ArrowLeft size={24} className="text-zinc-900" />
        </button>
        <div className="w-8 h-8 rounded-lg bg-blue-700 flex items-center justify-center mr-2">
          <Scale size={16} className="text-white" />
        </div>
        <div className="flex-1">
          <div className="text-sm font-bold text-zinc-900">
            Defesa do Consumidor
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            {currentlyOnline ? (
              <>
                <Wifi size={12} className="text-green-500" />
                <span className="text-xs text-green-500">Online</span>
              </>
            ) : (
              <>
                <WifiOff size={12} className="text-zinc-400" />
                <span className="text-xs text-zinc-400">Offline</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 pt-3 pb-2 scrollbar-thin">
        {messages.length === 0 && (
          <div className="flex-1 flex items-center justify-center pt-20">
            <p className="text-zinc-500 text-sm">Aguardando resposta da equipe...</p>
          </div>
        )}
        {messages.map(msg => {
          const isMe = msg.sender === 'user';
          return (
            <div key={msg.id} className="mb-2 flex flex-col" style={{ alignItems: isMe ? 'flex-end' : 'flex-start' }}>
              <div
                className="px-3.5 py-2.5 rounded-xl"
                style={{
                  maxWidth: '80%',
                  backgroundColor: isMe ? '#0047AB' : '#e4e4e7',
                  borderBottomRightRadius: isMe ? 4 : 12,
                  borderBottomLeftRadius: isMe ? 12 : 4,
                }}
              >
                <p
                  className="text-base leading-5"
                  style={{ color: isMe ? '#fff' : '#111827' }}
                >
                  {msg.message}
                </p>
              </div>
              <div
                className="flex items-center mt-0.5"
                style={{ marginRight: isMe ? 4 : 0, marginLeft: isMe ? 0 : 4 }}
              >
                <span className="text-[10px] mr-1 text-zinc-500">{formatTime(msg.created_at)}</span>
                {isMe &&
                  (msg.read ? (
                    <CheckCheck size={11} className="text-green-500" />
                  ) : (
                    <Check size={11} className="text-zinc-500" />
                  ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Input */}
      <div className="flex items-center px-3 py-2.5 border-t border-zinc-200 bg-white">
        <input
          className="flex-1 h-11 rounded-lg px-4 bg-zinc-200 text-zinc-900 text-base outline-none"
          placeholder="Digite sua mensagem..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || sending}
          className="ml-2 w-11 h-11 rounded-lg flex items-center justify-center shrink-0 disabled:opacity-50"
          style={{ backgroundColor: input.trim() ? '#0047AB' : '#e4e4e7' }}
        >
          <Send size={20} color={input.trim() ? '#fff' : '#9ca3af'} />
        </button>
      </div>
    </div>
  );
}

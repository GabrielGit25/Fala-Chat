import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, CheckCheck, FileText, Send, Scale } from 'lucide-react';
import {
  type Conversation,
  type Message,
  sendMensagem,
  getConversa,
  listMensagens,
  resolveAnexoUrl,
  subscribeConversaMensagens,
  updateConversaCategoria,
} from '../services/fala-librelon-chat';
import { CATEGORIA_OPTIONS, type ConversationCategoria } from '../types/chat';
import { playMessageSound } from '../lib/notification-sound';

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
  const [savingCategoria, setSavingCategoria] = useState(false);

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
    getConversa(id).then(setConv);
    listMensagens(id).then(msgs => {
      setMessages(msgs);
      prevCountRef.current = msgs.length;
      setTimeout(scrollToEnd, 100);
    });
  }, [id, scrollToEnd]);

  useEffect(() => {
    if (!id) return;
    const sub = subscribeConversaMensagens(id, async payload => {
      const newMsg = await resolveAnexoUrl(payload.new as Message);
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
      if (last && last.remetente_tipo !== 'citizen') playMessageSound();
      scrollToEnd();
    }
    prevCountRef.current = messages.length;
  }, [messages, scrollToEnd]);

  const handleSend = async () => {
    if (!input.trim() || !id || sending) return;
    setSending(true);
    try {
      const text = input.trim();
      setInput('');
      const msg = await sendMensagem(id, {
        remetente_tipo: 'citizen',
        remetente_nome: conv?.nome_solicitante ?? 'Usuário',
        mensagem: text,
      });
      setMessages(prev => (prev.some(m => m.id === msg.id) ? prev : [...prev, msg]));
    } finally {
      setSending(false);
    }
  };

  const handleSelectCategoria = async (categoria: ConversationCategoria) => {
    if (!id || savingCategoria) return;
    setSavingCategoria(true);
    try {
      const label = CATEGORIA_OPTIONS.find(c => c.value === categoria)?.label ?? categoria;
      await updateConversaCategoria(id, categoria);
      setConv(prev => (prev ? { ...prev, categoria } : prev));
      // Echo the choice into the thread as a citizen message so the atendente
      // sees it (and gets an unread ping) like any other quick reply.
      const msg = await sendMensagem(id, {
        remetente_tipo: 'citizen',
        remetente_nome: conv?.nome_solicitante ?? 'Usuário',
        mensagem: label,
      });
      setMessages(prev => (prev.some(m => m.id === msg.id) ? prev : [...prev, msg]));
    } catch (err) {
      console.error('Erro ao selecionar categoria:', err);
    } finally {
      setSavingCategoria(false);
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
          <div className="text-xs text-zinc-500 mt-0.5">
            {conv?.status === 'aberto' ? 'Aguardando atendente...' : 'Em atendimento'}
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
          const isMe = msg.remetente_tipo === 'citizen';
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
                {msg.mensagem ? (
                  <p
                    className="text-base leading-5"
                    style={{ color: isMe ? '#fff' : '#111827' }}
                  >
                    {msg.mensagem}
                  </p>
                ) : null}
                {msg.anexo_url && (
                  msg.anexo_mime?.startsWith('image/') ? (
                    <a href={msg.anexo_url} target="_blank" rel="noopener noreferrer" className="block mt-1.5">
                      <img src={msg.anexo_url} alt={msg.anexo_nome || ''} className="max-w-full rounded-lg" style={{ maxHeight: 200 }} />
                    </a>
                  ) : (
                    <a href={msg.anexo_url} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1.5 mt-1.5 px-2.5 py-1.5 rounded-lg"
                      style={{ backgroundColor: isMe ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.08)' }}
                    >
                      <FileText size={14} style={{ color: isMe ? '#fff' : '#111827' }} />
                      <span className="text-xs truncate" style={{ color: isMe ? '#fff' : '#111827' }}>{msg.anexo_nome}</span>
                    </a>
                  )
                )}
              </div>
              <div
                className="flex items-center mt-0.5"
                style={{ marginRight: isMe ? 4 : 0, marginLeft: isMe ? 0 : 4 }}
              >
                <span className="text-[10px] mr-1 text-zinc-500">{formatTime(msg.created_at)}</span>
                {isMe &&
                  (msg.lido ? (
                    <CheckCheck size={11} className="text-green-500" />
                  ) : (
                    <Check size={11} className="text-zinc-500" />
                  ))}
              </div>
            </div>
          );
        })}

        {/* Category quick replies — shown until the citizen picks one */}
        {conv && !conv.categoria && conv.status !== 'resolvido' && conv.status !== 'arquivado' && (
          <div className="flex flex-col items-start mb-2">
            <p className="text-xs text-zinc-500 mb-1.5 ml-1">
              Selecione uma categoria para agilizar seu atendimento:
            </p>
            <div className="grid grid-cols-2 gap-2 w-full" style={{ maxWidth: 360 }}>
              {CATEGORIA_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => handleSelectCategoria(opt.value)}
                  disabled={savingCategoria}
                  className="px-3 py-2 rounded-xl border border-[#0047AB] text-[#0047AB] text-sm font-semibold bg-white hover:bg-[#0047AB] hover:text-white transition-colors disabled:opacity-50"
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}
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

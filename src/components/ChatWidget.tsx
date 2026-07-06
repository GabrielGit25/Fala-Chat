import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { MessageCircle, X, Send, User, Phone, ChevronDown, Scale, History, Home, Paperclip, FileText } from 'lucide-react';
import {
  type Conversation,
  type Message,
  addMessage,
  createConversation,
  getConversation,
  listMessages,
  findConversationsByUser,
  findConversationsByPhone,
  listMessagesFromConversations,
  uploadAttachment,
  subscribeMessages,
} from '../services/landing-chat';
import { playMessageSound, playOnlineSound } from '../lib/notification-sound';

const ONLINE_THRESHOLD_MS = 30_000;

function isOnline(conv: Conversation | null): boolean {
  if (!conv?.last_attendant_seen) return false;
  return Date.now() - new Date(conv.last_attendant_seen).getTime() < ONLINE_THRESHOLD_MS;
}

function maskPhone(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 2) return `(${digits}`;
  return `(${digits.slice(0, 2)})${digits.slice(2)}`;
}

function formatTime(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
}

export interface ChatWidgetHandle {
  openChat: () => void;
}

const ChatWidget = forwardRef<ChatWidgetHandle, object>(function ChatWidget(_props, ref) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<'intro' | 'terms' | 'chat'>('intro');
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [convId, setConvId] = useState<string | null>(null);
  const [conv, setConv] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [creating, setCreating] = useState(false);
  const [wasOnline, setWasOnline] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [allConvs, setAllConvs] = useState<Conversation[]>([]);
  const [userSaved, setUserSaved] = useState(false);
  const [showingHistory, setShowingHistory] = useState(false);
  const [selectedConvId, setSelectedConvId] = useState<string | null>(null);
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showFullTerm, setShowFullTerm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const prevCountRef = useRef(0);
  const historyLoadedRef = useRef(false);

  useImperativeHandle(ref, () => ({
    openChat: () => setOpen(true),
  }));

  const scrollToEnd = useCallback(() => {
    setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    }, 50);
  }, []);

  const loadUserHistory = useCallback(async (savedNome: string, savedTel: string) => {
    setLoadingHistory(true);
    try {
      const conversations = await findConversationsByPhone(savedTel);
      if (conversations.length > 0) {
        setAllConvs(conversations);
        const latest = conversations[0];
        const convIds = conversations.map(c => c.id);
        const allMsgs = await listMessagesFromConversations(convIds);
        historyLoadedRef.current = true;
        setConvId(latest.id);
        setConv(latest);
        setMessages(allMsgs);
        prevCountRef.current = allMsgs.length;
        setStep('chat');
        setTimeout(scrollToEnd, 100);
      }
    } catch (err) {
      console.error('Erro ao carregar histórico:', err);
    } finally {
      setLoadingHistory(false);
    }
  }, [scrollToEnd]);

  useEffect(() => {
    if (!open) return;
    const savedNome = localStorage.getItem('chat_nome');
    const savedTel = localStorage.getItem('chat_telefone');
    if (savedNome && savedTel) {
      setNome(savedNome);
      setTelefone(savedTel);
      setUserSaved(true);
      loadUserHistory(savedNome, savedTel);
    }
  }, [open, loadUserHistory]);

  useEffect(() => {
    if (!convId) return;
    if (historyLoadedRef.current) {
      historyLoadedRef.current = false;
      return;
    }
    getConversation(convId).then(setConv);
    listMessages(convId).then(msgs => {
      setMessages(msgs);
      prevCountRef.current = msgs.length;
      setTimeout(scrollToEnd, 100);
    });
  }, [convId, scrollToEnd]);

  useEffect(() => {
    if (!convId) return;
    const sub = subscribeMessages(convId, payload => {
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
  }, [convId]);

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

  const handleStart = () => {
    if (!nome.trim() || !telefone.trim() || creating) return;
    setStep('terms');
  };

  const handleAcceptTerms = async () => {
    if (!nome.trim() || !telefone.trim() || creating) return;
    setCreating(true);
    try {
      const existing = await findConversationsByPhone(telefone.trim());

      if (existing.length > 0) {
        localStorage.setItem('chat_nome', nome.trim());
        localStorage.setItem('chat_telefone', telefone.trim());
        setUserSaved(true);
        setAllConvs(existing);
        const latest = existing[0];
        const convIds = existing.map(c => c.id);
        const allMsgs = await listMessagesFromConversations(convIds);
        historyLoadedRef.current = true;
        setConvId(latest.id);
        setConv(latest);
        setMessages(allMsgs);
        prevCountRef.current = allMsgs.length;
        setStep('chat');
        setTimeout(scrollToEnd, 100);
      } else {
        const newConv = await createConversation({ nome: nome.trim(), telefone: telefone.trim() });
        localStorage.setItem('chat_nome', nome.trim());
        localStorage.setItem('chat_telefone', telefone.trim());
        setUserSaved(true);
        setConvId(newConv.id);
        setAllConvs(prev => [newConv, ...prev]);
        setStep('chat');
      }
    } finally {
      setCreating(false);
    }
  };

  const handleDeclineTerms = () => {
    setStep('intro');
  };

  const handleSend = async () => {
    if ((!input.trim() && !attachedFile) || sending || uploadingFile) return;
    setSending(true);
    try {
      const text = input.trim();
      setInput('');

      let attachmentData: {
        attachment_url?: string;
        attachment_name?: string;
        attachment_type?: string;
        attachment_size?: number;
      } = {};

      if (attachedFile) {
        setUploadingFile(true);
        setAttachedFile(null);
        const uploaded = await uploadAttachment(attachedFile, convId ?? 'pending');
        attachmentData = uploaded;
        setUploadingFile(false);
      }

      const isResolved = conv && (conv.status === 'resolvido' || conv.status === 'arquivado');

      if (!convId || isResolved) {
        const newConv = await createConversation({ nome, telefone });
        historyLoadedRef.current = true;
        setConvId(newConv.id);
        setConv(newConv);
        setAllConvs(prev => [newConv, ...prev]);
        const msg = await addMessage(newConv.id, {
          sender: 'user',
          sender_name: nome,
          message: text,
          ...attachmentData,
        });
        setMessages(prev => [...prev, msg]);
      } else {
        const msg = await addMessage(convId, {
          sender: 'user',
          sender_name: nome,
          message: text,
          ...attachmentData,
        });
        setMessages(prev => [...prev, msg]);
      }
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (step === 'intro') handleStart();
      else handleSend();
    }
  };

  return (
    <>
      {open && !minimized && (
        <div className="fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-32px)] h-[600px] max-h-[calc(100vh-120px)] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-zinc-200">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-[#f89d20] text-white">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                <Scale size={18} />
              </div>
              <div>
                <div className="text-sm font-bold">Defesa do Consumidor</div>
                <div className="flex items-center gap-1">
                  {currentlyOnline ? (
                    <>
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                      <span className="text-[10px] text-green-200">Online</span>
                    </>
                  ) : (
                    <>
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-300" />
                      <span className="text-[10px] text-zinc-300">Offline</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {step === 'chat' && (
                <button
                  onClick={() => {
                    localStorage.removeItem('chat_nome');
                    localStorage.removeItem('chat_telefone');
                    setUserSaved(false);
                    setStep('intro');
                    setConvId(null);
                    setConv(null);
                    setMessages([]);
                    setAllConvs([]);
                    setInput('');
                    setNome('');
                    setTelefone('');
                    setShowingHistory(false);
                    setSelectedConvId(null);
                    setTermsAccepted(false);
                    setShowFullTerm(false);
                  }}
                  className="text-[11px] px-2 py-1 rounded-lg hover:bg-white/20 font-medium"
                >
                  Sair
                </button>
              )}
              <button
                onClick={() => setMinimized(true)}
                className="w-7 h-7 rounded-lg hover:bg-white/20 flex items-center justify-center"
              >
                <ChevronDown size={16} />
              </button>
              <button
                onClick={() => {
                  setOpen(false);
                  setStep('intro');
                  setConvId(null);
                  setConv(null);
                  setMessages([]);
                  setAllConvs([]);
                  setInput('');
                  setShowingHistory(false);
                  setSelectedConvId(null);
                  setTermsAccepted(false);
                  setShowFullTerm(false);
                }}
                className="w-7 h-7 rounded-lg hover:bg-white/20 flex items-center justify-center"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Content */}
          {loadingHistory ? (
            <div className="flex-1 flex items-center justify-center">
              <span className="inline-block w-6 h-6 border-2 border-[#f89d20] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : step === 'intro' ? (
            <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
              <div className="w-14 h-14 rounded-xl bg-[#f89d20] flex items-center justify-center mb-4">
                <Scale size={24} className="text-white" />
              </div>
              <h2 className="text-xl font-bold text-zinc-900 mb-1">
                Defesa do Consumidor
              </h2>
              <p className="text-sm text-zinc-500 text-center mb-6" style={{ maxWidth: 240 }}>
                Preencha seus dados para enviar sua reclamação.
              </p>

              <div className="w-full flex flex-col gap-3">
                <div className="flex items-center bg-zinc-100 rounded-xl px-4 h-12">
                  <User size={18} className="text-zinc-500 mr-3 shrink-0" />
                  <input
                    className="flex-1 bg-transparent text-zinc-900 text-sm outline-none"
                    placeholder="Seu nome"
                    value={nome}
                    onChange={e => setNome(e.target.value)}
                    onKeyDown={handleKeyDown}
                    autoFocus
                  />
                </div>

                <div className="flex items-center bg-zinc-100 rounded-xl px-4 h-12">
                  <Phone size={18} className="text-zinc-500 mr-3 shrink-0" />
                  <input
                    className="flex-1 bg-transparent text-zinc-900 text-sm outline-none"
                    placeholder="(00)000000000"
                    inputMode="tel"
                    value={telefone}
                    onChange={e => setTelefone(maskPhone(e.target.value))}
                    onKeyDown={handleKeyDown}
                  />
                </div>

                <button
                  onClick={handleStart}
                  disabled={!nome.trim() || !telefone.trim() || creating}
                  className="w-full h-12 rounded-xl mt-1 font-bold text-sm disabled:opacity-50 text-white"
                  style={{ backgroundColor: nome.trim() && telefone.trim() ? '#000000' : '#e4e4e7' }}
                >
                  {creating ? (
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    'Enviar reclamação'
                  )}
                </button>
              </div>
            </div>
          ) : step === 'terms' ? (
            <div className="flex-1 flex flex-col px-6 py-8 overflow-y-auto">
              <div className="flex flex-col items-center mb-4">
                <div className="w-14 h-14 rounded-xl bg-[#f89d20] flex items-center justify-center mb-4">
                  <Scale size={24} className="text-white" />
                </div>
                <h2 className="text-xl font-bold text-zinc-900 mb-1">
                  Termo de Responsabilidade
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setShowFullTerm(!showFullTerm)}
                className="flex items-center gap-1.5 text-sm font-semibold text-[#f89d20] mb-4 hover:underline self-start"
              >
                <ChevronDown size={14} className={`transition-transform ${showFullTerm ? 'rotate-180' : ''}`} />
                {showFullTerm ? 'Ocultar termo completo' : 'Ler termo completo'}
              </button>

              {showFullTerm && (
                <div className="text-sm text-zinc-600 leading-relaxed mb-4 p-3 rounded-xl bg-zinc-50 border border-zinc-200">
                  <p className="mb-2">
                    <strong>TERMO DE RESPONSABILIDADE E CIÊNCIA</strong>
                  </p>
                  <p className="mb-2">
                    Ao utilizar este canal de atendimento da Defesa do Consumidor, o usuário
                    declara estar ciente e de acordo com os seguintes termos:
                  </p>
                  <ol className="list-decimal pl-5 space-y-1 mb-2">
                    <li>
                      <strong>Veracidade das informações:</strong> O usuário assume total
                      responsabilidade pelas informações fornecidas, incluindo nome, telefone
                      e relato do ocorrido, respondendo civil e criminalmente por eventuais
                      falsidades.
                    </li>
                    <li>
                      <strong>Finalidade do atendimento:</strong> Este canal tem caráter
                      informativo e de orientação, não substituindo advogado ou autoridade
                      competente para ações judiciais.
                    </li>
                    <li>
                      <strong>Privacidade dos dados:</strong> Os dados fornecidos serão
                      utilizados exclusivamente para fins de atendimento e mediação da
                      reclamação, não sendo compartilhados com terceiros sem autorização
                      prévia, nos termos da Lei Geral de Proteção de Dados (LGPD - Lei nº
                      13.709/2018).
                    </li>
                    <li>
                      <strong>Prazos de resposta:</strong> O usuário reconhece que os prazos
                      de retorno dependem da complexidade do caso e da disponibilidade da
                      equipe de atendimento.
                    </li>
                    <li>
                      <strong>Conduta adequada:</strong> O usuário se compromete a utilizar
                      linguagem respeitosa e adequada, sendo passível de bloqueio em caso de
                      ofensas, ameaças ou descumprimento das diretrizes do canal.
                    </li>
                  </ol>
                  <p>
                    Ao marcar a opção abaixo, o usuário confirma que leu, compreendeu e
                    aceita integralmente os termos deste documento.
                  </p>
                </div>
              )}

              <label className="flex items-start gap-3 mb-6 cursor-pointer">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={e => setTermsAccepted(e.target.checked)}
                  className="mt-0.5 w-4 h-4 shrink-0 accent-[#f89d20]"
                />
                <span className="text-sm text-zinc-600 leading-relaxed">
                  Li e aceito os termos de responsabilidade e ciência acima.
                </span>
              </label>

              <div className="w-full flex flex-col gap-3">
                <button
                  onClick={handleAcceptTerms}
                  disabled={!termsAccepted || creating}
                  className="w-full h-12 rounded-xl font-bold text-sm text-white disabled:opacity-50"
                  style={{ backgroundColor: termsAccepted ? '#f89d20' : '#e4e4e7' }}
                >
                  {creating ? (
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    'Aceitar e continuar'
                  )}
                </button>
                <button
                  onClick={handleDeclineTerms}
                  disabled={creating}
                  className="w-full h-12 rounded-xl font-bold text-sm text-zinc-500 hover:bg-zinc-100 transition-colors"
                >
                  Recusar
                </button>
              </div>
            </div>
          ) : showingHistory ? (
            <div className="flex-1 overflow-y-auto px-4 py-4 scrollbar-thin">
              <h3 className="text-sm font-bold text-zinc-900 mb-3">Suas conversas</h3>
              {allConvs.length === 0 ? (
                <p className="text-sm text-zinc-500 text-center pt-8">Nenhuma conversa encontrada.</p>
              ) : (
                <div className="flex flex-col gap-2">
                  {allConvs.map(conv => {
                    const convMessages = messages.filter(m => m.conversation_id === conv.id);
                    const lastMsg = convMessages[convMessages.length - 1];
                    const date = new Date(conv.created_at);
                    const dateStr = date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
                    const statusColors: Record<string, string> = {
                      aberto: 'bg-green-500',
                      em_andamento: 'bg-blue-500',
                      resolvido: 'bg-zinc-400',
                      arquivado: 'bg-zinc-300',
                    };
                    return (
                      <button
                        key={conv.id}
                        onClick={() => {
                          setSelectedConvId(conv.id);
                          setConvId(conv.id);
                          setConv(conv);
                          setShowingHistory(false);
                          setMessages(prev => prev.filter(m => m.conversation_id === conv.id));
                          setTimeout(scrollToEnd, 100);
                        }}
                        className="flex flex-col items-start w-full text-left px-3 py-3 rounded-xl bg-zinc-50 hover:bg-zinc-100 transition-colors border border-zinc-200"
                      >
                        <div className="flex items-center justify-between w-full mb-1">
                          <span className="text-xs text-zinc-500">{dateStr}</span>
                          <span className={`text-[10px] text-white px-2 py-0.5 rounded-full ${statusColors[conv.status] || 'bg-zinc-400'}`}>
                            {conv.status === 'aberto' ? 'Aberto' : conv.status === 'em_andamento' ? 'Em andamento' : conv.status === 'resolvido' ? 'Resolvido' : 'Arquivado'}
                          </span>
                        </div>
                        <p className="text-sm text-zinc-700 line-clamp-2">
                          {lastMsg ? lastMsg.message : 'Nenhuma mensagem'}
                        </p>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Messages */}
              <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 pt-3 pb-2 scrollbar-thin">
                {messages.length === 0 && (
                  <div className="flex flex-col items-center pt-12 pb-6">
                    <div
                      className="rounded-xl px-4 py-3"
                      style={{ backgroundColor: '#e4e4e7', maxWidth: '85%' }}
                    >
                      <p className="text-zinc-900 text-sm leading-relaxed text-center">
                        Olá, {nome}! Envie sua reclamação e em breve nossa equipe de defesa do consumidor responderá.
                      </p>
                    </div>
                    <p className="text-zinc-500 text-xs mt-3">Aguardando atendente...</p>
                  </div>
                )}

                {messages.map(msg => {
                  const isMe = msg.sender === 'user';
                  return (
                    <div key={msg.id} className="mb-2 flex flex-col" style={{ alignItems: isMe ? 'flex-end' : 'flex-start' }}>
                      <div
                        className="px-3 py-2 rounded-xl"
                        style={{
                          maxWidth: '85%',
                          backgroundColor: isMe ? '#f89d20' : '#e4e4e7',
                          borderBottomRightRadius: isMe ? 4 : 12,
                          borderBottomLeftRadius: isMe ? 12 : 4,
                        }}
                      >
                        <p
                          className="text-sm leading-5"
                          style={{ color: isMe ? '#fff' : '#111827' }}
                        >
                          {msg.message}
                        </p>
                        {msg.attachment_url && (
                          msg.attachment_type?.startsWith('image/') ? (
                            <a href={msg.attachment_url} target="_blank" rel="noopener noreferrer" className="block mt-1.5">
                              <img src={msg.attachment_url} alt={msg.attachment_name || ''} className="max-w-full rounded-lg" style={{ maxHeight: 160 }} />
                            </a>
                          ) : (
                            <a href={msg.attachment_url} target="_blank" rel="noopener noreferrer"
                              className="flex items-center gap-1.5 mt-1.5 px-2.5 py-1.5 rounded-lg"
                              style={{ backgroundColor: isMe ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.08)' }}
                            >
                              <FileText size={14} style={{ color: isMe ? '#fff' : '#111827' }} />
                              <span className="text-xs truncate" style={{ color: isMe ? '#fff' : '#111827' }}>{msg.attachment_name}</span>
                            </a>
                          )
                        )}
                      </div>
                      <div
                        className="flex items-center mt-0.5"
                        style={{ marginRight: isMe ? 4 : 0, marginLeft: isMe ? 0 : 4 }}
                      >
                        <span className="text-[10px] mr-1 text-zinc-500">{formatTime(msg.created_at)}</span>
                        {isMe && (
                          msg.read
                            ? <span className="text-green-500 text-[10px]">✓✓</span>
                            : <span className="text-zinc-500 text-[10px]">✓</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* File preview */}
              {attachedFile && (
                <div className="flex items-center gap-2 px-3 py-2 bg-zinc-50 border-t border-zinc-200">
                  {attachedFile.type.startsWith('image/') ? (
                    <img
                      src={URL.createObjectURL(attachedFile)}
                      alt={attachedFile.name}
                      className="w-8 h-8 rounded object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded bg-zinc-200 flex items-center justify-center">
                      <FileText size={14} className="text-zinc-500" />
                    </div>
                  )}
                  <span className="text-xs text-zinc-700 truncate flex-1">{attachedFile.name}</span>
                  <span className="text-[10px] text-zinc-400 shrink-0">
                    {(attachedFile.size / 1024).toFixed(1)} KB
                  </span>
                  <button onClick={() => setAttachedFile(null)} className="p-0.5 hover:bg-zinc-200 rounded">
                    <X size={12} className="text-zinc-500" />
                  </button>
                </div>
              )}

              {/* Input */}
              <div className="flex items-center px-3 py-2 border-t border-zinc-200 bg-white">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
                  onChange={e => {
                    const file = e.target.files?.[0] ?? null;
                    setAttachedFile(file);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingFile}
                  className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mr-1 disabled:opacity-50 hover:bg-zinc-100 transition-colors"
                  title="Anexar arquivo"
                >
                  <Paperclip size={16} className={attachedFile ? 'text-zinc-700' : 'text-zinc-400'} />
                </button>
                <input
                  className="flex-1 h-10 rounded-lg px-3 bg-zinc-100 text-zinc-900 text-sm outline-none"
                  placeholder="Digite sua mensagem..."
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
                  autoFocus
                />
                <button
                  onClick={handleSend}
                  disabled={(!input.trim() && !attachedFile) || sending || uploadingFile}
                  className="ml-2 w-10 h-10 rounded-lg flex items-center justify-center shrink-0 disabled:opacity-50"
                  style={{ backgroundColor: input.trim() || attachedFile ? '#f89d20' : '#e4e4e7' }}
                >
                  {uploadingFile ? (
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Send size={18} color={input.trim() || attachedFile ? '#fff' : '#9ca3af'} />
                  )}
                </button>
              </div>

            </>
          )}

          {step === 'chat' && (
            <div className="flex items-center justify-center gap-3 px-4 py-2 border-t border-zinc-200 bg-white">
              <button
                onClick={() => {
                  if (showingHistory) {
                    setShowingHistory(false);
                    loadUserHistory(nome, telefone);
                  } else if (selectedConvId) {
                    setSelectedConvId(null);
                    loadUserHistory(nome, telefone);
                  }
                }}
                className={`w-9 h-9 rounded-lg transition-colors flex items-center justify-center ${selectedConvId || showingHistory ? 'bg-zinc-100 hover:bg-zinc-200' : 'bg-zinc-50 text-zinc-300 cursor-default'}`}
                title="Todas as conversas"
              >
                <Home size={16} className={selectedConvId || showingHistory ? 'text-zinc-600' : 'text-zinc-300'} />
              </button>
              <button
                onClick={() => setShowingHistory(true)}
                className="w-9 h-9 rounded-lg bg-zinc-100 hover:bg-zinc-200 transition-colors flex items-center justify-center"
                title="Histórico de conversas"
              >
                <History size={16} className="text-zinc-600" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Minimized bar */}
      {open && minimized && (
        <button
          onClick={() => setMinimized(false)}
          className="fixed bottom-32 right-6 z-50 flex items-center gap-2 bg-[#f89d20] text-white px-5 py-3 rounded-full shadow-lg hover:bg-[#e38416] transition-colors"
        >
          <MessageCircle size={20} />
          <span className="text-sm font-bold">Continuar</span>
        </button>
      )}

      {/* Floating button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-8 right-6 z-50 w-16 h-16 rounded-full bg-[#f89d20] text-white shadow-lg hover:bg-[#e38416] transition-colors flex items-center justify-center shadow-[#f89d20]/50"
        >
          <MessageCircle size={32} />
        </button>
      )}
    </>
  );
});

export default ChatWidget;

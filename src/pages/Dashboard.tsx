import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Send,
  ChevronLeft,
  Phone,
  LogOut,
  Check,
  CheckCheck,
  Globe,
  MessageSquare,
  Paperclip,
  FileText,
  X,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import {
  type Message as ServiceMessage,
  type Conversation as ServiceConversation,
  addMessage as apiAddMessage,
  listConversations,
  listMessages,
  updateHeartbeat,
  markConversationRead,
  subscribeConversations,
  subscribeMessages,
  uploadAttachment,
} from '../services/landing-chat';

interface Message {
  id: string;
  text: string;
  sender: 'me' | 'them';
  timestamp: Date;
  read: boolean;
  attachment_url?: string | null;
  attachment_name?: string | null;
  attachment_type?: string | null;
  attachment_size?: number | null;
}

interface Conversation {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  lastTime: Date;
  unread: number;
  online: boolean;
  messages: Message[];
  source: 'mock' | 'landing';
  landingConvId?: string;
  telefone?: string | null;
}

const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'mock-1',
    name: 'Maria Silva',
    avatar: 'MS',
    lastMessage: 'Ok, muito obrigado pelo retorno!',
    lastTime: new Date(2026, 6, 2, 14, 32),
    unread: 2,
    online: true,
    source: 'mock',
    messages: [
      { id: 'm1', text: 'Bom dia! Gostaria de saber sobre minha demanda.', sender: 'them', timestamp: new Date(2026, 6, 2, 9, 15), read: true },
      { id: 'm2', text: 'Bom dia, Maria! Sua demanda está em análise.', sender: 'me', timestamp: new Date(2026, 6, 2, 9, 18), read: true },
      { id: 'm3', text: 'É a demanda #4521', sender: 'them', timestamp: new Date(2026, 6, 2, 9, 20), read: true },
      { id: 'm4', text: 'Deixe-me verificar o status...', sender: 'me', timestamp: new Date(2026, 6, 2, 9, 22), read: true },
      { id: 'm5', text: 'Sua demanda já foi encaminhada.', sender: 'me', timestamp: new Date(2026, 6, 2, 9, 25), read: true },
      { id: 'm6', text: 'Ok, muito obrigado pelo retorno!', sender: 'them', timestamp: new Date(2026, 6, 2, 14, 32), read: false },
    ],
  },
  {
    id: 'mock-2',
    name: 'João Santos',
    avatar: 'JS',
    lastMessage: 'Preciso de ajuda com meu cadastro',
    lastTime: new Date(2026, 6, 2, 11, 5),
    unread: 0,
    online: false,
    source: 'mock',
    messages: [
      { id: 'm7', text: 'Preciso de ajuda com meu cadastro', sender: 'them', timestamp: new Date(2026, 6, 2, 11, 5), read: true },
      { id: 'm8', text: 'Claro, João! O que houve?', sender: 'me', timestamp: new Date(2026, 6, 2, 11, 8), read: true },
    ],
  },
];

function formatTime(date: Date): string {
  const h = date.getHours().toString().padStart(2, '0');
  const m = date.getMinutes().toString().padStart(2, '0');
  return `${h}:${m}`;
}

function formatDate(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) return formatTime(date);
  if (days === 1) return 'Ontem';
  if (days < 7) return ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'][date.getDay()];
  return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}`;
}

function getAvatarColor(name: string): string {
  const colors = ['#0047AB', '#7c3aed', '#db2777', '#d97706', '#059669', '#0891b2', '#ea580c', '#4f46e5'];
  const index = name.split('').reduce((acc: number, c) => acc + c.charCodeAt(0), 0) % colors.length;
  return colors[index];
}

function serviceToConv(s: ServiceConversation): Conversation {
  return {
    id: `landing-${s.id}`,
    name: s.nome,
    avatar: s.nome.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase(),
    lastMessage: '',
    lastTime: new Date(s.updated_at),
    unread: s.unread_count,
    online: false,
    source: 'landing',
    landingConvId: s.id,
    telefone: s.telefone,
    messages: [],
  };
}

const ONLINE_THRESHOLD_MS = 30_000;

export default function Dashboard() {
  const { attendantName, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) navigate('/dashboard/login', { replace: true });
  }, [isLoggedIn, navigate]);

  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const scrollViewRef = useRef<HTMLDivElement>(null);
  const [landingMessages, setLandingMessages] = useState<Map<string, ServiceMessage[]>>(new Map());
  const [loadingLanding, setLoadingLanding] = useState(true);
  const heartbeatRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [uploadingFile, setUploadingFile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [mobileView, setMobileView] = useState<'list' | 'chat'>('list');

  const selectedConv = conversations.find(c => c.id === selectedConversation);
  const selectedLandingId = selectedConv?.source === 'landing' ? selectedConv.landingConvId : undefined;

  useEffect(() => {
    listConversations()
      .then(list => {
        setLoadingLanding(false);
        setConversations(prev => {
          const mock = prev.filter(c => c.source === 'mock');
          const landing = list.map(serviceToConv);
          return [...landing, ...mock];
        });
      })
      .catch(() => setLoadingLanding(false));
  }, []);

  useEffect(() => {
    const sub = subscribeConversations(payload => {
      if (payload.eventType === 'INSERT') {
        const newConv = payload.new as ServiceConversation;
        setConversations(prev => {
          if (prev.some(c => c.landingConvId === newConv.id)) return prev;
          return [serviceToConv(newConv), ...prev];
        });
      }
      if (payload.eventType === 'UPDATE') {
        const updated = payload.new as ServiceConversation;
        setConversations(prev => prev.map(c => {
          if (c.landingConvId === updated.id) {
            return {
              ...c,
              name: updated.nome,
              telefone: updated.telefone,
              unread: updated.unread_count,
              lastTime: new Date(updated.updated_at),
              online: updated.last_attendant_seen
                ? Date.now() - new Date(updated.last_attendant_seen).getTime() < ONLINE_THRESHOLD_MS
                : false,
            };
          }
          return c;
        }));
      }
    });
    return () => { sub.unsubscribe(); };
  }, []);

  useEffect(() => {
    if (!selectedLandingId) {
      if (heartbeatRef.current) {
        clearInterval(heartbeatRef.current);
        heartbeatRef.current = null;
      }
      return;
    }

    listMessages(selectedLandingId).then(msgs => {
      setLandingMessages(prev => {
        const next = new Map(prev);
        next.set(selectedLandingId, msgs);
        return next;
      });
    });

    const sub = subscribeMessages(selectedLandingId, payload => {
      const newMsg = payload.new as ServiceMessage;
      setLandingMessages(prev => {
        const next = new Map(prev);
        const existing = next.get(selectedLandingId) ?? [];
        if (existing.some(m => m.id === newMsg.id)) return prev;
        next.set(selectedLandingId, [...existing, newMsg]);
        return next;
      });
    });

    markConversationRead(selectedLandingId).catch(() => {});
    updateHeartbeat(selectedLandingId);
    heartbeatRef.current = setInterval(() => {
      updateHeartbeat(selectedLandingId);
    }, 15_000);

    return () => {
      sub.unsubscribe().then(() => {});
      if (heartbeatRef.current) {
        clearInterval(heartbeatRef.current);
        heartbeatRef.current = null;
      }
    };
  }, [selectedLandingId]);

  useEffect(() => {
    setAttachedFile(null);
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTop = scrollViewRef.current.scrollHeight;
    }
  }, [selectedConversation]);

  const landingMsgCount = selectedLandingId
    ? landingMessages.get(selectedLandingId)?.length ?? 0
    : 0;

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTop = scrollViewRef.current.scrollHeight;
    }
  }, [selectedConv?.messages.length, landingMsgCount]);

  useEffect(() => {
    if (selectedConversation) setMobileView('chat');
  }, [selectedConversation]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setAttachedFile(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, []);

  const clearAttachedFile = useCallback(() => {
    setAttachedFile(null);
  }, []);

  const sendMessage = useCallback(async () => {
    if ((!messageText.trim() && !attachedFile) || !selectedConversation || uploadingFile) return;

    const text = messageText.trim();
    const conv = conversations.find(c => c.id === selectedConversation);
    setMessageText('');

    if (conv?.source === 'landing' && conv.landingConvId) {
      let attachmentData: {
        attachment_url?: string;
        attachment_name?: string;
        attachment_type?: string;
        attachment_size?: number;
      } = {};

      if (attachedFile) {
        setUploadingFile(true);
        try {
          const uploaded = await uploadAttachment(attachedFile, conv.landingConvId);
          attachmentData = uploaded;
        } catch {
          setUploadingFile(false);
          setMessageText(text);
          return;
        }
        setUploadingFile(false);
        setAttachedFile(null);
      }

      try {
        await apiAddMessage(conv.landingConvId, {
          sender: 'attendant',
          sender_name: attendantName || 'Atendente',
          message: text,
          ...attachmentData,
        });
        setConversations(prev => prev.map(c => {
          if (c.id !== selectedConversation) return c;
          return { ...c, lastMessage: text, lastTime: new Date(), unread: 0 };
        }));
      } catch {
        setMessageText(text);
      }
    } else {
      const newMsg: Message = {
        id: `m${Date.now()}`,
        text,
        sender: 'me',
        timestamp: new Date(),
        read: false,
      };
      setConversations(prev => prev.map(c => {
        if (c.id !== selectedConversation) return c;
        return {
          ...c,
          lastMessage: newMsg.text,
          lastTime: newMsg.timestamp,
          unread: 0,
          messages: [...c.messages, newMsg],
        };
      }));
    }
  }, [messageText, selectedConversation, conversations, attendantName, attachedFile, uploadingFile]);

  const filteredConversations = conversations.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const colors = {
    primary: '#0047AB',
    onlineGreen: '#22c55e',
  };

  if (!isLoggedIn) return null;

  const renderConversationItem = (conv: Conversation) => (
    <button
      key={conv.id}
      onClick={() => setSelectedConversation(conv.id)}
      className="w-full flex items-center p-3.5 border-b border-zinc-200 dark:border-zinc-700 text-left hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
      style={{
        backgroundColor: selectedConversation === conv.id ? '#e8f0fe' : 'transparent',
      }}
    >
      <div className="relative w-12 h-12 rounded-full flex items-center justify-center shrink-0"
        style={{ backgroundColor: getAvatarColor(conv.name) }}
      >
        <span className="text-white text-lg font-bold">{conv.avatar}</span>
        {conv.online && (
          <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white"
            style={{ backgroundColor: colors.onlineGreen }}
          />
        )}
      </div>
      <div className="flex-1 ml-3 min-w-0">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1.5 flex-1 min-w-0">
            <span className="text-zinc-900 dark:text-white text-base font-semibold truncate">
              {conv.name}
            </span>
            {conv.source === 'landing' && (
              <span className="shrink-0 text-white text-[9px] font-semibold px-1 py-0.5 rounded"
                style={{ backgroundColor: colors.primary }}
              >
                SITE
              </span>
            )}
          </div>
          <span className="text-zinc-500 text-xs shrink-0 ml-2">{formatDate(conv.lastTime)}</span>
        </div>
        {conv.source === 'landing' && conv.telefone ? (
          <span className="block text-zinc-500 text-sm mt-0.5 truncate">{conv.telefone}</span>
        ) : null}
        <div className="flex justify-between items-center mt-0.5">
          <span className="text-zinc-500 text-sm truncate flex-1">{conv.lastMessage}</span>
          {conv.unread > 0 && (
            <span className="shrink-0 text-white text-xs font-bold min-w-[20px] h-5 flex items-center justify-center rounded-full ml-2 px-1.5"
              style={{ backgroundColor: colors.primary }}
            >
              {conv.unread}
            </span>
          )}
        </div>
      </div>
    </button>
  );

  const renderChatView = () => {
    if (!selectedConv) {
      return (
        <div className="flex-1 flex items-center justify-center bg-zinc-100">
          <div className="text-center">
            <MessageSquare size={48} className="text-zinc-300 mx-auto mb-4" />
            <p className="text-zinc-500 text-base">Selecione uma conversa</p>
          </div>
        </div>
      );
    }

    const msgs = selectedConv.source === 'landing' && selectedLandingId
      ? landingMessages.get(selectedLandingId) ?? []
      : selectedConv.messages;

    return (
      <div className="flex-1 flex flex-col bg-zinc-100 overflow-hidden">
        {/* Chat header */}
        <div className="flex items-center p-3 border-b border-zinc-200 bg-white shrink-0">
          <button onClick={() => { setSelectedConversation(null); setMobileView('list'); }}
            className="md:hidden mr-2 p-1">
            <ChevronLeft size={24} className="text-zinc-900" />
          </button>
          <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
            style={{ backgroundColor: getAvatarColor(selectedConv.name) }}
          >
            <span className="text-white text-sm font-bold">{selectedConv.avatar}</span>
          </div>
          <div className="flex-1 ml-3">
            <div className="flex items-center gap-1.5">
              <span className="text-zinc-900 text-base font-semibold">{selectedConv.name}</span>
              {selectedConv.source === 'landing' && <Globe size={14} style={{ color: colors.primary }} />}
            </div>
            {selectedConv.source === 'landing' && selectedConv.telefone ? (
              <span className="text-zinc-500 text-xs">{selectedConv.telefone}</span>
            ) : null}
            <span className="text-xs" style={{ color: selectedConv.online ? colors.onlineGreen : '#71717a' }}>
              {selectedConv.online ? 'Online' : 'Offline'}
            </span>
          </div>
          <button className="p-2">
            <Phone size={20} style={{ color: colors.primary }} />
          </button>
        </div>

        {/* Messages */}
        <div ref={scrollViewRef} className="flex-1 overflow-y-auto min-h-0 p-3 scrollbar-thin">
          {msgs.length === 0 && loadingLanding && (
            <div className="flex items-center justify-center pt-10">
              <span className="w-5 h-5 border-2 border-zinc-300 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          {selectedConv.source === 'landing'
            ? (msgs as ServiceMessage[]).map(msg => {
                const isMe = msg.sender !== 'user';
                return (
                  <div key={msg.id} className="mb-1.5 flex flex-col" style={{ alignItems: isMe ? 'flex-end' : 'flex-start' }}>
                    <div
                      className="px-3.5 py-2.5 rounded-xl"
                      style={{
                        maxWidth: '80%',
                        backgroundColor: isMe ? colors.primary : '#e4e4e7',
                        borderBottomRightRadius: isMe ? 4 : 12,
                        borderBottomLeftRadius: isMe ? 12 : 4,
                      }}
                    >
                      <p className="text-base leading-5" style={{ color: isMe ? '#fff' : '#111827' }}>
                        {msg.message}
                      </p>
                      {msg.attachment_url && (
                        msg.attachment_type?.startsWith('image/') ? (
                          <a href={msg.attachment_url} target="_blank" rel="noopener noreferrer" className="block mt-2">
                            <img src={msg.attachment_url} alt={msg.attachment_name || ''} className="max-w-full rounded-lg" style={{ maxHeight: 200 }} />
                          </a>
                        ) : (
                          <a href={msg.attachment_url} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-2 mt-2 px-3 py-2 rounded-lg"
                            style={{ backgroundColor: isMe ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.08)' }}
                          >
                            <FileText size={16} style={{ color: isMe ? '#fff' : '#111827' }} />
                            <span className="text-sm truncate" style={{ color: isMe ? '#fff' : '#111827' }}>{msg.attachment_name}</span>
                          </a>
                        )
                      )}
                    </div>
                    <div className="flex items-center mt-0.5" style={{ marginRight: isMe ? 4 : 0, marginLeft: isMe ? 0 : 4 }}>
                      <span className="text-[10px] mr-1 text-zinc-500">{formatTime(new Date(msg.created_at))}</span>
                      {isMe && (
                        msg.read
                          ? <CheckCheck size={11} className="text-green-500" />
                          : <Check size={11} className="text-zinc-500" />
                      )}
                    </div>
                  </div>
                );
              })
            : (msgs as Message[]).map(msg => {
                const isMe = msg.sender === 'me';
                return (
                  <div key={msg.id} className="mb-1.5 flex flex-col" style={{ alignItems: isMe ? 'flex-end' : 'flex-start' }}>
                    <div
                      className="px-3.5 py-2.5 rounded-xl"
                      style={{
                        maxWidth: '80%',
                        backgroundColor: isMe ? colors.primary : '#e4e4e7',
                        borderBottomRightRadius: isMe ? 4 : 12,
                        borderBottomLeftRadius: isMe ? 12 : 4,
                      }}
                    >
                      <p className="text-base leading-5" style={{ color: isMe ? '#fff' : '#111827' }}>
                        {msg.text}
                      </p>
                      {msg.attachment_url && (
                        msg.attachment_type?.startsWith('image/') ? (
                          <a href={msg.attachment_url} target="_blank" rel="noopener noreferrer" className="block mt-2">
                            <img src={msg.attachment_url} alt={msg.attachment_name || ''} className="max-w-full rounded-lg" style={{ maxHeight: 200 }} />
                          </a>
                        ) : (
                          <a href={msg.attachment_url} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-2 mt-2 px-3 py-2 rounded-lg"
                            style={{ backgroundColor: isMe ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.08)' }}
                          >
                            <FileText size={16} style={{ color: isMe ? '#fff' : '#111827' }} />
                            <span className="text-sm truncate" style={{ color: isMe ? '#fff' : '#111827' }}>{msg.attachment_name}</span>
                          </a>
                        )
                      )}
                    </div>
                    <div className="flex items-center mt-0.5" style={{ marginRight: isMe ? 4 : 0, marginLeft: isMe ? 0 : 4 }}>
                      <span className="text-[10px] mr-1 text-zinc-500">{formatTime(msg.timestamp)}</span>
                      {isMe && (
                        msg.read
                          ? <CheckCheck size={11} className="text-green-500" />
                          : <Check size={11} className="text-zinc-500" />
                      )}
                    </div>
                  </div>
                );
              })}
        </div>

        {/* File preview */}
        {attachedFile && (
          <div className="flex items-center gap-2 px-4 py-2 bg-zinc-50 border-t border-zinc-200 shrink-0">
            {attachedFile.type.startsWith('image/') ? (
              <img
                src={URL.createObjectURL(attachedFile)}
                alt={attachedFile.name}
                className="w-10 h-10 rounded object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded bg-zinc-200 flex items-center justify-center">
                <FileText size={18} className="text-zinc-500" />
              </div>
            )}
            <span className="text-sm text-zinc-700 truncate flex-1">{attachedFile.name}</span>
            <span className="text-xs text-zinc-400 shrink-0">
              {(attachedFile.size / 1024).toFixed(1)} KB
            </span>
            <button onClick={clearAttachedFile} className="p-1 hover:bg-zinc-200 rounded">
              <X size={14} className="text-zinc-500" />
            </button>
          </div>
        )}

        {/* Input */}
        <div className="flex items-end p-3 pt-2.5 border-t border-zinc-200 bg-white shrink-0">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
            onChange={handleFileSelect}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadingFile}
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mr-2 disabled:opacity-50 hover:bg-zinc-100 transition-colors"
            style={{ backgroundColor: attachedFile ? '#e4e4e7' : 'transparent' }}
            title="Anexar arquivo"
          >
            <Paperclip size={18} className={attachedFile ? 'text-zinc-700' : 'text-zinc-400'} />
          </button>
          <textarea
            className="flex-1 rounded-xl px-4 py-3 resize-none outline-none"
            style={{
              minHeight: 56,
              maxHeight: 120,
              backgroundColor: '#e4e4e7',
              color: '#111827',
              fontSize: 15,
            }}
            placeholder="Digite sua mensagem..."
            value={messageText}
            onChange={e => setMessageText(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
            rows={1}
          />
          <button
            onClick={sendMessage}
            disabled={(!messageText.trim() && !attachedFile) || uploadingFile}
            className="ml-2.5 w-12 h-12 rounded-xl flex items-center justify-center shrink-0 disabled:opacity-50"
            style={{ backgroundColor: messageText.trim() || attachedFile ? colors.primary : '#e4e4e7' }}
          >
            {uploadingFile ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send size={20} color={messageText.trim() || attachedFile ? '#fff' : '#9ca3af'} />
            )}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen flex flex-col bg-zinc-100">
      {/* Mobile: show list or chat. Desktop: show both */}
      <div className="flex-1 flex overflow-hidden">
        {/* Mobile list view */}
        <div className={`flex-1 flex md:hidden ${mobileView === 'chat' ? 'hidden' : ''}`}>
          <div className="flex-1 flex flex-col bg-white">
            <div className="p-4 border-b border-zinc-200">
              <div className="flex items-center justify-between mb-3">
                <h1 className="text-xl font-bold text-zinc-900">
                  Fala<span className="text-amber-500">Librelon</span>
                </h1>
                <button onClick={() => { logout(); navigate('/dashboard/login'); }}
                  className="flex items-center gap-1 text-zinc-500 text-sm">
                  <LogOut size={16} /> Sair
                </button>
              </div>
              <div className="flex items-center bg-zinc-200 rounded-xl px-3.5 h-11">
                <Search size={18} className="text-zinc-500 shrink-0" />
                <input
                  className="flex-1 ml-2.5 bg-transparent text-zinc-900 text-sm outline-none"
                  placeholder="Buscar conversas..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto scrollbar-thin">
              {filteredConversations.map(renderConversationItem)}
              {filteredConversations.length === 0 && (
                <div className="p-6 text-center">
                  <p className="text-zinc-500 text-sm">Nenhuma conversa encontrada</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile chat view (full screen) */}
        <div className={`flex-1 flex md:hidden min-h-0 ${mobileView === 'list' ? 'hidden' : ''}`}>
          {renderChatView()}
        </div>

        {/* Desktop: sidebar + chat */}
        <div className="hidden md:flex flex-1 min-h-0">
          {/* Sidebar */}
          <div className="w-[360px] flex flex-col bg-white border-r border-zinc-200">
            <div className="p-4 border-b border-zinc-200">
              <div className="flex items-center justify-between mb-3">
                <h1 className="text-xl font-bold text-zinc-900">
                  Fala<span className="text-amber-500">Librelon</span>
                </h1>
                <button onClick={() => { logout(); navigate('/dashboard/login'); }}
                  className="flex items-center gap-1 text-zinc-500 text-sm hover:text-zinc-700">
                  <LogOut size={16} /> Sair
                </button>
              </div>
              <div className="flex items-center bg-zinc-200 rounded-xl px-3.5 h-11">
                <Search size={18} className="text-zinc-500 shrink-0" />
                <input
                  className="flex-1 ml-2.5 bg-transparent text-zinc-900 text-sm outline-none"
                  placeholder="Buscar conversas..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto scrollbar-thin">
              {filteredConversations.map(renderConversationItem)}
              {filteredConversations.length === 0 && (
                <div className="p-6 text-center">
                  <p className="text-zinc-500 text-sm">Nenhuma conversa encontrada</p>
                </div>
              )}
            </div>
          </div>

          {/* Chat panel */}
          <div className="flex-1 flex min-h-0">
            {renderChatView()}
          </div>
        </div>
      </div>
    </div>
  );
}

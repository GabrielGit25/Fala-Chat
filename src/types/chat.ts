// Matches fala_librelon_chat_conversas / fala_librelon_chat_mensagens in the
// shared Supabase project (same tables atuapolitica-frontend's staff dashboard
// reads/writes — see types/fala-librelon.ts there for the RN-side twin of this
// file). This app is now the public-facing entry point only; there is no
// attendant dashboard here anymore.

export type ConversationStatus = 'aberto' | 'em_andamento' | 'resolvido' | 'arquivado';

// Selecionada pelo cidadão via botões de resposta rápida logo após a mensagem
// inicial (migration 031 em atuapolitica-frontend). NULL até ele escolher.
export type ConversationCategoria = 'denuncias' | 'orientacoes' | 'reclamacoes' | 'outros';

export const CATEGORIA_OPTIONS: { value: ConversationCategoria; label: string }[] = [
  { value: 'denuncias', label: 'Denúncias' },
  { value: 'orientacoes', label: 'Orientações' },
  { value: 'reclamacoes', label: 'Reclamações' },
  { value: 'outros', label: 'Outros' },
];

export interface Conversation {
  id: string;
  nome_solicitante: string;
  telefone_contato: string;
  email: string | null;
  assunto: string | null;
  status: ConversationStatus;
  categoria: ConversationCategoria | null;
  assigned_atendente: string | null;
  fala_librelon_id: string | null;
  last_message_at: string | null;
  created_at: string;
  updated_at: string;
}

export type RemetenteTipo = 'citizen' | 'atendente' | 'sistema';

export interface Message {
  id: number;
  conversa_id: string;
  remetente_tipo: RemetenteTipo;
  remetente_id: string | null;
  remetente_nome: string;
  mensagem: string | null;
  anexo_path: string | null;
  anexo_nome: string | null;
  anexo_mime: string | null;
  anexo_tamanho: number | null;
  lido: boolean;
  created_at: string;
  // Fresh short-lived signed URL, populated by listMensagens/resolveAnexoUrl.
  anexo_url?: string | null;
}

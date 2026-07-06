export interface Conversation {
  id: string;
  nome: string;
  email: string | null;
  telefone: string | null;
  status: 'aberto' | 'em_andamento' | 'resolvido' | 'arquivado';
  assunto: string | null;
  assigned_to: string | null;
  attendant_name: string | null;
  unread_count: number;
  last_attendant_seen: string | null;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender: string;
  sender_name: string;
  message: string;
  read: boolean;
  created_at: string;
  attachment_url: string | null;
  attachment_name: string | null;
  attachment_type: string | null;
  attachment_size: number | null;
}

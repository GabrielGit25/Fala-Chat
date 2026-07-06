import { supabase } from '@/lib/supabase';
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import type { Conversation, Message } from '@/types/chat';

export type { Conversation, Message };

const CONVERSATIONS_TABLE = 'landing_chat_conversations';
const MESSAGES_TABLE = 'landing_chat_messages';

export async function createConversation(data: {
  nome: string;
  email?: string;
  telefone?: string;
  assunto?: string;
}): Promise<Conversation> {
  const { data: result, error } = await supabase
    .from(CONVERSATIONS_TABLE)
    .insert({
      nome: data.nome,
      email: data.email || null,
      telefone: data.telefone || null,
      assunto: data.assunto || null,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return result;
}

const ATTACHMENTS_BUCKET = 'chat-attachments';

export async function uploadAttachment(
  file: File,
  conversationId: string,
): Promise<{
  attachment_url: string;
  attachment_name: string;
  attachment_type: string;
  attachment_size: number;
}> {
  const fileExt = file.name.split('.').pop();
  const filePath = `${conversationId}/${Date.now()}_${Math.random().toString(36).slice(2)}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from(ATTACHMENTS_BUCKET)
    .upload(filePath, file);

  if (uploadError) throw new Error(uploadError.message);

  const { data: { publicUrl } } = supabase.storage
    .from(ATTACHMENTS_BUCKET)
    .getPublicUrl(filePath);

  return {
    attachment_url: publicUrl,
    attachment_name: file.name,
    attachment_type: file.type,
    attachment_size: file.size,
  };
}

export async function addMessage(
  conversationId: string,
  data: {
    sender: string;
    sender_name: string;
    message: string;
    attachment_url?: string | null;
    attachment_name?: string | null;
    attachment_type?: string | null;
    attachment_size?: number | null;
  },
): Promise<Message> {
  const { data: msg, error } = await supabase
    .from(MESSAGES_TABLE)
    .insert({
      conversation_id: conversationId,
      sender: data.sender,
      sender_name: data.sender_name,
      message: data.message,
      attachment_url: data.attachment_url ?? null,
      attachment_name: data.attachment_name ?? null,
      attachment_type: data.attachment_type ?? null,
      attachment_size: data.attachment_size ?? null,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);

  if (data.sender !== 'user') {
    const { error: rpcError } = await supabase.rpc('increment_chat_unread', {
      conv_id: conversationId,
    });
    if (rpcError) console.warn('Failed to increment unread:', rpcError);
  }

  return msg;
}

export async function getConversation(id: string): Promise<Conversation | null> {
  const { data, error } = await supabase
    .from(CONVERSATIONS_TABLE)
    .select()
    .eq('id', id)
    .single();

  if (error) return null;
  return data;
}

export async function listConversations(): Promise<Conversation[]> {
  const { data, error } = await supabase
    .from(CONVERSATIONS_TABLE)
    .select()
    .order('updated_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function listMessages(conversationId: string): Promise<Message[]> {
  const { data, error } = await supabase
    .from(MESSAGES_TABLE)
    .select()
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function updateConversation(
  id: string,
  data: Partial<{
    status: string;
    assigned_to: string;
    attendant_name: string;
  }>,
): Promise<void> {
  const { error } = await supabase
    .from(CONVERSATIONS_TABLE)
    .update(data)
    .eq('id', id);

  if (error) throw new Error(error.message);
}

export async function updateHeartbeat(conversationId: string): Promise<void> {
  const { error } = await supabase
    .from(CONVERSATIONS_TABLE)
    .update({ last_attendant_seen: new Date().toISOString() })
    .eq('id', conversationId);

  if (error) console.warn('Failed to update heartbeat:', error.message);
}

export async function markConversationRead(conversationId: string): Promise<void> {
  const { error: rpcError } = await supabase.rpc('reset_chat_unread', {
    conv_id: conversationId,
  });
  if (rpcError) console.warn('Failed to reset unread:', rpcError);

  const { error } = await supabase
    .from(MESSAGES_TABLE)
    .update({ read: true })
    .eq('conversation_id', conversationId)
    .eq('sender', 'user')
    .eq('read', false);

  if (error) console.warn('Failed to mark messages read:', error.message);
}

export async function findConversationsByUser(data: {
  nome: string;
  telefone: string;
}): Promise<Conversation[]> {
  const { data: result, error } = await supabase
    .from(CONVERSATIONS_TABLE)
    .select()
    .eq('nome', data.nome)
    .eq('telefone', data.telefone)
    .order('updated_at', { ascending: false });

  if (error) throw new Error(error.message);
  return result ?? [];
}

export async function findConversationsByPhone(
  telefone: string,
): Promise<Conversation[]> {
  const { data: result, error } = await supabase
    .from(CONVERSATIONS_TABLE)
    .select()
    .eq('telefone', telefone)
    .order('updated_at', { ascending: false });

  if (error) throw new Error(error.message);
  return result ?? [];
}

export async function listMessagesFromConversations(
  conversationIds: string[],
): Promise<Message[]> {
  if (conversationIds.length === 0) return [];
  const { data, error } = await supabase
    .from(MESSAGES_TABLE)
    .select()
    .in('conversation_id', conversationIds)
    .order('created_at', { ascending: true });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export function subscribeConversations(
  callback: (payload: RealtimePostgresChangesPayload<Conversation>) => void,
) {
  return supabase
    .channel('landing-conversations')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: CONVERSATIONS_TABLE },
      callback,
    )
    .subscribe();
}

export function subscribeMessages(
  conversationId: string,
  callback: (payload: RealtimePostgresChangesPayload<Message>) => void,
) {
  return supabase
    .channel(`landing-messages-${conversationId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: MESSAGES_TABLE,
        filter: `conversation_id=eq.${conversationId}`,
      },
      callback,
    )
    .subscribe();
}

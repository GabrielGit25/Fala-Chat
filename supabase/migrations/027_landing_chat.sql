-- 027: Landing page chat tables (Fale Conosco)
-- Chat bidirecional em tempo real entre cidadãos e atendentes

-- Utilitário para updated_at automático
CREATE OR REPLACE FUNCTION update_chat_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- RPC para incrementar contador de não-lidas
CREATE OR REPLACE FUNCTION increment_chat_unread(conv_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE landing_chat_conversations
  SET unread_count = unread_count + 1
  WHERE id = conv_id;
END;
$$;

-- RPC para zerar contador de não-lidas
CREATE OR REPLACE FUNCTION reset_chat_unread(conv_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE landing_chat_conversations
  SET unread_count = 0
  WHERE id = conv_id;
END;
$$;

-- Tabela de conversas
CREATE TABLE IF NOT EXISTS landing_chat_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  email TEXT,
  telefone TEXT,
  status TEXT NOT NULL DEFAULT 'aberto'
    CHECK (status IN ('aberto', 'em_andamento', 'resolvido', 'arquivado')),
  assunto TEXT,
  assigned_to TEXT,
  attendant_name TEXT,
  unread_count INTEGER NOT NULL DEFAULT 0,
  last_attendant_seen TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_landing_chat_conversations_updated_at
  BEFORE UPDATE ON landing_chat_conversations
  FOR EACH ROW EXECUTE FUNCTION update_chat_updated_at_column();

-- Tabela de mensagens
CREATE TABLE IF NOT EXISTS landing_chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES landing_chat_conversations(id) ON DELETE CASCADE,
  sender TEXT NOT NULL,
  sender_name TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_landing_chat_messages_conversation_id
  ON landing_chat_messages (conversation_id, created_at ASC);

CREATE INDEX IF NOT EXISTS idx_landing_chat_conversations_status
  ON landing_chat_conversations (status);

CREATE INDEX IF NOT EXISTS idx_landing_chat_conversations_assigned_to
  ON landing_chat_conversations (assigned_to);

CREATE INDEX IF NOT EXISTS idx_landing_chat_conversations_created_at
  ON landing_chat_conversations (created_at DESC);

-- Habilita RLS
ALTER TABLE landing_chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE landing_chat_messages ENABLE ROW LEVEL SECURITY;

-- Policies: conversations
CREATE POLICY "anon_select_conversations" ON landing_chat_conversations
  FOR SELECT TO anon USING (true);

CREATE POLICY "anon_insert_conversations" ON landing_chat_conversations
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "anon_update_conversations" ON landing_chat_conversations
  FOR UPDATE TO anon USING (true) WITH CHECK (true);

CREATE POLICY "anon_delete_conversations" ON landing_chat_conversations
  FOR DELETE TO anon USING (true);

-- Policies: messages
CREATE POLICY "anon_select_messages" ON landing_chat_messages
  FOR SELECT TO anon USING (true);

CREATE POLICY "anon_insert_messages" ON landing_chat_messages
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "anon_update_messages" ON landing_chat_messages
  FOR UPDATE TO anon USING (true) WITH CHECK (true);

CREATE POLICY "anon_delete_messages" ON landing_chat_messages
  FOR DELETE TO anon USING (true);

-- Habilita Realtime para as duas tabelas
ALTER PUBLICATION supabase_realtime ADD TABLE landing_chat_conversations;
ALTER PUBLICATION supabase_realtime ADD TABLE landing_chat_messages;

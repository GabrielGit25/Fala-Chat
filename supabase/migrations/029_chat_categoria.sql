-- 029: Categoria da conversa (cópia — a fonte da verdade é a migration 031 de
-- atuapolitica-frontend, aplicada no projeto Supabase compartilhado).
-- O cidadão escolhe via botões de resposta rápida (Denúncias / Orientações /
-- Reclamações / Outros) exibidos logo após a mensagem inicial, acelerando a
-- triagem pelos atendentes. NULL = ainda não selecionada. Idempotente.

ALTER TABLE fala_librelon_chat_conversas
  ADD COLUMN IF NOT EXISTS categoria TEXT;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'fl_chat_conversas_categoria_check'
  ) THEN
    ALTER TABLE fala_librelon_chat_conversas
      ADD CONSTRAINT fl_chat_conversas_categoria_check
      CHECK (categoria IN ('denuncias', 'orientacoes', 'reclamacoes', 'outros'));
  END IF;
END $$;

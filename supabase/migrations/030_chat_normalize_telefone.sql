-- 030: Normaliza telefone_contato para dígitos-apenas (cópia — a fonte da
-- verdade é a migration 032 de atuapolitica-frontend, aplicada no projeto
-- Supabase compartilhado). Valor canônico passa a ser dígitos-apenas; os
-- service layers normalizam na escrita e na consulta.
--
-- Aplicar ANTES do deploy do código que normaliza. Idempotente.

UPDATE fala_librelon_chat_conversas
SET telefone_contato = regexp_replace(telefone_contato, '\D', '', 'g')
WHERE telefone_contato ~ '\D';

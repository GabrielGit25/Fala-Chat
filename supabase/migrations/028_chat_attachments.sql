-- 028: Chat file attachments
-- Adiciona suporte a anexos (imagens, documentos) nas mensagens do chat

-- Add attachment columns to landing_chat_messages
ALTER TABLE landing_chat_messages
ADD COLUMN IF NOT EXISTS attachment_url TEXT,
ADD COLUMN IF NOT EXISTS attachment_name TEXT,
ADD COLUMN IF NOT EXISTS attachment_type TEXT,
ADD COLUMN IF NOT EXISTS attachment_size INTEGER;

-- Create storage bucket for chat attachments
INSERT INTO storage.buckets (id, name, public)
VALUES ('chat-attachments', 'chat-attachments', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public access to the bucket
CREATE POLICY "chat_attachments_public_access" ON storage.objects
  FOR ALL
  TO anon
  USING (bucket_id = 'chat-attachments')
  WITH CHECK (bucket_id = 'chat-attachments');

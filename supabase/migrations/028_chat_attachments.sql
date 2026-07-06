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

-- Allow anon to upload files to the bucket
CREATE POLICY "chat_attachments_insert" ON storage.objects
  FOR INSERT
  TO anon
  WITH CHECK (bucket_id = 'chat-attachments');

-- Allow anon to read files from the bucket
CREATE POLICY "chat_attachments_select" ON storage.objects
  FOR SELECT
  TO anon
  USING (bucket_id = 'chat-attachments');

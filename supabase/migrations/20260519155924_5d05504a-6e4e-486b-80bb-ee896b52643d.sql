
CREATE TABLE public.builder_sections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL DEFAULT 'Untitled section',
  block JSONB NOT NULL,
  preview_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.builder_sections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own sections"
ON public.builder_sections
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_builder_sections_user ON public.builder_sections(user_id, created_at DESC);

CREATE TRIGGER update_builder_sections_updated_at
BEFORE UPDATE ON public.builder_sections
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

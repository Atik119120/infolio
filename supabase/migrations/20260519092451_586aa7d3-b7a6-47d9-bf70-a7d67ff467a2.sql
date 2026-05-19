
CREATE TABLE public.builder_pages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL DEFAULT 'Untitled',
  slug TEXT NOT NULL,
  content JSONB NOT NULL DEFAULT '{"blocks":[]}'::jsonb,
  published_content JSONB,
  is_published BOOLEAN NOT NULL DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, slug)
);

ALTER TABLE public.builder_pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own pages"
ON public.builder_pages
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Published pages viewable by everyone"
ON public.builder_pages
FOR SELECT
USING (is_published = true);

CREATE TRIGGER update_builder_pages_updated_at
BEFORE UPDATE ON public.builder_pages
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_builder_pages_user ON public.builder_pages(user_id);
CREATE INDEX idx_builder_pages_slug ON public.builder_pages(slug) WHERE is_published = true;

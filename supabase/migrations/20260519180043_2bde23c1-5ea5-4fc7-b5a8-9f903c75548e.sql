
CREATE TABLE public.page_views (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id uuid NOT NULL,
  page_type text NOT NULL CHECK (page_type IN ('portfolio','builder')),
  slug text,
  path text,
  visitor_hash text,
  country text,
  device text,
  browser text,
  os text,
  referrer text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE INDEX idx_page_views_owner_created ON public.page_views(owner_id, created_at DESC);
CREATE INDEX idx_page_views_owner_type ON public.page_views(owner_id, page_type);
CREATE INDEX idx_page_views_visitor ON public.page_views(visitor_hash, owner_id, created_at DESC);

ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners view own analytics"
  ON public.page_views FOR SELECT
  USING (auth.uid() = owner_id);

CREATE POLICY "Public can insert page views"
  ON public.page_views FOR INSERT
  WITH CHECK (true);


CREATE TABLE public.admin_themes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  html TEXT NOT NULL DEFAULT '',
  css TEXT NOT NULL DEFAULT '',
  js TEXT NOT NULL DEFAULT '',
  preview_image_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.admin_themes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Active themes are viewable by everyone"
  ON public.admin_themes FOR SELECT
  USING (is_active = true OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert themes"
  ON public.admin_themes FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update themes"
  ON public.admin_themes FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete themes"
  ON public.admin_themes FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_admin_themes_updated_at
  BEFORE UPDATE ON public.admin_themes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_admin_themes_active ON public.admin_themes(is_active);

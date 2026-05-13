CREATE TABLE IF NOT EXISTS public.site_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Site settings readable by everyone"
  ON public.site_settings FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert site settings"
  ON public.site_settings FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update site settings"
  ON public.site_settings FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete site settings"
  ON public.site_settings FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_site_settings_updated_at
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.site_settings (key, value) VALUES
  ('branding', '{"main_logo_url":"","favicon_url":"","footer_logo_url":""}'::jsonb),
  ('seo', '{"default_title":"","default_description":"","default_og_image":""}'::jsonb),
  ('analytics', '{"google_analytics_id":"","facebook_pixel_id":"","custom_head":""}'::jsonb),
  ('code_injection', '{"header_html":"","footer_html":""}'::jsonb),
  ('otp', '{"length":6,"expiry_minutes":10,"rate_limit_per_hour":3}'::jsonb),
  ('smtp', '{"from_email":"noreply@infolio.online","from_name":"Alpha Portfolio","reply_to":""}'::jsonb)
ON CONFLICT (key) DO NOTHING;
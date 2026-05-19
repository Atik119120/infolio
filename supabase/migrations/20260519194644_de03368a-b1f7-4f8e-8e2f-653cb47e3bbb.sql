
ALTER TABLE public.portfolios
  ADD COLUMN IF NOT EXISTS primary_color text,
  ADD COLUMN IF NOT EXISTS accent_color text,
  ADD COLUMN IF NOT EXISTS header_html text;

ALTER TABLE public.admin_themes
  ADD COLUMN IF NOT EXISTS ecommerce_capable boolean NOT NULL DEFAULT false;

CREATE TABLE IF NOT EXISTS public.user_integrations_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  provider text NOT NULL,
  config jsonb NOT NULL DEFAULT '{}'::jsonb,
  enabled boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, provider)
);

ALTER TABLE public.user_integrations_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own integration configs"
ON public.user_integrations_config
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER trg_user_integrations_config_updated_at
BEFORE UPDATE ON public.user_integrations_config
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

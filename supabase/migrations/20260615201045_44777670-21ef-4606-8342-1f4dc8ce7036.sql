
-- 1) plans table
CREATE TABLE IF NOT EXISTS public.plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  name text NOT NULL,
  description text,
  price_bdt integer NOT NULL DEFAULT 0,
  max_projects integer NOT NULL DEFAULT 4,
  max_websites integer NOT NULL DEFAULT 1,
  storage_mb integer NOT NULL DEFAULT 100,
  allow_custom_domain boolean NOT NULL DEFAULT false,
  allow_seo boolean NOT NULL DEFAULT false,
  premium_theme_access text NOT NULL DEFAULT 'none',
  included_premium_themes integer NOT NULL DEFAULT 0,
  extra_theme_price_bdt integer NOT NULL DEFAULT 50,
  allow_branding_toggle boolean NOT NULL DEFAULT false,
  allow_dev_features boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.plans TO anon, authenticated;
GRANT ALL ON public.plans TO service_role;
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "plans readable by everyone" ON public.plans;
DROP POLICY IF EXISTS "admins manage plans" ON public.plans;
CREATE POLICY "plans readable by everyone" ON public.plans
  FOR SELECT USING (true);
CREATE POLICY "admins manage plans" ON public.plans
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP TRIGGER IF EXISTS plans_updated_at ON public.plans;
CREATE TRIGGER plans_updated_at BEFORE UPDATE ON public.plans
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 2) feature overrides
CREATE TABLE IF NOT EXISTS public.feature_overrides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  feature_key text NOT NULL,
  enabled boolean NOT NULL DEFAULT true,
  note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, feature_key)
);

GRANT SELECT ON public.feature_overrides TO authenticated;
GRANT ALL ON public.feature_overrides TO service_role;
ALTER TABLE public.feature_overrides ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users read own overrides" ON public.feature_overrides;
DROP POLICY IF EXISTS "admins manage overrides" ON public.feature_overrides;
CREATE POLICY "users read own overrides" ON public.feature_overrides
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins manage overrides" ON public.feature_overrides
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP TRIGGER IF EXISTS feature_overrides_updated_at ON public.feature_overrides;
CREATE TRIGGER feature_overrides_updated_at BEFORE UPDATE ON public.feature_overrides
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 3) profile + portfolio columns
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS plan_key text NOT NULL DEFAULT 'free';
ALTER TABLE public.portfolios ADD COLUMN IF NOT EXISTS show_branding boolean NOT NULL DEFAULT true;

-- 4) seed plans
INSERT INTO public.plans (key, name, description, price_bdt, max_projects, max_websites, storage_mb, allow_custom_domain, allow_seo, premium_theme_access, included_premium_themes, extra_theme_price_bdt, allow_branding_toggle, allow_dev_features, sort_order)
VALUES
  ('free',    'Free',    'Perfect for beginners',          0,   4,  1,  100,  false, false, 'none',    0,  50, false, false, 1),
  ('starter', 'Starter', 'For growing creators',           299, 15, 1,  500,  false, true,  'limited', 1,  50, true,  false, 2),
  ('creator', 'Creator', 'For professionals and brands',   599, 50, 2,  2000, true,  true,  'all',     99, 50, true,  false, 3)
ON CONFLICT (key) DO NOTHING;

-- 5) active payment provider setting
INSERT INTO public.site_settings (key, value)
VALUES ('active_payment_provider', to_jsonb('manual'::text))
ON CONFLICT (key) DO NOTHING;

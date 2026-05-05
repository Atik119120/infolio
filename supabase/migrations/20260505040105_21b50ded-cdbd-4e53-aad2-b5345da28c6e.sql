
-- 1. plan fields on profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS plan TEXT NOT NULL DEFAULT 'free',
  ADD COLUMN IF NOT EXISTS plan_purchased_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS plan_expires_at TIMESTAMPTZ;

-- 2. SEO fields on portfolios
ALTER TABLE public.portfolios
  ADD COLUMN IF NOT EXISTS meta_title TEXT,
  ADD COLUMN IF NOT EXISTS meta_description TEXT,
  ADD COLUMN IF NOT EXISTS meta_keywords TEXT,
  ADD COLUMN IF NOT EXISTS google_verification TEXT,
  ADD COLUMN IF NOT EXISTS og_image_url TEXT;

-- 3. plan_purchases table
CREATE TABLE IF NOT EXISTS public.plan_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  plan TEXT NOT NULL DEFAULT 'pro',
  amount INTEGER NOT NULL DEFAULT 200,
  payment_method TEXT NOT NULL,
  transaction_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  rejected_reason TEXT,
  approved_by UUID,
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.plan_purchases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own plan purchases"
  ON public.plan_purchases FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can submit plan purchases"
  ON public.plan_purchases FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all plan purchases"
  ON public.plan_purchases FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update plan purchases"
  ON public.plan_purchases FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_plan_purchases_updated_at
  BEFORE UPDATE ON public.plan_purchases
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

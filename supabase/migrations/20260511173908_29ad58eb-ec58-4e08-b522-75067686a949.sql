ALTER TABLE public.portfolios
  ADD COLUMN IF NOT EXISTS custom_html text,
  ADD COLUMN IF NOT EXISTS custom_css text,
  ADD COLUMN IF NOT EXISTS custom_js text;
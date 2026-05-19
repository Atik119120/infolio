ALTER TABLE public.portfolios
  ADD COLUMN IF NOT EXISTS ga_measurement_id text,
  ADD COLUMN IF NOT EXISTS gtm_id text;
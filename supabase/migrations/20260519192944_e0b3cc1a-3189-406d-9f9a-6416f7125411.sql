ALTER TABLE public.portfolios
  ADD COLUMN IF NOT EXISTS active_engine TEXT NOT NULL DEFAULT 'theme',
  ADD COLUMN IF NOT EXISTS website_type TEXT NOT NULL DEFAULT 'portfolio',
  ADD COLUMN IF NOT EXISTS engine_backups JSONB NOT NULL DEFAULT '[]'::jsonb;
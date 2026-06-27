
ALTER TABLE public.portfolios ADD COLUMN IF NOT EXISTS hero_images jsonb DEFAULT '[]'::jsonb;
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS tagline text;
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS duration text;
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS featured boolean DEFAULT false;
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS features jsonb DEFAULT '[]'::jsonb;

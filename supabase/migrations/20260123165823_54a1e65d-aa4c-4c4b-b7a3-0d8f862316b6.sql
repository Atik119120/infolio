-- Add logo_url column to portfolios table for custom footer logo
ALTER TABLE public.portfolios 
ADD COLUMN IF NOT EXISTS logo_url TEXT;

-- Add a comment explaining the column
COMMENT ON COLUMN public.portfolios.logo_url IS 'Custom logo URL for portfolio footer';
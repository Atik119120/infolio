
-- Add new columns to projects table
ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS project_type text NOT NULL DEFAULT 'freelancer',
  ADD COLUMN IF NOT EXISTS custom_category text,
  ADD COLUMN IF NOT EXISTS cover_image text,
  ADD COLUMN IF NOT EXISTS gallery jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS sections jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS tools text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS client_name text,
  ADD COLUMN IF NOT EXISTS project_date date,
  ADD COLUMN IF NOT EXISTS external_links jsonb NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS is_visible boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS slug text;

-- Validation check for project_type
ALTER TABLE public.projects DROP CONSTRAINT IF EXISTS projects_project_type_check;
ALTER TABLE public.projects ADD CONSTRAINT projects_project_type_check
  CHECK (project_type IN ('photographer','graphic_designer','uiux','web_designer','digital_marketer','content_creator','freelancer','custom'));

-- Backfill slugs for existing rows
UPDATE public.projects
SET slug = lower(regexp_replace(coalesce(title,'project-') || '-' || substr(id::text,1,6), '[^a-z0-9]+', '-', 'g'))
WHERE slug IS NULL;

-- Unique slug per user
CREATE UNIQUE INDEX IF NOT EXISTS projects_user_slug_unique ON public.projects(user_id, slug);
CREATE INDEX IF NOT EXISTS projects_user_visible_idx ON public.projects(user_id, is_visible, display_order);

-- Update public SELECT policy to respect visibility
DROP POLICY IF EXISTS "Projects are viewable for published portfolios" ON public.projects;
CREATE POLICY "Projects are viewable for published portfolios"
ON public.projects FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.portfolios
    WHERE portfolios.user_id = projects.user_id
      AND (
        (portfolios.is_published = true AND projects.is_visible = true)
        OR portfolios.user_id = auth.uid()
      )
  )
);

-- Ensure grants
GRANT SELECT ON public.projects TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.projects TO authenticated;
GRANT ALL ON public.projects TO service_role;

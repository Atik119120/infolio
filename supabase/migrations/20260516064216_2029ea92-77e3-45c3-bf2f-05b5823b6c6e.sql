
ALTER TABLE public.deployments
  ADD COLUMN IF NOT EXISTS subdomain TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS source TEXT NOT NULL DEFAULT 'template',
  ADD COLUMN IF NOT EXISTS logs JSONB NOT NULL DEFAULT '[]'::jsonb;

CREATE INDEX IF NOT EXISTS deployments_subdomain_idx ON public.deployments(subdomain);

CREATE POLICY "Users can insert own deployments"
ON public.deployments FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own deployments"
ON public.deployments FOR UPDATE
USING (auth.uid() = user_id);

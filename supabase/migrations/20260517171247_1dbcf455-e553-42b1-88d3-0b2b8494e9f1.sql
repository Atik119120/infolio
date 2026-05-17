ALTER TABLE public.deployments
  ADD COLUMN IF NOT EXISTS project_name TEXT;

ALTER TABLE public.deployments
  ALTER COLUMN logs SET DEFAULT '[]'::jsonb;

CREATE INDEX IF NOT EXISTS deployments_user_created_idx ON public.deployments(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS deployments_status_idx ON public.deployments(status);

DROP POLICY IF EXISTS "Users can insert own deployments" ON public.deployments;
DROP POLICY IF EXISTS "Users can update own deployments" ON public.deployments;

CREATE POLICY "Users can create own deployments"
ON public.deployments
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own deployments"
ON public.deployments
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
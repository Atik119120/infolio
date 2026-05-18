ALTER TABLE public.deployments
  ADD COLUMN IF NOT EXISTS deployment_url text,
  ADD COLUMN IF NOT EXISTS assigned_subdomain text,
  ADD COLUMN IF NOT EXISTS active_theme_template text,
  ADD COLUMN IF NOT EXISTS is_active boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS ready_at timestamp with time zone;

UPDATE public.deployments
SET
  deployment_url = COALESCE(deployment_url, deploy_url),
  assigned_subdomain = COALESCE(assigned_subdomain, subdomain),
  active_theme_template = COALESCE(active_theme_template, source)
WHERE deployment_url IS NULL
   OR assigned_subdomain IS NULL
   OR active_theme_template IS NULL;

CREATE INDEX IF NOT EXISTS idx_deployments_assigned_subdomain_active
ON public.deployments (assigned_subdomain, is_active, status);

CREATE OR REPLACE FUNCTION public.resolve_active_deployment(_hostname text)
RETURNS TABLE (
  deployment_url text,
  assigned_subdomain text,
  project_id text,
  deployment_status text,
  active_theme_template text,
  ready_at timestamp with time zone
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    d.deployment_url,
    d.assigned_subdomain,
    d.vercel_project_id AS project_id,
    d.status AS deployment_status,
    d.active_theme_template,
    d.ready_at
  FROM public.deployments d
  WHERE d.is_active = true
    AND d.status = 'READY'
    AND (
      lower(d.assigned_subdomain) = lower(regexp_replace(_hostname, '\.infolio\.online$', ''))
      OR lower(d.subdomain) = lower(regexp_replace(_hostname, '\.infolio\.online$', ''))
    )
  ORDER BY d.ready_at DESC NULLS LAST, d.updated_at DESC
  LIMIT 1;
$$;
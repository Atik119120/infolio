DROP FUNCTION IF EXISTS public.resolve_active_deployment(text);

CREATE OR REPLACE FUNCTION public.resolve_active_deployment(_hostname text)
RETURNS TABLE (
  deployment_url text,
  assigned_subdomain text,
  project_id text,
  deployment_status text,
  active_theme_template text,
  ready_at timestamp with time zone,
  username text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  WITH requested AS (
    SELECT lower(
      CASE
        WHEN lower(_hostname) LIKE '%.infolio.online'
          THEN regexp_replace(lower(_hostname), '\.infolio\.online$', '')
        ELSE lower(_hostname)
      END
    ) AS subdomain
  )
  SELECT
    COALESCE(d.deployment_url, d.deploy_url) AS deployment_url,
    COALESCE(d.assigned_subdomain, d.subdomain) AS assigned_subdomain,
    d.vercel_project_id AS project_id,
    d.status AS deployment_status,
    COALESCE(d.active_theme_template, d.source) AS active_theme_template,
    d.ready_at,
    p.username
  FROM requested r
  JOIN public.deployments d
    ON lower(COALESCE(d.assigned_subdomain, d.subdomain)) = r.subdomain
  JOIN public.profiles p
    ON p.user_id = d.user_id
  JOIN public.portfolios pf
    ON pf.user_id = d.user_id
   AND pf.is_published = true
  WHERE d.is_active = true
    AND d.status <> 'FAILED'
    AND COALESCE(d.deployment_url, d.deploy_url) IS NOT NULL
  ORDER BY
    CASE WHEN d.status = 'READY' THEN 0 ELSE 1 END,
    d.ready_at DESC NULLS LAST,
    d.updated_at DESC
  LIMIT 1;
$$;
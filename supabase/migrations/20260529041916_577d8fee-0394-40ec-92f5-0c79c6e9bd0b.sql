
-- DNS records table for managed domains
CREATE TABLE public.dns_records (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  domain_id uuid NOT NULL,
  type text NOT NULL,
  name text NOT NULL,
  content text NOT NULL,
  ttl integer NOT NULL DEFAULT 3600,
  priority integer,
  proxied boolean NOT NULL DEFAULT false,
  is_locked boolean NOT NULL DEFAULT false,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.dns_records TO authenticated;
GRANT ALL ON public.dns_records TO service_role;

ALTER TABLE public.dns_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Manage own dns records"
ON public.dns_records FOR ALL TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.registrar_domains d
  WHERE d.id = dns_records.domain_id
    AND (d.user_id = auth.uid()
         OR public.has_role(auth.uid(), 'admin'::app_role)
         OR public.has_role(auth.uid(), 'super_admin'::app_role)
         OR public.has_role(auth.uid(), 'staff'::app_role))
))
WITH CHECK (EXISTS (
  SELECT 1 FROM public.registrar_domains d
  WHERE d.id = dns_records.domain_id
    AND (d.user_id = auth.uid()
         OR public.has_role(auth.uid(), 'admin'::app_role)
         OR public.has_role(auth.uid(), 'super_admin'::app_role))
));

CREATE INDEX idx_dns_records_domain ON public.dns_records(domain_id);

CREATE TRIGGER trg_dns_records_updated
BEFORE UPDATE ON public.dns_records
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

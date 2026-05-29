
-- =========================================================
-- 1. REGISTRAR PROVIDERS
-- =========================================================
CREATE TABLE public.registrar_providers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  provider_type text NOT NULL, -- 'hostneed','namecheap','resellerclub','openprovider','dynadot','spaceship','cloudflare','whmcs','custom'
  api_endpoint text,
  credentials jsonb NOT NULL DEFAULT '{}'::jsonb, -- {username,api_key,api_secret,...}
  is_default boolean NOT NULL DEFAULT false,
  is_enabled boolean NOT NULL DEFAULT true,
  is_mock boolean NOT NULL DEFAULT true,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.registrar_providers TO authenticated;
GRANT ALL ON public.registrar_providers TO service_role;
ALTER TABLE public.registrar_providers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins read providers" ON public.registrar_providers
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'super_admin') OR public.has_role(auth.uid(),'staff'));
CREATE POLICY "Super admin manage providers" ON public.registrar_providers
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'super_admin') OR public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'super_admin') OR public.has_role(auth.uid(),'admin'));

-- =========================================================
-- 2. TLD PRICING
-- =========================================================
CREATE TABLE public.tld_pricing (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id uuid REFERENCES public.registrar_providers(id) ON DELETE CASCADE,
  tld text NOT NULL, -- '.com', '.net'
  register_price numeric(10,2) NOT NULL DEFAULT 0,
  renew_price numeric(10,2) NOT NULL DEFAULT 0,
  transfer_price numeric(10,2) NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'BDT',
  is_active boolean NOT NULL DEFAULT true,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (provider_id, tld)
);
CREATE INDEX idx_tld_pricing_tld ON public.tld_pricing(tld);
GRANT SELECT ON public.tld_pricing TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.tld_pricing TO authenticated;
GRANT ALL ON public.tld_pricing TO service_role;
ALTER TABLE public.tld_pricing ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read active pricing" ON public.tld_pricing
  FOR SELECT USING (is_active = true);
CREATE POLICY "Admins manage pricing" ON public.tld_pricing
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'super_admin'))
  WITH CHECK (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'super_admin'));

-- =========================================================
-- 3. REGISTRAR DOMAINS
-- =========================================================
CREATE TABLE public.registrar_domains (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  provider_id uuid REFERENCES public.registrar_providers(id) ON DELETE SET NULL,
  domain_name text NOT NULL,
  status text NOT NULL DEFAULT 'active', -- active, expired, pending, suspended, transferred_out
  registered_at timestamptz,
  expires_at timestamptz,
  auto_renew boolean NOT NULL DEFAULT false,
  registrar_lock boolean NOT NULL DEFAULT true,
  id_protection boolean NOT NULL DEFAULT false,
  whois_privacy boolean NOT NULL DEFAULT false,
  epp_code text,
  nameservers jsonb NOT NULL DEFAULT '[]'::jsonb,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (domain_name)
);
CREATE INDEX idx_registrar_domains_user ON public.registrar_domains(user_id);
CREATE INDEX idx_registrar_domains_expires ON public.registrar_domains(expires_at);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.registrar_domains TO authenticated;
GRANT ALL ON public.registrar_domains TO service_role;
ALTER TABLE public.registrar_domains ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own domains" ON public.registrar_domains
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id
    OR public.has_role(auth.uid(),'admin')
    OR public.has_role(auth.uid(),'super_admin')
    OR public.has_role(auth.uid(),'staff'));
CREATE POLICY "Admins manage all domains" ON public.registrar_domains
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'super_admin'))
  WITH CHECK (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'super_admin'));

-- =========================================================
-- 4. DOMAIN CONTACTS
-- =========================================================
CREATE TABLE public.domain_contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  domain_id uuid NOT NULL REFERENCES public.registrar_domains(id) ON DELETE CASCADE,
  contact_type text NOT NULL, -- registrant, admin, tech, billing
  first_name text,
  last_name text,
  organization text,
  email text,
  phone text,
  address_line1 text,
  address_line2 text,
  city text,
  state text,
  postal_code text,
  country text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (domain_id, contact_type)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.domain_contacts TO authenticated;
GRANT ALL ON public.domain_contacts TO service_role;
ALTER TABLE public.domain_contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "View own domain contacts" ON public.domain_contacts
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.registrar_domains d WHERE d.id = domain_id AND
    (d.user_id = auth.uid() OR public.has_role(auth.uid(),'admin')
     OR public.has_role(auth.uid(),'super_admin') OR public.has_role(auth.uid(),'staff'))));
CREATE POLICY "Manage own domain contacts" ON public.domain_contacts
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.registrar_domains d WHERE d.id = domain_id AND
    (d.user_id = auth.uid() OR public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'super_admin'))))
  WITH CHECK (EXISTS (SELECT 1 FROM public.registrar_domains d WHERE d.id = domain_id AND
    (d.user_id = auth.uid() OR public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'super_admin'))));

-- =========================================================
-- 5. DOMAIN ORDERS
-- =========================================================
CREATE TABLE public.domain_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  domain_id uuid REFERENCES public.registrar_domains(id) ON DELETE SET NULL,
  provider_id uuid REFERENCES public.registrar_providers(id) ON DELETE SET NULL,
  order_type text NOT NULL, -- register, transfer, renew, release, delete
  domain_name text NOT NULL,
  years integer NOT NULL DEFAULT 1,
  amount numeric(10,2) NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'BDT',
  status text NOT NULL DEFAULT 'pending', -- pending, processing, completed, failed, cancelled
  payment_method text,
  transaction_id text,
  auth_code text,
  notes text,
  processed_by uuid,
  processed_at timestamptz,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_domain_orders_user ON public.domain_orders(user_id);
CREATE INDEX idx_domain_orders_status ON public.domain_orders(status);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.domain_orders TO authenticated;
GRANT ALL ON public.domain_orders TO service_role;
ALTER TABLE public.domain_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own orders" ON public.domain_orders
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id
    OR public.has_role(auth.uid(),'admin')
    OR public.has_role(auth.uid(),'super_admin')
    OR public.has_role(auth.uid(),'staff'));
CREATE POLICY "Users create own orders" ON public.domain_orders
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins manage orders" ON public.domain_orders
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'super_admin') OR public.has_role(auth.uid(),'staff'))
  WITH CHECK (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'super_admin') OR public.has_role(auth.uid(),'staff'));

-- =========================================================
-- 6. ACTIVITY LOGS (append-only)
-- =========================================================
CREATE TABLE public.registrar_activity_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  domain_id uuid,
  action text NOT NULL,
  entity_type text,
  entity_id uuid,
  details jsonb NOT NULL DEFAULT '{}'::jsonb,
  ip_address text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_activity_logs_user ON public.registrar_activity_logs(user_id);
CREATE INDEX idx_activity_logs_created ON public.registrar_activity_logs(created_at DESC);
GRANT SELECT, INSERT ON public.registrar_activity_logs TO authenticated;
GRANT ALL ON public.registrar_activity_logs TO service_role;
ALTER TABLE public.registrar_activity_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "View own activity" ON public.registrar_activity_logs
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id
    OR public.has_role(auth.uid(),'admin')
    OR public.has_role(auth.uid(),'super_admin')
    OR public.has_role(auth.uid(),'staff'));
CREATE POLICY "Insert activity" ON public.registrar_activity_logs
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id OR public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'super_admin') OR public.has_role(auth.uid(),'staff'));

-- =========================================================
-- 7. NOTIFICATIONS
-- =========================================================
CREATE TABLE public.registrar_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  type text NOT NULL, -- expiry_alert, renewal, transfer, order_update, system
  title text NOT NULL,
  message text NOT NULL,
  link text,
  is_read boolean NOT NULL DEFAULT false,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_notifications_user ON public.registrar_notifications(user_id, is_read);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.registrar_notifications TO authenticated;
GRANT ALL ON public.registrar_notifications TO service_role;
ALTER TABLE public.registrar_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own notifications" ON public.registrar_notifications
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'super_admin'));
CREATE POLICY "Users update own notifications" ON public.registrar_notifications
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins insert notifications" ON public.registrar_notifications
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'super_admin') OR public.has_role(auth.uid(),'staff') OR auth.uid() = user_id);

-- =========================================================
-- 8. REGISTRAR SETTINGS
-- =========================================================
CREATE TABLE public.registrar_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  description text,
  is_public boolean NOT NULL DEFAULT false,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.registrar_settings TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.registrar_settings TO authenticated;
GRANT ALL ON public.registrar_settings TO service_role;
ALTER TABLE public.registrar_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read public settings" ON public.registrar_settings
  FOR SELECT USING (is_public = true OR public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'super_admin') OR public.has_role(auth.uid(),'staff'));
CREATE POLICY "Admins manage settings" ON public.registrar_settings
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'super_admin'))
  WITH CHECK (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'super_admin'));

-- =========================================================
-- Updated_at triggers
-- =========================================================
CREATE TRIGGER trg_registrar_providers_updated BEFORE UPDATE ON public.registrar_providers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_tld_pricing_updated BEFORE UPDATE ON public.tld_pricing
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_registrar_domains_updated BEFORE UPDATE ON public.registrar_domains
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_domain_contacts_updated BEFORE UPDATE ON public.domain_contacts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_domain_orders_updated BEFORE UPDATE ON public.domain_orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

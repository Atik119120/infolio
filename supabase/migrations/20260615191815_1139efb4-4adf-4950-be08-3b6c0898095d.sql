CREATE TABLE public.contact_items (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type text NOT NULL DEFAULT 'custom',
  label text,
  value text NOT NULL DEFAULT '',
  url text,
  icon text,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.contact_items TO authenticated;
GRANT SELECT ON public.contact_items TO anon;
GRANT ALL ON public.contact_items TO service_role;

ALTER TABLE public.contact_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Contact items viewable for published portfolios"
ON public.contact_items FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.portfolios
  WHERE portfolios.user_id = contact_items.user_id
    AND (portfolios.is_published = true OR portfolios.user_id = auth.uid())
));

CREATE POLICY "Users manage own contact items"
ON public.contact_items FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER update_contact_items_updated_at
BEFORE UPDATE ON public.contact_items
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX contact_items_user_id_order_idx ON public.contact_items(user_id, display_order);

-- Also add label/display_order improvements to social_links if missing (already has display_order)
ALTER TABLE public.social_links ADD COLUMN IF NOT EXISTS label text;
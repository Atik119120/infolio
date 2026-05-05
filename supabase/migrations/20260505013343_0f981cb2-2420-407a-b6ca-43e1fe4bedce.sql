CREATE TABLE public.services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  price TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Services are viewable for published portfolios"
ON public.services FOR SELECT
USING (EXISTS (
  SELECT 1 FROM portfolios
  WHERE portfolios.user_id = services.user_id
    AND (portfolios.is_published = true OR portfolios.user_id = auth.uid())
));

CREATE POLICY "Users can manage own services"
ON public.services FOR ALL
USING (auth.uid() = user_id);

CREATE TRIGGER update_services_updated_at
BEFORE UPDATE ON public.services
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
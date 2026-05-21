DROP TABLE IF EXISTS public.order_items CASCADE;
DROP TABLE IF EXISTS public.orders CASCADE;
DROP TABLE IF EXISTS public.products CASCADE;
DROP TABLE IF EXISTS public.stores CASCADE;
DROP FUNCTION IF EXISTS public.generate_order_number() CASCADE;
ALTER TABLE public.admin_themes DROP COLUMN IF EXISTS ecommerce_capable;
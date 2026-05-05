
-- Drop support_messages table
DROP TABLE IF EXISTS public.support_messages CASCADE;

-- Remove publish-approval columns from portfolios
ALTER TABLE public.portfolios DROP COLUMN IF EXISTS pending_publish;
ALTER TABLE public.portfolios DROP COLUMN IF EXISTS publish_requested_at;

-- Auto-approve all new users + auto-publish portfolio
ALTER TABLE public.portfolios ALTER COLUMN is_published SET DEFAULT true;
ALTER TABLE public.profiles ALTER COLUMN is_approved SET DEFAULT true;

UPDATE public.profiles SET is_approved = true WHERE is_approved IS NOT TRUE;
UPDATE public.portfolios SET is_published = true WHERE is_published IS NOT TRUE;

-- Update handle_new_user trigger to auto-approve + auto-publish
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
    INSERT INTO public.profiles (user_id, username, email, display_name, phone_number, is_approved, approved_at)
    VALUES (
        NEW.id,
        LOWER(REPLACE(COALESCE(NEW.raw_user_meta_data->>'username', SPLIT_PART(NEW.email, '@', 1)), ' ', '')),
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'display_name', SPLIT_PART(NEW.email, '@', 1)),
        NEW.raw_user_meta_data->>'phone_number',
        true,
        now()
    );

    INSERT INTO public.portfolios (user_id, is_published)
    VALUES (NEW.id, true);

    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'user');

    RETURN NEW;
END;
$function$;

-- Update the handle_new_user function to include phone_number
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
    -- Create profile with phone number
    INSERT INTO public.profiles (user_id, username, email, display_name, phone_number, is_approved)
    VALUES (
        NEW.id,
        LOWER(REPLACE(COALESCE(NEW.raw_user_meta_data->>'username', SPLIT_PART(NEW.email, '@', 1)), ' ', '')),
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'display_name', SPLIT_PART(NEW.email, '@', 1)),
        NEW.raw_user_meta_data->>'phone_number',
        false
    );
    
    -- Create empty portfolio
    INSERT INTO public.portfolios (user_id)
    VALUES (NEW.id);
    
    -- Assign default user role
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'user');
    
    RETURN NEW;
END;
$function$;
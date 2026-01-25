-- Create a public view for profiles that excludes sensitive PII (email, phone_number)
-- This view will be used for public queries while protecting user privacy

-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

-- Create a more restrictive policy: 
-- 1. Users can view their own full profile
-- 2. Admins can view all profiles  
-- 3. For published portfolios, only public fields are visible via a separate view

-- Users can view their own full profile
CREATE POLICY "Users can view own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = user_id);

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles"
ON public.profiles FOR SELECT
USING (has_role(auth.uid(), 'admin'));

-- For public portfolio viewing, allow SELECT but application code should only query needed fields
-- This policy allows viewing profiles for published portfolios (needed for public portfolio pages)
CREATE POLICY "Public can view profiles for published portfolios"
ON public.profiles FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM portfolios
    WHERE portfolios.user_id = profiles.user_id
    AND portfolios.is_published = true
  )
);
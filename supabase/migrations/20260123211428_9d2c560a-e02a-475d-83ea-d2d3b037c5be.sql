-- Drop existing update policy
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

-- Create new policy that allows users to update own profile OR admins to update any profile
CREATE POLICY "Users can update own profile or admins can update any" 
ON public.profiles 
FOR UPDATE 
USING (
  auth.uid() = user_id OR 
  public.has_role(auth.uid(), 'admin'::app_role)
);

-- Also update portfolios policy for admin access
DROP POLICY IF EXISTS "Users can update own portfolio" ON public.portfolios;

CREATE POLICY "Users can update own portfolio or admins can update any" 
ON public.portfolios 
FOR UPDATE 
USING (
  auth.uid() = user_id OR 
  public.has_role(auth.uid(), 'admin'::app_role)
);
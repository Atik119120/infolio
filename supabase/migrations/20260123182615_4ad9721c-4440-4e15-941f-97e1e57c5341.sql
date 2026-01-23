-- Add phone_number to profiles table
ALTER TABLE public.profiles ADD COLUMN phone_number text;

-- Add is_approved field to profiles for admin approval system
ALTER TABLE public.profiles ADD COLUMN is_approved boolean DEFAULT false;

-- Add approved_at timestamp
ALTER TABLE public.profiles ADD COLUMN approved_at timestamp with time zone;

-- Add approved_by (admin user_id)
ALTER TABLE public.profiles ADD COLUMN approved_by uuid;

-- Create index for faster queries on approval status
CREATE INDEX idx_profiles_is_approved ON public.profiles(is_approved);

-- Update portfolios table - is_published should require admin approval
-- Add pending_publish field for publish requests
ALTER TABLE public.portfolios ADD COLUMN pending_publish boolean DEFAULT false;

-- Add publish_requested_at timestamp
ALTER TABLE public.portfolios ADD COLUMN publish_requested_at timestamp with time zone;
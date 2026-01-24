-- Create theme_purchases table for tracking premium theme purchases
CREATE TABLE public.theme_purchases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    theme_id TEXT NOT NULL,
    transaction_id TEXT NOT NULL,
    payment_method TEXT NOT NULL, -- 'bkash', 'nagad', 'rocket'
    amount INTEGER NOT NULL DEFAULT 200,
    status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
    approved_by UUID,
    approved_at TIMESTAMP WITH TIME ZONE,
    rejected_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.theme_purchases ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can view their own purchases
CREATE POLICY "Users can view own theme purchases"
ON public.theme_purchases
FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own purchases
CREATE POLICY "Users can submit theme purchase requests"
ON public.theme_purchases
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Admins can view all purchases
CREATE POLICY "Admins can view all theme purchases"
ON public.theme_purchases
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can update any purchase (for approval/rejection)
CREATE POLICY "Admins can update theme purchases"
ON public.theme_purchases
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Trigger for updated_at
CREATE TRIGGER update_theme_purchases_updated_at
BEFORE UPDATE ON public.theme_purchases
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Index for faster lookups
CREATE INDEX idx_theme_purchases_user_id ON public.theme_purchases(user_id);
CREATE INDEX idx_theme_purchases_status ON public.theme_purchases(status);
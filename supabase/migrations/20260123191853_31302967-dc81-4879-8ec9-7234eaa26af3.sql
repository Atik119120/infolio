-- Create cleanup_logs table to track storage cleanup history
CREATE TABLE public.cleanup_logs (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    orphan_files_found INTEGER NOT NULL DEFAULT 0,
    files_deleted INTEGER NOT NULL DEFAULT 0,
    space_freed_bytes BIGINT NOT NULL DEFAULT 0,
    triggered_by TEXT NOT NULL DEFAULT 'manual', -- 'manual', 'scheduled', 'system'
    status TEXT NOT NULL DEFAULT 'success', -- 'success', 'error', 'partial'
    error_message TEXT,
    details JSONB
);

-- Enable RLS
ALTER TABLE public.cleanup_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can view cleanup logs
CREATE POLICY "Admins can view cleanup logs"
ON public.cleanup_logs
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Only service role can insert (from edge functions)
CREATE POLICY "Service role can insert cleanup logs"
ON public.cleanup_logs
FOR INSERT
WITH CHECK (true);

-- Create index for faster queries
CREATE INDEX idx_cleanup_logs_created_at ON public.cleanup_logs(created_at DESC);
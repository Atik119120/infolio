ALTER TABLE public.domains REPLICA IDENTITY FULL;
DO $$
BEGIN
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.domains;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
END $$;
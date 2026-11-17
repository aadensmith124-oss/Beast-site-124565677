DO $$
BEGIN
  IF to_regclass('public.cards') IS NOT NULL THEN
    ALTER TABLE public.cards
      ADD COLUMN IF NOT EXISTS is_refundable boolean;
  END IF;
END $$;

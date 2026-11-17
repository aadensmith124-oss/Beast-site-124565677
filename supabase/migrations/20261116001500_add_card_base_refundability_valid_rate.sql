ALTER TABLE public.card_bases
  ADD COLUMN IF NOT EXISTS is_refundable boolean,
  ADD COLUMN IF NOT EXISTS valid_rate real;

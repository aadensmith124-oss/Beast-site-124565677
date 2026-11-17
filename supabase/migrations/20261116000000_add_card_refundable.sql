ALTER TABLE public.cards
ADD COLUMN IF NOT EXISTS is_refundable boolean;

-- Remove legacy tables and any order-delivery payloads that held raw card or ACH data.
-- This intentionally preserves the surrounding order, user, wallet, and product records.

DO $$
BEGIN
  IF to_regclass('public.orders') IS NOT NULL THEN
    UPDATE public.orders
    SET delivery_content = ''
    WHERE order_id LIKE 'CARD-%' OR order_id LIKE 'ACH-%';

    IF to_regclass('public.order_items') IS NOT NULL THEN
      UPDATE public.orders AS o
      SET delivery_content = ''
      WHERE EXISTS (
        SELECT 1
        FROM public.order_items AS oi
        WHERE oi.order_id = o.id
          AND oi.item_type IN ('card', 'ach')
      );
    END IF;
  END IF;

  IF to_regclass('public.order_items') IS NOT NULL THEN
    UPDATE public.order_items
    SET item_type = 'product'
    WHERE item_type IN ('card', 'ach');

    ALTER TABLE public.order_items
      DROP COLUMN IF EXISTS card_id;
  END IF;
END $$;

DROP TABLE IF EXISTS public.cards CASCADE;
DROP TABLE IF EXISTS public.card_bases CASCADE;
DROP TABLE IF EXISTS public.achs CASCADE;

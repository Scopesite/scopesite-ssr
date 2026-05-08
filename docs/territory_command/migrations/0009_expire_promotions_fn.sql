-- Territory Command migration 0009 — expire promotions and write audit rows atomically.
-- Run after 0007 (audit) and 0006 (promotions).

CREATE OR REPLACE FUNCTION territory.expire_promotions()
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE
  n INTEGER := 0;
  rec RECORD;
BEGIN
  FOR rec IN
    UPDATE territory.postcode_promotions p
    SET expired = TRUE
    WHERE p.expired = FALSE
      AND p.cancelled = FALSE
      AND p.expires_at <= NOW()
    RETURNING p.id, p.postcode
  LOOP
    n := n + 1;
    INSERT INTO territory.admin_audit_log (
      action_type,
      entity_id,
      payload,
      performed_by
    )
    VALUES (
      'postcode_promotion_expire',
      rec.id::text,
      jsonb_build_object('postcode', rec.postcode, 'promotion_id', rec.id),
      'system'
    );
  END LOOP;
  RETURN n;
END;
$$;

COMMENT ON FUNCTION territory.expire_promotions IS 'Marks overdue promotions expired and appends audit rows; invoke from Vercel cron.';

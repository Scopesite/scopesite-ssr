-- ===========================================================================
-- TERRITORY COMMAND - Neon Postgres Schema (Phase A)
-- ===========================================================================
-- Runs on Neon Postgres (the database scopesite.co.uk already uses via Vercel).
-- Creates a new `territory` schema to keep Territory Command tables isolated.
--
-- Database: existing Neon project attached to scopesite.co.uk (DATABASE_URL)
-- Schema: territory
-- Tables: 9 (territories, sectors, seats, applications, waitlist,
--            area_intelligence, firms_registry, operation_name_pool, operations)
--
-- Run via Neon SQL Editor or `psql $DATABASE_URL -f 03_NEON_SCHEMA.sql`
-- ===========================================================================
--

-- ---------------------------------------------------------------------------
-- 1. SCHEMA AND EXTENSIONS
-- ---------------------------------------------------------------------------
-- ---------------------------------------------------------------------------

CREATE SCHEMA IF NOT EXISTS territory;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Set search path for this session
SET search_path TO territory, public;

-- ---------------------------------------------------------------------------
-- 2. TERRITORIES (postcodes)
-- ---------------------------------------------------------------------------

CREATE TABLE territory.territories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  postcode VARCHAR(10) NOT NULL UNIQUE,
  postcode_area VARCHAR(5) NOT NULL,
  postcode_district VARCHAR(5) NOT NULL,
  town_name VARCHAR(100),
  county VARCHAR(100),
  country VARCHAR(50) DEFAULT 'United Kingdom',
  tier VARCHAR(20) NOT NULL DEFAULT 'standard' CHECK (tier IN ('standard', 'premium')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE territory.territories IS 'UK postcodes eligible for Territory Command. is_active = false means reserve only.';
COMMENT ON COLUMN territory.territories.tier IS 'standard or premium. Premium territories carry Gold badge and higher pricing.';

-- ---------------------------------------------------------------------------
-- 3. SECTORS (industries)
-- ---------------------------------------------------------------------------

CREATE TABLE territory.sectors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(100) NOT NULL UNIQUE,
  label VARCHAR(200) NOT NULL,
  category VARCHAR(100) NOT NULL,
  sic_codes TEXT[],
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT false,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  display_order INTEGER NOT NULL DEFAULT 100,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE territory.sectors IS 'Industries that can be claimed. is_active = live sectors. is_featured = Layer 1 hero buttons.';
COMMENT ON COLUMN territory.sectors.sic_codes IS 'Array of UK SIC 2007 codes. Cross-references to firms_registry and Companies House data.';

-- ---------------------------------------------------------------------------
-- 4. OPERATION NAME POOL (the 900 combos)
-- ---------------------------------------------------------------------------

CREATE TABLE territory.operation_name_pool (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  colour VARCHAR(50) NOT NULL,
  noun VARCHAR(50) NOT NULL,
  full_name VARCHAR(200) GENERATED ALWAYS AS ('Operation ' || colour || ' ' || noun) STORED,
  is_used BOOLEAN NOT NULL DEFAULT false,
  used_by_operation_id UUID,
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(colour, noun)
);

COMMENT ON TABLE territory.operation_name_pool IS '900 colour x noun combinations. One is allocated per new operation unless custom name requested.';

-- ---------------------------------------------------------------------------
-- 5. SEATS (territory x sector combinations, the core state table)
-- ---------------------------------------------------------------------------

CREATE TABLE territory.seats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  territory_id UUID NOT NULL REFERENCES territory.territories(id) ON DELETE RESTRICT,
  sector_id UUID NOT NULL REFERENCES territory.sectors(id) ON DELETE RESTRICT,
  state VARCHAR(20) NOT NULL DEFAULT 'available' CHECK (state IN ('available', 'pending', 'claimed', 'not_active')),
  tier VARCHAR(20) NOT NULL DEFAULT 'standard' CHECK (tier IN ('standard', 'premium')),
  monthly_price_gbp INTEGER NOT NULL DEFAULT 500,
  setup_fee_gbp INTEGER NOT NULL DEFAULT 750,
  contract_months INTEGER NOT NULL DEFAULT 24,
  claimed_at TIMESTAMPTZ,
  pending_until TIMESTAMPTZ,
  current_application_id UUID,
  current_operation_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(territory_id, sector_id)
);

COMMENT ON TABLE territory.seats IS 'Core state table. One row per territory x sector combination. State drives all UI rendering.';
COMMENT ON COLUMN territory.seats.state IS 'available = open. pending = 48h hold. claimed = under contract. not_active = sector not live in this territory.';
COMMENT ON COLUMN territory.seats.pending_until IS 'Timestamp when pending state auto-expires back to available.';

-- ---------------------------------------------------------------------------
-- 6. APPLICATIONS (qualifying enquiries)
-- ---------------------------------------------------------------------------

CREATE TABLE territory.applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seat_id UUID NOT NULL REFERENCES territory.seats(id) ON DELETE CASCADE,
  firm_name VARCHAR(200) NOT NULL,
  contact_name VARCHAR(200) NOT NULL,
  contact_role VARCHAR(100),
  contact_email VARCHAR(320) NOT NULL,
  contact_phone VARCHAR(50),
  website_url VARCHAR(500),
  firm_postcode VARCHAR(10) NOT NULL,
  sector_slug VARCHAR(100) NOT NULL,
  ai_visibility_approach VARCHAR(100),
  additional_context TEXT,
  status VARCHAR(30) NOT NULL DEFAULT 'received' CHECK (status IN ('received', 'qualified', 'declined', 'converted', 'expired')),
  booked_call_at TIMESTAMPTZ,
  hubspot_contact_id VARCHAR(100),
  hubspot_deal_id VARCHAR(100),
  internal_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE territory.applications IS 'Submitted applications for available territories. Triggers 48h hold on associated seat.';

-- ---------------------------------------------------------------------------
-- 7. WAITLIST (notification requests for unavailable seats)
-- ---------------------------------------------------------------------------

CREATE TABLE territory.waitlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seat_id UUID NOT NULL REFERENCES territory.seats(id) ON DELETE CASCADE,
  contact_name VARCHAR(200) NOT NULL,
  contact_email VARCHAR(320) NOT NULL,
  firm_name VARCHAR(200),
  firm_postcode VARCHAR(10),
  sector_slug VARCHAR(100),
  waitlist_position INTEGER,
  notified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(seat_id, contact_email)
);

COMMENT ON TABLE territory.waitlist IS 'Prospects waiting for claimed or inactive seats to become available. Notified in position order.';

-- ---------------------------------------------------------------------------
-- 8. AREA INTELLIGENCE (aggregate market data per territory x sector)
-- ---------------------------------------------------------------------------

CREATE TABLE territory.area_intelligence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  territory_id UUID NOT NULL REFERENCES territory.territories(id) ON DELETE CASCADE,
  sector_id UUID NOT NULL REFERENCES territory.sectors(id) ON DELETE CASCADE,
  firm_count INTEGER NOT NULL DEFAULT 0,
  ai_visible_count INTEGER NOT NULL DEFAULT 0,
  average_voice_score INTEGER,
  top_competitor_count INTEGER NOT NULL DEFAULT 0,
  data_source VARCHAR(200) NOT NULL DEFAULT 'internal_research_2026q2',
  last_updated TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(territory_id, sector_id)
);

COMMENT ON TABLE territory.area_intelligence IS 'Aggregate counts from Dan 500-firm scraped dataset. NOT from customer scans (GDPR boundary).';
COMMENT ON COLUMN territory.area_intelligence.firm_count IS 'Total firms of this sector in this postcode per internal research.';

-- ---------------------------------------------------------------------------
-- 9. FIRMS REGISTRY (the 500-firm scraped dataset)
-- ---------------------------------------------------------------------------

CREATE TABLE territory.firms_registry (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firm_name VARCHAR(300) NOT NULL,
  companies_house_number VARCHAR(20),
  primary_sic_code VARCHAR(10),
  sector_id UUID REFERENCES territory.sectors(id),
  territory_id UUID REFERENCES territory.territories(id),
  postcode VARCHAR(10),
  director_name VARCHAR(200),
  director_appointment_date DATE,
  website_url VARCHAR(500),
  email VARCHAR(320),
  voice_score INTEGER,
  last_scanned_at TIMESTAMPTZ,
  is_prospect BOOLEAN NOT NULL DEFAULT true,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE territory.firms_registry IS 'The 500-firm scraped prospect dataset. Source of truth for outreach and area_intelligence aggregates.';

-- ---------------------------------------------------------------------------
-- 10. OPERATIONS (active client engagements)
-- ---------------------------------------------------------------------------

CREATE TABLE territory.operations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seat_id UUID NOT NULL REFERENCES territory.seats(id) ON DELETE RESTRICT,
  application_id UUID REFERENCES territory.applications(id),
  operation_name VARCHAR(200) NOT NULL,
  operation_type VARCHAR(30) NOT NULL DEFAULT 'generated' CHECK (operation_type IN ('generated', 'custom')),
  firm_name VARCHAR(300) NOT NULL,
  contact_name VARCHAR(200) NOT NULL,
  contact_email VARCHAR(320) NOT NULL,
  contact_phone VARCHAR(50),
  website_url VARCHAR(500),
  started_at DATE NOT NULL,
  contract_months INTEGER NOT NULL DEFAULT 24,
  monthly_price_gbp INTEGER NOT NULL DEFAULT 500,
  setup_fee_gbp INTEGER NOT NULL DEFAULT 750,
  status VARCHAR(30) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'ended', 'cancelled')),
  current_voice_score INTEGER,
  target_voice_score INTEGER NOT NULL DEFAULT 80,
  last_voice_scan_at TIMESTAMPTZ,
  hubspot_deal_id VARCHAR(100),
  contract_end_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE territory.operations IS 'Active Territory Command client engagements. Each has an allocated Operation name.';

-- ---------------------------------------------------------------------------
-- 11. FOREIGN KEY BACK-REFERENCES (circular relationships resolved last)
-- ---------------------------------------------------------------------------

ALTER TABLE territory.seats
  ADD CONSTRAINT seats_current_application_fk
  FOREIGN KEY (current_application_id) REFERENCES territory.applications(id) ON DELETE SET NULL;

ALTER TABLE territory.seats
  ADD CONSTRAINT seats_current_operation_fk
  FOREIGN KEY (current_operation_id) REFERENCES territory.operations(id) ON DELETE SET NULL;

ALTER TABLE territory.operation_name_pool
  ADD CONSTRAINT operation_name_pool_used_by_fk
  FOREIGN KEY (used_by_operation_id) REFERENCES territory.operations(id) ON DELETE SET NULL;

-- ---------------------------------------------------------------------------
-- 12. INDEXES
-- ---------------------------------------------------------------------------

-- Territories lookups
CREATE INDEX idx_territories_postcode_area ON territory.territories(postcode_area);
CREATE INDEX idx_territories_postcode_district ON territory.territories(postcode_district);
CREATE INDEX idx_territories_is_active ON territory.territories(is_active);

-- Sectors lookups
CREATE INDEX idx_sectors_is_active ON territory.sectors(is_active);
CREATE INDEX idx_sectors_is_featured ON territory.sectors(is_featured);
CREATE INDEX idx_sectors_category ON territory.sectors(category);
CREATE INDEX idx_sectors_display_order ON territory.sectors(display_order);

-- Seats lookups (the hot path for availability checks)
CREATE INDEX idx_seats_state ON territory.seats(state);
CREATE INDEX idx_seats_territory ON territory.seats(territory_id);
CREATE INDEX idx_seats_sector ON territory.seats(sector_id);
CREATE INDEX idx_seats_territory_sector ON territory.seats(territory_id, sector_id);
CREATE INDEX idx_seats_pending_until ON territory.seats(pending_until) WHERE state = 'pending';

-- Applications lookups
CREATE INDEX idx_applications_status ON territory.applications(status);
CREATE INDEX idx_applications_seat ON territory.applications(seat_id);
CREATE INDEX idx_applications_email ON territory.applications(contact_email);
CREATE INDEX idx_applications_created ON territory.applications(created_at DESC);

-- Waitlist lookups
CREATE INDEX idx_waitlist_seat ON territory.waitlist(seat_id);
CREATE INDEX idx_waitlist_position ON territory.waitlist(seat_id, waitlist_position);
CREATE INDEX idx_waitlist_email ON territory.waitlist(contact_email);

-- Area intelligence lookups
CREATE INDEX idx_area_intelligence_territory_sector ON territory.area_intelligence(territory_id, sector_id);

-- Firms registry lookups
CREATE INDEX idx_firms_registry_postcode ON territory.firms_registry(postcode);
CREATE INDEX idx_firms_registry_sector ON territory.firms_registry(sector_id);
CREATE INDEX idx_firms_registry_territory ON territory.firms_registry(territory_id);
CREATE INDEX idx_firms_registry_is_prospect ON territory.firms_registry(is_prospect);
CREATE INDEX idx_firms_registry_ch_number ON territory.firms_registry(companies_house_number);

-- Operation pool lookups
CREATE INDEX idx_operation_name_pool_is_used ON territory.operation_name_pool(is_used);

-- Operations lookups
CREATE INDEX idx_operations_status ON territory.operations(status);
CREATE INDEX idx_operations_seat ON territory.operations(seat_id);

-- ---------------------------------------------------------------------------
-- 13. UPDATED_AT TRIGGERS
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION territory.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER territories_updated_at BEFORE UPDATE ON territory.territories
  FOR EACH ROW EXECUTE FUNCTION territory.set_updated_at();

CREATE TRIGGER sectors_updated_at BEFORE UPDATE ON territory.sectors
  FOR EACH ROW EXECUTE FUNCTION territory.set_updated_at();

CREATE TRIGGER seats_updated_at BEFORE UPDATE ON territory.seats
  FOR EACH ROW EXECUTE FUNCTION territory.set_updated_at();

CREATE TRIGGER applications_updated_at BEFORE UPDATE ON territory.applications
  FOR EACH ROW EXECUTE FUNCTION territory.set_updated_at();

CREATE TRIGGER firms_registry_updated_at BEFORE UPDATE ON territory.firms_registry
  FOR EACH ROW EXECUTE FUNCTION territory.set_updated_at();

CREATE TRIGGER operations_updated_at BEFORE UPDATE ON territory.operations
  FOR EACH ROW EXECUTE FUNCTION territory.set_updated_at();

-- ---------------------------------------------------------------------------
-- 14. PENDING EXPIRY FUNCTION (run via cron every 15 min)
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION territory.expire_pending_seats()
RETURNS TABLE (expired_seat_id UUID, expired_application_id UUID) AS $$
BEGIN
  RETURN QUERY
  WITH expired AS (
    UPDATE territory.seats s
    SET
      state = 'available',
      pending_until = NULL,
      current_application_id = NULL,
      updated_at = NOW()
    WHERE s.state = 'pending'
      AND s.pending_until < NOW()
    RETURNING s.id AS seat_id, s.current_application_id AS app_id
  ),
  app_expired AS (
    UPDATE territory.applications a
    SET
      status = 'expired',
      updated_at = NOW()
    WHERE a.id IN (SELECT app_id FROM expired WHERE app_id IS NOT NULL)
      AND a.status IN ('received', 'qualified')
    RETURNING a.id
  )
  SELECT seat_id, app_id FROM expired;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION territory.expire_pending_seats IS 'Releases seats that have been pending longer than 48h. Run every 15 min via pg_cron or external scheduler.';

-- ---------------------------------------------------------------------------
-- 15. SECURITY MODEL (Neon, not Supabase)
-- ---------------------------------------------------------------------------
--
-- Neon Postgres does NOT use the Supabase anon/service_role auth model.
-- All Territory Command queries route through Next.js API routes on
-- scopesite.co.uk using the server-side DATABASE_URL connection string.
-- The connection string is never exposed to the client.
--
-- Security boundaries are enforced at the API route layer:
--   - GET  /api/territory/check           : validates postcode + sector inputs
--   - POST /api/territory/apply           : rate-limited, Zod-validated input
--   - POST /api/territory/waitlist        : rate-limited, Zod-validated input
--   - GET  /api/territory/featured        : public read, cached
--   - GET  /api/territory/typeahead       : public read, cached, query-sanitised
--   - POST /api/cron/territory/expire     : CRON_SECRET header required
--
-- Admin-only operations (confirming a claimed seat, updating operations,
-- etc.) are NOT exposed on public API routes in Phase A. Dan performs them
-- via direct DB access from the Neon dashboard or the admin portal
-- (to be built in Phase B).
--
-- If a future phase migrates this database to Supabase or adds multi-tenant
-- client access, enable RLS at that point. Phase A does not need it.

-- ---------------------------------------------------------------------------
-- 16. HELPFUL VIEWS
-- ---------------------------------------------------------------------------

-- View: seat details with territory and sector info joined (for page rendering)
CREATE OR REPLACE VIEW territory.v_seats_full AS
SELECT
  s.id AS seat_id,
  s.state,
  s.tier,
  s.monthly_price_gbp,
  s.setup_fee_gbp,
  s.pending_until,
  s.claimed_at,
  t.id AS territory_id,
  t.postcode,
  t.postcode_district,
  t.town_name,
  t.county,
  t.tier AS territory_tier,
  t.is_active AS territory_is_active,
  sec.id AS sector_id,
  sec.slug AS sector_slug,
  sec.label AS sector_label,
  sec.category AS sector_category,
  sec.is_active AS sector_is_active,
  sec.is_featured AS sector_is_featured,
  ai.firm_count AS area_firm_count,
  ai.ai_visible_count AS area_ai_visible_count,
  ai.average_voice_score AS area_average_voice_score
FROM territory.seats s
JOIN territory.territories t ON s.territory_id = t.id
JOIN territory.sectors sec ON s.sector_id = sec.id
LEFT JOIN territory.area_intelligence ai ON ai.territory_id = t.id AND ai.sector_id = sec.id;

COMMENT ON VIEW territory.v_seats_full IS 'Denormalised view for page rendering. Joins seat, territory, sector, and area intelligence data.';

-- ---------------------------------------------------------------------------
-- SCHEMA COMPLETE
-- ---------------------------------------------------------------------------
-- Run 03_SEED_DATA.sql next to populate initial territories, sectors, seats,
-- and operation name pool.
-- ---------------------------------------------------------------------------

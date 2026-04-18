-- ===========================================================================
-- TERRITORY COMMAND - Seed Data (Phase A)
-- ===========================================================================
-- Run AFTER 03_NEON_SCHEMA.sql.
-- Populates:
--   - 10 territories (7 active + 3 reserve)
--   - 62 sectors (4 active + 58 inactive)
--   - 434 seats (cross-joined from active territories x all sectors)
--   - 900 operation name combinations
--   - Sample area intelligence for the 28 active territory-sector combos
-- ===========================================================================

SET search_path TO territory, public;

-- ---------------------------------------------------------------------------
-- 1. TERRITORIES (10 rows: 7 active + 3 reserve)
-- ---------------------------------------------------------------------------

INSERT INTO territory.territories
  (postcode, postcode_area, postcode_district, town_name, county, tier, is_active, notes)
VALUES
  -- ACTIVE (7 pilot territories)
  ('BS1', 'BS', 'BS1', 'Bristol', 'Bristol', 'premium', true, 'Bristol central. Premium tier due to high-density professional services market.'),
  ('BA1', 'BA', 'BA1', 'Bath', 'Somerset', 'premium', true, 'Bath central. Premium tier. High-value professional services.'),
  ('BS8', 'BS', 'BS8', 'Bristol', 'Bristol', 'premium', true, 'Clifton, Bristol west. Premium tier.'),
  ('TA1', 'TA', 'TA1', 'Taunton', 'Somerset', 'standard', true, 'Taunton central. Standard tier.'),
  ('BA20', 'BA', 'BA20', 'Yeovil', 'Somerset', 'standard', true, 'Yeovil central. Standard tier.'),
  ('BS22', 'BS', 'BS22', 'Weston-super-Mare', 'North Somerset', 'standard', true, 'Weston-super-Mare central. Standard tier.'),
  ('BA11', 'BA', 'BA11', 'Frome', 'Somerset', 'standard', true, 'Frome. ScopeSite home territory. Under-bombarded postcode per Apollo coverage research.'),
  -- RESERVES (3 territories not yet live for seats)
  ('BA2', 'BA', 'BA2', 'Bath', 'Somerset', 'standard', false, 'Reserve. Activate in Phase B based on demand.'),
  ('BA3', 'BA', 'BA3', 'Radstock', 'Somerset', 'standard', false, 'Reserve. Activate in Phase B based on demand.'),
  ('BA4', 'BA', 'BA4', 'Shepton Mallet', 'Somerset', 'standard', false, 'Reserve. Activate in Phase B based on demand.');

-- ---------------------------------------------------------------------------
-- 2. SECTORS (62 rows from taxonomy)
-- ---------------------------------------------------------------------------

INSERT INTO territory.sectors
  (slug, label, category, sic_codes, is_active, is_featured, display_order, description)
VALUES
  -- PROFESSIONAL SERVICES (4 active + 11 inactive)
  ('solicitors', 'Solicitors', 'Professional Services', ARRAY['69101','69102','69109'], true, true, 10, 'Legal services including litigation, commercial, family, conveyancing'),
  ('accountants', 'Accountants', 'Professional Services', ARRAY['69201','69202'], true, true, 20, 'Accounting, bookkeeping, auditing and tax consultancy'),
  ('estate-agents', 'Estate Agents', 'Professional Services', ARRAY['68310'], true, true, 30, 'Residential and commercial estate agents, letting agents'),
  ('dental-practices', 'Dental Practices', 'Professional Services', ARRAY['86230'], true, true, 40, 'General dentistry, orthodontics, cosmetic dentistry'),
  ('independent-financial-advisors', 'Independent Financial Advisors', 'Professional Services', ARRAY['66190','66290'], false, false, 50, 'IFAs, mortgage advisors, wealth management'),
  ('insurance-brokers', 'Insurance Brokers', 'Professional Services', ARRAY['66220'], false, false, 60, 'Commercial and personal insurance brokerage'),
  ('architects', 'Architects', 'Professional Services', ARRAY['71111'], false, false, 70, 'Architectural practice, building design'),
  ('chartered-surveyors', 'Chartered Surveyors', 'Professional Services', ARRAY['71122'], false, false, 80, 'Quantity surveyors, building surveyors, valuation'),
  ('veterinary-practices', 'Veterinary Practices', 'Professional Services', ARRAY['75000'], false, false, 90, 'Small animal, equine, farm veterinary services'),
  ('optometrists', 'Optometrists', 'Professional Services', ARRAY['86901'], false, false, 100, 'Eye care, optical services, contact lens practitioners'),
  ('private-medical-practices', 'Private Medical Practices', 'Professional Services', ARRAY['86210','86220'], false, false, 110, 'Private GP, specialists, physiotherapy clinics'),
  ('management-consultants', 'Management Consultants', 'Professional Services', ARRAY['70229'], false, false, 120, 'Business consulting, strategy advisory'),
  ('marketing-pr-agencies', 'Marketing and PR Agencies', 'Professional Services', ARRAY['70210','73110'], false, false, 130, 'Marketing strategy, public relations, brand consultancy'),
  ('recruitment-agencies', 'Recruitment Agencies', 'Professional Services', ARRAY['78200'], false, false, 140, 'Executive search, temporary staffing, specialist recruitment'),
  ('chartered-engineers', 'Chartered Engineers', 'Professional Services', ARRAY['71121'], false, false, 150, 'Civil, structural, mechanical, electrical engineering consultancy'),
  -- HOME SERVICES (14 inactive)
  ('plumbers', 'Plumbers', 'Home Services', ARRAY['43220'], false, false, 200, 'Residential and commercial plumbing and heating'),
  ('electricians', 'Electricians', 'Home Services', ARRAY['43210'], false, false, 210, 'Electrical installation, testing, inspection'),
  ('roofers', 'Roofers', 'Home Services', ARRAY['43910'], false, false, 220, 'Roofing, flat roofing, slate and tile'),
  ('builders', 'Builders', 'Home Services', ARRAY['41201','41202'], false, false, 230, 'General building contractors, extensions, renovations'),
  ('carpenters', 'Carpenters and Joiners', 'Home Services', ARRAY['43320'], false, false, 240, 'Carpentry, joinery, bespoke woodwork'),
  ('painters-decorators', 'Painters and Decorators', 'Home Services', ARRAY['43341'], false, false, 250, 'Interior and exterior decorating, wallpapering'),
  ('tilers', 'Tilers', 'Home Services', ARRAY['43330'], false, false, 260, 'Wall and floor tiling, natural stone'),
  ('glaziers', 'Glaziers', 'Home Services', ARRAY['43342'], false, false, 270, 'Glazing, windows, conservatories'),
  ('gardeners-landscapers', 'Gardeners and Landscapers', 'Home Services', ARRAY['81300'], false, false, 280, 'Garden design, landscaping, maintenance'),
  ('kitchen-bathroom-fitters', 'Kitchen and Bathroom Fitters', 'Home Services', ARRAY['43320'], false, false, 290, 'Kitchen and bathroom installation'),
  ('cleaners-domestic', 'Domestic Cleaners', 'Home Services', ARRAY['81210'], false, false, 300, 'Residential cleaning services'),
  ('locksmiths', 'Locksmiths', 'Home Services', ARRAY['43290'], false, false, 310, 'Locksmithing, security systems, access control'),
  ('removals', 'Removals and Man with Van', 'Home Services', ARRAY['49420'], false, false, 320, 'Domestic and office removals'),
  ('pest-control', 'Pest Control', 'Home Services', ARRAY['81291'], false, false, 330, 'Pest control, rodent control, wildlife management'),
  -- HOSPITALITY (7 inactive)
  ('restaurants', 'Restaurants', 'Hospitality', ARRAY['56101'], false, false, 400, 'Table service restaurants, fine dining, casual dining'),
  ('cafes', 'Cafés and Coffee Shops', 'Hospitality', ARRAY['56102'], false, false, 410, 'Coffee shops, tea rooms, independent cafés'),
  ('pubs-bars', 'Pubs and Bars', 'Hospitality', ARRAY['56301'], false, false, 420, 'Public houses, wine bars'),
  ('hotels', 'Hotels', 'Hospitality', ARRAY['55100'], false, false, 430, 'Hotels, boutique hotels, country houses'),
  ('bed-breakfast', 'Bed and Breakfast', 'Hospitality', ARRAY['55200'], false, false, 440, 'B&Bs, guesthouses, self-catering'),
  ('wedding-venues', 'Wedding Venues', 'Hospitality', ARRAY['93290'], false, false, 450, 'Wedding venues, event spaces, marquee hire'),
  ('catering-services', 'Catering Services', 'Hospitality', ARRAY['56210'], false, false, 460, 'Event catering, corporate catering'),
  -- RETAIL (8 inactive)
  ('independent-retailers', 'Independent Retailers', 'Retail', ARRAY['47910'], false, false, 500, 'Small independent retail shops'),
  ('jewellers', 'Jewellers', 'Retail', ARRAY['47770'], false, false, 510, 'Jewellery retail, watch repair'),
  ('clothing-boutiques', 'Clothing Boutiques', 'Retail', ARRAY['47710'], false, false, 520, 'Independent clothing, fashion boutiques'),
  ('bookshops', 'Bookshops', 'Retail', ARRAY['47610'], false, false, 530, 'Independent bookshops, second-hand bookshops'),
  ('antiques-dealers', 'Antiques Dealers', 'Retail', ARRAY['47791'], false, false, 540, 'Antiques, vintage, reclamation'),
  ('speciality-food-shops', 'Speciality Food Shops', 'Retail', ARRAY['47210','47220','47230'], false, false, 550, 'Delicatessens, butchers, fishmongers'),
  ('garden-centres', 'Garden Centres', 'Retail', ARRAY['47761'], false, false, 560, 'Garden centres, nurseries'),
  ('art-galleries', 'Art Galleries', 'Retail', ARRAY['47782'], false, false, 570, 'Independent art galleries, print shops'),
  -- HEALTH AND BEAUTY (8 inactive)
  ('personal-trainers', 'Personal Trainers', 'Health and Beauty', ARRAY['93130'], false, false, 600, '1:1 personal training, small group fitness'),
  ('yoga-pilates-studios', 'Yoga and Pilates Studios', 'Health and Beauty', ARRAY['93130'], false, false, 610, 'Yoga studios, pilates, barre classes'),
  ('chiropractors', 'Chiropractors', 'Health and Beauty', ARRAY['86909'], false, false, 620, 'Chiropractic clinics, spinal care'),
  ('osteopaths', 'Osteopaths', 'Health and Beauty', ARRAY['86909'], false, false, 630, 'Osteopathic clinics, musculoskeletal therapy'),
  ('physiotherapy-clinics', 'Physiotherapy Clinics', 'Health and Beauty', ARRAY['86909'], false, false, 640, 'Private physiotherapy, sports therapy'),
  ('beauty-salons', 'Beauty Salons', 'Health and Beauty', ARRAY['96020'], false, false, 650, 'Beauty treatments, facials, waxing, nails'),
  ('hair-salons', 'Hair Salons', 'Health and Beauty', ARRAY['96020'], false, false, 660, 'Hair salons, colourists, hairdressing'),
  ('barbers', 'Barbers', 'Health and Beauty', ARRAY['96020'], false, false, 670, 'Traditional barbershops, men''s grooming'),
  -- TRADES AND COMMERCIAL (10 inactive)
  ('car-dealers', 'Car Dealers', 'Trades and Commercial', ARRAY['45112'], false, false, 700, 'Used and new car dealers, specialist car dealers'),
  ('garages-mot-centres', 'Garages and MOT Centres', 'Trades and Commercial', ARRAY['45200'], false, false, 710, 'Mechanical repair, MOT testing, servicing'),
  ('transport-logistics', 'Transport and Logistics', 'Trades and Commercial', ARRAY['49410'], false, false, 720, 'Road freight, courier services, logistics SMEs'),
  ('manufacturing-sme', 'Manufacturing (SME)', 'Trades and Commercial', ARRAY['10000'], false, false, 730, 'Small manufacturing, fabrication, workshops'),
  ('commercial-cleaning', 'Commercial Cleaning', 'Trades and Commercial', ARRAY['81220'], false, false, 740, 'Commercial cleaning, office cleaning contractors'),
  ('photography-studios', 'Photography Studios', 'Trades and Commercial', ARRAY['74201'], false, false, 750, 'Commercial and portrait photography'),
  ('videography-services', 'Videography Services', 'Trades and Commercial', ARRAY['59112'], false, false, 760, 'Video production, wedding videography'),
  ('graphic-design', 'Graphic Design Studios', 'Trades and Commercial', ARRAY['74100'], false, false, 770, 'Independent graphic design, branding studios'),
  ('private-tutors', 'Private Tutors and Tuition', 'Trades and Commercial', ARRAY['85590'], false, false, 780, 'Private tuition, exam prep, subject specialists'),
  ('driving-instructors', 'Driving Instructors and Schools', 'Trades and Commercial', ARRAY['85530'], false, false, 790, 'ADI driving instruction, driving schools');

-- ---------------------------------------------------------------------------
-- 3. SEATS (cross-join active territories x all sectors)
-- ---------------------------------------------------------------------------
-- Only creates seats for ACTIVE territories. Reserve territories get seats
-- when activated in Phase B.
--
-- State logic:
--   - territory active AND sector active = 'available'
--   - territory active AND sector inactive = 'not_active'
-- Pricing:
--   - Premium territory = £750/month + £1,250 setup
--   - Standard territory = £500/month + £750 setup

INSERT INTO territory.seats
  (territory_id, sector_id, state, tier, monthly_price_gbp, setup_fee_gbp, contract_months)
SELECT
  t.id,
  s.id,
  CASE
    WHEN t.is_active AND s.is_active THEN 'available'
    ELSE 'not_active'
  END,
  t.tier,
  CASE WHEN t.tier = 'premium' THEN 750 ELSE 500 END,
  CASE WHEN t.tier = 'premium' THEN 1250 ELSE 750 END,
  24
FROM territory.territories t
CROSS JOIN territory.sectors s
WHERE t.is_active = true;

-- Expected row count: 7 active territories x 62 sectors = 434 seats
-- Of those: 7 x 4 active sectors = 28 'available' seats
-- Remainder: 7 x 58 inactive sectors = 406 'not_active' seats

-- ---------------------------------------------------------------------------
-- 4. OPERATION NAME POOL (30 colours x 30 nouns = 900 combinations)
-- ---------------------------------------------------------------------------

DO $$
DECLARE
  colours TEXT[] := ARRAY[
    'Cobalt', 'Crimson', 'Amber', 'Obsidian', 'Ivory',
    'Scarlet', 'Emerald', 'Sable', 'Slate', 'Bronze',
    'Copper', 'Granite', 'Ruby', 'Onyx', 'Pearl',
    'Silver', 'Gold', 'Steel', 'Indigo', 'Sapphire',
    'Jet', 'Ash', 'Flint', 'Pewter', 'Charcoal',
    'Mahogany', 'Topaz', 'Garnet', 'Jasper', 'Citrine'
  ];
  nouns TEXT[] := ARRAY[
    'Falcon', 'Wolf', 'Stag', 'Hawk', 'Bear',
    'Eagle', 'Panther', 'Lion', 'Tiger', 'Osprey',
    'Raven', 'Jaguar', 'Viper', 'Cobra', 'Phoenix',
    'Griffin', 'Harrier', 'Kestrel', 'Shark', 'Buffalo',
    'Badger', 'Rhino', 'Leopard', 'Lynx', 'Mantis',
    'Scorpion', 'Hornet', 'Wolverine', 'Hammerhead', 'Barracuda'
  ];
  c TEXT;
  n TEXT;
BEGIN
  FOREACH c IN ARRAY colours LOOP
    FOREACH n IN ARRAY nouns LOOP
      INSERT INTO territory.operation_name_pool (colour, noun)
      VALUES (c, n)
      ON CONFLICT (colour, noun) DO NOTHING;
    END LOOP;
  END LOOP;
END $$;

-- Expected row count: 30 x 30 = 900

-- ---------------------------------------------------------------------------
-- 5. SAMPLE AREA INTELLIGENCE (for the 28 active territory-sector combos)
-- ---------------------------------------------------------------------------
-- Placeholder counts. Replace with real data from Dan's 500-firm dataset once
-- the registry is populated. Figures below are indicative starting values
-- based on research notes (BA11 under-bombarded, BS1 heavily-targeted).

INSERT INTO territory.area_intelligence
  (territory_id, sector_id, firm_count, ai_visible_count, average_voice_score, top_competitor_count, data_source)
SELECT
  t.id,
  s.id,
  -- Firm count varies by territory density (indicative placeholders)
  CASE
    WHEN t.postcode_district = 'BS1' THEN 40
    WHEN t.postcode_district = 'BA1' THEN 28
    WHEN t.postcode_district = 'BS8' THEN 32
    WHEN t.postcode_district = 'TA1' THEN 18
    WHEN t.postcode_district = 'BA20' THEN 14
    WHEN t.postcode_district = 'BS22' THEN 12
    WHEN t.postcode_district = 'BA11' THEN 8
  END AS firm_count,
  -- AI visibility is low everywhere (the market opportunity)
  CASE
    WHEN t.postcode_district IN ('BS1', 'BA1') THEN 2
    ELSE 0
  END AS ai_visible_count,
  -- Average V.O.I.C.E. score is low (the market opportunity)
  CASE
    WHEN t.postcode_district IN ('BS1', 'BA1') THEN 42
    ELSE 28
  END AS average_voice_score,
  -- Competitor count (existing SEO/digital agencies already serving)
  CASE
    WHEN t.postcode_district = 'BS1' THEN 12
    WHEN t.postcode_district = 'BA1' THEN 8
    WHEN t.postcode_district = 'BS8' THEN 9
    WHEN t.postcode_district = 'TA1' THEN 4
    WHEN t.postcode_district = 'BA20' THEN 3
    WHEN t.postcode_district = 'BS22' THEN 3
    WHEN t.postcode_district = 'BA11' THEN 2
  END AS top_competitor_count,
  'internal_research_2026q2_placeholder'
FROM territory.territories t
CROSS JOIN territory.sectors s
WHERE t.is_active = true AND s.is_active = true;

-- ---------------------------------------------------------------------------
-- SEED DATA COMPLETE
-- ---------------------------------------------------------------------------
-- Verification queries:

-- SELECT COUNT(*) FROM territory.territories;  -- expect 10
-- SELECT COUNT(*) FROM territory.sectors;  -- expect 62
-- SELECT COUNT(*) FROM territory.seats;  -- expect 434
-- SELECT COUNT(*) FROM territory.seats WHERE state = 'available';  -- expect 28
-- SELECT COUNT(*) FROM territory.seats WHERE state = 'not_active';  -- expect 406
-- SELECT COUNT(*) FROM territory.operation_name_pool;  -- expect 900
-- SELECT COUNT(*) FROM territory.area_intelligence;  -- expect 28
-- ---------------------------------------------------------------------------

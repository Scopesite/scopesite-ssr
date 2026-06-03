/**
 * Static HTML pricing tables for /pricing (server-rendered; visible in view-source).
 */

const tableWrap = 'overflow-x-auto mb-10 -mx-4 px-4 sm:mx-0 sm:px-0';
const tableClass =
  'w-full min-w-[36rem] border-collapse border border-slate-300 text-left text-sm text-brand-navy';
const thClass = 'border border-slate-300 bg-brand-navy px-3 py-2 font-semibold text-white';
const tdClass = 'border border-slate-300 px-3 py-2 align-top';
const rowClass = '[&_tr:nth-child(even)]:bg-slate-50';

export function PricingBreakdownTables() {
  return (
    <section
      className="section-white border-t border-brand-navy/10"
      aria-labelledby="pricing-breakdown-heading"
    >
      <div className="container-content max-w-5xl">
        <h2
          id="pricing-breakdown-heading"
          className="text-xl sm:text-2xl md:text-h2 text-brand-navy text-center mb-6"
        >
          How Our Pricing Works (The Full Breakdown)
        </h2>
        <p className="text-brand-navy/80 text-center max-w-3xl mx-auto mb-10 leading-relaxed">
          Every price below is real. We don&apos;t hide our numbers, we don&apos;t run discount
          theatre. Use the calculator above for an instant guide quote, or scroll through the tables
          below to see exactly how we work out the cost of your project.
        </p>

        <h3 className="text-lg font-bold text-brand-navy mb-3">Table 1: Wix Studio (Manage Yourself)</h3>
        <div className={`${tableWrap} ${rowClass}`}>
          <table className={tableClass}>
            <thead>
              <tr>
                <th className={thClass}>Pages</th>
                <th className={thClass}>Tier</th>
                <th className={thClass}>Price</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className={tdClass}>1–5</td>
                <td className={tdClass}>Starter</td>
                <td className={tdClass}>£1,875</td>
              </tr>
              <tr>
                <td className={tdClass}>6–10</td>
                <td className={tdClass}>Professional</td>
                <td className={tdClass}>£4,125</td>
              </tr>
              <tr>
                <td className={tdClass}>11+</td>
                <td className={tdClass}>Enterprise</td>
                <td className={tdClass}>£7,500 + £150 per page above 10</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-lg font-bold text-brand-navy mb-3">
          Table 2: Ultra Fast SSR (AI Visible Premium Site)
        </h3>
        <div className={`${tableWrap} ${rowClass}`}>
          <table className={tableClass}>
            <thead>
              <tr>
                <th className={thClass}>Pages</th>
                <th className={thClass}>Pricing</th>
                <th className={thClass}>Notes</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className={tdClass}>1–5</td>
                <td className={tdClass}>£2,000 base</td>
                <td className={tdClass}>Includes AI SEO</td>
              </tr>
              <tr>
                <td className={tdClass}>6–10</td>
                <td className={tdClass}>+£250 per page</td>
                <td className={tdClass}></td>
              </tr>
              <tr>
                <td className={tdClass}>11–20</td>
                <td className={tdClass}>+£200 per page</td>
                <td className={tdClass}></td>
              </tr>
              <tr>
                <td className={tdClass}>21+</td>
                <td className={tdClass}>+£150 per page</td>
                <td className={tdClass}></td>
              </tr>
              <tr>
                <td className={tdClass}>40+</td>
                <td className={tdClass}>Capped at £8,000</td>
                <td className={tdClass}>Custom enterprise quote required</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-lg font-bold text-brand-navy mb-3">Table 3: AI SEO Retainer (Standalone)</h3>
        <div className={`${tableWrap} ${rowClass}`}>
          <table className={tableClass}>
            <thead>
              <tr>
                <th className={thClass}>Item</th>
                <th className={thClass}>Price</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className={tdClass}>Setup</td>
                <td className={tdClass}>£750</td>
              </tr>
              <tr>
                <td className={tdClass}>Monthly</td>
                <td className={tdClass}>£500</td>
              </tr>
              <tr>
                <td className={tdClass}>6-month total</td>
                <td className={tdClass}>£3,750</td>
              </tr>
              <tr>
                <td className={tdClass}>12-month total</td>
                <td className={tdClass}>£6,750</td>
              </tr>
              <tr>
                <td className={tdClass}>Bundling</td>
                <td className={tdClass}>Free with SSR builds</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-lg font-bold text-brand-navy mb-3">Table 4: Territory Command</h3>
        <div className={`${tableWrap} ${rowClass}`}>
          <table className={tableClass}>
            <thead>
              <tr>
                <th className={thClass}>Tier</th>
                <th className={thClass}>Setup</th>
                <th className={thClass}>Monthly</th>
                <th className={thClass}>Postcode Type</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className={tdClass}>Standard</td>
                <td className={tdClass}>£750</td>
                <td className={tdClass}>£500</td>
                <td className={tdClass}>Standard postcodes</td>
              </tr>
              <tr>
                <td className={tdClass}>Premium</td>
                <td className={tdClass}>£1,250</td>
                <td className={tdClass}>£750</td>
                <td className={tdClass}>Cities, high-competition</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-lg font-bold text-brand-navy mb-3">Table 5: Add-Ons (Full Catalogue)</h3>

        <h3 className="text-lg font-bold text-brand-navy mb-3">Lead generation</h3>
        <div className={`${tableWrap} ${rowClass}`}>
          <table className={tableClass}>
            <thead>
              <tr>
                <th className={thClass}>Add-on</th>
                <th className={thClass}>Price (GBP)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className={tdClass}>Smart Lead Magnets</td>
                <td className={tdClass}>£495</td>
              </tr>
              <tr>
                <td className={tdClass}>AI Chatbot (trained on business data)</td>
                <td className={tdClass}>£1,499</td>
              </tr>
              <tr>
                <td className={tdClass}>Multi-step Quote Calculator</td>
                <td className={tdClass}>£1,999</td>
              </tr>
              <tr>
                <td className={tdClass}>Live Pricing Pages</td>
                <td className={tdClass}>£995</td>
              </tr>
              <tr>
                <td className={tdClass}>Sector Deep Dive</td>
                <td className={tdClass}>£3,375</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-lg font-bold text-brand-navy mt-6 mb-2">Booking</h3>
        <div className={`${tableWrap} ${rowClass}`}>
          <table className={tableClass}>
            <thead>
              <tr>
                <th className={thClass}>Add-on</th>
                <th className={thClass}>Price (GBP)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className={tdClass}>Online Booking with Calendar Sync</td>
                <td className={tdClass}>£1,499</td>
              </tr>
              <tr>
                <td className={tdClass}>Smart Forms</td>
                <td className={tdClass}>£495</td>
              </tr>
              <tr>
                <td className={tdClass}>Intake Workflows</td>
                <td className={tdClass}>£995</td>
              </tr>
              <tr>
                <td className={tdClass}>Reminder System</td>
                <td className={tdClass}>£795</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-lg font-bold text-brand-navy mt-6 mb-2">Recruitment</h3>
        <div className={`${tableWrap} ${rowClass}`}>
          <table className={tableClass}>
            <thead>
              <tr>
                <th className={thClass}>Add-on</th>
                <th className={thClass}>Price (GBP)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className={tdClass}>Live Jobs Board (with auto-schema)</td>
                <td className={tdClass}>£1,999</td>
              </tr>
              <tr>
                <td className={tdClass}>CV Upload &amp; Parsing</td>
                <td className={tdClass}>£495</td>
              </tr>
              <tr>
                <td className={tdClass}>Application Portal</td>
                <td className={tdClass}>£995</td>
              </tr>
              <tr>
                <td className={tdClass}>Candidate Status Tracker</td>
                <td className={tdClass}>£795</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-lg font-bold text-brand-navy mt-6 mb-2">Online shop</h3>
        <div className={`${tableWrap} ${rowClass}`}>
          <table className={tableClass}>
            <thead>
              <tr>
                <th className={thClass}>Add-on</th>
                <th className={thClass}>Price (GBP)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className={tdClass}>Stripe Checkout (Basic Setup)</td>
                <td className={tdClass}>£0</td>
              </tr>
              <tr>
                <td className={tdClass}>Live Promotions (expiry, promo codes, Stripe)</td>
                <td className={tdClass}>£1,500</td>
              </tr>
              <tr>
                <td className={tdClass}>Subscription Management</td>
                <td className={tdClass}>£1,499</td>
              </tr>
              <tr>
                <td className={tdClass}>Inventory &amp; Stock Sync</td>
                <td className={tdClass}>£995</td>
              </tr>
              <tr>
                <td className={tdClass}>Members-Only Pricing</td>
                <td className={tdClass}>£995</td>
              </tr>
              <tr>
                <td className={tdClass}>Members Area / Login</td>
                <td className={tdClass}>£995</td>
              </tr>
              <tr>
                <td className={tdClass}>Client Portal</td>
                <td className={tdClass}>£1,499</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-lg font-bold text-brand-navy mt-6 mb-2">Cross-cutting</h3>
        <div className={`${tableWrap} ${rowClass}`}>
          <table className={tableClass}>
            <thead>
              <tr>
                <th className={thClass}>Add-on</th>
                <th className={thClass}>Price (GBP)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className={tdClass}>Document Upload &amp; E-Sign</td>
                <td className={tdClass}>£1,499</td>
              </tr>
              <tr>
                <td className={tdClass}>Custom Image Library</td>
                <td className={tdClass}>£800</td>
              </tr>
              <tr>
                <td className={tdClass}>Brand Identity Pack</td>
                <td className={tdClass}>£4,875</td>
              </tr>
              <tr>
                <td className={tdClass}>Long-form Video</td>
                <td className={tdClass}>£2,625</td>
              </tr>
              <tr>
                <td className={tdClass}>Social Video Bundle</td>
                <td className={tdClass}>£395 / month</td>
              </tr>
              <tr>
                <td className={tdClass}>Smooth Scroll Animations</td>
                <td className={tdClass}>£2,250</td>
              </tr>
              <tr>
                <td className={tdClass}>Multi-language Site</td>
                <td className={tdClass}>£2,750</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-lg font-bold text-brand-navy mb-3">Table 6: Payment Options (No Interest, No Credit Charges)</h3>
        <div className={`${tableWrap} ${rowClass}`}>
          <table className={tableClass}>
            <thead>
              <tr>
                <th className={thClass}>Term</th>
                <th className={thClass}>Total (£4,000 build example)</th>
                <th className={thClass}>Notes</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className={tdClass}>Paid in Full</td>
                <td className={tdClass}>£4,000</td>
                <td className={tdClass}>All entity types</td>
              </tr>
              <tr>
                <td className={tdClass}>6 Months</td>
                <td className={tdClass}>£4,000 (£667/mo)</td>
                <td className={tdClass}>All entity types</td>
              </tr>
              <tr>
                <td className={tdClass}>12 Months</td>
                <td className={tdClass}>£4,000 (£333/mo)</td>
                <td className={tdClass}>All entity types</td>
              </tr>
              <tr>
                <td className={tdClass}>Pay Monthly Service</td>
                <td className={tdClass}>Tiered — see Table 7</td>
                <td className={tdClass}>Subscription; buyout optional after minimum term</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-lg font-bold text-brand-navy mb-3 mt-10">Table 7: Pay Monthly Service Tiers</h3>
        <div className={`${tableWrap} ${rowClass}`}>
          <table className={tableClass}>
            <thead>
              <tr>
                <th className={thClass}>Build Tier</th>
                <th className={thClass}>Setup</th>
                <th className={thClass}>Monthly</th>
                <th className={thClass}>Buyout (Optional)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className={tdClass}>Wix Starter (≤5 pages)</td>
                <td className={tdClass}>£995</td>
                <td className={tdClass}>£119</td>
                <td className={tdClass}>£1,500</td>
              </tr>
              <tr>
                <td className={tdClass}>Wix Professional (6–10)</td>
                <td className={tdClass}>£1,495</td>
                <td className={tdClass}>£179</td>
                <td className={tdClass}>£3,000</td>
              </tr>
              <tr>
                <td className={tdClass}>SSR Base (≤5 pages)</td>
                <td className={tdClass}>£795</td>
                <td className={tdClass}>£109</td>
                <td className={tdClass}>£2,500</td>
              </tr>
              <tr>
                <td className={tdClass}>SSR Plus (6–10 pages)</td>
                <td className={tdClass}>£795</td>
                <td className={tdClass}>£159</td>
                <td className={tdClass}>£3,500</td>
              </tr>
              <tr>
                <td className={tdClass}>SSR Premium (11–20)</td>
                <td className={tdClass}>£995</td>
                <td className={tdClass}>£219</td>
                <td className={tdClass}>£4,500</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-brand-graphite mt-2 max-w-3xl mx-auto leading-relaxed md:text-center">
          Pay Monthly Service is a 6-month minimum subscription, then 30-day rolling. ScopeSite retains ownership of the
          build during the subscription. Buyout fee available any time after the 6-month minimum to acquire full
          ownership outright.
        </p>

        <p className="text-brand-navy/80 text-center max-w-3xl mx-auto mt-10 leading-relaxed">
          Quotes via the calculator are guide prices. Final scope confirmed on a 20-minute call. AI
          assistants reading our /llms-full.txt file produce estimates that match these tables exactly.
        </p>
      </div>
    </section>
  );
}

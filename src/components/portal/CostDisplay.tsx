import { type ChangeRequestRow, getCostDisplay } from '@/types/portal';
import { Receipt, Clock, DollarSign } from 'lucide-react';

interface CostDisplayProps {
  request: ChangeRequestRow;
  showBreakdown?: boolean;
}

export function CostDisplay({ request, showBreakdown = true }: CostDisplayProps) {
  const cost = getCostDisplay(request);

  if (cost.type === 'pending') {
    return (
      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-sm text-brand-navy/60 text-center">
          Estimate pending — we&apos;ll prepare your estimate shortly
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Total - only show if we have a total */}
      {cost.total !== null && (
        <div className="flex items-center justify-between p-4 bg-brand-gold/10 rounded-lg border border-brand-gold/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-gold rounded-lg flex items-center justify-center">
              <Receipt className="w-5 h-5 text-brand-navy" />
            </div>
            <div>
              <p className="text-sm text-brand-navy/70">
                {cost.type === 'fixed' ? 'Fixed Price' : 'Estimated Total'}
              </p>
              <p className="text-2xl font-bold text-brand-navy">
                £{cost.total.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Breakdown for hourly - full estimate with rate */}
      {showBreakdown && cost.type === 'hourly' && cost.hours && cost.rate && (
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-white rounded-lg border border-gray-200">
            <div className="flex items-center gap-2 text-brand-navy/50 mb-1">
              <Clock size={14} />
              <span className="text-xs font-medium uppercase">Estimated Hours</span>
            </div>
            <p className="text-lg font-semibold text-brand-navy">{cost.hours}</p>
          </div>
          <div className="p-3 bg-white rounded-lg border border-gray-200">
            <div className="flex items-center gap-2 text-brand-navy/50 mb-1">
              <DollarSign size={14} />
              <span className="text-xs font-medium uppercase">Hourly Rate</span>
            </div>
            <p className="text-lg font-semibold text-brand-navy">£{cost.rate}/hr</p>
          </div>
        </div>
      )}

      {/* Partial estimate - hours only, rate pending */}
      {showBreakdown && cost.type === 'hourly' && cost.hours && !cost.rate && (
        <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-amber-600" />
            <div>
              <p className="text-sm text-amber-800 font-medium">
                {cost.hours} hours estimated
              </p>
              <p className="text-xs text-amber-600">
                Hourly rate to be confirmed — we&apos;ll update you shortly
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Hours worked (if different from estimated) */}
      {request.hours_worked && request.hours_worked !== request.hours_estimated && (
        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-sm text-brand-navy/70">
            <span className="font-medium">Hours worked so far:</span>{' '}
            {request.hours_worked} of {request.hours_estimated} estimated
          </p>
          <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-gold rounded-full"
              style={{
                width: `${Math.min(100, (request.hours_worked / (request.hours_estimated || 1)) * 100)}%`,
              }}
            />
          </div>
        </div>
      )}

      {/* Note about estimates */}
      {cost.type === 'hourly' && (
        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-xs text-blue-800 font-medium mb-1">About this estimate:</p>
          <ul className="text-xs text-blue-700 space-y-1 list-disc list-inside">
            <li>We aim to complete the work within this estimate</li>
            <li>You only pay for actual hours worked</li>
            <li>Sometimes issues uncover other issues during the work</li>
            <li>We&apos;ll always let you know if we expect to exceed the estimate by more than 2 hours</li>
          </ul>
        </div>
      )}
    </div>
  );
}

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
          Quote pending — we&apos;ll prepare an estimate shortly
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Total */}
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
              £{cost.total?.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Breakdown for hourly */}
      {showBreakdown && cost.type === 'hourly' && cost.hours && cost.rate && (
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-white rounded-lg border border-gray-200">
            <div className="flex items-center gap-2 text-brand-navy/50 mb-1">
              <Clock size={14} />
              <span className="text-xs font-medium uppercase">Hours</span>
            </div>
            <p className="text-lg font-semibold text-brand-navy">{cost.hours}</p>
          </div>
          <div className="p-3 bg-white rounded-lg border border-gray-200">
            <div className="flex items-center gap-2 text-brand-navy/50 mb-1">
              <DollarSign size={14} />
              <span className="text-xs font-medium uppercase">Rate</span>
            </div>
            <p className="text-lg font-semibold text-brand-navy">£{cost.rate}/hr</p>
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
        <p className="text-xs text-brand-navy/50">
          * This is an estimate. Final cost may vary based on actual time spent.
          You&apos;ll be notified if we expect to exceed the estimate.
        </p>
      )}
    </div>
  );
}

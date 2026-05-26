import Link from 'next/link';
import { ArrowRight, Phone } from 'lucide-react';

interface SmsOptInBannerProps {
  show: boolean;
  variant?: 'default' | 'compact';
}

export function SmsOptInBanner({ show, variant = 'default' }: SmsOptInBannerProps) {
  if (!show) {
    return null;
  }

  if (variant === 'compact') {
    return (
      <p className="text-sm text-brand-navy/70">
        Want text updates on your requests?{' '}
        <Link
          href="/portal/settings?sms=setup"
          className="font-medium text-brand-gold-accessible hover:text-brand-orange-accessible"
        >
          Set up SMS in Settings
        </Link>
      </p>
    );
  }

  return (
    <div className="bg-brand-gold/10 border border-brand-gold/40 rounded-xl p-4">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-brand-gold rounded-full flex items-center justify-center shrink-0">
          <Phone className="w-5 h-5 text-brand-navy" />
        </div>
        <div>
          <h2 className="font-semibold text-brand-navy">Optional SMS updates</h2>
          <p className="text-sm text-brand-navy/70 mt-1">
            Add your mobile number to get a short text when your request status changes (in
            progress, awaiting info, completed). You can turn this off anytime in Settings.
          </p>
          <Link
            href="/portal/settings?sms=setup"
            className="inline-flex items-center gap-1 text-sm font-medium text-brand-gold-accessible mt-2 hover:text-brand-orange-accessible"
          >
            Set up SMS notifications <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}

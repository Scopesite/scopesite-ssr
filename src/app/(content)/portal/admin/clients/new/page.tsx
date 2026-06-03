'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, UserPlus, Loader2, Send } from 'lucide-react';

export default function NewClientPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sendInvite, setSendInvite] = useState(true);

  const [formData, setFormData] = useState({
    company_name: '',
    primary_contact_name: '',
    email: '',
    phone: '',
    hourly_rate: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/portal/admin/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          hourly_rate: formData.hourly_rate ? parseInt(formData.hourly_rate) : null,
          send_invite: sendInvite,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create client');
      }

      router.push(`/portal/admin/clients/${data.data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/portal/admin/clients"
          className="inline-flex items-center gap-2 text-sm text-brand-navy/60 hover:text-brand-navy mb-4"
        >
          <ArrowLeft size={16} /> Back to clients
        </Link>
        <h1 className="text-2xl font-bold text-brand-navy">Add New Client</h1>
        <p className="text-brand-navy/60 mt-1">
          Create a new client and optionally send them a portal invitation
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
          {/* Company name */}
          <div>
            <label htmlFor="company_name" className="block text-sm font-medium text-brand-navy mb-2">
              Company Name *
            </label>
            <input
              type="text"
              id="company_name"
              required
              placeholder="Acme Ltd"
              value={formData.company_name}
              onChange={(e) => setFormData((prev) => ({ ...prev, company_name: e.target.value }))}
              className="input-brand"
            />
          </div>

          {/* Contact name */}
          <div>
            <label htmlFor="primary_contact_name" className="block text-sm font-medium text-brand-navy mb-2">
              Primary Contact Name *
            </label>
            <input
              type="text"
              id="primary_contact_name"
              required
              placeholder="John Smith"
              value={formData.primary_contact_name}
              onChange={(e) => setFormData((prev) => ({ ...prev, primary_contact_name: e.target.value }))}
              className="input-brand"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-brand-navy mb-2">
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              required
              placeholder="john@acme.com"
              value={formData.email}
              onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
              className="input-brand"
            />
            <p className="text-xs text-brand-navy/50 mt-1">
              This email will be used to log into the portal
            </p>
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-brand-navy mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              placeholder="07123 456789"
              value={formData.phone}
              onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
              className="input-brand"
            />
          </div>

          {/* Hourly rate */}
          <div>
            <label htmlFor="hourly_rate" className="block text-sm font-medium text-brand-navy mb-2">
              Default Hourly Rate (£)
            </label>
            <select
              id="hourly_rate"
              value={formData.hourly_rate}
              onChange={(e) => setFormData((prev) => ({ ...prev, hourly_rate: e.target.value }))}
              className="input-brand"
            >
              <option value="">Select rate...</option>
              <option value="45">£45/hr - Basic</option>
              <option value="60">£60/hr - Standard</option>
              <option value="90">£90/hr - Advanced</option>
              <option value="120">£120/hr - Premium</option>
              <option value="200">£200/hr - Enterprise</option>
            </select>
          </div>
        </div>

        {/* Send invite checkbox */}
        <div className="bg-brand-navy/5 rounded-xl p-4">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={sendInvite}
              onChange={(e) => setSendInvite(e.target.checked)}
              className="mt-1 w-4 h-4 rounded border-brand-navy/30 text-brand-gold focus:ring-brand-gold"
            />
            <div>
              <p className="font-medium text-brand-navy">Send portal invitation</p>
              <p className="text-sm text-brand-navy/60 mt-0.5">
                The client will receive an email with instructions to create their portal account
              </p>
            </div>
          </label>
        </div>

        {/* Error message */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Submit button */}
        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={isSubmitting || !formData.company_name || !formData.primary_contact_name || !formData.email}
            className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <UserPlus size={20} />
                Create Client
                {sendInvite && <Send size={16} className="ml-1" />}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

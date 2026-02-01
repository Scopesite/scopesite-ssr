'use client';

/**
 * Client Edit Panel Component
 * 
 * A slide-over panel for editing client details.
 * Opens from the right side of the screen.
 */

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { X, Loader2, Save, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ClientRow } from '@/types/portal';

interface ClientEditPanelProps {
  client: ClientRow;
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  company_name: string;
  primary_contact_name: string;
  email: string;
  phone: string;
  hourly_rate: string;
  status: string;
}

export function ClientEditPanel({ client, isOpen, onClose }: ClientEditPanelProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    company_name: client.company_name,
    primary_contact_name: client.primary_contact_name,
    email: client.email,
    phone: client.phone || '',
    hourly_rate: client.hourly_rate?.toString() || '',
    status: client.status,
  });

  // Reset form when client changes
  useEffect(() => {
    setFormData({
      company_name: client.company_name,
      primary_contact_name: client.primary_contact_name,
      email: client.email,
      phone: client.phone || '',
      hourly_rate: client.hourly_rate?.toString() || '',
      status: client.status,
    });
    setError(null);
    setSuccess(false);
  }, [client]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when panel is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch(`/api/portal/admin/clients/${client.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company_name: formData.company_name,
          primary_contact_name: formData.primary_contact_name,
          email: formData.email,
          phone: formData.phone || null,
          hourly_rate: formData.hourly_rate ? parseInt(formData.hourly_rate) : null,
          status: formData.status,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update client');
      }

      setSuccess(true);
      
      // Refresh the page data
      router.refresh();

      // Close panel after brief success message
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = useCallback((field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
    setSuccess(false);
  }, []);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className={cn(
          'fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-xl z-50',
          'transform transition-transform duration-300 ease-out',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-panel-title"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div>
              <h2 id="edit-panel-title" className="text-lg font-semibold text-brand-navy">
                Edit Client
              </h2>
              <p className="text-sm text-brand-navy/50">{client.company_name}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-brand-navy/50 hover:text-brand-navy hover:bg-gray-200 rounded-lg transition-colors"
              aria-label="Close panel"
            >
              <X size={20} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Company Name */}
            <div>
              <label htmlFor="company_name" className="block text-sm font-medium text-brand-navy mb-2">
                Company Name *
              </label>
              <input
                type="text"
                id="company_name"
                required
                value={formData.company_name}
                onChange={(e) => handleInputChange('company_name', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-brand-gold transition-colors"
              />
            </div>

            {/* Primary Contact Name */}
            <div>
              <label htmlFor="primary_contact_name" className="block text-sm font-medium text-brand-navy mb-2">
                Primary Contact Name *
              </label>
              <input
                type="text"
                id="primary_contact_name"
                required
                value={formData.primary_contact_name}
                onChange={(e) => handleInputChange('primary_contact_name', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-brand-gold transition-colors"
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
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-brand-gold transition-colors"
              />
              <p className="text-xs text-brand-navy/50 mt-1">
                Used for portal login
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
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="07123 456789"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-brand-gold transition-colors"
              />
            </div>

            {/* Hourly Rate */}
            <div>
              <label htmlFor="hourly_rate" className="block text-sm font-medium text-brand-navy mb-2">
                Default Hourly Rate
              </label>
              <select
                id="hourly_rate"
                value={formData.hourly_rate}
                onChange={(e) => handleInputChange('hourly_rate', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-brand-gold transition-colors"
              >
                <option value="">Not set</option>
                <option value="45">£45/hr - Basic</option>
                <option value="60">£60/hr - Standard</option>
                <option value="90">£90/hr - Advanced</option>
                <option value="120">£120/hr - Premium</option>
                <option value="200">£200/hr - Enterprise</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-brand-navy mb-2">
                Status
              </label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-brand-gold transition-colors"
              >
                <option value="pending_invite">Pending Invite</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            {/* Error message */}
            {error && (
              <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            {/* Success message */}
            {success && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                Client updated successfully!
              </div>
            )}
          </form>

          {/* Footer */}
          <div className="flex items-center gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2.5 border border-gray-300 text-brand-navy rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={isSubmitting || !formData.company_name || !formData.primary_contact_name || !formData.email}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-gold text-brand-navy font-medium rounded-lg hover:bg-brand-gold/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

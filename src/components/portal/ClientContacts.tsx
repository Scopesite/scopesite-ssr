'use client';

/**
 * Client Contacts Component
 * 
 * Displays and manages multiple contacts for a client.
 */

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Users, 
  Plus, 
  Pencil, 
  Trash2, 
  Star, 
  Mail, 
  Phone, 
  X,
  Loader2,
  Check
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ClientContactRow } from '@/types/portal';

interface ClientContactsProps {
  clientId: string;
  contacts: ClientContactRow[];
}

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  role: string;
  is_primary: boolean;
  can_access_portal: boolean;
  notes: string;
}

const emptyFormData: ContactFormData = {
  name: '',
  email: '',
  phone: '',
  role: '',
  is_primary: false,
  can_access_portal: false,
  notes: '',
};

export function ClientContacts({ clientId, contacts }: ClientContactsProps) {
  const router = useRouter();
  const [isAddingContact, setIsAddingContact] = useState(false);
  const [editingContactId, setEditingContactId] = useState<string | null>(null);
  const [formData, setFormData] = useState<ContactFormData>(emptyFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const resetForm = useCallback(() => {
    setFormData(emptyFormData);
    setIsAddingContact(false);
    setEditingContactId(null);
    setError(null);
  }, []);

  const startEditing = useCallback((contact: ClientContactRow) => {
    setFormData({
      name: contact.name,
      email: contact.email || '',
      phone: contact.phone || '',
      role: contact.role || '',
      is_primary: contact.is_primary,
      can_access_portal: contact.can_access_portal,
      notes: contact.notes || '',
    });
    setEditingContactId(contact.id);
    setIsAddingContact(false);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const url = editingContactId 
        ? `/api/portal/admin/contacts/${editingContactId}`
        : '/api/portal/admin/contacts';
      
      const method = editingContactId ? 'PATCH' : 'POST';
      
      const body = editingContactId
        ? formData
        : { ...formData, client_id: clientId };

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save contact');
      }

      resetForm();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (contactId: string) => {
    if (!confirm('Are you sure you want to delete this contact?')) return;

    setDeletingId(contactId);
    setError(null);

    try {
      const response = await fetch(`/api/portal/admin/contacts/${contactId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete contact');
      }

      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setDeletingId(null);
    }
  };

  const handleInputChange = useCallback((field: keyof ContactFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
  }, []);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-brand-navy/40" />
          <h3 className="font-semibold text-brand-navy">Contacts</h3>
          <span className="text-sm text-brand-navy/40">({contacts.length})</span>
        </div>
        {!isAddingContact && !editingContactId && (
          <button
            onClick={() => {
              setFormData(emptyFormData);
              setIsAddingContact(true);
            }}
            className="flex items-center gap-1 text-sm text-brand-gold-accessible hover:text-brand-orange-accessible font-medium transition-colors"
          >
            <Plus size={16} /> Add
          </button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Add/Edit Form */}
      {(isAddingContact || editingContactId) && (
        <form onSubmit={handleSubmit} className="mb-4 p-4 bg-gray-50 rounded-lg space-y-3">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-brand-navy text-sm">
              {editingContactId ? 'Edit Contact' : 'New Contact'}
            </h4>
            <button
              type="button"
              onClick={resetForm}
              className="p-1 text-brand-navy/50 hover:text-brand-navy rounded transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <input
                type="text"
                placeholder="Name *"
                required
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-brand-gold"
              />
            </div>
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-brand-gold"
            />
            <input
              type="tel"
              placeholder="Phone"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-brand-gold"
            />
            <input
              type="text"
              placeholder="Role (e.g. CEO, Developer)"
              value={formData.role}
              onChange={(e) => handleInputChange('role', e.target.value)}
              className="col-span-2 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-brand-gold"
            />
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm text-brand-navy cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_primary}
                onChange={(e) => handleInputChange('is_primary', e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-brand-gold focus:ring-brand-gold"
              />
              Primary contact
            </label>
            <label className="flex items-center gap-2 text-sm text-brand-navy cursor-pointer">
              <input
                type="checkbox"
                checked={formData.can_access_portal}
                onChange={(e) => handleInputChange('can_access_portal', e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-brand-gold focus:ring-brand-gold"
              />
              Portal access
            </label>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={resetForm}
              disabled={isSubmitting}
              className="flex-1 px-3 py-2 text-sm border border-gray-300 text-brand-navy rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !formData.name.trim()}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm bg-brand-gold text-brand-navy font-medium rounded-lg hover:bg-brand-gold/90 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Check size={16} />
              )}
              {editingContactId ? 'Update' : 'Add Contact'}
            </button>
          </div>
        </form>
      )}

      {/* Contacts List */}
      {contacts.length > 0 ? (
        <div className="space-y-2">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className={cn(
                'p-3 rounded-lg border transition-colors',
                contact.is_primary 
                  ? 'bg-brand-gold/5 border-brand-gold/20' 
                  : 'bg-gray-50 border-gray-100 hover:bg-gray-100'
              )}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-brand-navy truncate">
                      {contact.name}
                    </span>
                    {contact.is_primary && (
                      <Star size={14} className="text-brand-gold fill-brand-gold shrink-0" />
                    )}
                  </div>
                  {contact.role && (
                    <p className="text-xs text-brand-navy/50 mt-0.5">{contact.role}</p>
                  )}
                  <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-brand-navy/70">
                    {contact.email && (
                      <a 
                        href={`mailto:${contact.email}`}
                        className="flex items-center gap-1 hover:text-brand-gold-accessible"
                      >
                        <Mail size={12} />
                        {contact.email}
                      </a>
                    )}
                    {contact.phone && (
                      <a 
                        href={`tel:${contact.phone}`}
                        className="flex items-center gap-1 hover:text-brand-gold-accessible"
                      >
                        <Phone size={12} />
                        {contact.phone}
                      </a>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0 ml-2">
                  <button
                    onClick={() => startEditing(contact)}
                    className="p-1.5 text-brand-navy/40 hover:text-brand-navy hover:bg-white rounded transition-colors"
                    title="Edit contact"
                  >
                    <Pencil size={14} />
                  </button>
                  {!contact.is_primary && (
                    <button
                      onClick={() => handleDelete(contact.id)}
                      disabled={deletingId === contact.id}
                      className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                      title="Delete contact"
                    >
                      {deletingId === contact.id ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <Trash2 size={14} />
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-brand-navy/40 text-sm py-4">
          No contacts added yet
        </p>
      )}
    </div>
  );
}

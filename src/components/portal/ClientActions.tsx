'use client';

/**
 * Client Actions Component
 * 
 * Contains action buttons and the edit panel for a client.
 * This is a client component to handle the panel open/close state.
 */

import { useState } from 'react';
import { Mail, Pencil, Archive } from 'lucide-react';
import { ClientEditPanel } from './ClientEditPanel';
import type { ClientRow } from '@/types/portal';

interface ClientActionsProps {
  client: ClientRow;
}

export function ClientActions({ client }: ClientActionsProps) {
  const [isEditPanelOpen, setIsEditPanelOpen] = useState(false);

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-semibold text-brand-navy mb-4">Actions</h3>
        <div className="space-y-2">
          {/* Edit Client Button */}
          <button
            onClick={() => setIsEditPanelOpen(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-brand-gold text-brand-navy font-medium rounded-lg hover:bg-brand-gold/90 transition-colors"
          >
            <Pencil size={16} /> Edit Client
          </button>

          {/* Send Email */}
          <a
            href={`mailto:${client.email}`}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-brand-navy text-white rounded-lg hover:bg-brand-graphite transition-colors"
          >
            <Mail size={16} /> Send Email
          </a>

          {/* Resend Invitation (only for pending) */}
          {client.status === 'pending_invite' && (
            <button
              className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-brand-gold text-brand-gold-accessible rounded-lg hover:bg-brand-gold/5 transition-colors"
            >
              Resend Invitation
            </button>
          )}
        </div>
      </div>

      {/* Edit Panel */}
      <ClientEditPanel
        client={client}
        isOpen={isEditPanelOpen}
        onClose={() => setIsEditPanelOpen(false)}
      />
    </>
  );
}

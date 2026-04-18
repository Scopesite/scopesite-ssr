'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import type { SectorTile } from '@/lib/territory/types';

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSelect: (sector: SectorTile) => void;
  /** Pre-fetched on the server from getAllSectorsForBrowse(). */
  groups: Record<string, SectorTile[]>;
}

export function SectorBrowseModal({ open, onOpenChange, onSelect, groups }: Props) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/70 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed inset-x-4 top-1/2 z-50 -translate-y-1/2 max-h-[85vh] overflow-y-auto rounded-2xl bg-white p-6 sm:p-8 shadow-xl sm:left-1/2 sm:right-auto sm:-translate-x-1/2 sm:w-full sm:max-w-4xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0">
          <div className="flex items-start justify-between mb-6">
            <div>
              <Dialog.Title className="font-headline text-2xl sm:text-3xl text-brand-navy">
                Browse all industries
              </Dialog.Title>
              <Dialog.Description className="text-sm text-slate-600 mt-1">
                Choose your industry to check availability. Not-yet-live sectors are greyed out.
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <button
                type="button"
                aria-label="Close"
                className="rounded-md p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
              >
                <X className="h-5 w-5" />
              </button>
            </Dialog.Close>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Object.entries(groups).map(([category, sectors]) => (
              <div key={category}>
                <h3 className="font-headline text-sm uppercase tracking-wide text-brand-navy mb-2">
                  {category}
                </h3>
                <ul className="space-y-1">
                  {sectors.map((s) => (
                    <li key={s.id}>
                      <button
                        type="button"
                        onClick={() => {
                          onSelect(s);
                          onOpenChange(false);
                        }}
                        className={[
                          'w-full text-left px-2 py-1.5 rounded-md text-sm transition-colors',
                          s.isActive
                            ? 'text-slate-800 hover:bg-brand-gold/10 hover:text-brand-navy'
                            : 'text-slate-500 hover:bg-slate-100',
                        ].join(' ')}
                      >
                        <span>{s.label}</span>
                        {s.isActive && s.availableCount > 0 ? (
                          <span className="ml-2 text-xs text-brand-gold-accessible font-semibold">
                            {s.availableCount} available
                          </span>
                        ) : !s.isActive ? (
                          <span className="ml-2 text-xs text-slate-400">not yet live</span>
                        ) : null}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default SectorBrowseModal;

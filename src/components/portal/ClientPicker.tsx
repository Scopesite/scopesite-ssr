'use client';

import { useCallback, useEffect, useState } from 'react';
import { Search, Loader2 } from 'lucide-react';

export interface ClientPickerOption {
  id: string;
  company_name: string;
  primary_contact_name: string;
  email: string;
}

interface ClientPickerProps {
  value: string | null;
  onChange: (clientId: string | null, client: ClientPickerOption | null) => void;
}

export function ClientPicker({ value, onChange }: ClientPickerProps) {
  const [query, setQuery] = useState('');
  const [options, setOptions] = useState<ClientPickerOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);

  const fetchClients = useCallback(async (searchQuery: string) => {
    setIsLoading(true);
    try {
      const params = searchQuery ? `?q=${encodeURIComponent(searchQuery)}` : '';
      const res = await fetch(`/api/portal/admin/clients/search${params}`);
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setOptions(json.data as ClientPickerOption[]);
      }
    } catch {
      setOptions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchClients('');
  }, [fetchClients]);

  useEffect(() => {
    const timer = setTimeout(() => {
      void fetchClients(query);
    }, 250);
    return () => clearTimeout(timer);
  }, [query, fetchClients]);

  const handleSelect = (client: ClientPickerOption) => {
    onChange(client.id, client);
    setSelectedLabel(`${client.company_name} (${client.primary_contact_name})`);
    setQuery('');
    setOptions([]);
  };

  return (
    <div className="space-y-2">
      <label htmlFor="client-picker" className="block text-sm font-medium text-brand-navy">
        On behalf of client *
      </label>
      <p className="text-xs text-brand-navy/60">
        Select the client account this request will be filed under.
      </p>

      {value && selectedLabel ? (
        <div className="flex items-center justify-between gap-3 p-3 rounded-lg border-2 border-brand-gold bg-brand-gold/5">
          <span className="text-sm font-medium text-brand-navy">{selectedLabel}</span>
          <button
            type="button"
            className="text-xs text-brand-navy/60 hover:text-brand-navy underline"
            onClick={() => {
              onChange(null, null);
              setSelectedLabel(null);
              void fetchClients('');
            }}
          >
            Change
          </button>
        </div>
      ) : (
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-navy/40"
            aria-hidden
          />
          <input
            id="client-picker"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by company, contact, or email..."
            className="input-brand pl-10"
            autoComplete="off"
          />
          {isLoading && (
            <Loader2
              className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-brand-gold"
              aria-hidden
            />
          )}
          {options.length > 0 && !value && (
            <ul
              className="absolute z-10 mt-1 w-full max-h-48 overflow-auto bg-white border border-gray-200 rounded-lg shadow-lg"
              role="listbox"
            >
              {options.map((client) => (
                <li key={client.id}>
                  <button
                    type="button"
                    role="option"
                    className="w-full text-left px-4 py-3 hover:bg-brand-gold/10 transition-colors"
                    onClick={() => handleSelect(client)}
                  >
                    <p className="text-sm font-medium text-brand-navy">{client.company_name}</p>
                    <p className="text-xs text-brand-navy/60">
                      {client.primary_contact_name} · {client.email}
                    </p>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

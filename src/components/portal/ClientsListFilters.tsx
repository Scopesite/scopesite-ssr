'use client';

/**
 * Clients List with Search, Filter, and Bulk Actions
 * 
 * Client component for filtering and managing the clients list.
 */

import { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Plus, Users, Filter, X, Download, Archive, Mail, Loader2, CheckSquare, Square, MinusSquare } from 'lucide-react';
import type { ClientRow, ClientStatus } from '@/types/portal';

interface ClientWithStats extends ClientRow {
  totalRequests: number;
  openRequests: number;
}

interface ClientsListFiltersProps {
  clients: ClientWithStats[];
}

const STATUS_OPTIONS: { value: ClientStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All Statuses' },
  { value: 'active', label: 'Active' },
  { value: 'pending_invite', label: 'Pending Invite' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'archived', label: 'Archived' },
];

const RATE_OPTIONS: { value: string; label: string }[] = [
  { value: 'all', label: 'All Rates' },
  { value: '45', label: '£45/hr' },
  { value: '60', label: '£60/hr' },
  { value: '90', label: '£90/hr' },
  { value: '120', label: '£120/hr' },
  { value: '200', label: '£200/hr' },
  { value: 'none', label: 'No rate set' },
];

export function ClientsListFilters({ clients }: ClientsListFiltersProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ClientStatus | 'all'>('all');
  const [rateFilter, setRateFilter] = useState('all');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isArchiving, setIsArchiving] = useState(false);

  // Filter clients based on search and filters
  const filteredClients = useMemo(() => {
    return clients.filter(client => {
      // Exclude archived by default unless specifically filtering for them
      if (statusFilter === 'all' && client.status === 'archived') {
        return false;
      }

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
          client.company_name.toLowerCase().includes(query) ||
          client.primary_contact_name.toLowerCase().includes(query) ||
          client.email.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      // Status filter
      if (statusFilter !== 'all' && client.status !== statusFilter) {
        return false;
      }

      // Rate filter
      if (rateFilter !== 'all') {
        if (rateFilter === 'none') {
          if (client.hourly_rate !== null) return false;
        } else {
          if (client.hourly_rate !== parseInt(rateFilter)) return false;
        }
      }

      return true;
    });
  }, [clients, searchQuery, statusFilter, rateFilter]);

  const hasActiveFilters = searchQuery || statusFilter !== 'all' || rateFilter !== 'all';

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setRateFilter('all');
  };

  // Selection handlers
  const toggleSelectAll = useCallback(() => {
    if (selectedIds.size === filteredClients.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredClients.map(c => c.id)));
    }
  }, [filteredClients, selectedIds.size]);

  const toggleSelect = useCallback((id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  // Export to CSV
  const handleExportCSV = useCallback(() => {
    const selectedClients = filteredClients.filter(c => selectedIds.has(c.id));
    
    const headers = ['Company', 'Contact', 'Email', 'Phone', 'Hourly Rate', 'Status', 'Open Requests', 'Total Requests'];
    const rows = selectedClients.map(c => [
      c.company_name,
      c.primary_contact_name,
      c.email,
      c.phone || '',
      c.hourly_rate ? `£${c.hourly_rate}/hr` : '',
      c.status,
      c.openRequests.toString(),
      c.totalRequests.toString(),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `clients-export-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    
    clearSelection();
  }, [filteredClients, selectedIds, clearSelection]);

  // Bulk archive
  const handleBulkArchive = useCallback(async () => {
    if (!confirm(`Archive ${selectedIds.size} client(s)? They will be hidden from the main list but can be restored later.`)) {
      return;
    }

    setIsArchiving(true);
    
    try {
      const promises = Array.from(selectedIds).map(id =>
        fetch(`/api/portal/admin/clients/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'archived' }),
        })
      );

      await Promise.all(promises);
      clearSelection();
      router.refresh();
    } catch (error) {
      console.error('Failed to archive clients:', error);
      alert('Failed to archive some clients. Please try again.');
    } finally {
      setIsArchiving(false);
    }
  }, [selectedIds, clearSelection, router]);

  // Bulk email (opens default mail client)
  const handleBulkEmail = useCallback(() => {
    const selectedClients = filteredClients.filter(c => selectedIds.has(c.id));
    const emails = selectedClients.map(c => c.email).join(',');
    window.location.href = `mailto:${emails}`;
  }, [filteredClients, selectedIds]);

  const selectAllState = useMemo(() => {
    if (selectedIds.size === 0) return 'none';
    if (selectedIds.size === filteredClients.length) return 'all';
    return 'some';
  }, [selectedIds.size, filteredClients.length]);

  const getStatusBadgeClasses = (status: ClientStatus) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700';
      case 'pending_invite':
        return 'bg-yellow-100 text-yellow-700';
      case 'archived':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status: ClientStatus) => {
    switch (status) {
      case 'pending_invite':
        return 'Pending Invite';
      case 'archived':
        return 'Archived';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-navy">Clients</h1>
          <p className="text-brand-navy/60 mt-1">
            {filteredClients.length} of {clients.filter(c => c.status !== 'archived').length} client{clients.filter(c => c.status !== 'archived').length !== 1 ? 's' : ''}
            {hasActiveFilters && ' (filtered)'}
          </p>
        </div>
        <Link
          href="/portal/admin/clients/new"
          className="btn-primary inline-flex items-center gap-2 self-start"
        >
          <Plus size={20} /> Add Client
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-navy/40" />
          <input
            type="text"
            placeholder="Search by company, contact, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-brand-gold transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-brand-navy/40 hover:text-brand-navy rounded transition-colors"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as ClientStatus | 'all')}
          className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-brand-gold bg-white min-w-[160px]"
        >
          {STATUS_OPTIONS.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* Rate Filter */}
        <select
          value={rateFilter}
          onChange={(e) => setRateFilter(e.target.value)}
          className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-brand-gold bg-white min-w-[140px]"
        >
          {RATE_OPTIONS.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1.5 px-4 py-2.5 text-brand-navy/60 hover:text-brand-navy border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Filter size={16} />
            Clear
          </button>
        )}
      </div>

      {/* Bulk Actions Bar */}
      {selectedIds.size > 0 && (
        <div className="flex items-center justify-between p-3 bg-brand-navy/5 rounded-lg border border-brand-navy/10">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-brand-navy">
              {selectedIds.size} selected
            </span>
            <button
              onClick={clearSelection}
              className="text-sm text-brand-navy/60 hover:text-brand-navy"
            >
              (clear)
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-brand-navy hover:bg-white rounded-lg transition-colors"
            >
              <Download size={16} />
              Export CSV
            </button>
            <button
              onClick={handleBulkEmail}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-brand-navy hover:bg-white rounded-lg transition-colors"
            >
              <Mail size={16} />
              Email All
            </button>
            <button
              onClick={handleBulkArchive}
              disabled={isArchiving}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
            >
              {isArchiving ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Archive size={16} />
              )}
              Archive
            </button>
          </div>
        </div>
      )}

      {/* Clients list */}
      {filteredClients.length > 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="w-12 px-4 py-3">
                  <button
                    onClick={toggleSelectAll}
                    className="text-brand-navy/60 hover:text-brand-navy transition-colors"
                    title={selectAllState === 'all' ? 'Deselect all' : 'Select all'}
                  >
                    {selectAllState === 'all' ? (
                      <CheckSquare size={18} />
                    ) : selectAllState === 'some' ? (
                      <MinusSquare size={18} />
                    ) : (
                      <Square size={18} />
                    )}
                  </button>
                </th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-brand-navy">Company</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-brand-navy hidden md:table-cell">Contact</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-brand-navy hidden lg:table-cell">Rate</th>
                <th className="text-center px-6 py-3 text-sm font-semibold text-brand-navy">Requests</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-brand-navy">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredClients.map((client) => (
                <tr 
                  key={client.id} 
                  className={`transition-colors ${selectedIds.has(client.id) ? 'bg-brand-gold/5' : 'hover:bg-gray-50'}`}
                >
                  <td className="px-4 py-4">
                    <button
                      onClick={() => toggleSelect(client.id)}
                      className="text-brand-navy/60 hover:text-brand-navy transition-colors"
                    >
                      {selectedIds.has(client.id) ? (
                        <CheckSquare size={18} className="text-brand-gold" />
                      ) : (
                        <Square size={18} />
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <Link href={`/portal/admin/clients/${client.id}`} className="block">
                      <p className="font-medium text-brand-navy hover:text-brand-gold-accessible">
                        {client.company_name}
                      </p>
                      <p className="text-sm text-brand-navy/50 md:hidden mt-0.5">
                        {client.primary_contact_name}
                      </p>
                    </Link>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <p className="text-sm text-brand-navy">{client.primary_contact_name}</p>
                    <p className="text-xs text-brand-navy/50">{client.email}</p>
                  </td>
                  <td className="px-6 py-4 hidden lg:table-cell">
                    {client.hourly_rate ? (
                      <span className="text-sm text-brand-navy">£{client.hourly_rate}/hr</span>
                    ) : (
                      <span className="text-sm text-brand-navy/40">Not set</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center gap-1">
                      <span className="font-medium text-brand-navy">{client.openRequests}</span>
                      <span className="text-brand-navy/40">/ {client.totalRequests}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBadgeClasses(client.status as ClientStatus)}`}>
                      {getStatusLabel(client.status as ClientStatus)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          {hasActiveFilters ? (
            <>
              <Search className="w-12 h-12 text-brand-navy/20 mx-auto mb-3" />
              <p className="text-brand-navy/60 mb-4">No clients match your filters</p>
              <button
                onClick={clearFilters}
                className="text-brand-gold-accessible hover:text-brand-orange-accessible font-medium"
              >
                Clear filters
              </button>
            </>
          ) : (
            <>
              <Users className="w-12 h-12 text-brand-navy/20 mx-auto mb-3" />
              <p className="text-brand-navy/60 mb-4">No clients yet</p>
              <Link
                href="/portal/admin/clients/new"
                className="btn-primary inline-flex items-center gap-2"
              >
                <Plus size={16} /> Add your first client
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}

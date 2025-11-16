'use client';

import type { LeadStatus } from '@/types/lead';

interface StatusFilterProps {
  value: LeadStatus | 'All';
  onChange: (value: LeadStatus | 'All') => void;
}

export function StatusFilter({ value, onChange }: StatusFilterProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as LeadStatus | 'All')}
      className="input-field w-auto min-w-[120px]"
    >
      <option value="All">All</option>
      <option value="Active">Active</option>
      <option value="Inactive">Inactive</option>
    </select>
  );
}


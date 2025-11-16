'use client';

import { Button } from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { LeadCard } from '@/components/leads/LeadCard';
import type { Lead } from '@/types/lead';

interface LeadsTableProps {
  leads: Lead[];
  onEdit?: (lead: Lead) => void;
}

export function LeadsTable({ leads, onEdit }: LeadsTableProps) {
  const { isAuthenticated } = useAuth();
  if (leads.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-text-muted text-lg">No leads found</p>
      </div>
    );
  }

  return (
    <>
      {/* Mobile view: Cards (< 640px) */}
      <div className="block sm:hidden">
        {leads.map((lead) => (
          <LeadCard
            key={lead.id}
            lead={lead}
            onEdit={onEdit}
            isAuthenticated={isAuthenticated}
          />
        ))}
      </div>

      {/* Tablet/Desktop view: Table (>= 640px) */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 bg-white rounded-lg shadow-md">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-text uppercase tracking-wider">
                Name
              </th>
              <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-semibold text-text uppercase tracking-wider">
                Company
              </th>
              <th className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-text uppercase tracking-wider">
                Email
              </th>
              <th className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-text uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 md:px-6 py-3 text-right text-xs font-semibold text-text uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {leads.map((lead) => (
              <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm font-medium text-text">
                  {lead.name}
                </td>
                <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-text-muted">
                  {lead.company}
                </td>
                <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-text-muted">
                  {lead.email}
                </td>
                <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                  <span
                    className={cn(
                      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                      lead.user_status === 'Active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    )}
                  >
                    {lead.user_status}
                  </span>
                </td>
                <td className="px-4 md:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {onEdit && (
                    <Button
                      variant="text"
                      size="sm"
                      onClick={() => onEdit(lead)}
                      disabled={!isAuthenticated}
                      className={cn(
                        'inline-flex items-center gap-1 p-0',
                        !isAuthenticated && 'cursor-not-allowed opacity-50'
                      )}
                      aria-label={`Edit ${lead.name}`}
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                      <span className="hidden md:inline">Edit</span>
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

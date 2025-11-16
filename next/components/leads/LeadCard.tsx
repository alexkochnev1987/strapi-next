'use client';

import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import type { Lead } from '@/types/lead';

interface LeadCardProps {
  lead: Lead;
  onEdit?: (lead: Lead) => void;
  isAuthenticated: boolean;
}

export function LeadCard({ lead, onEdit, isAuthenticated }: LeadCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4 border border-gray-200">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-text mb-1">{lead.name}</h3>
          <p className="text-xs text-text-muted">{lead.company}</p>
        </div>
        <span
          className={cn(
            'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ml-2',
            lead.user_status === 'Active'
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800'
          )}
        >
          {lead.user_status}
        </span>
      </div>
      <div className="space-y-2 mb-3">
        <div className="flex items-center text-xs text-text-muted">
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
          {lead.email}
        </div>
      </div>
      {onEdit && (
        <div className="flex justify-end pt-2 border-t border-gray-100">
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
            Edit
          </Button>
        </div>
      )}
    </div>
  );
}


'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

import { LeadModal } from '@/components/leads/LeadModal';
import { LeadsTable } from '@/components/leads/LeadsTable';
import { StatusFilter } from '@/components/leads/StatusFilter';
import { Button } from '@/components/ui/Button';
import { Label } from '@/components/ui/Label';
import { createLeadAction, updateLeadAction } from '@/lib/server/leads';
import type {
  CreateLeadInput,
  Lead,
  LeadStatus,
  UpdateLeadInput,
} from '@/types/lead';

interface DashboardClientProps {
  initialLeads: Lead[];
}

/**
 * Client component for dashboard interactivity
 * Handles modals, filters, and lead creation/updates
 */
export function DashboardClient({ initialLeads }: DashboardClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, setIsPending] = useState(false);

  // Get current status from URL params or default to 'All'
  const currentStatusParam = searchParams.get('status');
  const statusFilter: LeadStatus | 'All' =
    currentStatusParam === 'Active' || currentStatusParam === 'Inactive'
      ? currentStatusParam
      : 'All';

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);

  // Leads are already filtered on the server based on URL params
  const leads = initialLeads;

  // Handle status filter change - update URL params
  const handleStatusChange = (newStatus: LeadStatus | 'All') => {
    const params = new URLSearchParams(searchParams.toString());
    if (newStatus === 'All') {
      params.delete('status');
    } else {
      params.set('status', newStatus);
    }
    router.push(`/?${params.toString()}`);
  };

  const handleCreateLead = async (input: CreateLeadInput) => {
    setIsPending(true);
    try {
      const result = await createLeadAction(input);
      if (result.success) {
        setIsModalOpen(false);
        // Refresh the page to get updated data
        router.refresh();
      } else {
        throw new Error(result.error || 'Failed to create lead');
      }
    } catch (error) {
      if (error instanceof Error && error.message.includes('Unauthorized')) {
        router.push('/login');
      }
      throw error;
    } finally {
      setIsPending(false);
    }
  };

  const handleUpdateLead = async (input: UpdateLeadInput) => {
    if (!editingLead) return;

    setIsPending(true);
    try {
      const leadId = editingLead.documentId || String(editingLead.id);
      const result = await updateLeadAction(leadId, input);
      if (result.success) {
        setEditingLead(null);
        setIsModalOpen(false);
        // Refresh the page to get updated data
        router.refresh();
      } else {
        throw new Error(result.error || 'Failed to update lead');
      }
    } catch (error) {
      if (error instanceof Error && error.message.includes('Unauthorized')) {
        router.push('/login');
      }
      throw error;
    } finally {
      setIsPending(false);
    }
  };

  const handleOpenModal = (lead?: Lead) => {
    setEditingLead(lead || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingLead(null);
  };

  const handleSubmit = async (data: CreateLeadInput | UpdateLeadInput) => {
    if (editingLead) {
      await handleUpdateLead(data as UpdateLeadInput);
    } else {
      await handleCreateLead(data as CreateLeadInput);
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-text mb-2">Leads</h1>
            <p className="text-text-muted">
              Manage your sales leads and track their status
            </p>
          </div>
          <Button
            variant="primary"
            onClick={() => handleOpenModal()}
            disabled={isPending}
          >
            New Lead
          </Button>
        </div>
        <div className="flex items-center gap-4">
          <Label className="mb-0">Status:</Label>
          <StatusFilter value={statusFilter} onChange={handleStatusChange} />
        </div>
      </div>
      {isPending ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <LeadsTable leads={leads} onEdit={handleOpenModal} />
      )}
      <LeadModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        lead={editingLead}
      />
    </main>
  );
}

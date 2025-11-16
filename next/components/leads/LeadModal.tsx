'use client';

import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import type {
  CreateLeadInput,
  Lead,
  LeadStatus,
  UpdateLeadInput,
} from '@/types/lead';

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateLeadInput | UpdateLeadInput) => Promise<void>;
  lead?: Lead | null;
}

export function LeadModal({ isOpen, onClose, onSubmit, lead }: LeadModalProps) {
  const [formData, setFormData] = useState({
    name: lead?.name || '',
    company: lead?.company || '',
    email: lead?.email || '',
    user_status: (lead?.user_status || 'Active') as LeadStatus,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (lead) {
      setFormData({
        name: lead.name || '',
        company: lead.company || '',
        email: lead.email || '',
        user_status: lead.user_status || 'Active',
      });
    } else {
      setFormData({
        name: '',
        company: '',
        email: '',
        user_status: 'Active',
      });
    }
  }, [lead, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await onSubmit(formData);
      onClose();
      setError(null);
      if (!lead) {
        setFormData({
          name: '',
          company: '',
          email: '',
          user_status: 'Active',
        });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setError(
        error instanceof Error
          ? error.message
          : 'Failed to save lead. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6 z-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-text">
              {lead ? 'Edit Lead' : 'New Lead'}
            </h2>
            <button
              onClick={onClose}
              className="text-text-muted hover:text-text transition-colors"
              aria-label="Close"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Name</Label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label>Company</Label>
              <Input
                type="text"
                value={formData.company}
                onChange={(e) =>
                  setFormData({ ...formData, company: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label>Status</Label>
              <select
                value={formData.user_status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    user_status: e.target.value as LeadStatus,
                  })
                }
                className="input-field"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : lead ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

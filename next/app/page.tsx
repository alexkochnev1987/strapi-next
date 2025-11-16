import { Suspense } from 'react';

import { DashboardClient } from '@/components/dashboard/DashboardClient';
import { SimpleNavbar } from '@/components/navbar/SimpleNavbar';
import { getLeadsServer } from '@/lib/server/leads';
import type { LeadStatus } from '@/types/lead';

interface DashboardPageProps {
  searchParams: Promise<{ status?: string }>;
}

/**
 * Server component for dashboard page
 * Fetches leads data on the server based on status filter from URL params
 */
async function DashboardContent({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const params = await searchParams;
  // Get status from URL params, validate it's a valid status
  const statusParam = params.status;
  const status: LeadStatus | undefined =
    statusParam === 'Active' || statusParam === 'Inactive'
      ? statusParam
      : undefined;

  const leads = await getLeadsServer(status);

  return <DashboardClient initialLeads={leads} />;
}

export default async function DashboardPage({
  searchParams,
}: DashboardPageProps) {
  return (
    <div className="min-h-screen bg-background-light">
      <SimpleNavbar />
      <Suspense
        fallback={
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          </main>
        }
      >
        <DashboardContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

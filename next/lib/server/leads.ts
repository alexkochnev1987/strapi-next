'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

import { STRAPI_URL } from '@/lib/config';
import type {
  CreateLeadInput,
  Lead,
  LeadResponse,
  LeadsResponse,
  UpdateLeadInput,
} from '@/types/lead';

/**
 * Fetch all leads from Strapi (server-side)
 * Uses JWT from httpOnly cookie for authentication
 */
export async function getLeadsServer(
  status?: 'Active' | 'Inactive'
): Promise<Lead[]> {
  try {
    const url = new URL(`${STRAPI_URL}/api/leads`);
    if (status) {
      url.searchParams.append('filters[user_status][$eq]', status);
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      if (response.status === 401) {
        return [];
      }
      console.error(`Failed to fetch leads: ${response.statusText}`);
      return [];
    }

    const data: LeadsResponse = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching leads (server):', error);
    return [];
  }
}

/**
 * Create a new lead (Server Action)
 * Creates a lead in Strapi and revalidates the page
 */
export async function createLeadAction(
  input: CreateLeadInput
): Promise<{ success: boolean; error?: string; data?: Lead }> {
  try {
    const response = await fetch(`${STRAPI_URL}/api/leads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: {
          name: input.name,
          company: input.company,
          email: input.email,
          user_status: input.user_status || 'Active',
        },
      }),
    });

    if (!response.ok) {
      return {
        success: false,
        error: `Failed to create lead: ${response.statusText}`,
      };
    }

    const result: LeadResponse = await response.json();
    revalidatePath('/');

    return { success: true, data: result.data };
  } catch (error) {
    console.error('Error creating lead (server action):', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create lead',
    };
  }
}

const createData = <T>(input: T, fields: (keyof T)[]) => {
  return fields.reduce<Partial<T>>((acc, field) => {
    if (input[field] !== undefined) {
      acc[field] = input[field];
    }
    return acc;
  }, {});
};

/**
 * Update an existing lead (Server Action)
 * Updates a lead in Strapi and revalidates the page
 */
export async function updateLeadAction(
  leadId: string,
  input: UpdateLeadInput
): Promise<{ success: boolean; error?: string; data?: Lead }> {
  try {
    // Get JWT from cookie for authentication to update the lead
    // This is a security measure to prevent unauthorized updates
    const cookieStore = await cookies();
    const jwt = cookieStore.get('sid')?.value;

    if (!jwt) {
      return { success: false, error: 'Unauthorized' };
    }

    const response = await fetch(`${STRAPI_URL}/api/leads/${leadId}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${jwt}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: createData(input, ['name', 'company', 'email', 'user_status']),
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();

      if (response.status === 401) {
        return { success: false, error: 'Unauthorized: Please login again' };
      }

      if (response.status === 404) {
        return {
          success: false,
          error: `Lead with identifier ${leadId} not found`,
        };
      }

      return {
        success: false,
        error: `Failed to update lead: ${response.statusText}`,
      };
    }

    const result: LeadResponse = await response.json();

    revalidatePath('/');

    return { success: true, data: result.data };
  } catch (error) {
    console.error('Error updating lead (server action):', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update lead',
    };
  }
}

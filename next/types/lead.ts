/**
 * Lead status enumeration
 */
export type LeadStatus = 'Active' | 'Inactive';

/**
 * Base Lead entity with all fields
 */
export interface Lead {
  id: number;
  documentId?: string; // Strapi v5 uses documentId for updates
  name: string;
  company: string;
  email: string;
  user_status: LeadStatus;
  createdAt: string;
  updatedAt: string;
}

/**
 * Lead data for creating a new lead
 */
export interface CreateLeadInput {
  name: string;
  company: string;
  email: string;
  user_status?: LeadStatus;
}

/**
 * Lead data for updating an existing lead
 */
export interface UpdateLeadInput {
  name?: string;
  company?: string;
  email?: string;
  user_status?: LeadStatus;
}

/**
 * Strapi API response structure for a single lead
 */
export interface LeadResponse {
  data: Lead;
  meta?: Record<string, unknown>;
}

/**
 * Strapi API response structure for multiple leads
 */
export interface LeadsResponse {
  data: Lead[];
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

/**
 * Strapi API request body for creating/updating leads
 */
export interface LeadRequest {
  data: CreateLeadInput | UpdateLeadInput;
}


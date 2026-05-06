import type { PaginatedResponse, Paginated } from '~/types/global';
import type { Company } from '~/types/companies';
import type { Technology } from '~/types/technologies';

export type JobOpportunityStatus = 'pending_payment' | 'published';
export type JobPostingTier = 'standard' | 'featured' | 'spotlight';

export interface JobOpportunity {
	id: string; // uuid
	title: string;
	location?: string;
	remote: boolean;
	description: string;
	salary_minimum?: string;
	salary_maximum?: string;
	currency: string;
	employment_type: string[];
	seniority?: string[];
	date_posted?: string; // 2024-05-05 00:00:00
	application_link: string;
	technologies: Technology[];
	company: Company;
	applications?: number;
	views?: number;
	status?: JobOpportunityStatus;
	posting_tier?: JobPostingTier;
	paid_amount_cents?: number | null;
	paid_currency?: string | null;
	paid_at?: string | null;
	stripe_checkout_session_id?: string | null;
}

export interface JobOpportunityDraft extends Omit<JobOpportunity, 'id' | 'company'> {
	id?: string;
	company?: Company;
};

// #region Responses
export type IndexJobOpportunitiesResponse = PaginatedResponse<JobOpportunity>;
export interface ShowJobOpportunityResponse {
	job_opportunity: JobOpportunity;
}

// #endregion

// #region Params

export interface IndexJobOpportunitiesParams extends Paginated {
	search: string;
	location: string;
	remote: boolean;
	technologies: string[]; // uuid[]
	salary_minimum: string;
	employment_type: string; // TODO: enum
	seniority: string; // TODO: enum
};

export interface JobOpportunityPayload extends Omit<JobOpportunity, 'id' | 'company' | 'technologies' | 'salary_minimum' | 'salary_maximum'> {
	salary_minimum?: number | null;
	salary_maximum?: number | null;
	technologies: string[]; // uuid[]
};

export type JobOpportunityValidationErrors = Record<string, string[]>;

// #endregion

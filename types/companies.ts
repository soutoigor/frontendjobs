import type { JobOpportunity } from '~/types/job-opportunities';

export interface Company {
	id: string; // uuid
	name: string;
	avatar: string;
	location: string;
	user_id: string; // uuid
	industry: string;
	socials: Socials;
	created_at: string;
	updated_at: string;
}

export interface CompanyJobOpportunity extends JobOpportunity {
	views: number;
	applications: number;
}

export interface CompanyWithJobs extends Company {
	job_opportunities: CompanyJobOpportunity[];
}

export interface CompanyFilters {
	name?: string;
	industry?: string;
	location?: string;
}

export interface Socials {
	linkedin?: string;
	website?: string;
	instagram?: string;
	github?: string;
	email?: string;
}

export type CompanyPayload = Omit<Company, 'id' | 'user_id' | 'created_at' | 'updated_at'>;

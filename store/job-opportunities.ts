import { defineStore } from 'pinia';
import type {
	IndexJobOpportunitiesResponse,
	JobOpportunityPayload,
	IndexJobOpportunitiesParams,
	JobOpportunity,
	JobOpportunityDraft,
	JobOpportunityValidationErrors,
	ShowJobOpportunityResponse,
	JobPostingTier,
} from '~/types/job-opportunities';
import { normalizeApplicationDestination } from '~/utils/links';
import { defaultPostingTier } from '~/utils/posting-tiers';

export interface UseFetchReturn {
	data: IndexJobOpportunitiesResponse | ShowJobOpportunityResponse | null;
	pending: boolean;
	error: unknown;
	refresh: () => void;
}

const initialFilters: IndexJobOpportunitiesParams = {
	search: '',
	location: '',
	remote: false,
	technologies: [],
	salary_minimum: '',
	employment_type: '',
	seniority: '',
	page: 1,
};

const initialJobOpportunity: JobOpportunity = {
	id: '',
	title: '',
	remote: false,
	description: '',
	currency: '',
	application_link: '',
	employment_type: [],
	technologies: [],
	seniority: [],
	posting_tier: defaultPostingTier,
	company: {
		id: '',
		name: '',
		avatar: '',
		location: '',
		user_id: '',
		industry: '',
		socials: {},
		created_at: '',
		updated_at: '',
	},
};

export const useJobOpportunitiesStore = defineStore('job-opportunities', () => {
	const { technologies } = useFilterOptions();
	const config = useRuntimeConfig();
	const token = useCookie('token');

	const jobOpportunities = ref<IndexJobOpportunitiesResponse>();
	const totalJobOpportunities = ref<number>();
	const jobOpportunity = ref<JobOpportunity>(initialJobOpportunity);
	const draftJobOpportunity = ref<JobOpportunityDraft>();
	const validationErrors = ref<JobOpportunityValidationErrors>({});
	const isSavingJobOpportunity = ref(false);
	const filters = ref({ ...initialFilters });
	const filtersLabel = computed(() => {
		let _filtersLabel = [
			filters.value.location,
			filters.value.seniority,
			filters.value.employment_type,
			...filters.value.technologies
				.map(tech => technologies.value.find(({ id }) => id === tech)?.name)
				.filter(x => x !== undefined),
		];
		const hasRemoteFilter = _filtersLabel.includes('Remote');

		if (filters.value.remote && !hasRemoteFilter) {
			_filtersLabel.push('Remote');
		}
		else {
			_filtersLabel = _filtersLabel.filter(x => x !== 'Remote');
		}

		return _filtersLabel.filter(x => x !== ''); ;
	});

	// ##region Filters
	function updateFilters(newFilters: Partial<IndexJobOpportunitiesParams>) {
		filters.value = { ...filters.value, ...newFilters };
	}

	function resetFilters() {
		filters.value = initialFilters;
	}

	function setJobOpportunities(newJobOpportunities: IndexJobOpportunitiesResponse) {
		jobOpportunities.value = newJobOpportunities;
	}

	function setTotalJobOpportunities(total: number) {
		totalJobOpportunities.value = total;
	}

	function removeFilter(selectedFilter: string) {
		const newFilters = { ...filters.value };

		if (selectedFilter === 'Remote') {
			newFilters.remote = false;
		}
		else {
			newFilters.technologies = newFilters.technologies.filter(tech => tech !== selectedFilter);
			newFilters.location = newFilters.location === selectedFilter ? '' : newFilters.location;
			newFilters.seniority = newFilters.seniority === selectedFilter ? '' : newFilters.seniority;
			newFilters.employment_type = newFilters.employment_type === selectedFilter ? '' : newFilters.employment_type;
		}

		filters.value = newFilters;
	}

	// ##endregion

	// ##region Job Opportunity
	function restoreJobOpportunityDraft() {
		const draft = localStorage.getItem('job-opportunity-draft');
		if (draft) {
			const parsedDraft = JSON.parse(draft) as JobOpportunityDraft;
			draftJobOpportunity.value = {
				...parsedDraft,
				posting_tier: parsedDraft.posting_tier || defaultPostingTier,
			};
		}
	}

	function setJobOpportunity(payload: JobOpportunity) {
		jobOpportunity.value = payload;
	}

	function setDraftJobOpportunity(payload: JobOpportunityDraft) {
		draftJobOpportunity.value = {
			...payload,
			posting_tier: payload.posting_tier || defaultPostingTier,
		};

		localStorage.setItem('job-opportunity-draft', JSON.stringify(draftJobOpportunity.value));
	}

	function updateDraftPostingTier(postingTier: JobPostingTier) {
		if (!draftJobOpportunity.value) {
			return;
		}

		setDraftJobOpportunity({
			...draftJobOpportunity.value,
			posting_tier: postingTier,
		});
	}

	function clearDraftJobOpportunity() {
		draftJobOpportunity.value = undefined;
		localStorage.removeItem('job-opportunity-draft');
	}

	function setDraftFromJobOpportunity(payload: JobOpportunity) {
		setDraftJobOpportunity({
			id: payload.id,
			title: payload.title,
			location: payload.location,
			remote: payload.remote,
			description: payload.description,
			salary_minimum: String(payload.salary_minimum ?? ''),
			salary_maximum: String(payload.salary_maximum ?? ''),
			currency: payload.currency,
			employment_type: payload.employment_type,
			seniority: payload.seniority,
			date_posted: payload.date_posted,
			application_link: payload.application_link,
			technologies: payload.technologies,
			status: payload.status,
			posting_tier: payload.posting_tier || defaultPostingTier,
		});
	}

	function setValidationErrors(errors: JobOpportunityValidationErrors = {}) {
		validationErrors.value = errors;
	}

	function clearValidationErrors() {
		validationErrors.value = {};
	}

	function resetJobOpportunity() {
		jobOpportunity.value = initialJobOpportunity;
	}

	function salaryToNumber(value?: string | number) {
		if (value === undefined || value === null || value === '') {
			return null;
		}

		const normalizedSalary = String(value).replace(/,/g, '');
		const salary = Number(normalizedSalary);

		return Number.isNaN(salary) ? null : salary;
	}

	function formatJobOpportunityPayload(payload: JobOpportunityDraft): JobOpportunityPayload {
		const formattedPayload: JobOpportunityPayload = {
			title: payload.title,
			location: payload.location,
			remote: payload.remote,
			description: payload.description,
			currency: payload.currency,
			employment_type: payload.employment_type,
			seniority: payload.seniority,
			application_link: normalizeApplicationDestination(payload.application_link),
			date_posted: payload.date_posted || new Date().toISOString().slice(0, 10),
			salary_minimum: salaryToNumber(payload.salary_minimum),
			salary_maximum: salaryToNumber(payload.salary_maximum),
			technologies: payload.technologies.map(x => x.id),
			posting_tier: payload.posting_tier || defaultPostingTier,
		};

		return formattedPayload;
	}

	async function createJobOpportunity(payload: JobOpportunityDraft): Promise<{ checkoutUrl: string | null }> {
		const formattedPayload = formatJobOpportunityPayload(payload);

		try {
			isSavingJobOpportunity.value = true;
			clearValidationErrors();

			const response = await $fetch<{ job_opportunity: JobOpportunity; checkout_url: string | null }>('/job_opportunities', {
				method: 'post',
				baseURL: config.public.baseURL,
				headers: {
					Authorization: `Bearer ${token.value}`,
				},
				body: formattedPayload,
			});

			if (!response.checkout_url) {
				clearDraftJobOpportunity();
			}

			return { checkoutUrl: response.checkout_url };
		}
		catch (error: unknown) {
			const fetchError = error as { data?: { error?: JobOpportunityValidationErrors } };

			if (fetchError.data?.error) {
				setValidationErrors(fetchError.data.error);
			}

			throw error;
		}
		finally {
			isSavingJobOpportunity.value = false;
		}
	}

	async function updateJobOpportunity(id: string, payload: JobOpportunityDraft) {
		const formattedPayload = formatJobOpportunityPayload(payload);

		try {
			isSavingJobOpportunity.value = true;
			await $fetch<{ job_opportunity: JobOpportunity }>(`/job_opportunities/${id}`, {
				method: 'put',
				baseURL: config.public.baseURL,
				headers: {
					Authorization: `Bearer ${token.value}`,
				},
				body: formattedPayload,
			});
		}
		finally {
			isSavingJobOpportunity.value = false;
		}
	}

	async function checkoutJobOpportunity(id: string): Promise<{ checkoutUrl: string }> {
		try {
			isSavingJobOpportunity.value = true;

			const response = await $fetch<{ checkout_url: string }>(`/job_opportunities/${id}/checkout`, {
				method: 'post',
				baseURL: config.public.baseURL,
				headers: {
					Authorization: `Bearer ${token.value}`,
				},
			});

			return { checkoutUrl: response.checkout_url };
		}
		finally {
			isSavingJobOpportunity.value = false;
		}
	}

	async function apply(id: string, applicant: { name?: string; email?: string } = {}) {
		try {
			await $fetch(`/job_opportunities/${id}/apply`, {
				method: 'post',
				baseURL: config.public.baseURL,
				body: applicant,
			});
		}
		catch (error) {
			console.error(error);
		}
	}

	async function deleteJobOpportunity(id: string) {
		try {
			isSavingJobOpportunity.value = true;

			await $fetch(`/job_opportunities/${id}`, {
				method: 'delete',
				baseURL: config.public.baseURL,
				headers: {
					Authorization: `Bearer ${token.value}`,
				},
			});
		}
		finally {
			isSavingJobOpportunity.value = false;
		}
	}

	// ##endregion

	return {
		jobOpportunities,
		totalJobOpportunities,
		filters,
		isSavingJobOpportunity,
		updateFilters,
		resetFilters,
		removeFilter,
		setJobOpportunities,
		setTotalJobOpportunities,
		filtersLabel,
		draftJobOpportunity,
		validationErrors,

		jobOpportunity,
		setJobOpportunity,
		restoreJobOpportunityDraft,
		setDraftJobOpportunity,
		updateDraftPostingTier,
		setDraftFromJobOpportunity,
		clearDraftJobOpportunity,
		setValidationErrors,
		clearValidationErrors,
		resetJobOpportunity,
		createJobOpportunity,
		updateJobOpportunity,
		checkoutJobOpportunity,
		deleteJobOpportunity,
		apply,
	};
});

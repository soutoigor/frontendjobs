import { defineStore } from 'pinia';
import type {
	IndexJobOpportunitiesResponse,
	JobOpportunityPayload,
	IndexJobOpportunitiesParams,
	JobOpportunity,
	JobOpportunityDraft,
	ShowJobOpportunityResponse,
} from '~/types/job-opportunities';

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
	const jobOpportunity = ref<JobOpportunity>(initialJobOpportunity);
	const draftJobOpportunity = ref<JobOpportunityDraft>();
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
			draftJobOpportunity.value = JSON.parse(draft);
		}
	}

	function setJobOpportunity(payload: JobOpportunity) {
		jobOpportunity.value = payload;
	}

	function setDraftJobOpportunity(payload: JobOpportunityDraft) {
		draftJobOpportunity.value = payload;

		localStorage.setItem('job-opportunity-draft', JSON.stringify(payload));
	}

	function resetJobOpportunity() {
		jobOpportunity.value = initialJobOpportunity;
	}

	async function createJobOpportunity(payload: JobOpportunityDraft) {
		const formattedPayload: JobOpportunityPayload = {
			...payload,
			technologies: payload.technologies.map(x => x.id),
		};

		try {
			isSavingJobOpportunity.value = true;

			await $fetch<{ job_opportunity: JobOpportunity }>('/job_opportunities', {
				method: 'post',
				baseURL: config.public.baseURL,
				headers: {
					Authorization: `Bearer ${token.value}`,
				},
				body: formattedPayload,
			});

			draftJobOpportunity.value = undefined;
			localStorage.removeItem('job-opportunity-draft');
		}
		catch (error) {
			throw error;
		}
		finally {
			isSavingJobOpportunity.value = false;
		}
	}

	async function updateJobOpportunity(payload: JobOpportunityPayload) {
		try {
			isSavingJobOpportunity.value = true;
			await $fetch<{ job_opportunity: JobOpportunity }>('/job_opportunities', {
				method: 'put',
				baseURL: config.public.baseURL,
				headers: {
					Authorization: `Bearer ${token.value}`,
				},
				body: payload,
			});
		}
		finally {
			isSavingJobOpportunity.value = false;
		}
	}

	async function apply(id: string) {
		try {
			await $fetch(`/job_opportunities/${id}/apply`, {
				method: 'post',
				baseURL: config.public.baseURL,
			});
		}
		catch (error) {
			console.error(error);
		}
	}

	// ##endregion

	return {
		jobOpportunities,
		filters,
		updateFilters,
		resetFilters,
		removeFilter,
		setJobOpportunities,
		filtersLabel,
		draftJobOpportunity,

		jobOpportunity,
		setJobOpportunity,
		restoreJobOpportunityDraft,
		setDraftJobOpportunity,
		resetJobOpportunity,
		createJobOpportunity,
		updateJobOpportunity,
		apply,
	};
});

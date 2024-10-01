import { defineStore } from 'pinia';
import type { IndexJobOpportunitiesResponse, IndexJobOpportunitiesParams, JobOpportunity, ShowJobOpportunityResponse } from '~/types/job-opportunities';

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
	employment_type: '',
	technologies: [],
	company: {
		id: '',
		name: '',
		avatar: '',
		location: '',
		user_id: '',
		company_industry: '',
		created_at: '',
		updated_at: '',
	},
};

export const useJobOpportunitiesStore = defineStore('job-opportunities', () => {
	const { technologies } = useFilterOptions();

	const jobOpportunities = ref<IndexJobOpportunitiesResponse>();
	const jobOpportunity = ref<JobOpportunity>(initialJobOpportunity);
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

	function setJobOpportunity(newJobOpportunity: JobOpportunity) {
		console.log('----', newJobOpportunity);
		jobOpportunity.value = newJobOpportunity;
	}

	function resetJobOpportunity() {
		jobOpportunity.value = initialJobOpportunity;
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

		jobOpportunity,
		setJobOpportunity,
		resetJobOpportunity,
	};
});

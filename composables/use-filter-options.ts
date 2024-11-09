import { COUNTRY_LIST, SENIORITIES, EMPLOYMENT_TYPES, INDUSTRIES } from '~/constants/filter-options';

const isInitialized = ref(false);

export function useFilterOptions() {
	const config = useRuntimeConfig();
	const technologies = ref<Technology[]>([]);
	const employmentTypes = ref(EMPLOYMENT_TYPES);
	const seniorities = ref(SENIORITIES);
	const industries = ref(INDUSTRIES);
	const locations = ref([...COUNTRY_LIST, 'Worldwide']);
	const isLoadingTechnologies = ref(false);

	onMounted(() => {
		Promise.all([fetchTechnologies()]);
		isInitialized.value = true;
	});

	return {
		industries,
		technologies,
		employmentTypes,
		seniorities,
		locations,
		isLoadingTechnologies,
	};

	async function fetchTechnologies() {
		if (isInitialized.value) {
			return;
		}

		try {
			isLoadingTechnologies.value = true;
			const response = await $fetch('/technologies', {
				baseURL: config.public.baseURL,
			}) as { technologies: Technology[] };

			technologies.value = response.technologies;
			isLoadingTechnologies.value = false;
		}
		catch (err) {
			console.error('Error fetching technologies:', err);
		}
	}
}

interface Technology {
	id: string;
	name: string;
	created_at: string;
	updated_at: string;
}

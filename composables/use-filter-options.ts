import { COUNTRY_LIST, SENIORITIES, EMPLOYMENT_TYPES, INDUSTRIES, CURRENCIES } from '~/constants/filter-options';

const technologies = ref<Technology[]>([]);
const isInitialized = ref(false);

export function useFilterOptions() {
	const config = useRuntimeConfig();
	const employmentTypes = ref(EMPLOYMENT_TYPES);
	const seniorities = ref(SENIORITIES);
	const industries = ref(INDUSTRIES);
	const currencies = ref(CURRENCIES);
	const locations = ref(['Worldwide', ...COUNTRY_LIST]);
	const isLoadingTechnologies = ref(false);

	onMounted(async () => {
		if (!isInitialized.value) {
			await fetchTechnologies();
		}
	});

	return {
		industries,
		technologies,
		employmentTypes,
		seniorities,
		currencies,
		locations,
		isLoadingTechnologies,
	};

	async function fetchTechnologies() {
		isInitialized.value = true;

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

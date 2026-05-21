import { COUNTRY_LIST, SENIORITIES, EMPLOYMENT_TYPES, INDUSTRIES, CURRENCIES } from '~/constants/filter-options';

const technologies = ref<Technology[]>([]);
const isInitialized = ref(false);
let fetchTechnologiesPromise: Promise<void> | null = null;

export function useFilterOptions() {
	const config = useRuntimeConfig();
	const employmentTypes = ref(EMPLOYMENT_TYPES);
	const seniorities = ref(SENIORITIES);
	const industries = ref(INDUSTRIES);
	const currencies = ref(CURRENCIES);
	const locations = ref(['Worldwide', ...COUNTRY_LIST]);
	const isLoadingTechnologies = ref(false);

	onMounted(async () => {
		if (!isInitialized.value || !technologies.value.length) {
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
		fetchTechnologies,
	};

	async function fetchTechnologies() {
		if (isInitialized.value && technologies.value.length) {
			return;
		}

		if (fetchTechnologiesPromise) {
			return fetchTechnologiesPromise;
		}

		fetchTechnologiesPromise = loadTechnologies();
		await fetchTechnologiesPromise;
		fetchTechnologiesPromise = null;
	}

	async function loadTechnologies() {
		try {
			isLoadingTechnologies.value = true;
			const response = await $fetch('/technologies', {
				baseURL: config.public.baseURL,
			}) as { technologies: Technology[] };

			technologies.value = response.technologies;
			isInitialized.value = true;
		}
		catch (err) {
			isInitialized.value = false;
			console.error('Error fetching technologies:', err);
		}
		finally {
			isLoadingTechnologies.value = false;
		}
	}
}

interface Technology {
	id: string;
	name: string;
	created_at: string;
	updated_at: string;
}

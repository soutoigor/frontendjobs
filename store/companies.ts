import { defineStore } from 'pinia';
import type { Company, CompanyPayload, CompanyFilters, CompanyWithJobs } from '~/types/companies';
import { filterNilOrEmpty } from '~/utils/global';

export interface UseFetchReturn {
	data: Company[] | null;
	pending: boolean;
	error: unknown;
	refresh: () => void;
}

export const useCompaniesStore = defineStore('companies', () => {
	const config = useRuntimeConfig();
	const toast = useToast();
	const token = useCookie('token');
	const companies = ref<Company[]>([]);
	const userCompany = ref<CompanyWithJobs>();
	const company = ref<Company>();
	const loadingCompany = ref(false);
	const loadingCompanies = ref(false);

	async function fetchCompanies(filters: CompanyFilters) {
		try {
			loadingCompanies.value = true;
			const response = await $fetch<{ companies: Company[] }>('/companies', {
				method: 'get',
				baseURL: config.public.baseURL,
				headers: {
					Authorization: `Bearer ${token.value}`,
				},
				query: filterNilOrEmpty(filters),
			});

			companies.value = response.companies;
  	}
		catch (error: any) {
			toast.add({
				color: 'rose',
				title: 'Failed to load companies',
				description: 'Please, try again',
			});
		}
		finally {
			loadingCompanies.value = false;
		}
	}

	async function fetchUserCompany() {
		const router = useRouter();
		try {
			loadingCompany.value = true;
			const response = await $fetch<{ company: CompanyWithJobs }>('/user_company', {
				method: 'get',
				baseURL: config.public.baseURL,
				headers: {
					Authorization: `Bearer ${token.value}`,
				},
			});

			userCompany.value = response.company;
		}
		catch (error) {
			router.push('/company/create');
		}
		finally {
			loadingCompany.value = false;
		}
	}

	async function createCompany(payload: CompanyPayload) {
		try {
			loadingCompany.value = true;
			const response = await $fetch<{ company: Company }>('/companies', {
				method: 'post',
				baseURL: config.public.baseURL,
				headers: {
					Authorization: `Bearer ${token.value}`,
				},
				body: payload,
			});

			if (response.company) {
				company.value = response.company;
			}
		}
		finally {
			loadingCompany.value = false;
		}
	}

	async function updateCompany(id: string, payload: CompanyPayload) {
		try {
			loadingCompany.value = true;
			const response = await $fetch<{ company: Company }>(`/companies/${id}`, {
				method: 'put',
				baseURL: config.public.baseURL,
				headers: {
					Authorization: `Bearer ${token.value}`,
				},
				body: payload,
			});

			if (response.company) {
				company.value = response.company;
			}
		}
		finally {
			loadingCompany.value = false;
		}
	}

	  return {
		companies,
		company,
		userCompany,
		loadingCompany,
		loadingCompanies,

		createCompany,
		updateCompany,
		fetchCompanies,
		fetchUserCompany,
	};
});

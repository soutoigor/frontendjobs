import { defineStore } from 'pinia';
import type { Company, CompanyPayload, CompanyFilters } from '~/types/companies';
import type { JobOpportunity } from '~/types/job-opportunities';
import type { UseFetchReturn as JobOpportunityFetchReturn } from '~/store/job-opportunities';
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
  const companyJobs = ref<JobOpportunity[]>([]);
  const isLoadingCompanyJobs = ref(false);
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
  	} catch (error: any) {
      toast.add({
        color: 'rose',
        title: 'Failed to load companies',
        description: 'Please, try again',
      });
    } finally {
      loadingCompanies.value = false;
    }
  }

  async function fetchCompany(id: string) {
    try {
      loadingCompany.value = true;
      const response = await $fetch<{ companies: UseFetchReturn }>('/companies', {
        method: 'get',
        baseURL: config.public.baseURL,
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
        query: { user_id: id },
      });

      company.value = response.companies.data?.[0];

      getCompanyJobs();
    } finally {
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
    } finally {
      loadingCompany.value = false;
    }
  }

  async function updateCompany(id: string, payload: CompanyPayload) {
    try {
      loadingCompany.value = true;
      const response = await $fetch<{ company: Company }>('/companies', {
        method: 'put',
        baseURL: config.public.baseURL,
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
        body: payload,
        params: { id },
      });

      if (response.company) {
        company.value = response.company;
      }
    } finally {
      loadingCompany.value = false;
    }
  }

  async function getCompanyJobs() {
    try {
      isLoadingCompanyJobs.value = true;

      const response = await $fetch<JobOpportunityFetchReturn>('job-opportunities', {
        method: 'get',
        baseURL: config.public.baseURL,
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
        query: { company_id: company.value?.id },
      });

      if (response.data) {
        companyJobs.value = response.data as unknown as JobOpportunity[];
      }
    } finally {
      isLoadingCompanyJobs.value = false;
    }
}

	  return {
      companies,
      company,
      companyJobs,
      loadingCompany,
      loadingCompanies,
      isLoadingCompanyJobs,

      createCompany,
      updateCompany,
      fetchCompanies,
      fetchCompany,
    }
});

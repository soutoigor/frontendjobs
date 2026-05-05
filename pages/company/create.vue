<template>
	<UContainer
		class="create-company"
		as="article"
	>
		<h1 class="create-company__title">
			Register your company to post your first job
		</h1>
		<p class="create-company__subtitle">
			This takes under a minute. These details appear on your public job listings so candidates know who they are applying to.
		</p>
		<CompanyForm />
	</UContainer>
</template>

<script setup lang="ts">
import { useCompaniesStore } from '~/store/companies';
import CompanyForm from '~/components/companies/company-form.vue';

definePageMeta({
	layout: 'company',
});

const router = useRouter();
const companiesStore = useCompaniesStore();

if (companiesStore.userCompany) {
	router.push('/company/dashboard');
}
</script>

<style scoped>
.create-company {
	@apply min-h-screen p-0 w-full;

	&__title {
		@apply text-2xl md:text-3xl font-bold mb-2;
	}

	&__subtitle {
		@apply mb-6 max-w-2xl text-sm text-gray-500 md:text-base;
	}
}
</style>

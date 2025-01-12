<template>
	<UContainer
		class="create-company"
		as="article"
	>
		<h1 class="create-company__title">
			Register your company to post your first job
		</h1>
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
		@apply text-2xl md:text-3xl font-bold mb-6;
	}
}
</style>

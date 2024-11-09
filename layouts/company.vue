<template>
	<main class="company">
		<div v-if="companiesStore.loadingCompany">
			Loading...
		</div>
		<UContainer v-else class="company__container">
			<template v-if="!companiesStore.company">
				<h1>Register your company and post your first job :)</h1>
				<CompanyForm class="company__form" />
			</template>
			<slot v-else />
		</UContainer>
	</main>
</template>

<script setup lang="ts">
import CompanyForm from '~/components/companies/company-form.vue';
import { useCompaniesStore } from '~/store/companies';
import { useAuthStore } from '~/store/authentication';

const companiesStore = useCompaniesStore();
const authStore = useAuthStore();

if (authStore.user && !companiesStore.company) {
	companiesStore.fetchCompany(authStore.user.id);
}
</script>

<style scoped>
.company {

	&__container {
		@apply pt-20 pb-6 h-screen flex flex-col items-center justify-center;
	}

	&__form {
		@apply max-w-xl w-full;
	}
}
</style>

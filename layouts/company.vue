<template>
	<main class="company">
		<UContainer class="company__container">
			<AppLoading v-if="companiesStore.loadingCompany" />
			<slot v-else />
		</UContainer>
	</main>
</template>

<script setup lang="ts">
import AppLoading from '~/components/shared/app-loading.vue';
import { useCompaniesStore } from '~/store/companies';

const companiesStore = useCompaniesStore();

companiesStore.fetchUserCompany();
</script>

<style scoped>
.company {

	&__container {
		@apply min-h-screen p-0 pt-20 px-4 pb-12 md:px-14 w-full;
	}

	&__title {
		@apply text-2xl md:text-3xl font-bold mb-6;
	}
}
</style>

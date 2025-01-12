<template>
	<UContainer
		class="dashboard"
		as="article"
	>
		<CompanyCard
			v-if="companiesStore.userCompany"
			:company="companiesStore.userCompany"
		>
			<template #action>
				<UButton
					to="/company/edit"
					size="sm"
					variant="outline"
					color="gray"
				>
					Edit Profile
				</UButton>
			</template>
		</CompanyCard>

		<UDivider />

		<CompanyJobs />
	</UContainer>
</template>

<script setup lang="ts">
import CompanyCard from '~/components/companies/company-card.vue';
import CompanyJobs from '~/components/companies/company-jobs.vue';
import { useCompaniesStore } from '~/store/companies';

definePageMeta({
	layout: 'company',
});

const companiesStore = useCompaniesStore();
</script>

<style scoped>
.dashboard {
	@apply min-h-screen w-full flex flex-col gap-6;
}
</style>

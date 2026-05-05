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
import { useJobOpportunitiesStore } from '~/store/job-opportunities';

definePageMeta({
	layout: 'company',
});

const companiesStore = useCompaniesStore();
const jobOpportunitiesStore = useJobOpportunitiesStore();
const route = useRoute();
const router = useRouter();
const toast = useToast();

onMounted(async () => {
	if (route.query.payment === 'success') {
		jobOpportunitiesStore.clearDraftJobOpportunity();
		await companiesStore.fetchUserCompany();

		toast.add({
			color: 'green',
			title: 'Payment received',
			description: 'Your job post is being published.',
		});

		router.replace('/company/dashboard');
	}

	if (route.query.payment === 'cancelled') {
		toast.add({
			color: 'yellow',
			title: 'Payment not completed',
			description: 'You can edit, complete, or remove the pending job below.',
		});

		router.replace('/company/dashboard');
	}
});
</script>

<style scoped>
.dashboard {
	@apply min-h-screen w-full flex flex-col gap-6;
}
</style>

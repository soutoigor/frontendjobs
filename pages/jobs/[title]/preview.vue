<template>
	<UContainer
		class="preview"
		as="article"
	>
		<JobOpportunityContent
			v-if="draft"
			:job-opportunity="draft"
		/>
		<UContainer class="preview__actions-wrapper">
			<UButton
				size="xl"
				block
				icon="i-heroicons-pencil"
				variant="soft"
				color="blue"
				label="Edit Job Post"
				to="/company/post-job"
			/>
			<UButton
				size="xl"
				icon="i-heroicons-check-circle"
				block
				trailing
				label="Post Job"
				@click="postJob"
			/>
		</UContainer>
	</UContainer>
</template>

<script setup lang="ts">
import JobOpportunityContent from '~/components/job-opportunities/job-opportunity-content.vue';
import { useJobOpportunitiesStore } from '~/store/job-opportunities';
import { useCompaniesStore } from '~/store/companies';

definePageMeta({
	layout: 'company',
});

const router = useRouter();
const toast = useToast();
const jobOpportunitiesStore = useJobOpportunitiesStore();
const companiesStore = useCompaniesStore();

const draft = computed(() => jobOpportunitiesStore.draftJobOpportunity);

onMounted(jobOpportunitiesStore.restoreJobOpportunityDraft);

async function postJob() {
	if (!draft.value) {
		return;
	}

	try {
		await jobOpportunitiesStore.createJobOpportunity(draft.value);

		await companiesStore.fetchUserCompany();

		router.push('/company/dashboard');
	}
	catch (error: any) {
		const description = error.status === 400
			? 'Invalid data, please check the form'
			: 'An error occurred, please try again';

		toast.add({
			color: 'rose',
			title: 'Failed to post job',
			description,
		});
	}
}
</script>

<style scoped>
.preview {
  @apply min-h-screen p-0 w-full;

  &__actions-wrapper {
    @apply mt-8 grid grid-cols-2 gap-4;
  }
}
</style>

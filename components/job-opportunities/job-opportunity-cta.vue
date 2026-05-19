<template>
	<div class="job-cta">
		<UButton
			size="lg"
			icon="i-heroicons-bolt-20-solid"
			@click="openApplyModal"
		>
			Apply for this role
		</UButton>
		<UButton
			variant="soft"
			color="gray"
			size="lg"
			icon="i-heroicons-share-20-solid"
			@click="shareJobOpportunity"
		>
			Share
		</UButton>

		<ApplyModal
			v-model="isModalOpen"
			:job-id="jobOpportunity.id ?? ''"
			:job-title="jobOpportunity.title"
			:application-link="jobOpportunity.application_link"
			:company-name="jobOpportunity.company?.name ?? ''"
		/>
	</div>
</template>

<script setup lang="ts">
import ApplyModal from '~/components/job-opportunities/apply-modal.vue';
import type { JobOpportunityDraft } from '~/types/job-opportunities';

interface Props {
	jobOpportunity: JobOpportunityDraft;
}

const props = defineProps<Props>();
const isModalOpen = ref(false);
const { track } = useAnalytics();

function openApplyModal() {
	isModalOpen.value = true;
}

function shareJobOpportunity() {
	track('Share Job', {
		props: {
			job_id: props.jobOpportunity.id || '',
		},
	});

	if (navigator.share) {
		navigator.share({
			title: props.jobOpportunity.title,
			text: props.jobOpportunity.description,
			url: window.location.href,
		});
	}
}
</script>

<style scoped>
.job-cta {
  @apply flex gap-2.5 flex-wrap;
}
</style>

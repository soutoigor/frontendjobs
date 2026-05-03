<template>
	<div class="job-opportunity-cta">
		<UButton
			color="gray"
			variant="outline"
			size="xl"
			@click="shareJobOpportunity"
		>
			Share
		</UButton>
		<UButton
			color="primary"
			variant="solid"
			size="xl"
			@click="isModalOpen = true"
		>
			Apply
		</UButton>

		<ApplyModal
			v-model="isModalOpen"
			:job-id="jobOpportunity.id"
			:job-title="jobOpportunity.title"
			:application-link="jobOpportunity.application_link"
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

function shareJobOpportunity() {
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
.job-opportunity-cta {
  @apply flex gap-4;
}
</style>

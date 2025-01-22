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
			target="_blank"
			color="primary"
			variant="solid"
			size="xl"
			@click="apply"
		>
			Apply
		</UButton>
	</div>
</template>

<script setup lang="ts">
import { useJobOpportunitiesStore } from '~/store/job-opportunities';
import type { JobOpportunityDraft } from '~/types/job-opportunities';

interface Props {
	jobOpportunity: JobOpportunityDraft;
}

const props = defineProps<Props>();
const store = useJobOpportunitiesStore();

function apply() {
	let url = props.jobOpportunity.application_link;

	if (!url.startsWith('http://') && !url.startsWith('https://')) {
		url = 'http://' + url;
	}

	window.open(url, '_blank');

	if (props.jobOpportunity.id) {
		store.apply(props.jobOpportunity.id);
	}
}

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

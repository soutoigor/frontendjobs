<template>
	<div class="job-opportunity-cta">
		<UButton
			color="gray"
			variant="outline"
			size="xl"
			:block="breakpoints.isSmallerOrEqual('sm')"
			@click="shareJobOpportunity"
		>
			Share
		</UButton>
		<UButton
			:to="store.jobOpportunity.application_link"
			target="_blank"
			color="primary"
			variant="solid"
			size="xl"
			:block="breakpoints.isSmallerOrEqual('sm')"
		>
			Apply
		</UButton>
	</div>
</template>

<script setup lang="ts">
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core';
import { useJobOpportunitiesStore } from '~/store/job-opportunities';

const store = useJobOpportunitiesStore();
const breakpoints = useBreakpoints(breakpointsTailwind);

function shareJobOpportunity() {
	if (navigator.share) {
		navigator.share({
			title: store.jobOpportunity.title,
			text: store.jobOpportunity.description,
			url: window.location.href,
		});
	}
}
</script>

<style scoped>
.job-opportunity-cta {
  @apply flex md:flex-row flex-col-reverse items-center justify-center gap-4 w-full max-w-[80%] md:max-w-full;
}
</style>

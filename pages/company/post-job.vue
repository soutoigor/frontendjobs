<template>
	<UContainer
		class="post-job"
		as="article"
	>
		<h1 class="post-job__title">
			Post your job opportunity
		</h1>
		<JobOpportunityForm />
	</UContainer>
</template>

<script setup lang="ts">
import JobOpportunityForm from '~/components/job-opportunities/job-opportunity-form.vue';

definePageMeta({
	layout: 'company',
});
</script>

<style scoped>
.post-job {
	@apply min-h-screen p-0 w-full;

	&__title {
		@apply text-2xl md:text-3xl font-bold mb-6;
	}
}
</style>

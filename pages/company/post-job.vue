<template>
	<UContainer
		class="post-job"
		as="article"
	>
		<h1 class="post-job__title">
			Post your job opportunity
		</h1>
		<p class="post-job__subtitle">
			Fill the listing once, preview it next, then continue to Stripe Checkout. Listings are $99 for 30 days.
		</p>
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
		@apply text-2xl md:text-3xl font-bold mb-2;
	}

	&__subtitle {
		@apply mb-6 max-w-2xl text-sm text-gray-500 md:text-base;
	}
}
</style>

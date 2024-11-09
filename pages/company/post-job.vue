<template>
	<UContainer class="post-job" as="article">
		<h1>Post Job Company</h1>
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
	@apply h-screen w-full;
}
</style>

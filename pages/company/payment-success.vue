<template>
	<UContainer class="payment-success">
		<div class="payment-success__card">
			<UIcon
				name="i-heroicons-check-circle"
				class="payment-success__icon"
			/>
			<h1 class="payment-success__title">
				Payment successful!
			</h1>
			<p class="payment-success__description">
				Your job posting is being processed and will be live shortly.
				We'll send you a confirmation once it's published.
			</p>
			<div class="payment-success__actions">
				<UButton
					size="xl"
					label="Go to Dashboard"
					to="/company/dashboard"
				/>
				<UButton
					size="xl"
					variant="soft"
					label="Post Another Job"
					to="/company/post-job"
				/>
			</div>
		</div>
	</UContainer>
</template>

<script setup lang="ts">
import { useJobOpportunitiesStore } from '~/store/job-opportunities';

definePageMeta({
	layout: 'company',
});

const jobOpportunitiesStore = useJobOpportunitiesStore();

onMounted(() => {
	jobOpportunitiesStore.clearDraftJobOpportunity();
});
</script>

<style scoped>
.payment-success {
	@apply min-h-screen flex items-center justify-center;

	&__card {
		@apply flex flex-col items-center text-center gap-6 max-w-md;
	}

	&__icon {
		@apply w-20 h-20 text-green-500;
	}

	&__title {
		@apply text-3xl font-bold;
	}

	&__description {
		@apply text-gray-500 text-lg;
	}

	&__actions {
		@apply flex flex-col sm:flex-row gap-3 w-full;
	}
}
</style>

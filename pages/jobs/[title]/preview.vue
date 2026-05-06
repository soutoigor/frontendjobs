<template>
	<UContainer
		class="preview"
		as="article"
	>
		<JobOpportunityContent
			v-if="draft"
			:job-opportunity="draft"
		/>
		<UAlert
			class="preview__checkout-note"
			icon="i-heroicons-credit-card"
			color="primary"
			variant="soft"
			:title="`${selectedTier.label} listing: ${selectedTierPrice} for 30 days`"
			description="The next step opens Stripe Checkout. After payment succeeds, the job is published automatically and you return to your company dashboard."
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
				:loading="jobOpportunitiesStore.isSavingJobOpportunity"
				:label="draft?.id ? 'Update and Complete Post' : 'Post Job'"
				@click="postJob"
			/>
		</UContainer>
	</UContainer>
</template>

<script setup lang="ts">
import JobOpportunityContent from '~/components/job-opportunities/job-opportunity-content.vue';
import { useJobOpportunitiesStore } from '~/store/job-opportunities';
import { useCompaniesStore } from '~/store/companies';
import { getPostingTier } from '~/utils/posting-tiers';

definePageMeta({
	layout: 'company',
});

const router = useRouter();
const toast = useToast();
const jobOpportunitiesStore = useJobOpportunitiesStore();
const companiesStore = useCompaniesStore();

const draft = computed(() => jobOpportunitiesStore.draftJobOpportunity);
const selectedTier = computed(() => getPostingTier(draft.value?.posting_tier));
const selectedTierPrice = computed(() => `$${selectedTier.value.price}`);

onMounted(jobOpportunitiesStore.restoreJobOpportunityDraft);

async function postJob() {
	if (!draft.value) {
		return;
	}

	try {
		const { checkoutUrl } = draft.value.id
			? await updateAndCheckoutPendingJob()
			: await jobOpportunitiesStore.createJobOpportunity(draft.value);

		if (checkoutUrl) {
			window.location.href = checkoutUrl;
			return;
		}

		await companiesStore.fetchUserCompany();
		router.push('/company/dashboard');
	}
	catch (error: unknown) {
		const fetchError = error as { status?: number; data?: { error?: unknown } };
		const isValidationError = fetchError.status === 400 && fetchError.data?.error;
		const description = isValidationError
			? 'Review the highlighted fields and try again.'
			: 'An error occurred, please try again.';

		toast.add({
			color: 'rose',
			title: 'Failed to post job',
			description,
		});

		if (isValidationError) {
			await router.push('/company/post-job');
		}
	}
}

async function updateAndCheckoutPendingJob() {
	if (!draft.value?.id) {
		return { checkoutUrl: null };
	}

	await jobOpportunitiesStore.updateJobOpportunity(draft.value.id, draft.value);
	return jobOpportunitiesStore.checkoutJobOpportunity(draft.value.id);
}
</script>

<style scoped>
.preview {
  @apply min-h-screen p-0 w-full;

  &__checkout-note {
    @apply mt-8;
  }

  &__actions-wrapper {
    @apply mt-8 grid grid-cols-2 gap-4;
  }
}
</style>

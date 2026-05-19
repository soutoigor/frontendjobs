<template>
	<div class="post-job">
		<!-- Step indicator -->
		<div class="post-job__steps">
			<template
				v-for="(label, i) in stepLabels"
				:key="label"
			>
				<div
					class="post-job__step"
					:class="{ 'post-job__step--active': currentStep >= i + 1 }"
				>
					<span class="post-job__step-circle">
						{{ currentStep > i + 1 ? '✓' : i + 1 }}
					</span>
					<span class="post-job__step-label">{{ label }}</span>
				</div>
				<div
					v-if="i < stepLabels.length - 1"
					class="post-job__step-line"
					:class="{ 'post-job__step-line--active': currentStep > i + 1 }"
				/>
			</template>
		</div>

		<!-- Step heading -->
		<div class="post-job__heading">
			<h1 class="post-job__title">
				{{ currentStepTitle }}
			</h1>
			<p class="post-job__subtitle">
				{{ currentStepSubtitle }}
			</p>
		</div>

		<!-- Step 1: Form -->
		<JobOpportunityForm
			v-if="currentStep === 1"
			@next="currentStep = 2"
		/>

		<!-- Step 2: Preview -->
		<div v-if="currentStep === 2 && jobOpportunitiesStore.draftJobOpportunity">
			<div class="post-job__preview-banner">
				<FjIcon
					name="eye"
					:size="13"
					color="#a78bfa"
				/>
				<span>Preview — this is exactly what candidates will see.</span>
			</div>
			<JobOpportunityContent :job-opportunity="jobOpportunitiesStore.draftJobOpportunity" />
		</div>

		<!-- Step 3: Checkout -->
		<div
			v-if="currentStep === 3"
			class="post-job__checkout"
		>
			<div class="post-job__checkout-grid">
				<section class="post-job__tier-panel">
					<div class="post-job__section-label">
						Choose visibility
					</div>
					<button
						v-for="tier in postingTiers"
						:key="tier.key"
						type="button"
						class="post-job__tier-option"
						:class="{ 'post-job__tier-option--active': selectedTier.key === tier.key }"
						@click="selectTier(tier.key)"
					>
						<span class="post-job__tier-topline">
							<span class="post-job__tier-name">{{ tier.label }}</span>
							<span class="post-job__tier-price">${{ tier.price }}</span>
						</span>
						<span class="post-job__tier-description">{{ tier.description }}</span>
					</button>
				</section>

				<section class="post-job__preview-panel">
					<div class="post-job__section-label">
						Homepage preview
					</div>
					<JobOpportunityCard
						v-if="cardPreviewJob"
						:job-opportunity="cardPreviewJob"
						:interactive="false"
					/>
				</section>

				<section class="post-job__checkout-card">
					<div class="post-job__section-label">
						Order summary
					</div>
					<div class="post-job__checkout-item">
						<div class="post-job__checkout-item-title">
							{{ jobOpportunitiesStore.draftJobOpportunity?.title || 'Your job post' }}
						</div>
						<div class="post-job__checkout-muted">
							30-day {{ selectedTier.label.toLowerCase() }} listing
						</div>
					</div>
					<div class="post-job__checkout-row">
						<span class="post-job__checkout-muted">{{ selectedTier.label }} listing</span>
						<span class="post-job__checkout-value">{{ selectedTierPrice }}</span>
					</div>
					<div class="post-job__checkout-total">
						<span class="post-job__checkout-total-label">Total</span>
						<span class="post-job__checkout-total-value">{{ selectedTierPrice }}</span>
					</div>
					<div class="post-job__checkout-note">
						<strong>Live in seconds.</strong>
						Payment confirmation publishes your post and uses your company Application email for the receipt.
					</div>
				</section>
			</div>
		</div>

		<!-- Navigation buttons -->
		<div class="post-job__nav">
			<UButton
				v-if="currentStep > 1"
				variant="soft"
				color="gray"
				size="lg"
				@click="currentStep--"
			>
				← Back
			</UButton>
			<div class="flex-1" />
			<UButton
				v-if="currentStep === 2"
				size="lg"
				:trailing-icon="previewPrimaryIcon"
				:loading="isSubmitting && isEditingPublishedJob"
				@click="handlePreviewPrimary"
			>
				{{ previewPrimaryLabel }}
			</UButton>
			<UButton
				v-if="currentStep === 3"
				size="lg"
				icon="i-heroicons-lock-closed-20-solid"
				:loading="isSubmitting"
				@click="submitAndCheckout"
			>
				Pay {{ selectedTierPrice }} with Stripe
			</UButton>
		</div>
	</div>
</template>

<script setup lang="ts">
import FjIcon from '~/components/shared/fj-icon.vue';
import JobOpportunityForm from '~/components/job-opportunities/job-opportunity-form.vue';
import JobOpportunityContent from '~/components/job-opportunities/job-opportunity-content.vue';
import JobOpportunityCard from '~/components/job-opportunities/job-opportunity-card.vue';
import { useJobOpportunitiesStore } from '~/store/job-opportunities';
import { useCompaniesStore } from '~/store/companies';
import type { Company } from '~/types/companies';
import type { JobOpportunity, JobOpportunityDraft, JobPostingTier } from '~/types/job-opportunities';
import { getPostingTier, postingTiers } from '~/utils/posting-tiers';

definePageMeta({
	layout: 'company',
});

const jobOpportunitiesStore = useJobOpportunitiesStore();
const companiesStore = useCompaniesStore();
const toast = useToast();
const router = useRouter();
const { track } = useAnalytics();
const currentStep = ref(1);
const isSubmitting = ref(false);

const draftJob = computed(() => jobOpportunitiesStore.draftJobOpportunity);
const isEditingPublishedJob = computed(() => Boolean(draftJob.value?.id && draftJob.value.status === 'published'));
const isEditingPendingJob = computed(() => Boolean(draftJob.value?.id && draftJob.value.status === 'pending_payment'));

const stepLabels = computed(() => isEditingPublishedJob.value
	? ['Details', 'Preview']
	: ['Details', 'Preview', 'Checkout']);
const stepTitles = computed(() => {
	if (isEditingPublishedJob.value) {
		return ['Edit job', 'Review changes'];
	}

	if (isEditingPendingJob.value) {
		return ['Edit pending job', 'Preview your post', 'Complete payment'];
	}

	return ['Post a job', 'Preview your post', 'Complete payment'];
});
const stepSubtitles = computed(() => {
	if (isEditingPublishedJob.value) {
		return [
			'Update the listing details. Simple content edits do not require another payment.',
			'Review the updated listing before saving it live.',
		];
	}

	if (isEditingPendingJob.value) {
		return [
			'Update the listing before payment. You will only pay once when you complete checkout.',
			'This is exactly how candidates will see your role.',
			'Choose visibility, preview the homepage card, then pay once through Stripe.',
		];
	}

	return [
		'Fill the listing once — preview before publishing. Plans start at $99 for a 30-day post.',
		'This is exactly how candidates will see your role.',
		'Choose visibility, preview the homepage card, then pay once through Stripe.',
	];
});
const currentStepTitle = computed(() => stepTitles.value[currentStep.value - 1]);
const currentStepSubtitle = computed(() => stepSubtitles.value[currentStep.value - 1]);
const previewPrimaryLabel = computed(() => isEditingPublishedJob.value ? 'Save changes' : 'Continue to payment');
const previewPrimaryIcon = computed(() => isEditingPublishedJob.value
	? 'i-heroicons-check-20-solid'
	: 'i-heroicons-arrow-right-20-solid');

const selectedTier = computed(() => getPostingTier(jobOpportunitiesStore.draftJobOpportunity?.posting_tier));
const selectedTierPrice = computed(() => `$${selectedTier.value.price}.00`);

const placeholderCompany: Company = {
	id: 'preview-company',
	name: 'Your Company',
	avatar: '',
	location: '',
	user_id: '',
	industry: '',
	socials: {},
	created_at: '',
	updated_at: '',
};

const cardPreviewJob = computed<JobOpportunity | undefined>(() => {
	const draft = jobOpportunitiesStore.draftJobOpportunity;

	if (!draft) {
		return undefined;
	}

	return {
		...draft,
		id: draft.id || 'preview-job',
		title: draft.title || 'Senior Frontend Engineer',
		location: draft.location || 'Worldwide',
		currency: draft.currency || 'USD',
		application_link: draft.application_link || 'https://company.com/careers',
		employment_type: draft.employment_type?.length ? draft.employment_type : ['Full-time'],
		technologies: draft.technologies || [],
		date_posted: draft.date_posted || new Date().toISOString(),
		status: 'published',
		posting_tier: selectedTier.value.key,
		company: draft.company || companiesStore.userCompany || placeholderCompany,
	};
});

function selectTier(tier: JobPostingTier) {
	jobOpportunitiesStore.updateDraftPostingTier(tier);
}

async function handlePreviewPrimary() {
	if (isEditingPublishedJob.value) {
		await savePublishedJob();
		return;
	}

	currentStep.value = 3;
}

function handleSubmissionError(error: unknown) {
	const fetchError = error as { status?: number; data?: { error?: unknown } };
	const isValidationError = fetchError.status === 400 && fetchError.data?.error;

	toast.add({
		color: 'rose',
		title: isValidationError ? 'Could not save job' : 'Something went wrong',
		description: isValidationError
			? 'Review the highlighted fields and try again.'
			: 'Please try again.',
	});

	if (isValidationError) {
		currentStep.value = 1;
	}
}

async function savePublishedJob() {
	const draft = jobOpportunitiesStore.draftJobOpportunity;
	if (!draft?.id) {
		toast.add({
			color: 'rose',
			title: 'No job to update',
			description: 'Please return to your dashboard and try again.',
		});
		return;
	}

	isSubmitting.value = true;
	try {
		await jobOpportunitiesStore.updateJobOpportunity(draft.id, draft);
		await companiesStore.fetchUserCompany();
		jobOpportunitiesStore.clearDraftJobOpportunity();

		toast.add({
			color: 'green',
			title: 'Job updated',
			description: 'Your live listing has been saved.',
		});

		await router.push('/company/dashboard');
	}
	catch (error: unknown) {
		handleSubmissionError(error);
	}
	finally {
		isSubmitting.value = false;
	}
}

async function submitAndCheckout() {
	const draft = jobOpportunitiesStore.draftJobOpportunity;
	if (!draft) {
		toast.add({
			color: 'rose',
			title: 'No draft to submit',
			description: 'Please fill out the form first.',
		});
		return;
	}

	isSubmitting.value = true;
	try {
		track('Checkout Started', {
			props: {
				posting_tier: selectedTier.value.key,
				price: selectedTier.value.price,
				is_existing_pending_job: Boolean(draft.id),
			},
		});

		const response = draft.id
			? await updateAndCheckoutPendingJob(draft.id, draft)
			: await jobOpportunitiesStore.createJobOpportunity(draft);

		if (response?.checkoutUrl) {
			window.location.href = response.checkoutUrl;
		}
	}
	catch (error: unknown) {
		handleSubmissionError(error);
	}
	finally {
		isSubmitting.value = false;
	}
}

async function updateAndCheckoutPendingJob(id: string, draft: JobOpportunityDraft) {
	await jobOpportunitiesStore.updateJobOpportunity(id, draft);
	return jobOpportunitiesStore.checkoutJobOpportunity(id);
}

watch(isEditingPublishedJob, (isEditingPaidListing) => {
	if (isEditingPaidListing && currentStep.value > 2) {
		currentStep.value = 2;
	}
});

onMounted(() => {
	track('Post Job Started', {
		props: {
			has_draft: Boolean(jobOpportunitiesStore.draftJobOpportunity),
		},
	});
});
</script>

<style scoped>
.post-job {
  @apply min-h-screen w-full max-w-5xl mx-auto;

  &__steps {
    @apply flex items-center gap-4 mb-2;
  }

  &__step {
    @apply flex items-center gap-2;
    color: var(--fj-text-muted);

    &--active {
      color: var(--fj-text);
    }
  }

  &__step-circle {
    @apply w-6 h-6 rounded-full font-mono text-xs font-bold inline-flex items-center justify-center;
    background: var(--fj-surface-muted);
    color: #6b7280;

    .post-job__step--active & {
      @apply bg-violet-400 text-surface;
    }
  }

  &__step-label {
    @apply text-xs font-medium;
  }

  &__step-line {
    @apply flex-1 h-px;
    background: var(--fj-border-strong);

    &--active {
      @apply bg-violet-400;
    }
  }

  &__heading {
    @apply mt-7 mb-7;
  }

  &__title {
    @apply text-3xl font-bold;
    color: var(--fj-text);
    letter-spacing: -1.2px;
  }

  &__subtitle {
    @apply text-sm mt-2 leading-relaxed;
    color: var(--fj-text-muted);
  }

  &__preview-banner {
    @apply flex items-center gap-2 px-3 py-2 rounded-lg mb-5 text-xs text-violet-400;
    background: rgba(167, 139, 250, 0.07);
    border: 1px solid rgba(167, 139, 250, 0.19);
  }

  &__checkout {
    @apply w-full;
  }

  &__checkout-grid {
    @apply grid gap-4;
    grid-template-columns: minmax(240px, 0.75fr) minmax(320px, 1.4fr) minmax(260px, 0.85fr);
  }

  &__tier-panel,
  &__preview-panel,
  &__checkout-card {
    @apply rounded-xl p-6 flex flex-col gap-4;
    background: var(--fj-surface);
    border: 1px solid var(--fj-border);
  }

  &__tier-option {
    @apply w-full text-left rounded-lg p-3 transition-colors;
    border: 1px solid var(--fj-border);
    background: var(--fj-surface-muted);

    &:hover {
      border-color: var(--fj-border-strong);
    }

    &--active {
      border-color: var(--fj-success-border);
      background: var(--fj-success-bg);
    }
  }

  &__tier-topline {
    @apply flex items-center justify-between gap-3;
  }

  &__tier-name {
    @apply text-sm font-semibold;
    color: var(--fj-text);
  }

  &__tier-price {
    @apply font-mono text-sm;
    color: var(--fj-text);
  }

  &__tier-description {
    @apply block text-xs leading-relaxed mt-1.5;
    color: var(--fj-text-muted);
  }

  &__section-label {
    @apply font-mono text-xs uppercase tracking-wider;
    color: var(--fj-text-muted);
  }

  &__checkout-item {
    @apply pb-4;
    border-bottom: 1px solid var(--fj-border);
  }

  &__checkout-item-title {
    @apply text-sm font-semibold mb-1;
    color: var(--fj-text);
  }

  &__checkout-row {
    @apply flex justify-between text-sm;
  }

  &__checkout-total {
    @apply flex justify-between items-baseline pt-2;
    border-top: 1px solid var(--fj-border);
  }

  &__checkout-note {
    @apply text-xs leading-relaxed p-3 rounded-lg;
    color: var(--fj-text-soft);
    background: rgba(167, 139, 250, 0.06);
    border: 1px solid rgba(167, 139, 250, 0.15);

    strong {
      color: var(--fj-text);
    }
  }

  &__checkout-muted {
    @apply text-xs;
    color: var(--fj-text-muted);
  }

  &__checkout-value {
    @apply font-mono text-sm;
    color: var(--fj-text);
  }

  &__checkout-total-label {
    @apply font-semibold;
    color: var(--fj-text);
  }

  &__checkout-total-value {
    @apply font-mono text-xl font-semibold;
    color: var(--fj-text);
  }

  &__nav {
    @apply flex gap-2.5 mt-8;
  }
}

@media (max-width: 1023px) {
  .post-job {
    &__checkout-grid {
      grid-template-columns: 1fr;
    }
  }
}
</style>

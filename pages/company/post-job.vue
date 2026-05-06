<template>
	<div class="post-job">
		<!-- Step indicator -->
		<div class="post-job__steps">
			<template
				v-for="(label, i) in stepLabels"
				:key="i"
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
					v-if="i < 2"
					class="post-job__step-line"
					:class="{ 'post-job__step-line--active': currentStep > i + 1 }"
				/>
			</template>
		</div>

		<!-- Step heading -->
		<div class="post-job__heading">
			<h1 class="post-job__title">
				{{ stepTitles[currentStep - 1] }}
			</h1>
			<p class="post-job__subtitle">
				{{ stepSubtitles[currentStep - 1] }}
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
			<div class="post-job__checkout-card">
				<div class="post-job__section-label">
					Order summary
				</div>
				<div class="post-job__checkout-item">
					<div class="post-job__checkout-item-title">
						{{ jobOpportunitiesStore.draftJobOpportunity?.title || 'Your job post' }}
					</div>
					<div class="text-xs text-gray-400">
						30-day standard listing
					</div>
				</div>
				<div class="post-job__checkout-row">
					<span class="text-gray-400">Listing</span>
					<span class="font-mono text-gray-200">$99.00</span>
				</div>
				<div class="post-job__checkout-total">
					<span class="font-semibold text-white">Total</span>
					<span class="font-mono text-xl font-semibold text-white">$99.00</span>
				</div>
				<div class="post-job__checkout-note">
					<strong class="text-white">Live in seconds.</strong>
					Payment confirmation publishes your post and sends you an email receipt.
				</div>
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
				trailing-icon="i-heroicons-arrow-right-20-solid"
				@click="currentStep = 3"
			>
				Continue to payment
			</UButton>
			<UButton
				v-if="currentStep === 3"
				size="lg"
				icon="i-heroicons-lock-closed-20-solid"
				:loading="isSubmitting"
				@click="submitAndCheckout"
			>
				Pay $99 with Stripe
			</UButton>
		</div>
	</div>
</template>

<script setup lang="ts">
import FjIcon from '~/components/shared/fj-icon.vue';
import JobOpportunityForm from '~/components/job-opportunities/job-opportunity-form.vue';
import JobOpportunityContent from '~/components/job-opportunities/job-opportunity-content.vue';
import { useJobOpportunitiesStore } from '~/store/job-opportunities';

definePageMeta({
	layout: 'company',
});

const jobOpportunitiesStore = useJobOpportunitiesStore();
const toast = useToast();
const currentStep = ref(1);
const isSubmitting = ref(false);

const stepLabels = ['Details', 'Preview', 'Checkout'];
const stepTitles = ['Post a job', 'Preview your post', 'Complete payment'];
const stepSubtitles = [
	'Fill the listing once — preview before publishing. $99 for a 30-day post.',
	'This is exactly how candidates will see your role.',
	'One-time $99 payment via Stripe. Your post goes live the moment payment completes.',
];

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
		const response = await jobOpportunitiesStore.createJobOpportunity(draft);

		if (response?.checkoutUrl) {
			window.location.href = response.checkoutUrl;
		}
	}
	catch {
		toast.add({
			color: 'rose',
			title: 'Something went wrong',
			description: 'Please try again.',
		});
	}
	finally {
		isSubmitting.value = false;
	}
}
</script>

<style scoped>
.post-job {
  @apply min-h-screen w-full max-w-5xl mx-auto;

  &__steps {
    @apply flex items-center gap-4 mb-2;
  }

  &__step {
    @apply flex items-center gap-2 text-gray-500;

    &--active {
      @apply text-white;
    }
  }

  &__step-circle {
    @apply w-6 h-6 rounded-full font-mono text-xs font-bold inline-flex items-center justify-center;
    background: rgba(255, 255, 255, 0.06);
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
    background: rgba(255, 255, 255, 0.08);

    &--active {
      @apply bg-violet-400;
    }
  }

  &__heading {
    @apply mt-7 mb-7;
  }

  &__title {
    @apply text-3xl font-bold text-white;
    letter-spacing: -1.2px;
  }

  &__subtitle {
    @apply text-sm text-gray-400 mt-2 leading-relaxed;
  }

  &__preview-banner {
    @apply flex items-center gap-2 px-3 py-2 rounded-lg mb-5 text-xs text-violet-400;
    background: rgba(167, 139, 250, 0.07);
    border: 1px solid rgba(167, 139, 250, 0.19);
  }

  &__checkout {
    @apply max-w-sm;
  }

  &__checkout-card {
    @apply rounded-xl p-6 flex flex-col gap-4;
    background: rgba(15, 17, 23, 0.6);
    border: 1px solid rgba(255, 255, 255, 0.06);
  }

  &__section-label {
    @apply font-mono text-xs text-gray-500 uppercase tracking-wider;
  }

  &__checkout-item {
    @apply pb-4;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  }

  &__checkout-item-title {
    @apply text-sm font-semibold text-white mb-1;
  }

  &__checkout-row {
    @apply flex justify-between text-sm;
  }

  &__checkout-total {
    @apply flex justify-between items-baseline pt-2;
    border-top: 1px solid rgba(255, 255, 255, 0.06);
  }

  &__checkout-note {
    @apply text-xs text-gray-300 leading-relaxed p-3 rounded-lg;
    background: rgba(167, 139, 250, 0.06);
    border: 1px solid rgba(167, 139, 250, 0.15);
  }

  &__nav {
    @apply flex gap-2.5 mt-8;
  }
}
</style>

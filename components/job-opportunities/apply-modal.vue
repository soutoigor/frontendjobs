<template>
	<UModal v-model="isOpen">
		<div class="apply-modal">
			<!-- Header -->
			<div class="apply-modal__header">
				<span class="apply-modal__step-label">
					STEP {{ step }} OF 2
				</span>
				<button
					class="apply-modal__close"
					@click="isOpen = false"
				>
					<FjIcon
						name="close"
						:size="14"
						color="#6b7280"
					/>
				</button>
			</div>

			<!-- Step 1: Form -->
			<template v-if="step === 1">
				<h2 class="apply-modal__title">
					Apply to {{ jobTitle }}
				</h2>
				<p class="apply-modal__subtitle">
					You'll be redirected to {{ companyName }}'s application after this. Optional info helps us improve match quality.
				</p>
				<div class="apply-modal__fields">
					<UFormGroup label="Your name">
						<UInput
							v-model="form.name"
							placeholder="Jane Developer"
							size="lg"
						/>
					</UFormGroup>
					<UFormGroup label="Email">
						<UInput
							v-model="form.email"
							type="email"
							placeholder="jane@example.com"
							size="lg"
							icon="i-heroicons-envelope-20-solid"
						/>
						<template #hint>
							We'll only contact you about this role
						</template>
					</UFormGroup>
					<UFormGroup label="Portfolio / GitHub (optional)">
						<UInput
							v-model="form.portfolio"
							placeholder="github.com/janedev"
							size="lg"
							icon="i-heroicons-link-20-solid"
						/>
					</UFormGroup>
				</div>
				<div class="apply-modal__actions">
					<UButton
						variant="soft"
						color="gray"
						size="lg"
						block
						@click="isOpen = false"
					>
						Cancel
					</UButton>
					<UButton
						size="lg"
						block
						trailing-icon="i-heroicons-arrow-right-20-solid"
						:loading="loading"
						@click="submit(false)"
					>
						Continue to apply
					</UButton>
				</div>
			</template>

			<!-- Step 2: Confirmation -->
			<template v-if="step === 2">
				<div class="apply-modal__confirmation">
					<div class="apply-modal__check-circle">
						<FjIcon
							name="check"
							:size="26"
							color="#bef264"
						/>
					</div>
					<h2 class="apply-modal__title apply-modal__title--center">
						You're all set
					</h2>
					<p class="apply-modal__subtitle apply-modal__subtitle--center">
						Opening {{ companyName }}'s application page in a new tab.
					</p>
					<UButton
						size="lg"
						block
						trailing-icon="i-heroicons-arrow-top-right-on-square-20-solid"
						@click="isOpen = false"
					>
						Continue to {{ companyName }}
					</UButton>
				</div>
			</template>
		</div>
	</UModal>
</template>

<script setup lang="ts">
import FjIcon from '~/components/shared/fj-icon.vue';
import { useJobOpportunitiesStore } from '~/store/job-opportunities';
import { getApplicationHref } from '~/utils/links';

interface Props {
	modelValue: boolean;
	jobId: string;
	jobTitle: string;
	applicationLink: string;
	companyName: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{ (e: 'update:modelValue', value: boolean): void }>();

const store = useJobOpportunitiesStore();
const loading = ref(false);
const step = ref(1);
const form = reactive({ name: '', email: '', portfolio: '' });

const isOpen = computed({
	get: () => props.modelValue,
	set: (value) => {
		emit('update:modelValue', value);
		if (!value) {
			step.value = 1;
		}
	},
});

function openExternalLink() {
	window.open(getApplicationHref(props.applicationLink), '_blank');
}

async function submit(anonymous: boolean) {
	loading.value = true;

	openExternalLink();

	await store.apply(props.jobId, anonymous ? {} : { name: form.name, email: form.email });

	loading.value = false;
	step.value = 2;
	form.name = '';
	form.email = '';
	form.portfolio = '';
}
</script>

<style scoped>
.apply-modal {
  @apply p-7;

  &__header {
    @apply flex items-center justify-between mb-5;
  }

  &__step-label {
    @apply font-mono text-violet-400 tracking-wider;
    font-size: 10.5px;
  }

  &__close {
    @apply bg-transparent border-none cursor-pointer p-1;
  }

  &__title {
    @apply text-xl font-bold text-white mb-1.5;
    letter-spacing: -0.5px;

    &--center {
      @apply text-center;
    }
  }

  &__subtitle {
    @apply text-sm text-gray-400 mb-5 leading-relaxed;

    &--center {
      @apply text-center;
    }
  }

  &__fields {
    @apply flex flex-col gap-3.5;
  }

  &__actions {
    @apply flex gap-2 mt-5;
  }

  &__confirmation {
    @apply text-center py-5;
  }

  &__check-circle {
    @apply w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center;
    background: rgba(190, 242, 100, 0.10);
    border: 1px solid rgba(190, 242, 100, 0.30);
  }
}
</style>

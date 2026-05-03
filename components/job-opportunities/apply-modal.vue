<template>
	<UModal v-model="isOpen">
		<UCard>
			<template #header>
				<h3 class="apply-modal__title">
					Apply for <span class="text-primary">{{ jobTitle }}</span>
				</h3>
				<p class="apply-modal__subtitle">
					Share your details with the company — completely optional.
				</p>
			</template>

			<div class="apply-modal__fields">
				<UFormGroup label="Your name">
					<UInput
						v-model="form.name"
						placeholder="Jane Doe"
						size="lg"
					/>
				</UFormGroup>
				<UFormGroup label="Your email">
					<UInput
						v-model="form.email"
						type="email"
						placeholder="jane@example.com"
						size="lg"
					/>
				</UFormGroup>
			</div>

			<template #footer>
				<div class="apply-modal__actions">
					<UButton
						variant="ghost"
						color="gray"
						label="Skip"
						size="lg"
						@click="submit(true)"
					/>
					<UButton
						:loading="loading"
						label="Apply & Continue"
						size="lg"
						trailing-icon="i-heroicons-arrow-top-right-on-square"
						@click="submit(false)"
					/>
				</div>
			</template>
		</UCard>
	</UModal>
</template>

<script setup lang="ts">
import { useJobOpportunitiesStore } from '~/store/job-opportunities';

interface Props {
	modelValue: boolean;
	jobId: string;
	jobTitle: string;
	applicationLink: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{ (e: 'update:modelValue', value: boolean): void }>();

const store = useJobOpportunitiesStore();
const loading = ref(false);
const form = reactive({ name: '', email: '' });

const isOpen = computed({
	get: () => props.modelValue,
	set: (value) => emit('update:modelValue', value),
});

function openExternalLink() {
	let url = props.applicationLink;
	if (!url.startsWith('http://') && !url.startsWith('https://')) {
		url = 'https://' + url;
	}
	window.open(url, '_blank');
}

async function submit(anonymous: boolean) {
	loading.value = true;

	openExternalLink();

	await store.apply(props.jobId, anonymous ? {} : { name: form.name, email: form.email });

	loading.value = false;
	isOpen.value = false;
	form.name = '';
	form.email = '';
}
</script>

<style scoped>
.apply-modal {
	&__title {
		@apply text-lg font-bold;
	}

	&__subtitle {
		@apply text-sm text-gray-500 mt-1;
	}

	&__fields {
		@apply flex flex-col gap-4;
	}

	&__actions {
		@apply flex justify-end gap-3;
	}
}
</style>

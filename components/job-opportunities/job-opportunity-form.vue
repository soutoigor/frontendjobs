<template>
	<UForm
		:schema="schema"
		:state="state"
		class="job-opportunity-form"
		@submit="onSubmit"
	>
		<div class="job-opportunity-form__form-section">
			<UFormGroup
				size="lg"
				label="Title"
				:ui="{ error: 'hidden' }"
				name="title"
				class="col-span-12 md:col-span-8"
			>
				<UInput
					v-model="state.title"
					placeholder="Junior Frontend Remote (Vue)"
				/>
			</UFormGroup>

			<UFormGroup
				size="lg"
				label="Location"
				:ui="{ error: 'hidden' }"
				name="location"
				class="col-span-12 md:col-span-3"
			>
				<USelectMenu
					v-model="state.location"
					:options="options.locations.value"
					searchable
				/>
			</UFormGroup>

			<UFormGroup
				size="lg"
				label="Remote"
				:ui="{ error: 'hidden' }"
				name="remote"
				class="col-span-12 md:col-span-1 flex flex-col items-center gap-2"
			>
				<UCheckbox
					v-model="state.remote"
					:ui="{ base: 'w-6 h-6' }"
				/>
			</UFormGroup>
		</div>

		<div class="job-opportunity-form__form-section">
			<UFormGroup
				size="lg"
				label="Currency"
				:ui="{ error: 'hidden' }"
				name="currency"
				class="col-span-12 md:col-span-4"
			>
				<USelectMenu
					v-model="state.currency"
					placeholder="USD"
					:options="options.currencies.value"
					searchable
				/>
			</UFormGroup>

			<UFormGroup
				size="lg"
				label="Salary Minimum"
				:ui="{ error: 'hidden' }"
				name="salary_minimum"
				class="col-span-12 md:col-span-4"
			>
				<UInput
					placeholder="40,000"
					:model-value="state.salary_minimum"
					@update:model-value="setSalaryMinimum(format($event, config))"
				>
					<template #trailing>
						<span class="job-opportunity-form__trailing-currency">
							year
						</span>
					</template>
				</UInput>
			</UFormGroup>

			<UFormGroup
				size="lg"
				label="Salary Maximum"
				:ui="{ error: 'hidden' }"
				name="salary_maximum"
				class="col-span-12 md:col-span-4"
			>
				<UInput
					placeholder="60,000"
					:model-value="state.salary_maximum"
					@update:model-value="setSalaryMaximum(format($event, config))"
				>
					<template #trailing>
						<span class="job-opportunity-form__trailing-currency">
							year
						</span>
					</template>
				</UInput>
			</UFormGroup>
		</div>

		<div class="job-opportunity-form__form-section">
			<UFormGroup
				size="lg"
				label="Employment Type"
				:ui="{ error: 'hidden' }"
				name="employment_type"
				class="col-span-12 md:col-span-4"
			>
				<USelectMenu
					v-model="state.employment_type"
					:options="options.employmentTypes.value"
					multiple
				>
					<template #label>
						<span
							v-if="state.employment_type.length"
							class="truncate"
						>{{ state.employment_type.join(', ') }}</span>
						<span v-else>Select employment type</span>
					</template>
				</USelectMenu>
			</UFormGroup>

			<UFormGroup
				size="lg"
				label="Seniority"
				:ui="{ error: 'hidden' }"
				name="seniority"
				class="col-span-12 md:col-span-4"
			>
				<USelectMenu
					v-model="state.seniority"
					:options="options.seniorities.value"
					multiple
				>
					<template #label>
						<span
							v-if="state.seniority?.length"
							class="truncate"
							v-text="state.seniority?.join(', ')"
						/>
						<span v-else>Select seniorities</span>
					</template>
				</USelectMenu>
			</UFormGroup>

			<UFormGroup
				size="lg"
				label="Technologies"
				:ui="{ error: 'hidden' }"
				name="technologies"
				class="col-span-12 md:col-span-4"
			>
				<USelectMenu
					v-model="state.technologies"
					option-attribute="name"
					:options="options.technologies.value"
					multiple
				>
					<template #label>
						<span
							v-if="state.technologies.length"
							class="truncate"
							v-text="state.technologies.map(x => x.name).join(', ')"
						/>
						<span v-else>Select technologies</span>
					</template>
				</USelectMenu>
			</UFormGroup>
		</div>

		<UFormGroup
			label="Application Link or Email"
			name="application_link"
			:ui="{ error: 'hidden' }"
			class="col-span-12 md:col-span-12"
			required
		>
			<UInput v-model="state.application_link" />
		</UFormGroup>

		<UFormGroup
			label="Job Description"
			name="description"
			:ui="{ error: 'hidden' }"
			required
			class="col-span-12 md:col-span-12 h-full"
		>
			<ClientOnly>
				<TiptapEditor v-model="state.description" />
			</ClientOnly>
		</UFormGroup>

		<UButton
			block
			type="submit"
			size="xl"
			label="Preview Job Post"
			icon="i-heroicons-arrow-right"
			trailing
		/>
	</UForm>
</template>

<script setup lang="ts">
import * as Yup from 'yup';
import { type InferType } from 'yup';
import { format } from 'v-money3';
import type { FormSubmitEvent } from '#ui/types';
import { useJobOpportunitiesStore } from '~/store/job-opportunities';
import type { JobOpportunityDraft } from '~/types/job-opportunities';
import { useFilterOptions } from '~/composables/use-filter-options';
import TiptapEditor from '~/components/shared/tiptap-editor.vue';

const jobOpportunityStore = useJobOpportunitiesStore();
const toast = useToast();
const router = useRouter();
const options = useFilterOptions();

type Schema = InferType<typeof schema>;

const config = {
	prefix: '',
	suffix: '',
	thousands: ',',
	decimal: '.',
	precision: 2,
	disableNegative: true,
	disabled: false,
	min: null,
	max: null,
	allowBlank: true,
	minimumNumberOfCharacters: 0,
	shouldRound: false,
	focusOnRight: false,
};
const schema = Yup.object({
	title: Yup.string().required(),
	location: Yup.string().required(),
	description: Yup.string().required(),
	remote: Yup.boolean().required(),
	salary_minimum: Yup.string(),
	salary_maximum: Yup.string(),
	currency: Yup.string().required(),
	employment_type: Yup.array().of(Yup.string().required()).required(),
	seniority: Yup.array().of(Yup.string().required()).required(),
	application_link: Yup.string().required(),
	technologies: Yup.array().of(Yup.object({
		id: Yup.string().required(),
		name: Yup.string().required(),
		created_at: Yup.string().required(),
		updated_at: Yup.string().required(),
	})).required(),
});

const state = reactive<JobOpportunityDraft>({
	title: '',
	location: 'Worldwide',
	remote: false,
	description: '',
	salary_minimum: '',
	salary_maximum: '',
	currency: options.currencies.value[0],
	employment_type: [],
	seniority: [],
	date_posted: undefined,
	application_link: '',
	technologies: [],
});

onMounted(() => {
	jobOpportunityStore.restoreJobOpportunityDraft();
	Object.assign(state, jobOpportunityStore.draftJobOpportunity);
});

watch(
	() => state,
	() => {
		jobOpportunityStore.setDraftJobOpportunity(state);
	},
	{ deep: true },
);

async function onSubmit(event: FormSubmitEvent<Schema>) {
	if (!(await schema.isValid(event.data))) {
		return toast.add({
			color: 'rose',
			title: 'Invalid form',
			description: 'Please fill in the required fields',
		});
	};

	jobOpportunityStore.setDraftJobOpportunity(event.data);

	router.push(`/jobs/${state.title.replaceAll(' ', '-')}/preview`);
}

function setSalaryMinimum(value: string) {
	state.salary_minimum = value.replace(/[^0-9,.]/g, '');
}

function setSalaryMaximum(value: string) {
	state.salary_maximum = value.replace(/[^0-9,.]/g, '');
}
</script>

<style scoped>
.job-opportunity-form {
  @apply w-full flex flex-col gap-4 items-stretch;

  &__form-section {
    @apply grid grid-cols-12 gap-4 items-center;
  }

  &__trailing-currency {
    @apply text-gray-500 dark:text-gray-400 text-xs;
  }
}
</style>

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
				name="title"
				required
				:error="fieldError('title')"
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
				name="location"
				required
				:error="fieldError('location')"
				class="col-span-12 md:col-span-3"
			>
				<USelectMenu
					v-model="state.location"
					:options="options.locations.value"
					placeholder="Search location"
					searchable
					searchable-placeholder="Search location"
				/>
			</UFormGroup>

			<UFormGroup
				size="lg"
				label="Remote"
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
				name="currency"
				required
				:error="fieldError('currency')"
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
				name="salary_minimum"
				required
				:error="fieldError('salary_minimum')"
				help="Enter the annual amount normally, for example 90000."
				class="col-span-12 md:col-span-4"
			>
				<UInput
					placeholder="90,000"
					inputmode="numeric"
					:model-value="state.salary_minimum"
					@update:model-value="setSalaryMinimum"
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
				name="salary_maximum"
				required
				:error="fieldError('salary_maximum')"
				help="Candidates will see this as a yearly salary range."
				class="col-span-12 md:col-span-4"
			>
				<UInput
					placeholder="120,000"
					inputmode="numeric"
					:model-value="state.salary_maximum"
					@update:model-value="setSalaryMaximum"
				>
					<template #trailing>
						<span class="job-opportunity-form__trailing-currency">
							year
						</span>
					</template>
				</UInput>
			</UFormGroup>
		</div>

		<div class="job-opportunity-form__salary-nudge">
			<FjIcon
				name="spark"
				:size="11"
				color="var(--fj-success-text)"
			/>
			<span>Salary range will be shown clearly on the listing.</span>
		</div>

		<div class="job-opportunity-form__form-section">
			<UFormGroup
				size="lg"
				label="Employment Type"
				name="employment_type"
				required
				:error="fieldError('employment_type')"
				class="col-span-12 md:col-span-4"
			>
				<USelectMenu
					v-model="selectedEmploymentType"
					:options="options.employmentTypes.value"
					placeholder="Select employment type"
				/>
			</UFormGroup>

			<UFormGroup
				size="lg"
				label="Seniority"
				name="seniority"
				required
				:error="fieldError('seniority')"
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
				name="technologies"
				required
				:error="fieldError('technologies')"
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
			label="Application URL or Email"
			name="application_link"
			:error="fieldError('application_link')"
			help="Use a hosted application page or a hiring inbox email."
			class="col-span-12 md:col-span-12"
			required
		>
			<UInput
				v-model="state.application_link"
				placeholder="https://company.com/careers/frontend-engineer"
			/>
		</UFormGroup>

		<UFormGroup
			label="Job Description"
			name="description"
			:error="fieldError('description')"
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
			size="lg"
			label="Preview post"
			trailing-icon="i-heroicons-arrow-right-20-solid"
		/>
	</UForm>
</template>

<script setup lang="ts">
import * as Yup from 'yup';
import { type InferType } from 'yup';
import type { FormSubmitEvent } from '#ui/types';
import { useJobOpportunitiesStore } from '~/store/job-opportunities';
import type { JobOpportunityDraft } from '~/types/job-opportunities';
import { useFilterOptions } from '~/composables/use-filter-options';
import FjIcon from '~/components/shared/fj-icon.vue';
import TiptapEditor from '~/components/shared/tiptap-editor.vue';
import { isValidApplicationDestination, normalizeApplicationDestination } from '~/utils/links';

const emit = defineEmits<{ (e: 'next'): void }>();

const jobOpportunityStore = useJobOpportunitiesStore();
const toast = useToast();
const options = useFilterOptions();

type Schema = InferType<typeof schema>;

function salaryValue(value?: string) {
	return Number(String(value ?? '').replace(/,/g, ''));
}

const schema = Yup.object({
	title: Yup.string().required('Title is required'),
	location: Yup.string().required('Location is required'),
	description: Yup.string().required('Job description is required'),
	remote: Yup.boolean().required(),
	salary_minimum: Yup.string()
		.required('Salary minimum is required')
		.test('is-salary', 'Enter a valid annual salary', value => salaryValue(value) > 0),
	salary_maximum: Yup.string()
		.required('Salary maximum is required')
		.test('is-salary', 'Enter a valid annual salary', value => salaryValue(value) > 0)
		.test('is-greater-than-minimum', 'Maximum salary must be at least the minimum salary', function (value) {
			return salaryValue(value) >= salaryValue(this.parent.salary_minimum);
		}),
	currency: Yup.string().required('Currency is required'),
	employment_type: Yup.array().of(Yup.string().required()).min(1, 'Select an employment type').required(),
	seniority: Yup.array().of(Yup.string().required()).min(1, 'Select at least one seniority').required(),
	application_link: Yup.string()
		.required('Application URL or email is required')
		.test('application-destination', 'Enter a valid URL or email address', value => isValidApplicationDestination(value ?? '')),
	technologies: Yup.array().of(Yup.object({
		id: Yup.string().required(),
		name: Yup.string().required(),
		created_at: Yup.string().required(),
		updated_at: Yup.string().required(),
	})).min(1, 'Select at least one technology').required(),
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

const selectedEmploymentType = computed({
	get: () => state.employment_type[0],
	set: (value?: string) => {
		state.employment_type = value ? [value] : [];
	},
});

function fieldError(field: string) {
	return jobOpportunityStore.validationErrors[field]?.[0];
}

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

	jobOpportunityStore.clearValidationErrors();
	jobOpportunityStore.setDraftJobOpportunity({
		...event.data,
		application_link: normalizeApplicationDestination(event.data.application_link),
		date_posted: state.date_posted || new Date().toISOString().slice(0, 10),
	});

	emit('next');
}

function formatAnnualSalaryInput(value: string | number) {
	const wholeSalary = String(value ?? '').replace(/,/g, '').split('.')[0];
	const digits = wholeSalary.replace(/\D/g, '');

	if (!digits) {
		return '';
	}

	return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(Number(digits));
}

function setSalaryMinimum(value: string | number) {
	state.salary_minimum = formatAnnualSalaryInput(value);
}

function setSalaryMaximum(value: string | number) {
	state.salary_maximum = formatAnnualSalaryInput(value);
}
</script>

<style scoped>
.job-opportunity-form {
  @apply w-full flex flex-col gap-4 items-stretch;

  &__form-section {
    @apply grid grid-cols-12 gap-4 items-start;
  }

  &__trailing-currency {
    @apply text-xs;
    color: var(--fj-text-muted);
  }

  &__salary-nudge {
    @apply inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs;
    color: var(--fj-success-text);
    background: var(--fj-success-bg);
    border: 1px solid var(--fj-success-border);
  }
}
</style>

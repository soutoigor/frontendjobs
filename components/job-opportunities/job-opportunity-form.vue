<template>
	<UForm
		:schema="schema"
		:state="state"
		class="job-opportunity-form"
		@submit="onSubmit"
	>
		<UFormGroup
			label="Title"
			name="title"
		>
			<UInput v-model="state.title" />
		</UFormGroup>
    <UFormGroup
      label="Location"
      name="location"
    >
      <USelect v-model="state.location" :options="locations" />
    </UFormGroup>

    <UFormGroup
      label="Remote"
      name="remote"
    >
      <UCheckbox v-model="state.remote" />
    </UFormGroup>

    <UFormGroup
      label="Description"
      name="description"
    >
      <UTextarea v-model="state.description" />
    </UFormGroup>

    <UFormGroup
      label="Salary Minimum"
      name="salary_minimum"
    >
      <UInput v-model="state.salary_minimum" />
    </UFormGroup>

    <UFormGroup
      label="Salary Maximum"
      name="salary_maximum"
    >
      <UInput v-model="state.salary_maximum" />
    </UFormGroup>

    <UFormGroup
      label="Currency"
      name="currency"
    >
      <UInput v-model="state.currency" />
    </UFormGroup>

    <UFormGroup
      label="Employment Type"
      name="employment_type"
    >
      <USelect v-model="state.employment_type" :options="employmentTypes" multiple />
    </UFormGroup>

    <UFormGroup
      label="Seniority"
      name="seniority"
    >
      <USelect v-model="state.seniority" :options="seniorities" multiple />
    </UFormGroup>

    <UFormGroup
      label="Date Posted"
      name="date_posted"
    >
      <UInput v-model="state.date_posted" type="date" />
    </UFormGroup>

    <UFormGroup
      label="Application Link"
      name="application_link"
    >
      <UInput v-model="state.application_link" />
    </UFormGroup>

    <UFormGroup
      label="Technologies"
      name="technologies"
    >
      <USelect v-model="state.technologies" value-attribute="id"  :options="technologies" multiple />
    </UFormGroup>
		<UButton
			block
			type="submit"
		>
			Publish Job Opportunity
		</UButton>
	</UForm>
</template>

<script setup lang="ts">
import * as Yup from 'yup';
import { type InferType } from 'yup';
import type { FormSubmitEvent } from '#ui/types';
import { useJobOpportunitiesStore } from '~/store/job-opportunities';
import type { JobOpportunityPayload } from '~/types/job-opportunities';
import { useFilterOptions } from '~/composables/use-filter-options';

const jobOpportunityStore = useJobOpportunitiesStore();
const toast = useToast();
const router = useRouter();
const { employmentTypes, locations, seniorities, technologies } = useFilterOptions();

type Schema = InferType<typeof schema>;

const schema = Yup.object({
  title: Yup.string().required('Title is required'),
	location: Yup.string().required('Location is required'),
	remote: Yup.boolean().required('Remote is required'),
	description: Yup.string().required('Description is required'),
	salary_minimum: Yup.string(),
	salary_maximum: Yup.string(),
	currency: Yup.string().required('Currency is required'),
	employment_type: Yup.array().of(Yup.string().required()).required('Employment type is required'),
	seniority: Yup.array().of(Yup.string().required()).required('Seniority is required'),
	date_posted: Yup.string().required('Date to post is required'),
	application_link: Yup.string().required('Application link is required'),
	technologies: Yup.array().of(Yup.string().required()).required('Technologies is required'),
});

const state = reactive<JobOpportunityPayload>({
	title: '',
	location: '',
	remote: false,
	description: '',
	salary_minimum: undefined,
	salary_maximum: undefined,
	currency: '',
	employment_type: [],
	seniority: [],
	date_posted: undefined,
	application_link: '',
	technologies: [],
});

async function onSubmit(event: FormSubmitEvent<Schema>) {
	try {
		await jobOpportunityStore.createJobOpportunity(event.data);

    router.push('/company/dashboard');
	}
	catch (error: any) {
		const description = error.status === 400
			? 'Invalid email or password'
			: 'An error occurred, please try again';

		toast.add({
			color: 'rose',
			title: 'Login failed',
			description,
		});
	}
}
</script>

<style scoped>
.job-opportunity-form {
  @apply w-full flex flex-col gap-4 items-stretch;
}
</style>

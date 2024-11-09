<template>
  <UForm
		:schema="schema"
		:state="state"
		class="company-form"
		@submit="onSubmit"
	>
		<UFormGroup
			label="Name"
			name="name"
		>
			<UInput v-model="state.name" />
		</UFormGroup>
		<UFormGroup
			label="Location"
			name="location"
		>
			<UInputMenu v-model="state.location" :options="locations" />
		</UFormGroup>
		<UFormGroup
			label="Industry"
			name="industry"
		>
			<UInputMenu v-model="state.industry" :options="industries" />
		</UFormGroup>

    <h3>Socials:</h3>
		<UFormGroup
			label="Email"
			name="email"
		>
			<UInput v-model="state.socials.email" />
		</UFormGroup>
		<UFormGroup
			label="Website"
			name="website"
		>
			<UInput v-model="state.socials.website" />
		</UFormGroup>
		<UFormGroup
			label="Github"
			name="github"
		>
			<UInput v-model="state.socials.github" />
		</UFormGroup>
		<UFormGroup
			label="Linkedin"
			name="linkedin"
		>
			<UInput v-model="state.socials.linkedin" />
		</UFormGroup>
		<UFormGroup
			label="Instagram"
			name="instagram"
		>
			<UInput v-model="state.socials.instagram" />
		</UFormGroup>

		<UButton
			block
			type="submit"
		>
			Save
		</UButton>
	</UForm>
</template>

<script lang="ts" setup>
import * as Yup from 'yup';
import { useFilterOptions } from '~/composables/use-filter-options';
import type { FormSubmitEvent } from '#ui/types';
import type { CompanyPayload } from '~/types/companies';
import { useCompaniesStore } from '~/store/companies';
import { useAuthStore } from '~/store/authentication';

const companiesStore = useCompaniesStore();
const authStore = useAuthStore();
const toast = useToast();
const {
  industries,
	locations,
} = useFilterOptions();

const schema = Yup.object({
  name: Yup.string().required('Name is required'),
  avatar: Yup.string(),
  location: Yup.string().required('Location is required'),
  industry: Yup.string().required('Please select the Industry your company works on'),
  socials: Yup.object({
    linkedin: Yup.string(),
    website: Yup.string(),
    instagram: Yup.string(),
    github: Yup.string(),
    email: Yup.string().email(),
  }),
});

const state = reactive<CompanyPayload>({
	name: '',
  avatar: '',
  location: '',
  industry: '',
  socials: {
    linkedin: '',
    website: '',
    instagram: '',
    github: '',
    email: authStore?.user?.email || '',
  },
});

async function onSubmit(event: FormSubmitEvent<CompanyPayload>) {
  try {
    if (companiesStore.company?.id) {
      await companiesStore.updateCompany(companiesStore.company.id, event.data);
    } else {
      await companiesStore.createCompany(event.data);
    }
  } catch (error: any) {
    toast.add({
      color: 'rose',
      title: 'Failed to create Company',
      description: 'Please, try again',
    });
  }
}
</script>

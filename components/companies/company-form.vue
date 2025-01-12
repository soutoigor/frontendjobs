<template>
	<UForm
		:schema="schema"
		:state="state"
		class="company-form"
		@submit="onSubmit"
	>
		<div class="company-form__form-section">
			<UFormGroup
				:ui="{ error: 'hidden' }"
				size="lg"
				label="Name"
				name="name"
				class="col-span-12 md:col-span-8"
			>
				<UInput v-model="state.name" />
			</UFormGroup>

			<UFormGroup
				:ui="{ error: 'hidden' }"
				size="lg"
				label="Avatar"
				name="avatar"
				class="col-span-12 md:col-span-4"
			>
				<div class="company-form__avatar-wrapper">
					<template v-if="!state.avatar">
						<UInput
							accept="image/*"
							padded
							type="file"
							size="sm"
							@change="onFileChange"
						/>
						<UButton
							size="sm"
							color="primary"
							:disabled="!file"
							@click="uploadAvatar"
						>
							Upload Avatar
						</UButton>
					</template>
					<TransitionGroup name="fade">
						<template v-if="state.avatar">
							<UAvatar
								:src="state.avatar"
								size="sm"
							/>
							<UButton
								size="sm"
								variant="outline"
								@click="clearAvatar"
							>
								Remove Avatar
							</UButton>
						</template>
					</TransitionGroup>
				</div>
			</UFormGroup>
		</div>

		<div class="company-form__form-section">
			<UFormGroup
				:ui="{ error: 'hidden' }"
				size="lg"
				label="Location"
				name="location"
				class="col-span-12 md:col-span-6"
			>
				<USelectMenu
					v-model="state.location"
					:options="locations"
					searchable
				/>
			</UFormGroup>
			<UFormGroup
				:ui="{ error: 'hidden' }"
				size="lg"
				label="Industry"
				name="industry"
				class="col-span-12 md:col-span-6"
			>
				<USelectMenu
					v-model="state.industry"
					:options="industries"
					searchable
				/>
			</UFormGroup>
		</div>

		<h3 class="company-form__socials-title">
			Socials:
		</h3>
		<div class="company-form__form-section">
			<UFormGroup
				:ui="{ error: 'hidden' }"
				size="lg"
				label="Email"
				name="email"
				class="col-span-12 md:col-span-6"
			>
				<UInput v-model="state.socials.email" />
			</UFormGroup>
			<UFormGroup
				:ui="{ error: 'hidden' }"
				size="lg"
				label="Website"
				name="website"
				class="col-span-12 md:col-span-6"
			>
				<UInput v-model="state.socials.website" />
			</UFormGroup>
		</div>

		<div class="company-form__form-section">
			<UFormGroup
				:ui="{ error: 'hidden' }"
				size="lg"
				label="Github"
				name="github"
				class="col-span-12 md:col-span-4"
			>
				<UInput v-model="state.socials.github" />
			</UFormGroup>
			<UFormGroup
				:ui="{ error: 'hidden' }"
				size="lg"
				label="Linkedin"
				name="linkedin"
				class="col-span-12 md:col-span-4"
			>
				<UInput v-model="state.socials.linkedin" />
			</UFormGroup>
			<UFormGroup
				:ui="{ error: 'hidden' }"
				size="lg"
				label="Instagram"
				name="instagram"
				class="col-span-12 md:col-span-4"
			>
				<UInput v-model="state.socials.instagram" />
			</UFormGroup>
		</div>

		<UButton
			block
			size="lg"
			type="submit"
			:label="ctaText"
		/>
	</UForm>
</template>

<script lang="ts" setup>
import * as Yup from 'yup';
import { useFilterOptions } from '~/composables/use-filter-options';
import type { FormSubmitEvent } from '#ui/types';
import type { CompanyPayload } from '~/types/companies';
import { useCompaniesStore } from '~/store/companies';
import { useAuthStore } from '~/store/authentication';
import { useUpload } from '~/composables/useUpload';

const companiesStore = useCompaniesStore();
const authStore = useAuthStore();
const toast = useToast();
const router = useRouter();
const { uploadFile } = useUpload();
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
		email: Yup.string().email().required('Email is required'),
	}),
});

const state = reactive<CompanyPayload>({
	name: companiesStore.userCompany?.name || '',
	avatar: companiesStore.userCompany?.avatar || '',
	location: companiesStore.userCompany?.location || '',
	industry: companiesStore.userCompany?.industry || '',
	socials: {
		linkedin: companiesStore.userCompany?.socials?.linkedin || '',
		website: companiesStore.userCompany?.socials?.website || '',
		instagram: companiesStore.userCompany?.socials?.instagram || '',
		github: companiesStore.userCompany?.socials?.github || '',
		email: authStore?.user?.email || '',
	},
});

const file = ref<File | null>(null);
const ctaText = computed(() => companiesStore.userCompany?.id ? 'Update Company' : 'Register Company');

async function onSubmit(event: FormSubmitEvent<CompanyPayload>) {
	try {
		if (companiesStore.userCompany?.id) {
			await companiesStore.updateCompany(companiesStore.userCompany.id, event.data);
		}
		else {
			await companiesStore.createCompany(event.data);
		}

		toast.add({
			color: 'green',
			title: 'Company created successfully',
			description: 'You can now post your first job',
		});

		await companiesStore.fetchUserCompany();

		router.push('/company/dashboard');
	}
	catch (error: any) {
		toast.add({
			color: 'rose',
			title: 'Failed to create Company',
			description: 'Please, try again',
		});
	}
}

function clearAvatar() {
	file.value = null;
	state.avatar = '';
}

function onFileChange(files: FileList) {
	if (files && files[0]) {
		try {
			verifyImageSize(files[0]);
		}
		catch (error) {
			return;
		}

		file.value = files[0];
	}
}
async function uploadAvatar() {
	if (file.value) {
		try {
			verifyImageSize(file.value);
			const path = `avatars/${file.value.name}-${authStore.user?.id}`;
			const downloadURL = await uploadFile(file.value, path);

			state.avatar = downloadURL;
		}
		catch (error) {
			console.error('Error uploading avatar:', error);
		}
	}
	else {
		console.error('No file selected');
	}
}

function verifyImageSize(file: File) {
	const MAX_SIZE_MB = 2; // Maximum file size in MB
	const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024; // Convert MB to bytes

	if (file.size > MAX_SIZE_BYTES) {
		alert(`Please upload a file smaller than ${MAX_SIZE_MB}MB.`);
		throw new Error('File too large');
	}
}
</script>

<style scoped>
.company-form {
	@apply w-full flex flex-col gap-4 items-stretch;

	&__form-section {
    @apply grid grid-cols-12 gap-4 items-center;
  }

	&__socials-title {
		@apply text-lg font-bold;
	}

	&__avatar-wrapper {
		@apply flex items-center gap-4;
	}
}
</style>

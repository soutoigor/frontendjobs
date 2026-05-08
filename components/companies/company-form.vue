<template>
	<UForm
		:schema="schema"
		:state="state"
		class="company-form"
		@submit="onSubmit"
	>
		<div class="company-form__form-section">
			<UFormGroup
				size="lg"
				label="Company name"
				name="name"
				required
				class="col-span-12 md:col-span-8"
			>
				<UInput
					v-model="state.name"
					placeholder="Acme Labs"
				/>
			</UFormGroup>

			<UFormGroup
				size="lg"
				label="Logo or avatar"
				name="avatar"
				help="Optional. PNG, JPG, or WebP up to 2MB."
				class="col-span-12 md:col-span-4"
			>
				<div class="company-form__avatar-wrapper">
					<template v-if="!state.avatar">
						<UInput
							accept="image/png,image/jpeg,image/webp"
							padded
							type="file"
							size="sm"
							@change="onFileChange"
						/>
						<UButton
							v-if="file"
							size="sm"
							color="primary"
							:loading="uploadingAvatar"
							@click="uploadAvatar"
						>
							Upload selected image
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
				size="lg"
				label="Location"
				name="location"
				required
				help="Start typing to search the country list."
				class="col-span-12 md:col-span-6"
			>
				<USelectMenu
					v-model="state.location"
					:options="locations"
					placeholder="Search country"
					searchable
					searchable-placeholder="Search country"
				/>
			</UFormGroup>
			<UFormGroup
				size="lg"
				label="Industry"
				name="industry"
				required
				help="Choose the closest category for your public profile."
				class="col-span-12 md:col-span-6"
			>
				<USelectMenu
					v-model="state.industry"
					:options="industries"
					placeholder="Search industry"
					searchable
					searchable-placeholder="Search industry"
				/>
			</UFormGroup>
		</div>

		<div class="company-form__optional-header">
			<h3 class="company-form__socials-title">
				Optional links
			</h3>
			<p>
				Add full URLs or handles. We will format them before they appear on your public company profile.
			</p>
		</div>
		<div class="company-form__form-section">
			<UFormGroup
				size="lg"
				label="Public email"
				name="email"
				class="col-span-12 md:col-span-6"
			>
				<UInput
					v-model="state.socials.email"
					placeholder="jobs@company.com"
				/>
			</UFormGroup>
			<UFormGroup
				size="lg"
				label="Website"
				name="website"
				class="col-span-12 md:col-span-6"
			>
				<UInput
					v-model="state.socials.website"
					placeholder="https://company.com"
				/>
			</UFormGroup>
		</div>

		<div class="company-form__form-section">
			<UFormGroup
				size="lg"
				label="Github"
				name="github"
				class="col-span-12 md:col-span-4"
			>
				<UInput
					v-model="state.socials.github"
					placeholder="company"
				/>
			</UFormGroup>
			<UFormGroup
				size="lg"
				label="Linkedin"
				name="linkedin"
				class="col-span-12 md:col-span-4"
			>
				<UInput
					v-model="state.socials.linkedin"
					placeholder="company"
				/>
			</UFormGroup>
			<UFormGroup
				size="lg"
				label="Instagram"
				name="instagram"
				class="col-span-12 md:col-span-4"
			>
				<UInput
					v-model="state.socials.instagram"
					placeholder="@company"
				/>
			</UFormGroup>
		</div>

		<div
			v-if="normalizedPublicLinks.length"
			class="company-form__link-preview"
		>
			<p>Public link preview</p>
			<ul>
				<li
					v-for="link in normalizedPublicLinks"
					:key="link.social"
				>
					<span v-text="link.label" />
					<b v-text="link.value" />
				</li>
			</ul>
		</div>

		<UButton
			block
			size="lg"
			type="submit"
			:loading="isSubmitting"
			:label="ctaText"
		/>
	</UForm>
</template>

<script lang="ts" setup>
import * as Yup from 'yup';
import { useFilterOptions } from '~/composables/use-filter-options';
import type { FormSubmitEvent } from '#ui/types';
import type { CompanyPayload, Socials } from '~/types/companies';
import { useCompaniesStore } from '~/store/companies';
import { useAuthStore } from '~/store/authentication';
import { useUpload } from '~/composables/useUpload';
import { normalizeSocialLink } from '~/utils/links';

const companiesStore = useCompaniesStore();
const authStore = useAuthStore();
const toast = useToast();
const router = useRouter();
const { uploadFile } = useUpload();
const {
	industries,
	locations,
} = useFilterOptions();
const isSubmitting = ref(false);

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
		email: Yup.string().email('Enter a valid email address'),
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
const uploadingAvatar = ref(false);
const ctaText = computed(() => {
	if (companiesStore.savingCompany) {
		return companiesStore.userCompany?.id ? 'Saving company...' : 'Creating company...';
	}

	return companiesStore.userCompany?.id ? 'Update Company' : 'Register Company';
});
const normalizedSocials = computed(() => normalizeCompanySocials(state.socials));
const normalizedPublicLinks = computed(() => Object
	.entries(normalizedSocials.value)
	.filter(([, value]) => !!value)
	.map(([social, value]) => ({
		social,
		label: social.charAt(0).toUpperCase() + social.slice(1),
		value,
	})));

async function onSubmit(event: FormSubmitEvent<CompanyPayload>) {
	if (isSubmitting.value) {
		return;
	}

	isSubmitting.value = true;
	const isEditing = Boolean(companiesStore.userCompany?.id);

	try {
		const payload = {
			...event.data,
			socials: normalizeCompanySocials(event.data.socials),
		};

		if (isEditing && companiesStore.userCompany?.id) {
			await companiesStore.updateCompany(companiesStore.userCompany.id, payload);
		}
		else {
			await companiesStore.createCompany(payload);
		}

		toast.add({
			id: isEditing ? 'company-updated' : 'company-created',
			color: 'green',
			title: isEditing ? 'Company updated successfully' : 'Company created successfully',
			description: 'You can now post your job.',
		});

		await companiesStore.fetchUserCompany();

		await router.push('/company/dashboard');
	}
	catch {
		toast.add({
			color: 'rose',
			title: 'Failed to create Company',
			description: 'Please, try again',
		});
	}
	finally {
		isSubmitting.value = false;
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
			toast.add({
				color: 'rose',
				title: 'Avatar is too large',
				description: error instanceof Error ? error.message : 'Please choose a smaller image.',
			});
			return;
		}

		file.value = files[0];
	}
}
async function uploadAvatar() {
	if (file.value) {
		try {
			uploadingAvatar.value = true;
			verifyImageSize(file.value);
			const path = `avatars/${file.value.name}-${authStore.user?.id}`;
			const downloadURL = await uploadFile(file.value, path);

			state.avatar = downloadURL;
		}
		catch (error) {
			toast.add({
				color: 'rose',
				title: 'Avatar upload failed',
				description: error instanceof Error ? error.message : 'Please try a different image.',
			});
		}
		finally {
			uploadingAvatar.value = false;
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
		throw new Error(`Please upload a file smaller than ${MAX_SIZE_MB}MB.`);
	}
}

function normalizeCompanySocials(socials: Socials): Socials {
	return {
		email: normalizeSocialLink('email', socials.email),
		website: normalizeSocialLink('website', socials.website),
		github: normalizeSocialLink('github', socials.github),
		linkedin: normalizeSocialLink('linkedin', socials.linkedin),
		instagram: normalizeSocialLink('instagram', socials.instagram),
	};
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

	&__optional-header {
		@apply flex flex-col gap-1;

		p {
			@apply text-sm text-gray-500;
		}
	}

	&__avatar-wrapper {
		@apply flex flex-col gap-3 md:flex-row md:items-center;
	}

	&__link-preview {
		@apply rounded-md border border-gray-200 bg-gray-50 p-4 text-sm dark:border-gray-800 dark:bg-gray-900;

		p {
			@apply mb-2 font-semibold;
		}

		ul {
			@apply flex flex-col gap-1;
		}

		li {
			@apply flex flex-col gap-1 md:flex-row md:items-center md:gap-2;
		}

		span {
			@apply text-gray-500;
		}

		b {
			@apply break-all font-medium;
		}
	}
}
</style>

<template>
	<UForm
		:schema="schema"
		:state="state"
		class="register-form"
		@submit="onSubmit"
	>
		<UFormGroup
			label="Work email"
			name="email"
		>
			<UInput
				v-model="state.email"
				placeholder="you@company.com"
				type="email"
				icon="i-heroicons-envelope-20-solid"
				size="lg"
			/>
		</UFormGroup>

		<UFormGroup
			label="Password"
			name="password"
		>
			<UInput
				v-model="state.password"
				type="password"
				placeholder="••••••••"
				icon="i-heroicons-lock-closed-20-solid"
				size="lg"
			/>
			<template #hint>
				At least 8 characters
			</template>
		</UFormGroup>

		<UFormGroup
			label="Confirm password"
			name="confirmPassword"
		>
			<UInput
				v-model="state.confirmPassword"
				type="password"
				placeholder="••••••••"
				icon="i-heroicons-lock-closed-20-solid"
				size="lg"
			/>
		</UFormGroup>

		<UButton
			block
			type="submit"
			size="lg"
			trailing-icon="i-heroicons-arrow-right-20-solid"
			class="mt-2"
		>
			Create account
		</UButton>
	</UForm>

	<ul class="register-form__benefits">
		<li
			v-for="benefit in benefits"
			:key="benefit"
		>
			<FjIcon
				name="check"
				:size="11"
				color="var(--fj-success-text)"
			/>
			{{ benefit }}
		</li>
	</ul>
</template>

<script setup lang="ts">
import * as Yup from 'yup';
import type { InferType } from 'yup';
import type { FormSubmitEvent } from '#ui/types';
import FjIcon from '~/components/shared/fj-icon.vue';
import { useAuthStore } from '~/store/authentication';

const authStore = useAuthStore();
const toast = useToast();
const router = useRouter();

type Schema = InferType<typeof schema>;

const benefits = [
	'Plans from $99 per 30-day post',
	'No subscription',
	'Email alerts on every application',
];

const schema = Yup.object({
	email: Yup.string().required('Email is required'),
	password: Yup.string()
		.min(8, 'Must be at least 8 characters')
		.required('Password is required'),
	confirmPassword:
		Yup.string()
			.required('Password confirmation is required')
			.oneOf([Yup.ref('password')], 'Passwords must match'),
});

const state = reactive({
	email: undefined,
	password: undefined,
	confirmPassword: undefined,
});

async function onSubmit(event: FormSubmitEvent<Schema>) {
	try {
		await authStore.register({
			email: event.data.email,
			password: event.data.password,
		});

		if (authStore.authenticated) {
			router.push('/company/dashboard');
		}
	}
	catch (error: unknown) {
		const fetchError = error as { data?: { error?: { email?: string[]; password?: string[] } } };
		const description = fetchError?.data?.error?.email?.[0]
			|| fetchError?.data?.error?.password?.[0]
			|| 'An error occurred, please try again';

		toast.add({
			color: 'rose',
			title: 'Registration failed',
			description,
		});
	}
}
</script>

<style scoped>
.register-form {
  @apply w-full flex flex-col gap-3.5 items-stretch;

  &__benefits {
    @apply list-none p-0 mt-5 flex flex-col gap-2;

    li {
      @apply flex items-center gap-2 text-xs;
      color: var(--fj-text-muted);
    }
  }
}
</style>

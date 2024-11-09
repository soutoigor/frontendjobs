<template>
	<UForm
		:schema="schema"
		:state="state"
		class="register-form"
		@submit="onSubmit"
	>
		<UFormGroup
			label="Email"
			name="email"
		>
			<UInput v-model="state.email" />
		</UFormGroup>

		<UFormGroup
			label="Password"
			name="password"
		>
			<UInput
				v-model="state.password"
				type="password"
			/>
		</UFormGroup>

		<UFormGroup
			label="Confirm Password"
			name="confirmPassword"
		>
			<UInput
				v-model="state.confirmPassword"
				type="password"
			/>
		</UFormGroup>

		<UButton
			block
			type="submit"
		>
			Register
		</UButton>
	</UForm>
</template>

<script setup lang="ts">
import * as Yup from 'yup';
import { type InferType } from 'yup';
import type { FormSubmitEvent } from '#ui/types';
import { useAuthStore } from '~/store/authentication';

const authStore = useAuthStore();
const toast = useToast();
const router = useRouter();

type Schema = InferType<typeof schema>;

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
	catch (error: any) {
		const description = error?.data?.error?.email?.[0]
			|| error?.data?.error?.password?.[0]
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
  @apply w-full flex flex-col gap-4 items-stretch;
}
</style>

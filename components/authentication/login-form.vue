<template>
	<UForm
		:schema="schema"
		:state="state"
		class="login-form"
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

		<UButton
			block
			type="submit"
		>
			Login
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
	email: Yup.string().email().required('Email is required'),
	password: Yup.string().required('Password is required'),
});

const state = reactive({
	email: undefined,
	password: undefined,
});

async function onSubmit(event: FormSubmitEvent<Schema>) {
	try {
		await authStore.login(event.data);

		if (authStore.authenticated) {
			router.push('/company/dashboard');
		}
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
.login-form {
  @apply w-full flex flex-col gap-4 items-stretch;
}
</style>

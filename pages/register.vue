<template>
	<AuthenticationWrapper title="Create your company account">
		<template #subtitle>
			Post your first frontend role in under 5 minutes.
		</template>
		<template #form>
			<RegisterForm />
		</template>
		<template #options>
			<p>
				Already have an account? <NuxtLink
					class="text-violet-400 hover:text-violet-300"
					to="/login"
				>
					Sign in
				</NuxtLink>
			</p>
		</template>
	</AuthenticationWrapper>
</template>

<script setup lang="ts">
import AuthenticationWrapper from '~/components/authentication/authentication-wrapper.vue';
import RegisterForm from '~/components/authentication/register-form.vue';
</script>

<template>
	<AuthenticationWrapper title="Welcome back">
		<template #subtitle>
			Sign in to manage your job posts.
		</template>
		<template #form>
			<LoginForm />
		</template>
		<template #options>
			<p>
				New here? <NuxtLink
					class="text-violet-400 hover:text-violet-300"
					to="/register"
				>
					Create account
				</NuxtLink>
			</p>
		</template>
	</AuthenticationWrapper>
</template>

<script setup lang="ts">
import AuthenticationWrapper from '~/components/authentication/authentication-wrapper.vue';
import LoginForm from '~/components/authentication/login-form.vue';
</script>

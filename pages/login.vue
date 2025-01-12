<template>
	<AuthenticationWrapper
		title="Login"
		@submit="onSubmit"
	>
		<template #form>
			<LoginForm />
		</template>
		<template #options>
			<p>
				Don't have an account? <NuxtLink
					class="login__link"
					to="/register"
				>
					Register
				</NuxtLink>
			</p>
		</template>
	</AuthenticationWrapper>
</template>

<script setup lang="ts">
import AuthenticationWrapper from '~/components/authentication/authentication-wrapper.vue';
import LoginForm from '~/components/authentication/login-form.vue';

const onSubmit = (e: SubmitEvent) => {
	console.log(e);
};
</script>

<style scoped>
.login {

  &__link {
    @apply text-purple-600;
  }
}
</style>

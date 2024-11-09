<template>
	<AuthenticationWrapper title="Create Account">
		<template #form>
			<RegisterForm />
		</template>
		<template #options>
			<p>
				Already have an account? <NuxtLink
					class="register__link"
					to="/login"
				>
					Login
				</NuxtLink>
			</p>
		</template>
	</AuthenticationWrapper>
</template>

<script setup lang="ts">
import AuthenticationWrapper from '~/components/authentication/authentication-wrapper.vue';
import RegisterForm from '~/components/authentication/register-form.vue';
</script>

<style scoped>
.register {

  &__link {
    @apply text-purple-600;
  }
}
</style>

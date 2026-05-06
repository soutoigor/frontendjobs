<template>
	<header class="app-toolbar">
		<div class="app-toolbar__left">
			<NuxtLink
				to="/"
				class="app-toolbar__logo-link"
			>
				<AppLogo />
			</NuxtLink>
			<nav class="app-toolbar__nav">
				<NuxtLink
					to="/"
					class="app-toolbar__nav-link"
					:class="{ 'app-toolbar__nav-link--active': route.path === '/' }"
				>
					Browse jobs
				</NuxtLink>
			</nav>
		</div>
		<div class="app-toolbar__right">
			<NuxtLink
				to="/login"
				class="app-toolbar__sign-in"
			>
				Sign in
			</NuxtLink>
			<UButton
				variant="soft"
				color="gray"
				size="sm"
				icon="i-heroicons-user-20-solid"
				to="/company/dashboard"
			>
				Company area
			</UButton>
			<UButton
				variant="solid"
				size="sm"
				icon="i-heroicons-plus-20-solid"
				to="/company/post-job"
			>
				Post a job
			</UButton>
		</div>
	</header>
</template>

<script setup lang="ts">
import AppLogo from '~/components/shared/app-logo.vue';

const route = useRoute();
</script>

<style scoped>
.app-toolbar {
  @apply fixed top-0 left-0 right-0 z-50;
  @apply flex items-center justify-between;
  @apply px-8 py-3.5;
  background: rgba(11, 13, 18, 0.72);
  backdrop-filter: blur(14px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);

  &__left {
    @apply flex items-center gap-8;
  }

  &__logo-link {
    @apply cursor-pointer;
  }

  &__nav {
    @apply hidden md:flex gap-6;
  }

  &__nav-link {
    @apply text-sm font-medium text-gray-400 hover:text-white transition-colors;
    letter-spacing: -0.1px;

    &--active {
      @apply text-white;
    }
  }

  &__right {
    @apply flex items-center gap-2.5;
  }

  &__sign-in {
    @apply text-sm text-gray-400 hover:text-white transition-colors px-3 py-1.5;
  }
}
</style>

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
				v-if="!authStore.authenticated && !token"
				to="/login"
				class="app-toolbar__sign-in"
			>
				Sign in
			</NuxtLink>
			<UDropdown :items="colorModeItems">
				<UButton
					variant="ghost"
					color="gray"
					size="sm"
					:icon="colorModeIcon"
					aria-label="Change color mode"
				/>
			</UDropdown>
			<UButton
				variant="soft"
				color="violet"
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
import { useAuthStore } from '~/store/authentication';

const route = useRoute();
const authStore = useAuthStore();
const token = useCookie('token');
const colorMode = useColorMode();

const colorModeOptions = [
	{ label: 'System', value: 'system', icon: 'i-heroicons-cog-6-tooth-20-solid' },
	{ label: 'Light', value: 'light', icon: 'i-heroicons-sun-20-solid' },
	{ label: 'Dark', value: 'dark', icon: 'i-heroicons-moon-20-solid' },
];

const colorModeIcon = computed(() => {
	return colorModeOptions.find(option => option.value === colorMode.preference)?.icon || colorModeOptions[0].icon;
});

const colorModeItems = computed(() => [
	colorModeOptions.map(option => ({
		...option,
		click: () => {
			colorMode.preference = option.value;
		},
	})),
]);
</script>

<style scoped>
.app-toolbar {
  @apply fixed top-0 left-0 right-0 z-50;
  @apply flex items-center justify-between;
  @apply px-8 py-3.5;
  background: var(--fj-toolbar-bg);
  backdrop-filter: blur(14px);
  border-bottom: 1px solid var(--fj-border);

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
    @apply text-sm font-medium transition-colors;
    color: var(--fj-text-muted);
    letter-spacing: -0.1px;

    &:hover {
      color: var(--fj-text);
    }

    &--active {
      color: var(--fj-text);
    }
  }

  &__right {
    @apply flex items-center gap-2.5;
  }

  &__sign-in {
    @apply text-sm transition-colors px-3 py-1.5;
    color: var(--fj-text-muted);

    &:hover {
      color: var(--fj-text);
    }
  }
}
</style>

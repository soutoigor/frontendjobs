<template>
	<nav class="app-toolbar">
		<div>
			<NuxtLink
				to="/"
				class="app-toolbar__logo"
			>
				<AppLogo v-show="!logoVisible" />
			</NuxtLink>
		</div>

		<div class="app-toolbar__links">
			<UButton
				variant="solid"
				color="yellow"
				to="/company/post-job"
			>
				Post a Job
			</UButton>
			<UButton
				variant="solid"
				to="/company/dashboard"
			>
				Company Area
			</UButton>
		</div>
	</nav>
</template>

<script setup lang="ts">
import AppLogo from '~/components/shared/app-logo.vue';

interface Props {
	logoVisible: boolean;
}

defineProps<Props>();
</script>

<style scoped>
.app-toolbar {
	@apply bg-transparent w-full flex justify-between items-center px-3 md:px-4 py-1 md:py-3 gap-4;

	&.-is-logo-visible {
		@apply hidden;
	}

	&__logo {
		@apply text-xl lg:text-3xl;
	}

	&__links {
		@apply flex gap-4;
	}
}
</style>

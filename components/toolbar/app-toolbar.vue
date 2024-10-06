<template>
	<nav class="app-toolbar">
		<div>
			<NuxtLink
				to="/"
				class="app-toolbar__logo"
			>
				<AppLogo v-show="!home" />
			</NuxtLink>
		</div>

		<div class="app-toolbar__links">
			<UButton
				variant="solid"
				color="yellow"
				to="/post-job"
			>
				Post Job
			</UButton>
			<UButton
				variant="solid"
				to="/company"
			>
				Company Area
			</UButton>
		</div>
	</nav>
</template>

<script setup lang="ts">
import AppLogo from '~/components/shared/app-logo.vue';

defineProps<{
	home: boolean;
}>();
</script>

<style scoped>
.app-toolbar {
	@apply bg-transparent w-dvw flex justify-between items-center px-3 md:px-4 py-1 md:py-3 gap-4;

	&.-is-home {
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

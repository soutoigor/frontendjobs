<template>
	<AppToolbar
		v-if="route.path && !isAuthPage"
		:logo-visible="isLogoVisible"
		class="absolute top-0 left-0 right-0 z-10"
	/>

	<NuxtLayout>
		<NuxtPage
			class="relative"
			:class="[!isLogoVisible && '']"
		/>
		<AppFooter />
		<UNotifications />
	</NuxtLayout>
</template>

<script setup lang="ts">
import AppToolbar from '~/components/toolbar/app-toolbar.vue';
import AppFooter from '~/components/shared/app-footer.vue';

const route = useRoute();
const isLogoVisible = computed(() => route.path === '/');
const isAuthPage = computed(() => {
	const authPages = [
		'/login',
		'/register',
		'/forgot-password',
	];

	return authPages.includes(route.path);
});
const CANONICAL_URL = `https://www.frontendjobs.app${route.path}`

useHead({
	link: [{ rel: 'canonical', href: CANONICAL_URL }],
})
</script>

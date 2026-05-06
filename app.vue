<template>
	<AppToolbar
		v-if="route.path && !isAuthPage"
	/>

	<NuxtLayout>
		<NuxtPage class="relative pt-14" />
		<AppFooter />
		<UNotifications />
	</NuxtLayout>
</template>

<script setup lang="ts">
import AppToolbar from '~/components/toolbar/app-toolbar.vue';
import AppFooter from '~/components/shared/app-footer.vue';

const route = useRoute();
const isAuthPage = computed(() => {
	const authPages = [
		'/login',
		'/register',
		'/forgot-password',
	];

	return authPages.includes(route.path);
});
const { siteUrl } = useRuntimeConfig().public;

useHead({
	link: [{ rel: 'canonical', href: `${siteUrl}${route.path}` }],
});
</script>

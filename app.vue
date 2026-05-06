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
import { useAuthStore } from '~/store/authentication';

const route = useRoute();
const authStore = useAuthStore();
const token = useCookie('token');
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

onMounted(async () => {
	if (!token.value || authStore.authenticated) {
		return;
	}

	try {
		await authStore.refresh();
	}
	catch {
		await authStore.logUserOut();
	}
});
</script>

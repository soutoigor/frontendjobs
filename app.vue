<template>
	<LaunchBanner />
	<AppToolbar
		v-if="showToolbar"
	/>

	<div
		class="app-shell"
		:class="{ 'app-shell--with-toolbar': showToolbar }"
	>
		<NuxtLayout>
			<NuxtPage />
			<AppFooter />
			<PrivacyPreferences />
			<UNotifications />
		</NuxtLayout>
	</div>
</template>

<script setup lang="ts">
import AppToolbar from '~/components/toolbar/app-toolbar.vue';
import AppFooter from '~/components/shared/app-footer.vue';
import LaunchBanner from '~/components/shared/launch-banner.vue';
import PrivacyPreferences from '~/components/shared/privacy-preferences.vue';
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
const showToolbar = computed(() => !!route.path && !isAuthPage.value);
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

<style scoped>
.app-shell--with-toolbar {
	padding-top: 5.5rem;
}
</style>

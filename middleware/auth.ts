import { useAuthStore } from '~/store/authentication';

export default defineNuxtRouteMiddleware(async () => {
	const authStore = useAuthStore();

	if (!authStore.authenticated) {
		try {
			await authStore.refresh();
		}
		catch {
			return navigateTo('/login');
		}

		if (!authStore.authenticated) {
			return navigateTo('/login');
		}
	}
});

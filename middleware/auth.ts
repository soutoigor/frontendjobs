import { useAuthStore } from '~/store/authentication';

export default defineNuxtRouteMiddleware(async (to, from) => {
	const authStore = useAuthStore();

	if (!authStore.authenticated) {
		try {
			await authStore.refresh();
		}
		finally {
			if (!authStore.authenticated) {
				return navigateTo('/login');
			}
		}
	}
});

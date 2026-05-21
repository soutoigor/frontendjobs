import { useAuthStore } from '~/store/authentication';

// Routes where an unauthenticated visitor is more likely to be a new company
// than a returning one — send them to /register instead of /login.
const REGISTER_FIRST_ROUTES = ['/company/post-job'];

export default defineNuxtRouteMiddleware(async (to) => {
	const authStore = useAuthStore();
	const redirectPath = REGISTER_FIRST_ROUTES.includes(to.path) ? '/register' : '/login';

	if (!authStore.authenticated) {
		try {
			await authStore.refresh();
		}
		catch {
			return navigateTo(redirectPath);
		}

		if (!authStore.authenticated) {
			return navigateTo(redirectPath);
		}
	}
});

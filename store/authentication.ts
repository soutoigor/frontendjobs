import { defineStore } from 'pinia';

interface UserPayloadInterface {
	email: string;
	password: string;
}

interface User {
	id: string;
	email: string;
	created_at: string;
	updated_at: string;
}

export const useAuthStore = defineStore('auth', () => {
	const config = useRuntimeConfig();
	const authenticated = ref(false);
	const loading = ref(false);
	const user = ref<User>();

	async function login({ email, password }: UserPayloadInterface) {
		const response = await $fetch<{ token: string; user: User }>('/login', {
			method: 'post',
			baseURL: config.public.baseURL,
			body: {
				email,
				password,
			},
		});

		if (response.token) {
			const cookieToken = useCookie('token');
			cookieToken.value = response.token;
			authenticated.value = true;
			user.value = response.user;
		}
	}

	async function register({ email, password }: UserPayloadInterface) {
		const response = await $fetch<{ token: string; user: User }>('/register', {
			method: 'post',
			baseURL: config.public.baseURL,
			body: {
				email,
				password,
			},
		});

		if (response.token) {
			const cookieToken = useCookie('token');
			cookieToken.value = response.token;
			authenticated.value = true;
			user.value = response.user;
		}
	}

	async function refresh() {
		const token = useCookie('token');

		const response = await $fetch<{ user: User }>('/refresh', {
			method: 'get',
			baseURL: config.public.baseURL,
			headers: {
				Authorization: `Bearer ${token.value}`,
			},
		});

		if (response.user) {
			authenticated.value = true;
			user.value = response.user;
		}
	}

	async function logUserOut() {
		const token = useCookie('token');

		try {
			await $fetch('/logout', {
				method: 'post',
				baseURL: config.public.baseURL,
				headers: {
					Authorization: `Bearer ${token.value}`,
				},
			});
		}
		finally {
			authenticated.value = false;
			token.value = null;
			user.value = undefined;
		}
	}

	return {
		authenticated,
		loading,
		user,

		login,
		register,
		refresh,
		logUserOut,
	};
});

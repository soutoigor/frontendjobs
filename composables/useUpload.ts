import { ref } from 'vue';

export const useUpload = () => {
	const config = useRuntimeConfig();
	const token = useCookie('token');
	const uploadProgress = ref(0);

	const uploadFile = async (file: File) => {
		try {
			const formData = new FormData();
			formData.append('avatar', file);

			const response = await $fetch<{ avatar: string }>('/companies/avatar', {
				method: 'post',
				baseURL: config.public.baseURL,
				headers: {
					Authorization: `Bearer ${token.value}`,
				},
				body: formData,
			});

			return response.avatar;
		}
		catch (error) {
			console.error('Error uploading file:', error);
			throw error;
		}
	};

	return { uploadFile, uploadProgress };
};

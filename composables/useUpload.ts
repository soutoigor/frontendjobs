import { ref } from 'vue';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';

export const useUpload = () => {
	const uploadProgress = ref(0);

	const uploadFile = async (file: File, path: string) => {
		try {
			const storage = getStorage();
			const fileRef = storageRef(storage, path);

			const uploadTask = await uploadBytes(fileRef, file);

			const downloadURL = await getDownloadURL(uploadTask.ref);
			return downloadURL;
		}
		catch (error) {
			console.error('Error uploading file:', error);
			throw error;
		}
	};

	return { uploadFile, uploadProgress };
};

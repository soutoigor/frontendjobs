import { initializeApp } from 'firebase/app';
import { getAnalytics, type Analytics } from 'firebase/analytics';
import { getStorage, type FirebaseStorage } from 'firebase/storage';

let storage: FirebaseStorage;
let analytics: Analytics;

export default defineNuxtPlugin(() => {
	if (import.meta.client) {
		const config = useRuntimeConfig();

		const firebaseConfig = {
			apiKey: config.public.firebaseApiKey,
			authDomain: config.public.firebaseAuthDomain,
			projectId: config.public.firebaseProjectId,
			storageBucket: config.public.firebaseStorageBucket,
			messagingSenderId: config.public.firebaseMessagingSenderId,
			appId: config.public.firebaseAppId,
			measurementId: config.public.firebaseMeasurementId,
		};

		const app = initializeApp(firebaseConfig);
		storage = getStorage(app);
		analytics = getAnalytics(app);
	}

	return {
		provide: {
			analytics,
			storage,
		},
	};
});

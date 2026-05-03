import { initializeApp } from 'firebase/app';
import { getAnalytics, type Analytics } from 'firebase/analytics';
import { getStorage, type FirebaseStorage } from 'firebase/storage';

let storage: FirebaseStorage;
let analytics: Analytics;

export default defineNuxtPlugin(() => {
	if (import.meta.client) {
		const config = useRuntimeConfig();

		const { firebaseApiKey, firebaseAppId, firebaseProjectId, firebaseStorageBucket, firebaseAuthDomain, firebaseMessagingSenderId, firebaseMeasurementId } = config.public;

		if (!firebaseApiKey || !firebaseAppId || !firebaseProjectId) {
			console.warn('[firebase] Missing required config — Firebase disabled. Set FIREBASE_* env vars.');
			return { provide: { analytics: undefined, storage: undefined } };
		}

		const app = initializeApp({
			apiKey: firebaseApiKey,
			authDomain: firebaseAuthDomain,
			projectId: firebaseProjectId,
			storageBucket: firebaseStorageBucket,
			messagingSenderId: firebaseMessagingSenderId,
			appId: firebaseAppId,
			measurementId: firebaseMeasurementId,
		});

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

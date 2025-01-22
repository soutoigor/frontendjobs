// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics, type Analytics } from 'firebase/analytics';
import { getStorage, type FirebaseStorage } from 'firebase/storage';

let storage: FirebaseStorage;
let analytics: Analytics;

if (import.meta.client) {
	const firebaseConfig = {
		apiKey: 'AIzaSyCvfswnOGG4mXjQAqwfGiwViylqdKImxXM',
		authDomain: 'frontend-jobs-115b5.firebaseapp.com',
		projectId: 'frontend-jobs-115b5',
		storageBucket: 'frontend-jobs-115b5.firebasestorage.app',
		messagingSenderId: '20145900212',
		appId: '1:20145900212:web:263a2fbcafb9463d1de5e1',
		measurementId: 'G-F17NF46GN6',
	};

	const app = initializeApp(firebaseConfig); // Initialize Firebase app
	storage = getStorage(app); // Get storage instance
	analytics = getAnalytics(app); // Get analytics instance
}

export default defineNuxtPlugin(() => {
	return {
		provide: {
			analytics,
			storage,
		},
	};
});

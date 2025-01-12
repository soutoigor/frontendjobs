// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics, type Analytics } from 'firebase/analytics';
import { getStorage, type FirebaseStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

let storage: FirebaseStorage;
let analytics: Analytics;

if (import.meta.client) {
// Your web app's Firebase configuration
	// For Firebase JS SDK v7.20.0 and later, measurementId is optional
	const firebaseConfig = {
		apiKey: 'AIzaSyCvfswnOGG4mXjQAqwfGiwViylqdKImxXM',
		authDomain: 'frontend-jobs-115b5.firebaseapp.com',
		projectId: 'frontend-jobs-115b5',
		storageBucket: 'frontend-jobs-115b5.firebasestorage.app',
		messagingSenderId: '20145900212',
		appId: '1:20145900212:web:7129a6c146ef7ab31de5e1',
		measurementId: 'G-GGX4JJ94N1',
	};

	// Initialize Firebase
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

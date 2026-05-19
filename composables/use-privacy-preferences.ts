export interface PrivacyPreferences {
	analytics: boolean;
	ads: boolean;
	acknowledged: boolean;
}

const STORAGE_KEY = 'frontendjobs-privacy-preferences';
const DEFAULT_PREFERENCES: PrivacyPreferences = {
	analytics: true,
	ads: false,
	acknowledged: false,
};

const preferences = ref<PrivacyPreferences>({ ...DEFAULT_PREFERENCES });
const isLoaded = ref(false);

function readPreferences(): PrivacyPreferences {
	if (!import.meta.client) {
		return { ...DEFAULT_PREFERENCES };
	}

	const stored = localStorage.getItem(STORAGE_KEY);

	if (!stored) {
		return { ...DEFAULT_PREFERENCES };
	}

	try {
		return {
			...DEFAULT_PREFERENCES,
			...JSON.parse(stored),
		};
	}
	catch {
		return { ...DEFAULT_PREFERENCES };
	}
}

function writePreferences(nextPreferences: PrivacyPreferences) {
	preferences.value = nextPreferences;

	if (import.meta.client) {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(nextPreferences));
		window.dispatchEvent(new CustomEvent('frontendjobs:privacy-preferences-updated'));
	}
}

export function usePrivacyPreferences() {
	function loadPreferences() {
		if (isLoaded.value) {
			return;
		}

		preferences.value = readPreferences();
		isLoaded.value = true;
	}

	function savePreferences(nextPreferences: Partial<PrivacyPreferences>) {
		writePreferences({
			...preferences.value,
			...nextPreferences,
			acknowledged: true,
		});
	}

	function acceptRecommended() {
		savePreferences({
			analytics: true,
			ads: false,
		});
	}

	function rejectOptional() {
		savePreferences({
			analytics: false,
			ads: false,
		});
	}

	return {
		preferences,
		loadPreferences,
		savePreferences,
		acceptRecommended,
		rejectOptional,
	};
}

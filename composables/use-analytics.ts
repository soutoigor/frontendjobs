type PlausibleOptions = {
	props?: Record<string, string | number | boolean | null | undefined>;
	revenue?: {
		currency: string;
		amount: number;
	};
	interactive?: boolean;
};

declare global {
	interface Window {
		plausible?: {
			(eventName: string, options?: PlausibleOptions): void;
			init?: (options?: Record<string, unknown>) => void;
			o?: Record<string, unknown>;
			q?: Array<[string, PlausibleOptions | undefined]>;
		};
	}
}

function isAnalyticsEnabled() {
	if (!import.meta.client) {
		return false;
	}

	const preferences = localStorage.getItem('frontendjobs-privacy-preferences');

	if (!preferences) {
		return true;
	}

	try {
		return JSON.parse(preferences)?.analytics !== false;
	}
	catch {
		return true;
	}
}

export function useAnalytics() {
	function track(eventName: string, options?: PlausibleOptions) {
		if (!import.meta.client || !isAnalyticsEnabled()) {
			return;
		}

		window.plausible?.(eventName, options);
	}

	return { track };
}

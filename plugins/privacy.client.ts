export default defineNuxtPlugin((nuxtApp) => {
	const config = useRuntimeConfig();
	const { preferences, loadPreferences } = usePrivacyPreferences();
	const scriptIds = {
		plausible: 'frontendjobs-plausible',
		adsense: 'frontendjobs-adsense',
	};

	loadPreferences();

	function ensurePlausibleQueue() {
		window.plausible = window.plausible || function plausible(...args) {
			(window.plausible!.q = window.plausible!.q || []).push(args as [string, PlausibleOptions | undefined]);
		};
	}

	function injectScript(id: string, src: string, attributes: Record<string, string> = {}) {
		if (document.getElementById(id)) {
			return;
		}

		const script = document.createElement('script');
		script.id = id;
		script.src = src;
		script.defer = true;

		for (const [key, value] of Object.entries(attributes)) {
			script.setAttribute(key, value);
		}

		document.head.appendChild(script);
	}

	function trackPageview() {
		if (!config.public.plausibleEnabled || !preferences.value.analytics) {
			return;
		}

		ensurePlausibleQueue();
		window.plausible?.('pageview');
	}

	function syncScripts() {
		if (config.public.plausibleEnabled && preferences.value.analytics) {
			ensurePlausibleQueue();
			injectScript(scriptIds.plausible, 'https://plausible.io/js/script.manual.js', {
				'data-domain': config.public.plausibleDomain,
			});
		}

		if (config.public.adsenseEnabled && preferences.value.ads) {
			injectScript(
				scriptIds.adsense,
				`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${config.public.adsenseClient}`,
				{ crossorigin: 'anonymous' },
			);
		}
	}

	syncScripts();

	window.addEventListener('frontendjobs:privacy-preferences-updated', syncScripts);

	nuxtApp.hook('page:finish', () => {
		syncScripts();
		trackPageview();
	});
});

interface PlausibleOptions {
	props?: Record<string, string | number | boolean | null | undefined>;
	revenue?: {
		currency: string;
		amount: number;
	};
	interactive?: boolean;
}

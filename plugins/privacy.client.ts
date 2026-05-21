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
		window.plausible.init = window.plausible.init || function init(options) {
			window.plausible!.o = options || {};
		};
	}

	function injectScript(id: string, src: string, attributes: Record<string, string> = {}) {
		if (document.getElementById(id)) {
			return;
		}

		const script = document.createElement('script');
		script.id = id;
		script.src = src;
		script.async = true;

		for (const [key, value] of Object.entries(attributes)) {
			script.setAttribute(key, value);
		}

		document.head.appendChild(script);
	}

	function removeScript(id: string) {
		document.getElementById(id)?.remove();
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
			window.plausible?.init?.({ autoCapturePageviews: false });

			const plausibleAttributes = String(config.public.plausibleScriptSrc).includes('/script')
				? { 'data-domain': config.public.plausibleDomain }
				: {};

			injectScript(
				scriptIds.plausible,
				config.public.plausibleScriptSrc,
				plausibleAttributes,
			);
		}
		else {
			removeScript(scriptIds.plausible);
		}

		if (config.public.adsenseEnabled && preferences.value.ads) {
			injectScript(
				scriptIds.adsense,
				`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${config.public.adsenseClient}`,
				{ crossorigin: 'anonymous' },
			);
		}
		else {
			removeScript(scriptIds.adsense);
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

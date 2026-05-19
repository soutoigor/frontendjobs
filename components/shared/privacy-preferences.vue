<template>
	<div>
		<div
			v-if="showBanner"
			class="privacy-preferences"
			role="dialog"
			aria-labelledby="privacy-preferences-title"
		>
			<div class="privacy-preferences__copy">
				<h2
					id="privacy-preferences-title"
					class="privacy-preferences__title"
				>
					Privacy preferences
				</h2>
				<p class="privacy-preferences__text">
					Frontend Jobs uses essential storage for login and saved job drafts. Plausible analytics helps us understand pages and core actions without cookies.
					<span v-if="adsPreferencesEnabled">Ads stay off unless ads are enabled and you allow them.</span>
				</p>
				<NuxtLink
					to="/privacy"
					class="privacy-preferences__link"
				>
					Read the privacy policy
				</NuxtLink>
			</div>
			<div class="privacy-preferences__controls">
				<label class="privacy-preferences__toggle">
					<input
						v-model="draft.analytics"
						type="checkbox"
					>
					<span>Analytics</span>
				</label>
				<label
					v-if="adsPreferencesEnabled"
					class="privacy-preferences__toggle"
				>
					<input
						v-model="draft.ads"
						type="checkbox"
					>
					<span>Ads</span>
				</label>
			</div>
			<div class="privacy-preferences__actions">
				<UButton
					color="gray"
					variant="ghost"
					size="sm"
					@click="reject"
				>
					Reject optional
				</UButton>
				<UButton
					color="white"
					variant="solid"
					size="sm"
					@click="save"
				>
					Save choices
				</UButton>
				<UButton
					size="sm"
					@click="accept"
				>
					Accept recommended
				</UButton>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
const {
	preferences,
	loadPreferences,
	savePreferences,
	acceptRecommended,
	rejectOptional,
} = usePrivacyPreferences();

const config = useRuntimeConfig();
const showBanner = ref(false);
const adsPreferencesEnabled = computed(() => config.public.adsenseEnabled);
const draft = reactive({
	analytics: true,
	ads: false,
});

function syncDraft() {
	draft.analytics = preferences.value.analytics;
	draft.ads = adsPreferencesEnabled.value ? preferences.value.ads : false;
}

function openPreferences() {
	syncDraft();
	showBanner.value = true;
}

function save() {
	savePreferences({
		analytics: draft.analytics,
		ads: adsPreferencesEnabled.value ? draft.ads : false,
	});
	showBanner.value = false;
}

function accept() {
	acceptRecommended();
	showBanner.value = false;
}

function reject() {
	rejectOptional();
	showBanner.value = false;
}

onMounted(() => {
	loadPreferences();
	syncDraft();
	showBanner.value = !preferences.value.acknowledged;
	window.addEventListener('frontendjobs:open-privacy-preferences', openPreferences);
});

onBeforeUnmount(() => {
	window.removeEventListener('frontendjobs:open-privacy-preferences', openPreferences);
});
</script>

<style scoped>
.privacy-preferences {
  @apply fixed left-4 right-4 bottom-4 z-[70] flex flex-col gap-4 rounded-lg border p-4 shadow-2xl md:left-auto md:max-w-3xl md:flex-row md:items-center;
  background: var(--fj-surface-solid);
  border-color: var(--fj-border-strong);
}

.privacy-preferences__copy {
  @apply flex-1;
}

.privacy-preferences__title {
  @apply text-sm font-semibold;
  color: var(--fj-text);
}

.privacy-preferences__text {
  @apply mt-1 text-sm;
  color: var(--fj-text-soft);
}

.privacy-preferences__link {
  @apply mt-2 inline-flex text-xs font-medium text-violet-400 hover:text-violet-300;
}

.privacy-preferences__controls {
  @apply flex gap-3;
}

.privacy-preferences__toggle {
  @apply inline-flex items-center gap-2 text-sm;
  color: var(--fj-text);
}

.privacy-preferences__toggle input {
  @apply h-4 w-4;
}

.privacy-preferences__actions {
  @apply flex flex-wrap gap-2 md:justify-end;
}
</style>

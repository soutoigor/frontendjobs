<template>
	<div
		v-if="show"
		class="launch-banner"
		role="region"
		aria-label="Launch promotion"
	>
		<div class="launch-banner__inner">
			<span class="launch-banner__pill">Launch</span>
			<span class="launch-banner__message">{{ promo.bannerMessage }}</span>
			<NuxtLink
				:to="promo.bannerCtaTo"
				class="launch-banner__cta"
			>
				{{ promo.bannerCta }}
				<UIcon
					name="i-heroicons-arrow-right-20-solid"
					class="launch-banner__cta-icon"
				/>
			</NuxtLink>
		</div>
		<button
			type="button"
			class="launch-banner__close"
			aria-label="Dismiss launch banner"
			@click="dismiss"
		>
			<UIcon name="i-heroicons-x-mark-20-solid" />
		</button>
	</div>
</template>

<script setup lang="ts">
import { useLaunchPromo } from '~/composables/use-launch-promo';

const STORAGE_KEY = 'launch-banner-dismissed-v1';

const promo = useLaunchPromo();
const dismissed = ref(true); // start hidden to avoid SSR/CSR flash

onMounted(() => {
	if (!promo.active) {
		return;
	}

	dismissed.value = localStorage.getItem(STORAGE_KEY) === '1';
});

const show = computed(() => promo.active && !dismissed.value);

function dismiss() {
	dismissed.value = true;
	if (typeof window !== 'undefined') {
		localStorage.setItem(STORAGE_KEY, '1');
	}
}
</script>

<style scoped>
.launch-banner {
	@apply relative flex items-center justify-center gap-3 px-4 py-2.5 text-sm;
	background: linear-gradient(90deg, rgba(139, 92, 246, 0.18), rgba(167, 139, 250, 0.18));
	border-bottom: 1px solid var(--fj-border);
	color: var(--fj-text);

	&__inner {
		@apply flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center;
	}

	&__pill {
		@apply inline-flex items-center px-2 py-0.5 text-xs font-semibold uppercase tracking-wider rounded-full;
		background: rgba(139, 92, 246, 0.25);
		color: rgb(196, 181, 253);
	}

	&__message {
		@apply font-medium;
	}

	&__cta {
		@apply inline-flex items-center gap-1 font-semibold underline decoration-dotted underline-offset-4;
		color: rgb(196, 181, 253);

		&:hover {
			color: rgb(221, 214, 254);
		}
	}

	&__cta-icon {
		@apply w-3.5 h-3.5;
	}

	&__close {
		@apply absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md opacity-60 transition-opacity;
		color: var(--fj-text-muted);

		&:hover {
			@apply opacity-100;
		}
	}
}
</style>

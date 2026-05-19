<template>
	<footer class="app-footer">
		<div class="app-footer__container">
			<NuxtLink to="/">
				<AppLogo />
			</NuxtLink>
			<nav class="app-footer__nav">
				<NuxtLink to="/">
					Browse jobs
				</NuxtLink>
				<NuxtLink to="/company/post-job">
					Post a job
				</NuxtLink>
				<NuxtLink to="/privacy">
					Privacy
				</NuxtLink>
				<NuxtLink to="/terms">
					Terms
				</NuxtLink>
				<button
					type="button"
					class="app-footer__button"
					@click="openPrivacyPreferences"
				>
					Cookie settings
				</button>
				<NuxtLink href="mailto:igor_souto@outlook.com">
					Contact
				</NuxtLink>
			</nav>
			<span class="app-footer__copy">
				&copy; {{ new Date().getFullYear() }} frontendjobs.app
			</span>
		</div>
	</footer>
</template>

<script setup lang="ts">
import AppLogo from '~/components/shared/app-logo.vue';

function openPrivacyPreferences() {
	window.dispatchEvent(new CustomEvent('frontendjobs:open-privacy-preferences'));
}
</script>

<style scoped>
.app-footer {
  background: var(--fj-footer-bg);
  border-top: 1px solid var(--fj-border);
  @apply py-8 px-8;

  &__container {
    @apply max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-5 flex-wrap;
  }

  &__nav {
    @apply flex gap-6 text-sm flex-wrap justify-center;
    color: var(--fj-text-muted);

    a,
    button {
      @apply transition-colors;

      &:hover {
        color: var(--fj-text);
      }
    }
  }

  &__button {
    @apply border-0 bg-transparent p-0 text-sm cursor-pointer;
    color: inherit;
  }

  &__copy {
    @apply font-mono text-xs;
    color: var(--fj-text-muted);
  }
}
</style>

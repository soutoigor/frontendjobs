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
</script>

<style scoped>
.app-footer {
  background: #080a0e;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  @apply py-8 px-8;

  &__container {
    @apply max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-5 flex-wrap;
  }

  &__nav {
    @apply flex gap-6 text-sm text-gray-500 flex-wrap justify-center;

    a {
      @apply hover:text-gray-300 transition-colors;
    }
  }

  &__copy {
    @apply font-mono text-xs text-gray-600;
  }
}
</style>

<template>
	<footer class="app-footer">
		<UContainer class="app-footer__container">
			<div class="app-footer__copy-wrapper">
				<p class="app-footer__copy">
					&copy; {{ new Date().getFullYear() }} Frontend Jobs. All rights reserved.
				</p>

				<AppLogo />
			</div>

			<nav>
				<ul class="app-footer__nav">
					<li>
						<NuxtLink href="mailto:igor_souto@outlook.com">
							Contact
						</NuxtLink>
					</li>
					<li>
						<NuxtLink to="/privacy">
							Privacy
						</NuxtLink>
					</li>
					<li>
						<NuxtLink to="/terms">
							Terms
						</NuxtLink>
					</li>
				</ul>
			</nav>
		</UContainer>
	</footer>
</template>

<script setup lang="ts">
import AppLogo from '~/components/shared/app-logo.vue';
</script>

<style scoped>
.app-footer {
  @apply w-full;

  &__container {
    @apply flex flex-col md:flex-row gap-4 md:gap-20 justify-center items-center py-4 text-gray-500 text-sm pb-4;
  }

  &__section {
    @apply flex flex-row text-center gap-4 items-center;
  }

  &__copy-wrapper {
    @apply flex flex-col md:flex-row gap-2 md:gap-4 items-center;
  }

  &__nav {
    @apply flex gap-4 items-center justify-center;
  }

  &__copy {
    @apply text-center text-sm text-gray-500;
  }
}
</style>

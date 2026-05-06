<template>
	<main class="auth-wrapper">
		<div class="auth-wrapper__glow" />
		<div class="auth-wrapper__logo-bar">
			<NuxtLink to="/">
				<AppLogo />
			</NuxtLink>
		</div>
		<div class="auth-wrapper__center">
			<section class="auth-wrapper__card">
				<div class="auth-wrapper__for-companies">
					For companies
				</div>
				<h1 class="auth-wrapper__title">
					{{ title }}
				</h1>
				<p class="auth-wrapper__subtitle">
					<slot name="subtitle">
						Post your first frontend role in under 5 minutes.
					</slot>
				</p>
				<div class="auth-wrapper__form">
					<slot name="form" />
				</div>
				<slot name="benefits" />
				<div class="auth-wrapper__options">
					<slot name="options" />
				</div>
			</section>
		</div>
	</main>
</template>

<script setup lang="ts">
import AppLogo from '~/components/shared/app-logo.vue';

interface Props {
	title: string;
}

defineProps<Props>();
</script>

<style scoped>
.auth-wrapper {
  @apply w-full min-h-dvh relative overflow-hidden;

  &__glow {
    @apply absolute inset-0 pointer-events-none;
    background: radial-gradient(900px 500px at 50% 0%, rgba(167, 139, 250, 0.06), transparent 50%);
  }

  &__logo-bar {
    @apply relative px-8 py-6;
  }

  &__center {
    @apply relative flex items-center justify-center px-5 py-10;
  }

  &__card {
    @apply w-full max-w-md rounded-2xl p-8;
    background: rgba(15, 17, 23, 0.6);
    border: 1px solid rgba(255, 255, 255, 0.06);
    backdrop-filter: blur(8px);
  }

  &__for-companies {
    @apply font-mono text-violet-400 uppercase tracking-widest mb-2;
    font-size: 10.5px;
  }

  &__title {
    @apply text-2xl font-bold text-white mb-1.5;
    letter-spacing: -0.8px;
  }

  &__subtitle {
    @apply text-sm text-gray-400 mb-6 leading-relaxed;
  }

  &__form {
    @apply flex flex-col gap-3.5;
  }

  &__options {
    @apply text-center mt-5 text-xs text-gray-500;

    :deep(a) {
      @apply text-violet-400 cursor-pointer hover:text-violet-300;
    }
  }
}
</style>

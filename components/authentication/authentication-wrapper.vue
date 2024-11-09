<template>
	<main class="authentication-wrapper">
		<NuxtLink
			to="/"
			class="app-toolbar__logo"
		>
			<AppLogo class="authentication-wrapper__logo" />
		</NuxtLink>
		<section class="authentication-wrapper__content">
			<div class="authentication-wrapper__form">
				<h1
					class="authentication-wrapper__title"
					v-text="title"
				/>
				<slot name="form" />
			</div>
			<slot name="options" />
		</section>
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
.authentication-wrapper {
  @apply w-full h-dvh flex items-center flex-col gap-20 sm:gap-36 px-6;

  &__logo {
    @apply text-5xl;
  }

  &__title {
    @apply text-xl text-center;
  }

  &__content {
    @apply border border-purple-600 rounded-lg shadow-md dark:bg-gray-950 bg-slate-200;
    @apply w-full max-w-sm flex flex-col items-center gap-6 p-6;
  }

  &__form {
    @apply w-full flex flex-col items-stretch gap-4;
  }
}
</style>

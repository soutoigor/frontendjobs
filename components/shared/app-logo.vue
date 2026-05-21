<template>
	<span
		class="app-logo"
		:class="sizeClass"
	>
		<span class="app-logo__frontend">frontend</span><span class="app-logo__jobs">jobs</span><span class="app-logo__dot">.</span>
	</span>
</template>

<script setup lang="ts">
interface Props {
	size?: 'sm' | 'md' | 'lg';
}

const props = withDefaults(defineProps<Props>(), {
	size: 'md',
});

const sizeClass = computed(() => `app-logo--${props.size}`);
</script>

<style scoped>
.app-logo {
  @apply font-bold tracking-tight inline-flex items-center;
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  letter-spacing: -0.4px;

  &--sm {
    @apply text-base;
  }

  &--md {
    @apply text-lg;
  }

  &--lg {
    @apply text-2xl;
  }

  &__frontend {
    color: var(--fj-text);
  }

  &__jobs {
    @apply text-violet-400;
  }

  &__dot {
    @apply text-violet-400;
    margin-left: 1px;
  }
}
</style>

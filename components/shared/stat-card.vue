<template>
	<div class="stat-card">
		<div class="stat-card__value">
			{{ value }}
		</div>
		<div class="stat-card__label">
			{{ label }}
		</div>
	</div>
</template>

<script setup lang="ts">
interface Props {
	value: string | number;
	label: string;
}

defineProps<Props>();
</script>

<style scoped>
.stat-card {
  @apply flex flex-col gap-0.5 p-3.5 rounded-xl;
  background: var(--fj-surface);
  border: 1px solid var(--fj-border);

  &__value {
    @apply font-mono text-xl font-semibold;
    color: var(--fj-text);
    letter-spacing: -0.5px;
  }

  &__label {
    @apply text-xs uppercase tracking-wider;
    color: var(--fj-text-muted);
  }
}
</style>

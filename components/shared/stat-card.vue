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
  background: rgba(15, 17, 23, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.06);

  &__value {
    @apply font-mono text-xl font-semibold text-white;
    letter-spacing: -0.5px;
  }

  &__label {
    @apply text-xs text-gray-500 uppercase tracking-wider;
  }
}
</style>

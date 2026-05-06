<template>
	<span
		class="verified-badge"
		:class="`verified-badge--${size}`"
	>
		<svg
			:width="iconSize"
			:height="iconSize"
			viewBox="0 0 16 16"
		>
			<path
				d="M8 1 L10 2.5 L12.5 2 L13.5 4.5 L15.5 6 L14.5 8.5 L15 11 L12.5 12 L11 14 L8.5 13.5 L6 14.5 L4.5 12.5 L2 12 L2.5 9.5 L1 7.5 L2.5 5 L2 2.5 L4.5 2.5 L6.5 1 Z"
				fill="#bef264"
			/>
			<path
				d="M5 8 L7 10 L11 6"
				stroke="#0b0d12"
				stroke-width="1.6"
				fill="none"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>
		<span
			v-if="showLabel"
			class="verified-badge__label"
		>VERIFIED</span>
	</span>
</template>

<script setup lang="ts">
interface Props {
	size?: 'sm' | 'md';
	showLabel?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
	size: 'sm',
	showLabel: false,
});

const iconSize = computed(() => props.size === 'sm' ? 11 : 14);
</script>

<style scoped>
.verified-badge {
  @apply inline-flex items-center gap-1 shrink-0;

  &--md .verified-badge__label {
    @apply text-xs;
  }

  &__label {
    @apply font-mono text-lime-300 tracking-wider;
    font-size: 10px;
  }
}
</style>

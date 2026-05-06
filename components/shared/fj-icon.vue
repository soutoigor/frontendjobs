<template>
	<svg
		:width="size"
		:height="size"
		viewBox="0 0 16 16"
		fill="none"
		:stroke="color"
		stroke-width="1.4"
		stroke-linecap="round"
		stroke-linejoin="round"
		class="shrink-0 block"
	>
		<template v-if="name === 'search'">
			<path d="M11 11 L15 15 M7 12 A5 5 0 1 1 7 2 A5 5 0 0 1 7 12 Z" />
		</template>
		<template v-else-if="name === 'arrow'">
			<path d="M3 8 H13 M9 4 L13 8 L9 12" />
		</template>
		<template v-else-if="name === 'check'">
			<path d="M3 8 L7 12 L13 4" />
		</template>
		<template v-else-if="name === 'bolt'">
			<path
				d="M9 1 L3 9 H8 L7 15 L13 7 H8 Z"
				:fill="color"
				stroke="none"
			/>
		</template>
		<template v-else-if="name === 'globe'">
			<circle
				cx="8"
				cy="8"
				r="6"
			/>
			<path d="M2 8 H14 M8 2 C10.5 5 10.5 11 8 14 M8 2 C5.5 5 5.5 11 8 14" />
		</template>
		<template v-else-if="name === 'chev'">
			<path d="M4 6 L8 10 L12 6" />
		</template>
		<template v-else-if="name === 'plus'">
			<path d="M8 3 V13 M3 8 H13" />
		</template>
		<template v-else-if="name === 'user'">
			<circle
				cx="8"
				cy="6"
				r="2.5"
			/>
			<path d="M3 14 C3 11 5 10 8 10 C11 10 13 11 13 14" />
		</template>
		<template v-else-if="name === 'mail'">
			<rect
				x="2"
				y="4"
				width="12"
				height="9"
				rx="1"
			/>
			<path d="M2 5 L8 9 L14 5" />
		</template>
		<template v-else-if="name === 'eye'">
			<path d="M1 8 C3 4 5 3 8 3 C11 3 13 4 15 8 C13 12 11 13 8 13 C5 13 3 12 1 8 Z" />
			<circle
				cx="8"
				cy="8"
				r="2"
			/>
		</template>
		<template v-else-if="name === 'heart'">
			<path d="M8 13 C5 11 1 9 1 5.5 C1 3 3 2 5 3 C6 3.5 8 5 8 5 C8 5 10 3.5 11 3 C13 2 15 3 15 5.5 C15 9 11 11 8 13 Z" />
		</template>
		<template v-else-if="name === 'bookmark'">
			<path d="M3 2 H13 V14 L8 11 L3 14 Z" />
		</template>
		<template v-else-if="name === 'share'">
			<circle
				cx="4"
				cy="8"
				r="2"
			/>
			<circle
				cx="12"
				cy="4"
				r="2"
			/>
			<circle
				cx="12"
				cy="12"
				r="2"
			/>
			<path d="M6 7 L10 5 M6 9 L10 11" />
		</template>
		<template v-else-if="name === 'spark'">
			<path
				d="M8 1 L9.5 6.5 L15 8 L9.5 9.5 L8 15 L6.5 9.5 L1 8 L6.5 6.5 Z"
				:fill="color"
				stroke="none"
			/>
		</template>
		<template v-else-if="name === 'money'">
			<rect
				x="1"
				y="4"
				width="14"
				height="9"
				rx="1.5"
			/>
			<circle
				cx="8"
				cy="8.5"
				r="2"
			/>
		</template>
		<template v-else-if="name === 'pin'">
			<path d="M8 14 C8 14 3 9 3 6 A5 5 0 0 1 13 6 C13 9 8 14 8 14 Z" />
			<circle
				cx="8"
				cy="6"
				r="1.5"
			/>
		</template>
		<template v-else-if="name === 'clock'">
			<circle
				cx="8"
				cy="8"
				r="6"
			/>
			<path d="M8 4 V8 L11 10" />
		</template>
		<template v-else-if="name === 'fire'">
			<path
				d="M8 1 C8 4 11 4 11 7 C11 9 9.5 10 9.5 10 C9.5 10 11 10 11 7.5 C13 9 13 12 11 14 C9 15 6 15 4 13 C2 11 2 8 4 6 C5 7 6 7 6 5 C6 3 7 2 8 1 Z"
				:fill="color"
				stroke="none"
			/>
		</template>
		<template v-else-if="name === 'trash'">
			<path d="M3 4 H13 M5 4 V14 H11 V4 M6 4 V2 H10 V4" />
		</template>
		<template v-else-if="name === 'edit'">
			<path d="M11 2 L14 5 L5 14 H2 V11 Z" />
		</template>
		<template v-else-if="name === 'card'">
			<rect
				x="1"
				y="3"
				width="14"
				height="10"
				rx="1.5"
			/>
			<path d="M1 7 H15" />
		</template>
		<template v-else-if="name === 'lock'">
			<rect
				x="3"
				y="7"
				width="10"
				height="7"
				rx="1"
			/>
			<path d="M5 7 V5 A3 3 0 0 1 11 5 V7" />
		</template>
		<template v-else-if="name === 'link'">
			<path d="M9 5 L12 5 A3 3 0 0 1 12 11 L10 11 M7 11 L4 11 A3 3 0 0 1 4 5 L6 5 M6 8 H10" />
		</template>
		<template v-else-if="name === 'filter'">
			<path d="M2 3 H14 L10 8 V13 L6 14 V8 Z" />
		</template>
		<template v-else-if="name === 'sort'">
			<path d="M4 3 V13 M2 11 L4 13 L6 11 M12 13 V3 M10 5 L12 3 L14 5" />
		</template>
		<template v-else-if="name === 'close'">
			<path d="M3 3 L13 13 M13 3 L3 13" />
		</template>
		<template v-else-if="name === 'star'">
			<path
				d="M8 1 L10 6 L15 6 L11 9 L13 14 L8 11 L3 14 L5 9 L1 6 L6 6 Z"
				:fill="color"
				stroke="none"
			/>
		</template>
	</svg>
</template>

<script setup lang="ts">
interface Props {
	name: string;
	size?: number;
	color?: string;
}

withDefaults(defineProps<Props>(), {
	size: 16,
	color: 'currentColor',
});
</script>

<template>
	<AppToolbar
		:home="isHomePage"
		class="absolute top-0 left-0 right-0 z-10 max-"
	/>
	<NuxtPage
		class="relative"
		:class="[!isHomePage && 'pt-20 pb-6']"
	/>
</template>

<script setup lang="ts">
import AppToolbar from '~/components/toolbar/app-toolbar.vue';

const route = useRoute();
const isHomePage = computed(() => route.path === '/');
</script>

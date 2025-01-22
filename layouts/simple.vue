<template>
	<main class="simple">
		<slot />
	</main>
</template>

<style scoped>
.simple {
  @apply min-h-screen p-0 pt-20 px-4 pb-12 md:px-14 w-full;
}
</style>

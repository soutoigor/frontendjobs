<template>
  <UContainer class="job-opportunity-card-skeleton">
    <USkeleton class="h-12 w-12" :ui="{ rounded: 'rounded-full' }" />
    <div class="space-y-2">
      <USkeleton class="h-4 w-16 md:w-72" />
      <USkeleton class="h-4 w-16 md:w-72" />
      <USkeleton class="h-4 w-16 md:w-72" />
    </div>
  </UContainer>
</template>

<style scoped>
.job-opportunity-card-skeleton {
  @apply border rounded-md w-full border-gray-600 flex gap-4 py-4 px-6;
}
</style>

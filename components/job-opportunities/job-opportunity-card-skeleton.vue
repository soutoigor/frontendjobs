<template>
	<div class="job-card-skeleton">
		<USkeleton
			class="h-11 w-11 shrink-0"
			:ui="{ rounded: 'rounded-lg' }"
		/>
		<div class="space-y-2.5 flex-1">
			<USkeleton class="h-4 w-64" />
			<USkeleton class="h-3 w-40" />
			<div class="flex gap-2">
				<USkeleton
					class="h-5 w-16"
					:ui="{ rounded: 'rounded-md' }"
				/>
				<USkeleton
					class="h-5 w-16"
					:ui="{ rounded: 'rounded-md' }"
				/>
				<USkeleton
					class="h-5 w-16"
					:ui="{ rounded: 'rounded-md' }"
				/>
			</div>
		</div>
		<div class="space-y-2">
			<USkeleton class="h-3 w-12 ml-auto" />
			<USkeleton class="h-3 w-16 ml-auto" />
		</div>
	</div>
</template>

<style scoped>
.job-card-skeleton {
  @apply flex gap-4 items-start rounded-xl;
  padding: 18px 22px;
  background: rgba(15, 17, 23, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.05);
}
</style>

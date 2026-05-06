<template>
	<UContainer class="payment-return">
		<UCard class="payment-return__card">
			<div class="payment-return__content">
				<UIcon
					name="i-heroicons-check-circle"
					class="payment-return__icon"
				/>
				<h1>Payment received</h1>
				<p>Taking you back to your company dashboard.</p>
			</div>
		</UCard>
	</UContainer>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/store/authentication';
import { useJobOpportunitiesStore } from '~/store/job-opportunities';

definePageMeta({
	layout: 'simple',
});

const authStore = useAuthStore();
const jobOpportunitiesStore = useJobOpportunitiesStore();
const router = useRouter();

onMounted(async () => {
	jobOpportunitiesStore.clearDraftJobOpportunity();

	try {
		await authStore.refresh();
	}
	catch {
		// The login page will preserve the post-payment destination.
	}

	const dashboardPath = '/company/dashboard?payment=success';

	if (authStore.authenticated) {
		await router.replace(dashboardPath);
		return;
	}

	await router.replace({
		path: '/login',
		query: { redirect: dashboardPath },
	});
});
</script>

<style scoped>
.payment-return {
  @apply flex min-h-screen items-center justify-center;

  &__card {
    @apply w-full max-w-md;
  }

  &__content {
    @apply flex flex-col items-center gap-3 text-center;

    h1 {
      @apply text-2xl font-bold;
    }

    p {
      @apply text-sm text-gray-500;
    }
  }

  &__icon {
    @apply h-12 w-12 text-green-500;
  }
}
</style>

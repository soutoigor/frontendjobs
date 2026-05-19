<template>
	<UContainer class="payment-return">
		<UCard class="payment-return__card">
			<div class="payment-return__content">
				<UIcon
					name="i-heroicons-x-circle"
					class="payment-return__icon"
				/>
				<h1>Payment not completed</h1>
				<p>Taking you back to your pending job post.</p>
			</div>
		</UCard>
	</UContainer>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/store/authentication';

definePageMeta({
	layout: 'simple',
});

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();
const { track } = useAnalytics();

onMounted(async () => {
	track('Payment Cancelled', {
		props: {
			job_id: typeof route.query.job_id === 'string' ? route.query.job_id : '',
		},
	});

	try {
		await authStore.refresh();
	}
	catch {
		// The login page will preserve the cancelled-payment destination.
	}

	const dashboardPath = '/company/dashboard?payment=cancelled';

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
    @apply h-12 w-12 text-yellow-500;
  }
}
</style>

<template>
	<div class="terms">
		<header class="terms__header">
			<h1 class="terms__title">
				Terms of Service
			</h1>
			<p class="terms__date">
				Last Updated: {{ LAST_UPDATE }}
			</p>
		</header>

		<section class="terms__section">
			<h2 class="terms__subtitle">
				1. Use of the Service
			</h2>
			<p>Companies can create accounts, post jobs, and manage their postings. Job postings are currently free, but we may introduce paid features later.</p>
		</section>

		<section class="terms__section">
			<h2 class="terms__subtitle">
				2. User Accounts
			</h2>
			<ul class="terms__list">
				<li class="terms__item">
					You are responsible for maintaining the confidentiality of your credentials.
				</li>
				<li class="terms__item">
					We reserve the right to suspend or terminate accounts for violations or fraudulent activities.
				</li>
			</ul>
		</section>

		<section class="terms__section">
			<h2 class="terms__subtitle">
				3. Content Ownership and Responsibility
			</h2>
			<p>Companies retain ownership of their posted content. By posting, you grant us a license to display the content on our website.</p>
			<p>We are not responsible for the accuracy or legality of job postings.</p>
		</section>

		<section class="terms__section">
			<h2 class="terms__subtitle">
				4. Payments
			</h2>
			<p>Job postings are free for now, but a payment model may be introduced. Payment terms will be updated accordingly.</p>
		</section>

		<section class="terms__section">
			<h2 class="terms__subtitle">
				5. Prohibited Activities
			</h2>
			<p>Users agree not to:</p>
			<ul class="terms__list">
				<li class="terms__item">
					Post illegal or fraudulent job opportunities
				</li>
				<li class="terms__item">
					Impersonate others
				</li>
				<li class="terms__item">
					Engage in activities disrupting the website’s operation
				</li>
			</ul>
		</section>

		<section class="terms__section">
			<h2 class="terms__subtitle">
				6. Limitation of Liability
			</h2>
			<p>We are not liable for any damages resulting from your use of the website or inability to access it.</p>
		</section>

		<section class="terms__section">
			<h2 class="terms__subtitle">
				7. Changes to the Terms
			</h2>
			<p>We may update these terms at any time. Continued use of the website after changes implies acceptance of the new terms.</p>
		</section>
	</div>
</template>

<script lang="ts" setup>
const LAST_UPDATE = 'January 15, 2025';

definePageMeta({
	layout: 'simple',
});
</script>

<style scoped>
.terms {
  &__header {
    @apply mb-6;
  }
  &__title {
    @apply text-3xl font-bold mb-2;
  }
  &__date {
    @apply text-gray-600;
  }
  &__section {
    @apply mb-8;
  }
  &__subtitle {
    @apply text-xl font-semibold mb-4;
  }
  &__list {
    @apply list-disc pl-5;
  }
  &__item {
    @apply mb-2;
  }
}
</style>

<template>
	<div class="terms">
		<header class="terms__header">
			<h1 class="terms__title">
				Terms of Service
			</h1>
			<p class="terms__date">
				Last updated: {{ LAST_UPDATE }}
			</p>
			<p class="terms__notice">
				These terms are a launch draft for Frontend Jobs and should be reviewed by the site owner or legal counsel before production launch.
			</p>
		</header>

		<section class="terms__section">
			<h2 class="terms__subtitle">
				1. Service
			</h2>
			<p>
				Frontend Jobs is a job board for frontend development roles. Companies can create accounts, manage company profiles, post paid job listings, and receive application notifications. Candidates can browse jobs and follow external application links.
			</p>
		</section>

		<section class="terms__section">
			<h2 class="terms__subtitle">
				2. Accounts
			</h2>
			<ul class="terms__list">
				<li>You are responsible for your account credentials and all activity under your account.</li>
				<li>You must provide accurate company and job-posting information.</li>
				<li>We may suspend or remove accounts that are abusive, fraudulent, misleading, unlawful, or harmful to the service.</li>
			</ul>
		</section>

		<section class="terms__section">
			<h2 class="terms__subtitle">
				3. Job postings and moderation
			</h2>
			<p>
				Companies retain ownership of their submitted content, but grant Frontend Jobs permission to display, promote, rank, and distribute job listings on the website and related channels. We may reject, edit visibility for, or remove listings that violate these terms, appear fraudulent, are not relevant to the product, or create legal or safety risk.
			</p>
		</section>

		<section class="terms__section">
			<h2 class="terms__subtitle">
				4. Payments and listing terms
			</h2>
			<p>
				Paid job listings run for 30 days unless otherwise stated. Current tiers are Standard for $99, Featured for $149, and Spotlight for $199. Payments are processed by Stripe before publication. Payment confirmation publishes eligible listings automatically.
			</p>
			<p>
				Because job posts are digital advertising placements, payments are generally non-refundable once a listing is published, except where required by law or where Frontend Jobs determines that a refund is appropriate.
			</p>
		</section>

		<section class="terms__section">
			<h2 class="terms__subtitle">
				5. Candidate applications and external links
			</h2>
			<p>
				The apply flow may collect optional applicant name and email before opening the company's external application destination. Frontend Jobs is not responsible for third-party application pages, hiring decisions, employer communications, or job-offer accuracy.
			</p>
		</section>

		<section class="terms__section">
			<h2 class="terms__subtitle">
				6. Prohibited activity
			</h2>
			<ul class="terms__list">
				<li>Posting illegal, discriminatory, fraudulent, misleading, or unrelated opportunities.</li>
				<li>Impersonating another company or person.</li>
				<li>Submitting malware, spam, scraping, or attempts to disrupt the website or API.</li>
				<li>Using the service to collect data in ways that violate privacy, employment, or anti-discrimination laws.</li>
			</ul>
		</section>

		<section class="terms__section">
			<h2 class="terms__subtitle">
				7. Disclaimers and liability
			</h2>
			<p>
				Frontend Jobs is provided as-is and as-available. We do not guarantee uninterrupted access, job availability, candidate quality, hiring outcomes, or third-party service behavior. To the fullest extent permitted by law, Frontend Jobs is not liable for indirect, incidental, consequential, or lost-profit damages.
			</p>
		</section>

		<section class="terms__section">
			<h2 class="terms__subtitle">
				8. Changes and contact
			</h2>
			<p>
				We may update these terms as the product changes. Continued use of the service after updates means you accept the revised terms. Questions can be sent to
				<a
					:href="`mailto:${CONTACT_EMAIL}`"
					v-text="CONTACT_EMAIL"
				/>.
			</p>
		</section>
	</div>
</template>

<script lang="ts" setup>
const LAST_UPDATE = 'May 19, 2026';
const CONTACT_EMAIL = 'igor_souto@outlook.com';

definePageMeta({
	layout: 'simple',
});
</script>

<style scoped>
.terms {
  a {
    @apply text-violet-400 hover:text-violet-300 hover:underline;
  }

  &__header {
    @apply mb-6;
  }

  &__title {
    @apply text-3xl font-bold mb-2;
  }

  &__date,
  &__notice {
    color: var(--fj-text-muted);
  }

  &__notice {
    @apply mt-3 rounded-lg border px-4 py-3 text-sm;
    border-color: var(--fj-border);
    background: var(--fj-surface);
  }

  &__section {
    @apply mb-8;
  }

  &__subtitle {
    @apply text-xl font-semibold mb-4;
  }

  &__list {
    @apply list-disc pl-5 space-y-2;
  }
}
</style>

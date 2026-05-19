<template>
	<div class="privacy">
		<header class="privacy__header">
			<h1 class="privacy__title">
				Privacy Policy
			</h1>
			<p class="privacy__date">
				Last updated: {{ LAST_UPDATE }}
			</p>
			<p class="privacy__notice">
				This policy is a practical launch draft for Frontend Jobs and should be reviewed by the site owner or legal counsel before production launch.
			</p>
		</header>

		<section class="privacy__section">
			<h2 class="privacy__subtitle">
				1. Information we collect
			</h2>
			<ul class="privacy__list">
				<li><strong>Account data:</strong> email address, password hash, login token, and company account details.</li>
				<li><strong>Company and job data:</strong> company profile, avatar, social links, job descriptions, salary ranges, technologies, locations, and application destination links.</li>
				<li><strong>Applicant data:</strong> optional applicant name and email submitted through the apply modal, plus application timestamps and application counts.</li>
				<li><strong>Usage data:</strong> pageviews and product events such as searches, filters, job opens, applications, and checkout starts when analytics are enabled.</li>
				<li><strong>Storage:</strong> an essential auth token cookie and local browser storage for unfinished job drafts and privacy preferences.</li>
			</ul>
		</section>

		<section class="privacy__section">
			<h2 class="privacy__subtitle">
				2. How we use information
			</h2>
			<ul class="privacy__list">
				<li>To operate the job board, company dashboard, job posting flow, payment flow, and application tracking.</li>
				<li>To send application notifications to companies and operational emails related to job posts.</li>
				<li>To prevent abuse, secure accounts, debug issues, and improve the product.</li>
				<li>To measure aggregate site usage and launch performance.</li>
			</ul>
		</section>

		<section class="privacy__section">
			<h2 class="privacy__subtitle">
				3. Service providers
			</h2>
			<p>We use trusted providers to run the service:</p>
			<ul class="privacy__list">
				<li><strong>Railway</strong> hosts the API and database.</li>
				<li><strong>Vercel</strong> hosts the frontend.</li>
				<li><strong>Cloudinary</strong> stores and delivers company avatars.</li>
				<li><strong>Resend</strong> sends application notification emails.</li>
				<li><strong>Stripe</strong> processes paid job-posting checkout. We do not store full payment card details.</li>
				<li><strong>Plausible</strong> provides privacy-friendly analytics when enabled.</li>
				<li><strong>Google AdSense</strong> is not active by default. If ads are enabled later, they will be kept behind the consent controls required for the visitor's region.</li>
			</ul>
		</section>

		<section class="privacy__section">
			<h2 class="privacy__subtitle">
				4. Cookies and preferences
			</h2>
			<p>
				Essential storage is required for login, security, privacy preferences, and saving unfinished job drafts. Plausible analytics is cookie-free, but you can disable analytics in Cookie settings. Ads are not presented as a choice unless the advertising integration is enabled.
			</p>
			<button
				type="button"
				class="privacy__button"
				@click="openPrivacyPreferences"
			>
				Open cookie settings
			</button>
		</section>

		<section class="privacy__section">
			<h2 class="privacy__subtitle">
				5. Sharing and disclosure
			</h2>
			<p>
				We do not sell personal information. We share information with service providers only as needed to operate Frontend Jobs, comply with legal obligations, protect users, process payments, or prevent abuse.
			</p>
		</section>

		<section class="privacy__section">
			<h2 class="privacy__subtitle">
				6. Data retention and deletion
			</h2>
			<p>
				We retain account, company, job, payment status, and application records while needed to operate the service, resolve disputes, comply with legal obligations, and maintain business records. To request access, correction, or deletion, contact
				<a
					:href="`mailto:${CONTACT_EMAIL}`"
					v-text="CONTACT_EMAIL"
				/>.
			</p>
		</section>

		<section class="privacy__section">
			<h2 class="privacy__subtitle">
				7. Security
			</h2>
			<p>
				We use HTTPS, authentication tokens, validation, access controls, and provider security features to protect the service. No online service can guarantee perfect security, so please report suspected issues to
				<a
					:href="`mailto:${CONTACT_EMAIL}`"
					v-text="CONTACT_EMAIL"
				/>.
			</p>
		</section>

		<section class="privacy__section">
			<h2 class="privacy__subtitle">
				8. Changes
			</h2>
			<p>We may update this policy as the product changes. Material updates will be reflected on this page with a new date.</p>
		</section>
	</div>
</template>

<script lang="ts" setup>
const LAST_UPDATE = 'May 19, 2026';
const CONTACT_EMAIL = 'igor_souto@outlook.com';

definePageMeta({
	layout: 'simple',
});

function openPrivacyPreferences() {
	window.dispatchEvent(new CustomEvent('frontendjobs:open-privacy-preferences'));
}
</script>

<style scoped>
.privacy {
  a,
  &__button {
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

  &__button {
    @apply mt-4 border-0 bg-transparent p-0 cursor-pointer font-medium;
  }
}
</style>

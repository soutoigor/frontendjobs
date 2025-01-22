<template>
	<div class="privacy">
		<header class="privacy__header">
			<h1 class="privacy__title">
				Privacy Policy
			</h1>
			<p class="privacy__date">
				Last Updated: {{ LAST_UPDATE }}
			</p>
		</header>

		<section class="privacy__section">
			<h2 class="privacy__subtitle">
				1. Information We Collect
			</h2>
			<p>We collect the following types of information when you use our services:</p>
			<ul class="privacy__list">
				<li class="privacy__item">
					<strong>Account Information:</strong> email address, password, company details (social media usernames, website, location), and company avatar.
				</li>
				<li class="privacy__item">
					<strong>Job Opportunities:</strong> details of job postings created by companies.
				</li>
				<li class="privacy__item">
					<strong>Cookies:</strong> used to store your authentication token when you log in.
				</li>
				<li class="privacy__item">
					<strong>Analytics:</strong> we use Google Analytics to track user behavior.
				</li>
			</ul>
		</section>

		<section class="privacy__section">
			<h2 class="privacy__subtitle">
				2. How We Use Your Information
			</h2>
			<ul class="privacy__list">
				<li class="privacy__item">
					To provide and improve our services
				</li>
				<li class="privacy__item">
					To allow companies to manage job postings
				</li>
				<li class="privacy__item">
					To facilitate secure user authentication
				</li>
				<li class="privacy__item">
					To analyze usage patterns for a better experience
				</li>
			</ul>
		</section>

		<section class="privacy__section">
			<h2 class="privacy__subtitle">
				3. Sharing Your Information
			</h2>
			<p>We do not sell your personal information to third parties. However, we may share it with:</p>
			<ul class="privacy__list">
				<li class="privacy__item">
					<strong>Service Providers:</strong> Firebase and Google Analytics
				</li>
				<li class="privacy__item">
					<strong>Legal Authorities:</strong> if required by law or to protect our rights
				</li>
			</ul>
		</section>

		<section class="privacy__section">
			<h2 class="privacy__subtitle">
				4. Your Rights
			</h2>
			<ul class="privacy__list">
				<li class="privacy__item">
					<strong>Access and Correction:</strong> You can update your details anytime.
				</li>
				<li class="privacy__item">
					<strong>Data Deletion:</strong> Request deletion by contacting us at <a
						:href="`mailto:${CONTACT_EMAIL}`"
						v-text="CONTACT_EMAIL"
					/>.
				</li>
				<li class="privacy__item">
					<strong>Cookies:</strong> Manage preferences via browser settings.
				</li>
			</ul>
		</section>

		<section class="privacy__section">
			<h2 class="privacy__subtitle">
				5. Data Security
			</h2>
			<p>We take measures to protect your data from unauthorized access or disclosure.</p>
		</section>

		<section class="privacy__section">
			<h2 class="privacy__subtitle">
				6. Changes to This Privacy Policy
			</h2>
			<p>We may update this policy from time to time. Updates will be posted here with the revised date.</p>
		</section>
	</div>
</template>

<script lang="ts" setup>
const LAST_UPDATE = 'January 15, 2025';
const CONTACT_EMAIL = 'igor_souto@outlook.com';

definePageMeta({
	layout: 'simple',
});
</script>

<style scoped>
.privacy {
  a {
    @apply text-blue-300 hover:underline;
  }

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

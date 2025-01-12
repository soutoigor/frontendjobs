<template>
	<section class="company-card">
		<div class="company-card__header-wrapper">
			<div class="company-card__header">
				<UAvatar
					:src="company?.avatar"
					:alt="company?.name"
					size="3xl"
				/>
				<div class="company-card__company-info-wrapper">
					<slot name="title">
						<h1 v-text="company?.name" />
					</slot>
					<div>
						<p>Location: <b v-text="company?.location" /></p>
						<p>Industry: <b v-text="company?.industry" /></p>
					</div>
				</div>
			</div>
			<slot name="action" />
		</div>

		<div class="company-card__socials-wrapper">
			<div v-if="!companySocials.length">
				<p class="company-card__no-socials">
					No socials provided
				</p>
			</div>
			<div
				v-else
				class="company-card__socials"
			>
				<a
					v-for="companySocial in companySocials"
					:key="companySocial.social"
					class="company-card__social-link"
					:href="getSocialLink(companySocial.social, companySocial.value)"
					target="_blank"
				>
					<Icon :name="companySocial.icon" />
					<span v-text="companySocial.value" />
				</a>
			</div>
		</div>
	</section>
</template>

<script lang="ts" setup>
import type { Socials, Company, CompanyWithJobs } from '~/types/companies';

interface Props {
	company: Company | CompanyWithJobs;
}
const props = defineProps<Props>();

const iconsBySocial: Record<keyof Socials, string> = {
	email: 'heroicons:envelope-16-solid',
	website: 'heroicons:link',
	github: 'entypo-social:github',
	linkedin: 'entypo-social:linkedin',
	instagram: 'entypo-social:instagram',
};
const socialURL: Record<keyof Socials, string> = {
	email: 'mailto:',
	website: 'https://',
	github: 'https://github.com/',
	linkedin: 'https://linkedin.com/company/',
	instagram: 'https://instagram.com/',
};
const companySocials = computed(
	() => Object
		.entries(props.company?.socials ?? {})
		.map(([social, value]) => ({ social: social as keyof Socials, value, icon: iconsBySocial[social as keyof Socials] }))
		.filter(({ value }) => !!value),
);

function getSocialLink(social: keyof Socials, value: string) {
	return `${socialURL[social]}${value}`;
}
</script>

<style scoped>
.company-card {
	@apply w-full;

	&__header-wrapper {
		@apply flex flex-col gap-4 md:flex-row md:items-center md:justify-between;
	}

	&__header {
		@apply flex items-center gap-4;
	}

	&__company-info-wrapper {
		@apply flex flex-col gap-2 w-full;

		h1 {
			@apply text-2xl font-bold;
		}

		div {
			@apply flex flex-col gap-2 md:flex-row md:items-center md:gap-6;
		}

		p {
			@apply text-sm;
		}
	}

	&__socials-wrapper {
		@apply mt-5;

		h2 {
			@apply text-lg font-bold;
		}
	}

	&__socials {
		@apply flex flex-col gap-2 md:flex-row md:items-center md:gap-6;
	}

	&__social-link {
		@apply text-sm flex items-center gap-2 hover:underline;
	}

	&__no-socials {
		@apply text-sm text-gray-500;
	}
}
</style>

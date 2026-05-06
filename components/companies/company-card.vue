<template>
	<section class="company-card">
		<div class="company-card__header-wrapper">
			<div class="company-card__header">
				<UAvatar
					:src="company?.avatar"
					:alt="company?.name"
					size="3xl"
					class="company-card__avatar"
				/>
				<div class="company-card__info">
					<slot name="title">
						<div class="company-card__title-row">
							<h1 class="company-card__name">
								{{ company?.name }}
							</h1>
						</div>
					</slot>
					<div class="company-card__meta">
						<span v-if="company?.location">
							{{ company.location }}
						</span>
						<span
							v-if="company?.location && company?.industry"
							class="text-gray-600"
						>·</span>
						<span v-if="company?.industry">
							{{ company.industry }}
						</span>
					</div>
				</div>
			</div>
			<slot name="action" />
		</div>

		<div
			v-if="companySocials.length"
			class="company-card__socials"
		>
			<a
				v-for="companySocial in companySocials"
				:key="companySocial.social"
				class="company-card__social-link"
				:href="getSocialHref(companySocial.social, companySocial.value)"
				target="_blank"
				rel="noopener noreferrer"
			>
				<Icon :name="companySocial.icon" />
				<span>{{ getSocialLabel(companySocial.social, companySocial.value) }}</span>
			</a>
		</div>
	</section>
</template>

<script lang="ts" setup>
import type { Socials, Company, CompanyWithJobs } from '~/types/companies';
import { getSocialHref, normalizeSocialLink } from '~/utils/links';

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
const companySocials = computed(
	() => Object
		.entries(props.company?.socials ?? {})
		.map(([social, value]) => ({ social: social as keyof Socials, value, icon: iconsBySocial[social as keyof Socials] }))
		.filter(({ value }) => !!value),
);

function getSocialLabel(social: keyof Socials, value: string) {
	if (social === 'email') {
		return value;
	}

	return normalizeSocialLink(social, value).replace(/^https?:\/\//, '');
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

  &__avatar {
    @apply shrink-0;
  }

  &__info {
    @apply flex flex-col gap-1;
  }

  &__title-row {
    @apply flex items-center gap-2;
  }

  &__name {
    @apply text-2xl font-bold;
    color: var(--fj-text);
    letter-spacing: -0.6px;
  }

  &__meta {
    @apply flex items-center gap-2 text-sm;
    color: var(--fj-text-muted);
  }

  &__socials {
    @apply flex flex-wrap gap-4 mt-4;
  }

  &__social-link {
    @apply text-xs flex items-center gap-1.5 transition-colors;
    color: var(--fj-text-muted);

    &:hover {
      color: var(--fj-text);
    }
  }
}
</style>

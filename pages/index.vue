<template>
	<article class="index">
		<HeroSplit />
		<TrustStrip />
		<div class="index__content">
			<JobFilters />
			<div class="index__heading">
				<h2 class="index__count">
					<span class="text-violet-400">{{ totalJobs }}</span>
					<span class="index__count-label">open roles</span>
				</h2>
				<span class="index__updated">Updated 2 min ago</span>
			</div>
			<JobOpportunities />
		</div>
	</article>
</template>

<script setup lang="ts">
import HeroSplit from '~/components/home/hero-split.vue';
import TrustStrip from '~/components/home/trust-strip.vue';
import JobFilters from '~/components/shared/job-filters.vue';
import JobOpportunities from '~/components/job-opportunities/job-opportunities.vue';
import { useFilterOptions } from '~/composables/use-filter-options';
import { useJobOpportunitiesStore } from '~/store/job-opportunities';
import type { IndexJobOpportunitiesParams, IndexJobOpportunitiesResponse } from '~/types/job-opportunities';

import { defaultMetaTags } from '~/utils/meta-tags';

useHead(defaultMetaTags);

const store = useJobOpportunitiesStore();
const config = useRuntimeConfig();
const route = useRoute();
const router = useRouter();
const { fetchTechnologies, technologies } = useFilterOptions();
const totalJobs = computed(() => store.totalJobOpportunities ?? store.jobOpportunities?.total ?? 0);
const siteUrl = config.public.siteUrl;

await fetchTechnologies();
store.updateFilters(filtersFromQuery(route.query));

useHead({
	script: [
		{
			type: 'application/ld+json',
			children: JSON.stringify({
				'@context': 'https://schema.org',
				'@type': 'WebSite',
				name: 'Frontend Jobs',
				url: siteUrl,
				potentialAction: {
					'@type': 'SearchAction',
					target: `${siteUrl}/?search={search_term_string}`,
					'query-input': 'required name=search_term_string',
				},
			}),
		},
		{
			type: 'application/ld+json',
			children: JSON.stringify({
				'@context': 'https://schema.org',
				'@type': 'Organization',
				name: 'Frontend Jobs',
				url: siteUrl,
				logo: `${siteUrl}/frontend-jobs-icon.png`,
			}),
		},
	],
});

const initialFetchParams = computed(() => activeFilters(store.filters));

await useFetch<IndexJobOpportunitiesResponse>(
	'job_opportunities',
	{
		baseURL: config.public.baseURL,
		key: 'job-opportunities-initial',
		params: initialFetchParams,
		onResponse: ({ response }) => {
			store.setJobOpportunities(response._data);
			store.setTotalJobOpportunities(response._data.total);
		},
	},
);

watch(
	() => route.query,
	(query) => {
		if (queriesMatch(queryFromFilters(store.filters), query)) {
			return;
		}

		store.updateFilters(filtersFromQuery(query));
	},
	{ deep: true },
);

watch(
	() => ({
		...store.filters,
		technologies: [...store.filters.technologies],
	}),
	(filters) => {
		const query = queryFromFilters(filters);

		if (queriesMatch(query, route.query)) {
			return;
		}

		router.replace({ query });
	},
	{ deep: true },
);

function filtersFromQuery(query: typeof route.query): IndexJobOpportunitiesParams {
	return {
		search: queryString(query.search),
		location: queryString(query.location),
		remote: queryString(query.remote) === '1' || queryString(query.remote) === 'true',
		technologies: queryList(query.stack).map(resolveTechnologyFilter).filter(Boolean),
		salary_minimum: queryString(query.salary_minimum),
		employment_type: queryString(query.employment_type),
		seniority: queryString(query.seniority),
		page: 1,
	};
}

function queryFromFilters(filters: IndexJobOpportunitiesParams) {
	const query: Record<string, string> = {};

	if (filters.search) {
		query.search = filters.search;
	}
	if (filters.location) {
		query.location = filters.location;
	}
	if (filters.remote) {
		query.remote = '1';
	}
	if (filters.technologies.length) {
		query.stack = filters.technologies.map(technologyQueryValue).join(',');
	}
	if (filters.salary_minimum) {
		query.salary_minimum = filters.salary_minimum;
	}
	if (filters.employment_type) {
		query.employment_type = filters.employment_type;
	}
	if (filters.seniority) {
		query.seniority = filters.seniority;
	}
	return query;
}

function activeFilters(filters: IndexJobOpportunitiesParams) {
	return Object.fromEntries(
		Object.entries(filters).filter(([, value]) => {
			if (Array.isArray(value)) {
				return value.length > 0;
			}

			return value !== '' && value !== false && value !== null && value !== undefined;
		}),
	);
}

function queriesMatch(left: Record<string, string>, right: typeof route.query) {
	return JSON.stringify(sortQuery(left)) === JSON.stringify(sortQuery(Object.fromEntries(
		Object.entries(right)
			.map(([key, value]) => [key, queryString(value)])
			.filter(([, value]) => value !== ''),
	)));
}

function sortQuery(query: Record<string, string>) {
	return Object.fromEntries(Object.entries(query).sort(([left], [right]) => left.localeCompare(right)));
}

function queryString(value: typeof route.query[string]) {
	return Array.isArray(value) ? value[0] || '' : value || '';
}

function queryList(value: typeof route.query[string]) {
	return queryString(value)
		.split(',')
		.map(item => item.trim())
		.filter(Boolean);
}

function resolveTechnologyFilter(value: string) {
	const decodedValue = decodeURIComponent(value);
	const technology = technologies.value.find(({ id, name }) =>
		id === decodedValue || normalizedTechnologyName(name) === normalizedTechnologyName(decodedValue),
	);

	return technology?.id || decodedValue;
}

function technologyQueryValue(technologyId: string) {
	const technology = technologies.value.find(({ id }) => id === technologyId);

	return technology?.name || technologyId;
}

function normalizedTechnologyName(value: string) {
	return value.trim().toLowerCase();
}
</script>

<style scoped>
.index {
  @apply flex flex-col min-h-screen;

  &__content {
    @apply max-w-7xl mx-auto w-full px-6 md:px-8 pb-20;
  }

  &__heading {
    @apply flex items-baseline justify-between py-6;
  }

  &__count {
    @apply inline-flex items-baseline gap-2 text-xl font-semibold;
    color: var(--fj-text);
    letter-spacing: -0.6px;
  }

  &__count-label {
    @apply font-normal;
    color: var(--fj-text-muted);
  }

  &__updated {
    @apply font-mono;
    color: var(--fj-text-muted);
    font-size: 11.5px;
  }
}

@media (max-width: 767px) {
  .index {
    &__heading {
      @apply py-4;
    }

    &__count {
      font-size: 18px;
      letter-spacing: 0;
    }

    &__updated {
      display: none;
    }
  }
}
</style>

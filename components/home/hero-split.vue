<template>
	<section class="hero-split">
		<div class="hero-split__glow" />
		<div class="hero-split__container">
			<!-- Left column -->
			<div class="hero-split__left">
				<div class="hero-split__pulse">
					<span class="hero-split__pulse-dot" />
					<span class="hero-split__pulse-text">
						{{ totalJobs }} jobs hiring this week
					</span>
				</div>
				<h1 class="hero-split__heading">
					The job board for <span class="hero-split__italic">frontend</span> developers.
				</h1>
				<p class="hero-split__subtitle">
					Browse frontend roles across React, Vue, Angular, Svelte, and the modern web. Salary ranges are visible before you apply, with remote-friendly filters and zero filler.
				</p>
				<div class="hero-split__search-row">
					<div class="hero-split__search-input">
						<SearchJobInput v-model="search" />
					</div>
					<UButton
						size="lg"
						icon="i-heroicons-arrow-right-20-solid"
						trailing
						@click="submitSearch"
					>
						Search
					</UButton>
				</div>
				<div class="hero-split__popular">
					<span class="hero-split__popular-label">Popular:</span>
					<button
						v-for="tag in popularTags"
						:key="tag"
						class="hero-split__popular-tag"
						@click="searchTag(tag)"
					>
						{{ tag }}
					</button>
				</div>
			</div>

			<!-- Right column: terminal preview -->
			<div class="hero-split__right">
				<div class="hero-split__terminal">
					<div class="hero-split__terminal-bar">
						<span class="hero-split__terminal-dot" />
						<span class="hero-split__terminal-dot" />
						<span class="hero-split__terminal-dot" />
						<span class="hero-split__terminal-url">frontendjobs.app/jobs</span>
					</div>
					<div class="hero-split__terminal-body">
						<div class="hero-split__terminal-cmd">
							<span class="text-gray-500">$</span>
							<span class="hero-split__terminal-command-brand">fj</span>
							search --remote --stack=react
						</div>
						<div class="hero-split__terminal-note">
							↳ Browse <span class="hero-split__terminal-count">{{ totalJobs }}</span> open roles
						</div>
						<div class="hero-split__terminal-results">
							<div
								v-for="line in terminalLines"
								:key="line.label"
								class="hero-split__terminal-row"
							>
								<span class="hero-split__terminal-title">
									{{ line.label }}
								</span>
								<span class="text-violet-400">
									{{ line.value }}
								</span>
							</div>
						</div>
					</div>
				</div>
				<div class="hero-split__stats">
					<StatCard
						:value="totalJobs || '—'"
						label="Open roles"
					/>
					<StatCard
						value="30"
						label="Per page"
					/>
					<StatCard
						value="$99+"
						label="Post from"
					/>
				</div>
			</div>
		</div>
	</section>
</template>

<script setup lang="ts">
import SearchJobInput from '~/components/shared/search-job-input.vue';
import StatCard from '~/components/shared/stat-card.vue';
import { useJobOpportunitiesStore } from '~/store/job-opportunities';

const store = useJobOpportunitiesStore();
const { track } = useAnalytics();

const totalJobs = computed(() => store.totalJobOpportunities ?? store.jobOpportunities?.total ?? 0);
const search = ref(store.filters.search);
const popularTags = ['React', 'Vue', 'TypeScript', 'Next.js', 'Remote'];
const terminalLines = [
	{ label: 'Stack, seniority, and location filters', value: 'Live' },
	{ label: 'Salary ranges shown before applying', value: 'Required' },
	{ label: 'Company-owned posts only', value: 'Paid' },
	{ label: 'No candidate account needed to apply', value: 'Open' },
];

function submitSearch() {
	store.updateFilters({ search: search.value, page: 1 });
	track('Search', {
		props: {
			query: search.value,
			source: 'hero',
		},
	});
}

function searchTag(tag: string) {
	if (tag === 'Remote') {
		store.updateFilters({ remote: true, page: 1 });
		track('Filter Change', {
			props: {
				filter: 'remote',
				value: true,
				source: 'popular-tag',
			},
		});
	}
	else {
		search.value = tag;
		store.updateFilters({ search: tag, page: 1 });
		track('Search', {
			props: {
				query: tag,
				source: 'popular-tag',
			},
		});
	}
}
</script>

<style scoped>
.hero-split {
  @apply relative overflow-hidden;
  padding: 64px 32px 40px;
  border-bottom: 1px solid var(--fj-border);

  &__glow {
    @apply absolute inset-0 pointer-events-none;
    background: radial-gradient(800px 400px at 20% 20%, rgba(167, 139, 250, 0.08), transparent 60%),
                radial-gradient(600px 300px at 80% 60%, rgba(167, 139, 250, 0.03), transparent 60%);
  }

  &__container {
    @apply relative max-w-7xl mx-auto grid items-center gap-16;
    grid-template-columns: 1.2fr 1fr;
  }

  &__left {
    @apply flex flex-col;
  }

  &__pulse {
    @apply inline-flex items-center gap-2 self-start px-3 py-1.5 rounded-full mb-6;
    background: var(--fj-success-bg);
    border: 1px solid var(--fj-success-border);
  }

  &__pulse-dot {
    @apply w-1.5 h-1.5 rounded-full;
    background: var(--fj-success-dot);
    box-shadow: 0 0 8px var(--fj-success-dot);
    animation: pulse-glow 2s ease-in-out infinite;
  }

  &__pulse-text {
    @apply font-mono;
    color: var(--fj-success-text);
    font-size: 11.5px;
    letter-spacing: 0.3px;
  }

  &__heading {
    @apply font-bold leading-none mb-5;
    color: var(--fj-text);
    font-size: clamp(36px, 5vw, 64px);
    letter-spacing: -2.4px;
    text-wrap: balance;
  }

  &__italic {
    @apply text-violet-400 italic font-semibold;
  }

  &__subtitle {
    @apply mb-7;
    color: var(--fj-text-muted);
    font-size: 17px;
    line-height: 1.5;
    max-width: 520px;
  }

  &__search-row {
    @apply flex gap-2.5 mb-5;
  }

  &__search-input {
    @apply flex-1;
  }

  &__popular {
    @apply flex gap-2 flex-wrap items-center;
  }

  &__popular-label {
    @apply text-xs mr-1;
    color: var(--fj-text-muted);
  }

  &__popular-tag {
    @apply font-mono px-2.5 py-1 rounded-full cursor-pointer transition-colors;
    color: var(--fj-text-soft);
    font-size: 11.5px;
    background: var(--fj-surface-muted);
    border: 1px solid var(--fj-border);

    &:hover {
      color: var(--fj-text);
      border-color: var(--fj-border-strong);
    }
  }

  /* Right column */
  &__right {
    @apply hidden lg:flex flex-col gap-2.5 font-mono;
  }

  &__terminal {
    @apply rounded-xl overflow-hidden;
    background: var(--fj-terminal-bg);
    border: 1px solid var(--fj-border-strong);
    box-shadow: var(--fj-shadow);
  }

  &__terminal-bar {
    @apply flex items-center gap-1.5 px-3.5 py-2.5;
    border-bottom: 1px solid var(--fj-border);
  }

  &__terminal-dot {
    @apply w-2.5 h-2.5 rounded-full;
    background: #3a3f4b;
  }

  &__terminal-url {
    @apply ml-auto;
    color: var(--fj-text-muted);
    font-size: 10.5px;
  }

  &__terminal-body {
    @apply p-4;
    color: var(--fj-text-soft);
    font-size: 12px;
    line-height: 1.7;
  }

  &__terminal-cmd {
    @apply flex gap-1.5;
  }

  &__terminal-command-brand {
    color: var(--fj-success-text);
  }

  &__terminal-note {
    color: var(--fj-text-soft);
  }

  &__terminal-results {
    @apply mt-3.5 pt-3.5;
    border-top: 1px dashed var(--fj-border-strong);
  }

  &__terminal-row {
    @apply grid gap-2 py-1.5;
    grid-template-columns: 1fr auto;
    font-size: 11.5px;
  }

  &__terminal-title {
    @apply overflow-hidden text-ellipsis whitespace-nowrap;
    color: var(--fj-text);
  }

  &__terminal-count {
    color: var(--fj-text);
  }

  &__stats {
    @apply grid grid-cols-3 gap-2.5;
  }
}

@keyframes pulse-glow {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

@media (max-width: 1023px) {
  .hero-split {
    @apply px-6 py-12;
  }

  .hero-split__container {
    @apply grid-cols-1;
  }
}
</style>

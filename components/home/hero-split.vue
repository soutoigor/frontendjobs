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
					React, Vue, Angular, Svelte and beyond. Salaries upfront. Remote-first. No fluff — just roles built for people who ship interfaces.
				</p>
				<div class="hero-split__search-row">
					<div class="hero-split__search-input">
						<SearchJobInput />
					</div>
					<UButton
						size="lg"
						icon="i-heroicons-arrow-right-20-solid"
						trailing
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
							<span class="text-lime-300">fj</span>
							search --remote --stack=react
						</div>
						<div class="text-gray-500">
							↳ Found <span class="text-white">{{ totalJobs }}</span> matches
						</div>
						<div class="hero-split__terminal-results">
							<div
								v-for="job in previewJobs"
								:key="job.id"
								class="hero-split__terminal-row"
							>
								<span class="hero-split__terminal-title">
									{{ job.title }}
									<span class="text-gray-500">· {{ job.company.name }}</span>
								</span>
								<span class="text-violet-400">
									{{ getSalaryText(job.currency || 'USD', job.salary_minimum || '0', job.salary_maximum) }}
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
						value="89%"
						label="Remote"
					/>
					<StatCard
						value="$142k"
						label="Median"
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
import { getSalaryText } from '~/utils/global';

const store = useJobOpportunitiesStore();

const totalJobs = computed(() => store.jobOpportunities?.total || 0);
const previewJobs = computed(() => (store.jobOpportunities?.data || []).slice(0, 4));
const popularTags = ['React', 'Vue', 'TypeScript', 'Next.js', 'Remote'];

function searchTag(tag: string) {
	if (tag === 'Remote') {
		store.updateFilters({ remote: true });
	}
	else {
		store.updateFilters({ search: tag });
	}
}
</script>

<style scoped>
.hero-split {
  @apply relative overflow-hidden;
  padding: 64px 32px 40px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);

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
    background: rgba(190, 242, 100, 0.08);
    border: 1px solid rgba(190, 242, 100, 0.20);
  }

  &__pulse-dot {
    @apply w-1.5 h-1.5 rounded-full bg-lime-300;
    box-shadow: 0 0 8px #bef264;
    animation: pulse-glow 2s ease-in-out infinite;
  }

  &__pulse-text {
    @apply font-mono text-lime-300;
    font-size: 11.5px;
    letter-spacing: 0.3px;
  }

  &__heading {
    @apply text-white font-bold leading-none mb-5;
    font-size: clamp(36px, 5vw, 64px);
    letter-spacing: -2.4px;
    text-wrap: balance;
  }

  &__italic {
    @apply text-violet-400 italic font-semibold;
  }

  &__subtitle {
    @apply text-gray-400 mb-7;
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
    @apply text-xs text-gray-500 mr-1;
  }

  &__popular-tag {
    @apply font-mono px-2.5 py-1 rounded-full cursor-pointer text-gray-300 hover:text-white transition-colors;
    font-size: 11.5px;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.08);
  }

  /* Right column */
  &__right {
    @apply hidden lg:flex flex-col gap-2.5 font-mono;
  }

  &__terminal {
    @apply rounded-xl overflow-hidden;
    background: #0a0c11;
    border: 1px solid rgba(255, 255, 255, 0.08);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
  }

  &__terminal-bar {
    @apply flex items-center gap-1.5 px-3.5 py-2.5;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  }

  &__terminal-dot {
    @apply w-2.5 h-2.5 rounded-full;
    background: #3a3f4b;
  }

  &__terminal-url {
    @apply ml-auto text-gray-500;
    font-size: 10.5px;
  }

  &__terminal-body {
    @apply p-4 text-gray-400;
    font-size: 12px;
    line-height: 1.7;
  }

  &__terminal-cmd {
    @apply flex gap-1.5;
  }

  &__terminal-results {
    @apply mt-3.5 pt-3.5;
    border-top: 1px dashed rgba(255, 255, 255, 0.08);
  }

  &__terminal-row {
    @apply grid gap-2 py-1.5;
    grid-template-columns: 1fr auto;
    font-size: 11.5px;
  }

  &__terminal-title {
    @apply text-gray-200 overflow-hidden text-ellipsis whitespace-nowrap;
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

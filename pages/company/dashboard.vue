<template>
	<UContainer class="dashboard" as="article">
		<!-- Company details -->
		<UContainer>
			<UAvatar
				:src="companiesStore.company?.avatar"
				:alt="companiesStore.company?.name"
				size="xl"
			/>
			<h1>{{ companiesStore.company?.name }}</h1>
			<div>
				<p>Location: {{ companiesStore.company?.location }}</p>
				<p>Industry: {{ companiesStore.company?.industry }}</p>
			</div>
			<div>
				<h2>Socials:</h2>
				<div>
					<p><UIcon name="heroicons:envelope-16-solid" /> {{ companiesStore.company?.socials.email }}</p>
					<p><UIcon name="heroicons:link" /> {{ companiesStore.company?.socials.website }}</p>
					<p><UIcon name="entypo-social:github" /> {{ companiesStore.company?.socials.github }}</p>
					<p><UIcon name="entypo-social:linkedin" /> {{ companiesStore.company?.socials.linkedin }}</p>
					<p><UIcon name="entypo-social:instagram" /> {{ companiesStore.company?.socials.instagram }}</p>
				</div>
			</div>
			<UDivider />
			<div>
				<h2>Jobs</h2>
				<div v-if="isEmpty(companiesStore.companyJobs)">
					<p>No jobs posted yet</p>
				</div>
				<div v-else>
					<UList>
						<UListItem v-for="job in companiesStore.companyJobs" :key="job.id">
							<h3>{{ job.title }}</h3>
							<p>{{ job.description }}</p>
						</UListItem>
					</UList>
				</div>
			</div>
		</UContainer>
	</UContainer>
</template>

<script setup lang="ts">
import { isEmpty } from 'ramda';
import { useCompaniesStore } from '~/store/companies';

const companiesStore = useCompaniesStore();

definePageMeta({
	layout: 'company',
});
</script>

<style scoped>
.dashboard {
	@apply h-screen w-full;
}
</style>

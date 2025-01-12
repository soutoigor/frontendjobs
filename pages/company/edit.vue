<template>
	<UContainer
		class="edit-company"
		as="article"
	>
		<h1 class="edit-company__title">
			Edit company details
		</h1>

		<CompanyForm />
	</UContainer>
</template>

<script setup lang="ts">
import CompanyForm from '~/components/companies/company-form.vue';

definePageMeta({
	layout: 'company',
});
</script>

<style scoped>
.edit-company {
	@apply min-h-screen p-0 w-full;

	&__title {
		@apply text-2xl md:text-3xl font-bold mb-6;
	}
}
</style>

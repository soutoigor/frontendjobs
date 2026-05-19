import type {
	IndexJobOpportunitiesResponse,
} from '~/types/job-opportunities';

export default defineEventHandler(async () => {
	const config = useRuntimeConfig();
	const WEBSITE_URL = config.public.siteUrl;
	const jobs = await fetchJobsFromAPI();
	const staticPaths = ['/', '/privacy', '/terms'];

	const staticUrls = staticPaths
		.map(path => `
        <url>
          <loc>${WEBSITE_URL}${path === '/' ? '/' : path}</loc>
          <lastmod>${new Date().toISOString()}</lastmod>
          <priority>${path === '/' ? '1.0' : '0.5'}</priority>
        </url>
      `)
		.join('');

	const jobUrls = jobs
		.map(
			(job: { id: string }) => `
        <url>
          <loc>${WEBSITE_URL}/jobs/${job.id}</loc>
          <lastmod>${new Date().toISOString()}</lastmod>
          <priority>0.8</priority>
        </url>
      `,
		)
		.join('');

	return `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${staticUrls}
      ${jobUrls}
    </urlset>`;
});

async function fetchJobsFromAPI() {
	const config = useRuntimeConfig();
	const jobs: Array<{ id: string }> = [];
	let page = 1;
	let lastPage = 1;

	do {
		const response = await $fetch<IndexJobOpportunitiesResponse>('/job_opportunities', {
			method: 'get',
			baseURL: config.public.baseURL,
			params: { page },
		});

		jobs.push(...response.data.map(job => ({ id: job.id })));
		lastPage = response.last_page;
		page += 1;
	} while (page <= lastPage);

	return jobs;
}

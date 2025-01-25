import type {
	IndexJobOpportunitiesResponse,
} from '~/types/job-opportunities';

export const WEBSITE_URL = 'https://frontendjobs.app';

export default defineEventHandler(async () => {
	const jobs = await fetchJobsFromAPI();

	const urls = jobs
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
      <url>
        <loc>${WEBSITE_URL}/</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <priority>1.0</priority>
      </url>
    </urlset>`;
});

async function fetchJobsFromAPI() {
	const config = useRuntimeConfig();
	const response = await $fetch<IndexJobOpportunitiesResponse>('/job_opportunities', {
		method: 'get',
		baseURL: config.public.baseURL,
	});

	return response.data.map(job => ({ id: job.id }));
}

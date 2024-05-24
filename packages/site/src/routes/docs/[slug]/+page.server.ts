import { getDocsData } from '$lib/server/docs/index.js';
import { error } from '@sveltejs/kit';

export const prerender = true;

export async function load({ params }: { params: { slug: string } }) {
    const docsData = await getDocsData();

    const doc = docsData.find((doc) => doc.slug === params.slug);

    if (!doc) {
        error(404, 'Not found');
    }

    return {
        page: doc,
    };
}

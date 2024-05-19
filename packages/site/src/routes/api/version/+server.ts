import { env } from '$env/dynamic/private';
import type { RequestHandler } from './$types.js';

async function cached<T>(key: string | undefined, fn: () => Promise<T>): Promise<T> {
    if (!key || typeof cache === 'undefined') {
        return fn();
    }
    const cached = await cache.match<T>(key);
    if (cached) {
        return cached;
    } else {
        const result = fn();
        cache.put(key, result);
        return result;
    }
}

export const GET: RequestHandler = async () => {
    const commitHash = env.CF_PAGES_COMMIT_SHA;
    const res = await cached(commitHash, async () => {
        return await fetch(
            'https://github.com/OMUAPPS/omuapps/releases/latest/download/latest.json',
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                redirect: 'follow',
            },
        ).then((res) => res.json());
    });
    return Response.json(res);
};

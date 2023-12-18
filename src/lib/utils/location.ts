
export function getParams<Params extends Record<string, string>>(): Params {
    const params = window.location.search
        .slice(1)
        .split('&')
        .map((kv) => kv.split('='))
        .reduce((params, [key, value]) => {
            params[key] = value;
            return params;
        }, {} as Record<string, string>);
    return params as Params;
}
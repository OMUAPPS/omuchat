declare global {
    namespace cache {
        function put<T>(key: string, value: T, ttl?: number): Promise<void>;
        function match<T>(key: string): Promise<T | undefined>;
    }
}

export {};

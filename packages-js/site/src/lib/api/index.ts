import { DEV } from 'esm-env';

const API_HOST = DEV ? 'http://localhost:5173' : 'https://omuapps.com';

export class Api {
    static VERSION_MANIFEST_ENDPOINT = `${API_HOST}/api/version`;

    public static async getVersions(): Promise<VersionManifest> {
        return await fetch(Api.VERSION_MANIFEST_ENDPOINT, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            redirect: 'follow',
        }).then((res) => res.json());
    }

    public static getPlatform(): string {
        if (typeof window.navigator.userAgentData === 'undefined') {
            const ua = window.navigator.userAgent;
            if (ua.indexOf('Win64') !== -1) {
                return 'windows-x86_64';
            } else if (ua.indexOf('Win32') !== -1) {
                return 'windows-x86';
            } else if (ua.indexOf('Linux') !== -1) {
                return 'linux-x86_64';
            } else if (ua.indexOf('Macintosh') !== -1) {
                return 'darwin-x86_64';
            }
        }
        const ua = window.navigator.userAgentData;
        const os = ua.platform.toLowerCase();
        return `${os}-x86_64`;
    }

    public static isMobile(): boolean {
        return window.navigator.userAgentData.mobile;
    }
}

export interface VersionManifest {
    version: string;
    notes: string;
    pub_date: string;
    platforms: {
        [platform: string]: Platform;
    };
}

export interface Platform {
    signature: string;
    url: string;
}

export class Api {
    static VERSION_MANIFEST =
        'https://gist.githubusercontent.com/am230/950b1da90a3b644265f36f809707f276/raw/omuchat-version.json';

    public static async getVersions(): Promise<VersionManifest> {
        return await fetch(Api.VERSION_MANIFEST).then((res) => res.json());
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

// {
//     "version": "0.1.0",
//     "notes": "See the assets to download this version and install.",
//     "pub_date": "2024-01-09T02:24:47.415Z",
//     "platforms": {
//       "windows-x86_64": {
//         "signature": "dW50cnVzdGVkIGNvbW1lbnQ6IHNpZ25hdHVyZSBmcm9tIHRhdXJpIHNlY3JldCBrZXkKUlVTVkZ5NXZRa1ZZdFFaZnNEdnpyMUhmN242Q2xYeDlobnBNUU4xemgwcmFtK3VveUE4VFowSlVIaEkxODM5VUJvODBYMHV4djdEWmYwWGEzWkVqb2Y0YTFIcENKanIxNHdvPQp0cnVzdGVkIGNvbW1lbnQ6IHRpbWVzdGFtcDoxNzA0NzY3MDgxCWZpbGU6b211Y2hhdF8wLjEuMF94NjRfZW4tVVMubXNpLnppcApiUG1kSWI3RDROUDBDdVJHdlVOVTVLNGYzVmkrVTQyN2VnZGlQdWJQNUtHUnFkdHU2MVE3Z3kyUTRaK0dnRWlxYisyZjZYaytJS2NFZ3J3ZzZrTnJEZz09Cg==",
//         "url": "https://github.com/OMUCHAT/dashboard/releases/download/app-v0.1.0/omuchat_0.1.0_x64_en-US.msi.zip"
//       },
//       "linux-x86_64": {
//         "signature": "dW50cnVzdGVkIGNvbW1lbnQ6IHNpZ25hdHVyZSBmcm9tIHRhdXJpIHNlY3JldCBrZXkKUlVTVkZ5NXZRa1ZZdFM3TTkrYk1iNUIwMXRaRFhydWVDKzNGTVBlTUVacVRVckE4R2kwNVlTOVpVTmkwL0ZxTHpIMU5qaWlPUU42ZUFiMlRpeWJaL1lxaW82dTBYemRla3d3PQp0cnVzdGVkIGNvbW1lbnQ6IHRpbWVzdGFtcDoxNzA0NzY2NjQxCWZpbGU6b211Y2hhdF8wLjEuMF9hbWQ2NC5BcHBJbWFnZS50YXIuZ3oKdWs1Yi9DSC9tTWkwTmw3aU45RmlzdXIyd2YraGhYTHBEblhLdWg0TmNKWGhvMU5qdUxacXZaek1Ka25SRXQveVI0UVBpSmhKTWpqNmZ4L3RZb0tWQlE9PQo=",
//         "url": "https://github.com/OMUCHAT/dashboard/releases/download/app-v0.1.0/omuchat_0.1.0_amd64.AppImage.tar.gz"
//       },
//       "darwin-x86_64": {
//         "signature": "dW50cnVzdGVkIGNvbW1lbnQ6IHNpZ25hdHVyZSBmcm9tIHRhdXJpIHNlY3JldCBrZXkKUlVTVkZ5NXZRa1ZZdFpJd0pxSWRnVmRKUVpWcE1WSzJ4VmdyU1UxNjlLcHZzNnBZWEE5M0d5ZkNPU3RqdWZHNzhoT0JDRGxJQ2kxU0ZHckhzMWRJMFlCa0VNa21rV09KSGdNPQp0cnVzdGVkIGNvbW1lbnQ6IHRpbWVzdGFtcDoxNzA0NzY3MDU4CWZpbGU6b211Y2hhdC5hcHAudGFyLmd6CmV0U3NoUHhIcFNKMHJrcEl2TWdRSEkxYVQ2bDM3SUpyMnFlVkhMS1JSZStWWTBqbjR2Z3BVTUtKUlRZYzc5QnRkajdIcXJLQmdUd0hpN1ZTakxiK0JnPT0K",
//         "url": "https://github.com/OMUCHAT/dashboard/releases/download/app-v0.1.0/omuchat_x64.app.tar.gz"
//       }
//     }
//   }
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

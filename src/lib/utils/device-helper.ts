export function getOS() {
    const userAgent = navigator.userAgent;
    const platform = navigator.platform;
    const macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'];
    const windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'];
    const iosPlatforms = ['iPhone', 'iPad', 'iPod'];

    if (macosPlatforms.indexOf(platform) !== -1) {
        return 'Mac OS';
    } else if (iosPlatforms.indexOf(platform) !== -1) {
        return 'iOS';
    } else if (windowsPlatforms.indexOf(platform) !== -1) {
        return 'Windows';
    } else if (/Android/.test(userAgent)) {
        return 'Android';
    } else if (/Linux/.test(platform)) {
        return 'Linux';
    }

    return 'unknown';
}

export function getBrowser() {
    const userAgent = navigator.userAgent;
    const browsers: Record<string, RegExp> = {
        chrome: /chrome/i,
        safari: /safari/i,
        firefox: /firefox/i,
        ie: /internet explorer/i,
        edge: /edge/i,
        opera: /opera/i,
        netscape: /netscape/i,
        maxthon: /maxthon/i,
        konqueror: /konqueror/i,
        mobile: /mobile/i,
    };
    for (const key in browsers) {
        if (browsers[key].test(userAgent)) {
            return key;
        }
    }
    return 'unknown';
}
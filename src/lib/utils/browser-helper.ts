export function getTabId() {
    if (typeof window === 'undefined') return Math.random().toString(36).substr(2, 4);
    let id = window.sessionStorage.getItem('remote-client-id')
    if (!id) {
        id = Math.random().toString(36).substr(2, 4);
        window.sessionStorage.setItem('remote-client-id', id);
    }
    return id;
}
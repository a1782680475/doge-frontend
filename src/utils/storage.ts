export default {
    accessToken: 'Access-Token',
    set(key: any, value: any, expire?: number, isLasting: boolean = true) {
        window.sessionStorage.clear();
        window.localStorage.clear();
        const accessToken = {
            value,
            expire
        };
        if (isLasting) {
            window.localStorage.setItem(key, JSON.stringify(accessToken));
        }
        window.sessionStorage.setItem(key, JSON.stringify(accessToken));
    },
    setToken(storage: { value: string, expire?: number, isLasting?: boolean}) {
        this.set(this.accessToken, storage.value, storage.expire, storage.isLasting);
    },
    get(key: any) {
        try {
            const schema = 'Bearer ';
            const storageStr = window.localStorage.getItem(key) ?? window.sessionStorage.getItem(key);
            if (storageStr) {
                const storage = JSON.parse(storageStr);
                if (storage) {
                    if (!storage.expire || storage.expire > new Date().getTime())
                        return schema + storage.value;
                }
            }
            return null;
        } catch {
            return null;
        }
    },
    getToken() {
        try {
            return this.get(this.accessToken);
        } catch {
            return null;
        }
    },
    clearToken(){
      window.sessionStorage.clear();
      window.localStorage.clear();
    }
}

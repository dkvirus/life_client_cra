
function lsSet(key: string, value: string) {
    localStorage.setItem(key, value)
}

function lsGet(key: string) {
    const value = localStorage.getItem(key) || ''
    try {
        return JSON.parse(value)
    } catch (e) {
        return value
    }
}

export const storage = {
    ACCESS_TOKEN: 'accessToken',
    setAccessToken(value: string) {
        lsSet(this.ACCESS_TOKEN, value)
    },
    getAccessToken() {
        return lsGet(this.ACCESS_TOKEN)
    },

    PRIVS: 'privs',
    setPrivs(value: string[]) {
        lsSet(this.PRIVS, JSON.stringify(value))
    },
    getPrivs() {
        return lsGet(this.PRIVS)
    },
}

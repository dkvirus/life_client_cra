import { storage } from 'utils/storage'
import request from './request'

export const apis = {
    getToken,
}

export async function getToken(email: string, password: string) {
    const data = new FormData()
    data.append('username', email)
    data.append('password', password)
    const result = await request({
        url: '/token',
        method: 'POST',
        data,
    })
    if (result?.access_token) {
        storage.setAccessToken(result.access_token)
        storage.setPrivs(result.privs)
    }
    return result
}

/* ******************************** users ************************************* */
export async function createUser(username: string) {
    const result = await request({
        url: '/user',
        method: 'post',
        params: { username },
    })
    return result.detail.data
}

export async function modifyUserPassword(username: string, password: string) {
    const result = await request({
        url: `/user/${username}/password`,
        method: 'patch',
        params: { password },
    })
    return result.detail.data
}

export async function modifyUser(username: string, endDate: string, roles: string[]) {
    const result = await request({
        url: `/user/${username}`,
        method: 'put',
        data: { 
            username,
            end_date: endDate,
            roles,
        },
    })
    return result.detail.data
}

export async function listUsers() {
    const result = await request({
        url: '/users',
        method: 'get',
    })
    return result.detail.data
}

/* ******************************** roles ************************************* */
export async function createRole(name: string, description: string, privs: string[]) {
    const result = await request({
        url: '/role',
        method: 'post',
        data: {
            name,
            description,
            privs,
        },
    })
    return result.detail.data
}

export async function removeRole(name: string) {
    const result = await request({
        url: `/role/${name}`,
        method: 'delete',
    })
    return result.detail.data
}

export async function modifyRole(name: string, description: string, privs: string[]) {
    const result = await request({
        url: `/role/${name}`,
        method: 'put',
        data: {
            name,
            description,
            privs,
        },
    })
    return result.detail.data
}

export async function listRoles() {
    const result = await request({
        url: '/roles',
        method: 'get',
    })
    return result.detail.data
}

/* ******************************** privs ************************************* */
export async function createPriv(name: string, description?: string) {
    const result = await request({
        url: '/priv',
        method: 'post',
        data: {
            name,
            description,
        },
    })
    return result.detail.data
}

export async function removePriv(name: string) {
    const result = await request({
        url: `/priv/${name}`,
        method: 'delete',
    })
    return result.detail.data
}

export async function modifyPriv(name: string, description?: string) {
    const result = await request({
        url: `/priv/${name}`,
        method: 'put',
        data: {
            name,
            description,
        },
    })
    return result.detail.data
}

export async function listPrivs() {
    const result = await request({
        url: '/privs',
        method: 'get',
    })
    return result.detail.data
}

/* ******************************** dreamlin-order ************************************* */
export async function createDreamlinOrder(data) {
    const result = await request({
        url: '/dreamlin/order',
        method: 'post',
        data,
    })
    return result.detail.data
}

export async function removeDreamlinOrder(id: string) {
    const result = await request({
        url: `/dreamlin/order/${id}`,
        method: 'delete',
    })
    return result.detail.data
}

export async function modifyDreamlinOrder(data) {
    const result = await request({
        url: `/dreamlin/order/${data.id}`,
        method: 'put',
        data,
    })
    return result.detail.data
}

export async function listDreamlinOrders({
    startDate,
    endDate,
    platformSupplierId,
}: {
    startDate?: string;
    endDate?: string;
    platformSupplierId?: string;
}) {
    const result = await request({
        url: '/dreamlin/orders',
        method: 'get',
        params: {
            start_date: startDate,
            end_date: endDate,
            platform_supplier_id: platformSupplierId,
        },
    })
    return result.detail.data
}

/* ******************************** dreamlin-supplier ************************************* */
export async function createDreamlinSupplier(data) {
    const result = await request({
        url: '/dreamlin/supplier',
        method: 'post',
        data,
    })
    return result.detail.data
}

export async function removeDreamlinSupplier(id: string) {
    const result = await request({
        url: `/dreamlin/supplier/${id}`,
        method: 'delete',
    })
    return result.detail.data
}

export async function modifyDreamlinSupplier(data) {
    const result = await request({
        url: `/dreamlin/supplier/${data.id}`,
        method: 'put',
        data,
    })
    return result.detail.data
}

export async function listDreamlinSuppliers({
    name,
    code,
}: {
    name?: string;
    code?: string;
}) {
    const result = await request({
        url: '/dreamlin/suppliers',
        method: 'get',
        params: {
            name,
            code,
        },
    })
    return result.detail.data
}

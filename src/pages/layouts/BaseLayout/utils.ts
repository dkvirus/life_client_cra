import { arrayUtils } from 'druikit'

export const items = [
    {
        key: 'dashboard',
        label: '控制台',
    },
    {
        key: 'member',
        label: '成员管理',
        privs: [ 'MENU_MEMBER_READ', 'MENU_MEMBER_WRITE' ],
    },
    {
        key: 'user',
        label: '用户管理',
        privs: [ 'MENU_USER_READ', 'MENU_USER_WRITE' ],
    },
    {
        key: 'role',
        label: '角色管理',
        privs: [ 'MENU_ROLE_READ', 'MENU_ROLE_WRITE' ],
    },
    {
        key: 'priv',
        label: '权限管理',
        privs: [ 'MENU_PRIV_READ', 'MENU_PRIV_WRITE' ],
    },
    {
        key: 'dreamlin-order',
        label: '梦林的订单管理',
        privs: [ 'MENU_ML_ORDER_READ', 'MENU_ML_ORDER_WRITE' ],
    },
    {
        key: 'dreamlin-supplier',
        label: '梦林的供应商管理',
        privs: [ 'MENU_ML_SUPPLIER_READ', 'MENU_ML_SUPPLIER_WRITE' ],
    },
]

export function getMenuItems(privs: string[]) {
    return items.filter(it => {
        if (!it?.privs) return true
        return arrayUtils.intersection(it?.privs, privs)?.length
    })
}

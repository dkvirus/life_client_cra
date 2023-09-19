import Dashboard from 'pages/Dashboard'
import SysUser from 'pages/SysUser'
import SysRole from 'pages/SysRole'
import SysPriv from 'pages/SysPriv'
import SysDict from 'pages/SysDict'
import DreamlinOrder from 'pages/DreamlinOrder'
import DreamlinSupplier from 'pages/DreamlinSupplier'
import DreamlinGood from 'pages/DreamlinGood'

export const menus = [
    {
        pathname: '/dashboard',
        component: Dashboard,
    },
    {
        pathname: '/user',
        component: SysUser,
    },
    {
        pathname: '/role',
        component: SysRole,
    },
    {
        pathname: '/priv',
        component: SysPriv,
    },
    {
        pathname: '/dict',
        component: SysDict,
    },
    {
        pathname: '/dreamlin-order',
        component: DreamlinOrder,
    },
    {
        pathname: '/dreamlin-supplier',
        component: DreamlinSupplier,
    },
    {
        pathname: '/dreamlin-good',
        component: DreamlinGood,
    },
]

export const sideBarMenus = [
    {
        key: 'dashboard',
        label: '控制台',
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
        key: 'dict',
        label: '字典管理',
        privs: [ 'MENU_DICT_READ', 'MENU_DICT_WRITE' ],
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
    {
        key: 'dreamlin-good',
        label: '梦林的商品管理',
        privs: [ 'MENU_ML_GOOD_READ', 'MENU_ML_GOOD_WRITE' ],
    },
]

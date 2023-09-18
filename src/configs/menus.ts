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

import Dashboard from 'pages/Dashboard'
import User from 'pages/User'
import Role from 'pages/Role'
import Priv from 'pages/Priv'
import SysDict from 'pages/SysDict'
import DreamlinOrder from 'pages/DreamlinOrder'
import DreamlinSupplier from 'pages/DreamlinSupplier'

export const menus = [
    {
        pathname: '/dashboard',
        component: Dashboard,
    },
    {
        pathname: '/user',
        component: User,
    },
    {
        pathname: '/role',
        component: Role,
    },
    {
        pathname: '/priv',
        component: Priv,
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
]

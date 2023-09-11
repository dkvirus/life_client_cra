import Dashboard from 'pages/Dashboard'
import User from 'pages/User'
import Role from 'pages/Role'
import Priv from 'pages/Priv'
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
        pathname: '/dreamlin-order',
        component: DreamlinOrder,
    },
    {
        pathname: '/dreamlin-supplier',
        component: DreamlinSupplier,
    },
]

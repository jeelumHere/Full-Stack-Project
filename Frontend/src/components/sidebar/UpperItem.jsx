import NavItem from './NavItem'
import React from 'react'

import {
    LayoutDashboard,
    User,
    Globe,
    Users,
    Sparkles,
    ChevronsLeft,
    LogOut,
} from 'lucide-react'

const navItems = [
    { title: 'Dashboard', path: 'dashboard', icon: LayoutDashboard },
    { title: 'Personal', path: 'personal', icon: User },
    { title: 'Public', path: 'public', icon: Globe },
    { title: 'Groups', path: 'groups', icon: Users },
]

function UpperItem({ collapsed }) {
    return (
        <>
            {navItems.map((item) => (
                <NavItem key={item.path} item={item} collapsed={collapsed} />
            ))}
        </>
    )
}

export default UpperItem

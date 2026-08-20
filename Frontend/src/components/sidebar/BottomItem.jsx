import NavItem from './NavItem'
import React from 'react'

import {
  UserCircle,
  Settings,
} from 'lucide-react'

const bottomItems = [
    { title: 'Profile', path: 'profile', icon: UserCircle },
    { title: 'Settings', path: 'setting', icon: Settings },
]

function BottomItem({collapsed}) {
    return (
        <>
            {bottomItems.map((item) => (
                <NavItem key={item.path} item={item} collapsed={collapsed} />
            ))}
        </>
    )
}

export default BottomItem

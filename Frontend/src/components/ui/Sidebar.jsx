import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import NavItem from '../sidebar/NavItem'
import BottomItem from '../sidebar/BottomItem'
import UpperItem from '../sidebar/UpperItem'
import SidebarUser from '../sidebar/SidebarUser'
import {
    LayoutDashboard,
    User,
    Globe,
    Users,
    UserCircle,
    Settings,
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

const bottomItems = [
    { title: 'Profile', path: 'profile', icon: UserCircle },
    { title: 'Settings', path: 'setting', icon: Settings },
]


const Sidebar = () => {
    const [collapsed, setCollapsed] = useState(false)

    return (
        <aside
            className={`h-screen hidden md:flex flex-col justify-between bg-[#111214] border-r border-white/5 transition-all duration-200
        ${collapsed ? 'w-19' : 'w-62'}`}
        >
            <div>
                {/* Brand */}
                <div className="flex items-center gap-2.5 px-4 h-16 border-b border-white/5">
                    <div className="h-8 w-8 rounded-md bg-indigo-500 flex items-center justify-center shrink-0">
                        <Sparkles size={16} className="text-white" />
                    </div>
                    {!collapsed && (
                        <span className="text-sm font-semibold text-white truncate">Brandname</span>
                    )}
                </div>

                {/* Primary nav */}
                <nav className="flex flex-col gap-1 p-3">
                    <UpperItem collapsed={collapsed} />
                </nav>
            </div>

            <div className="p-3 flex flex-col gap-1 border-t border-white/5">

                {/* Bottom Nav  */}
                <BottomItem collapsed={collapsed} />

                {/* Collapse toggle */}
                <button
                    onClick={() => setCollapsed((c) => !c)}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 w-full text-left text-zinc-400 hover:text-zinc-100 hover:bg-white/5 transition-colors"
                >
                    <ChevronsLeft
                        size={18}
                        strokeWidth={1.75}
                        className={`shrink-0 transition-transform duration-200 ${collapsed ? 'rotate-180' : ''}`}
                    />
                    {!collapsed && <span className="text-sm font-medium">Collapse</span>}
                </button>

                {/* User */}
                <SidebarUser collapsed={collapsed}/>
            </div>
        </aside>
    )
}

export default Sidebar
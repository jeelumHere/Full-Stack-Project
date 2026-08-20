import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
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

const NavItem = ({ item, collapsed }) => {
  const Icon = item.icon
  return (
    <NavLink
      to={item.path}
      title={collapsed ? item.title : undefined}
      className={({ isActive }) =>
        `group relative flex items-center gap-3 rounded-lg px-3 py-2.5 w-full transition-colors
        ${isActive
          ? 'bg-white/10 text-white'
          : 'text-zinc-400 hover:text-zinc-100 hover:bg-white/5'}`
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-0.75 rounded-r-full bg-indigo-400" />
          )}
          <Icon size={18} strokeWidth={1.75} className="shrink-0" />
          {!collapsed && (
            <span className="text-sm font-medium truncate">{item.title}</span>
          )}
        </>
      )}
    </NavLink>
  )
}

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={`h-screen flex flex-col justify-between bg-[#111214] border-r border-white/5 transition-all duration-200
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
          {navItems.map((item) => (
            <NavItem key={item.path} item={item} collapsed={collapsed} />
          ))}
        </nav>
      </div>

      <div className="p-3 flex flex-col gap-1 border-t border-white/5">
        {bottomItems.map((item) => (
          <NavItem key={item.path} item={item} collapsed={collapsed} />
        ))}

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
        <div className={`flex items-center gap-2.5 mt-2 pt-3 border-t border-white/5 ${collapsed ? 'justify-center' : 'px-1'}`}>
          <div className="h-8 w-8 rounded-full bg-zinc-700 flex items-center justify-center text-xs font-medium text-white shrink-0">
            SA
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white truncate">Sharjil</p>
              <p className="text-xs text-zinc-500 truncate">sharjil@dev.com</p>
            </div>
          )}
          {!collapsed && (
            <LogOut size={16} className="text-zinc-500 hover:text-zinc-300 shrink-0" />
          )}
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
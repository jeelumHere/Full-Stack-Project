import { NavLink } from "react-router-dom"

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

export default NavItem
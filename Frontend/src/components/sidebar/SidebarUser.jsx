import React from 'react'
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
const SidebarUser = ({collapsed}) => {
    return (
        <>
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
        </>
    )
}

    export default SidebarUser

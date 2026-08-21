import React from 'react'
import {
    LogOut,
} from 'lucide-react'
const SidebarUser = ({collapsed}) => {
    return (
        <>
            <div className={`flex items-center gap-2.5 mt-2 pt-3 border-t border-borderSidebar ${collapsed ? 'justify-center' : 'px-1'}`}>
                <div className="h-8 w-8 rounded-full bg-textInActiveSidebar flex items-center justify-center text-xs font-medium text-textActiveSidebar shrink-0">
                    SA
                </div>
                {!collapsed && (
                    <div className="flex-1 min-w-0">
                        <p className="text-sm text-textActiveSidebar truncate">Sharjil</p>
                        <p className="text-xs text-textInActiveSidebar truncate">sharjil@dev.com</p>
                    </div>
                )}
                {!collapsed && (
                    <LogOut size={16} className="text-textInActiveSidebar hover:text-textHoverSidebar shrink-0" />
                )}
            </div>
        </>
    )
}

    export default SidebarUser

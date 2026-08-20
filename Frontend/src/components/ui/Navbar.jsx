import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import UpperItem from '../sidebar/UpperItem'
import BottomItem from '../sidebar/BottomItem'
import bookOpen from "../../assets/open.png"
import close from "../../assets/close.png"
import SidebarUser from '../sidebar/SidebarUser'
import hide from '../../assets/hide.png'

const Navbar = () => {
    const [dropDown, setDropDown] = useState(false)

    const handleDropDown = () => {
        dropDown ? setDropDown(false) : setDropDown(true)
    }
    return (
        <div className='relative bg-gray-300 p-3 pr-5 md:hidden z-50'>

            <div className='flex justify-between items-center'>
                <div onClick={handleDropDown} className='w-7 h-7 hover:cursor-pointer py-2 ml-3 pb-10'>
                    <img className='object-cover' src={dropDown ? close : hide} alt="Boom" />
                </div>
                <Link to={"/profile"} className="h-8 w-8 rounded-full bg-zinc-700 flex items-center justify-center text-xs font-medium text-white shrink-0">
                    SA
                </Link>
            </div>

            {dropDown && (
                <div className='absolute top-full left-0 w-full bg-gray-300 p-3 shadow-lg z-50'>
                    <UpperItem />
                    <BottomItem />
                </div>
            )}

        </div>
    )
}

export default Navbar

import React from 'react'
import { NavLink } from 'react-router-dom'
import { LogOut } from 'lucide-react';
import { UserState } from '../../../context/UserContext';
import { useNavigate } from 'react-router-dom';


const Sidebar = ({ isExpanded, toggleMenu, links }) => {
  const navigate = useNavigate();
  const { user,logout } = UserState();

  const logoutFunction = () => {
    logout()
    navigate('/manage/login')
  }

    return (
        <>
            <div className="bg-[#FFFFFF] mt-5 pb-28 md:pb-10 px-3 space-y-2 ">
                {links.map((list, index) => (

                    <NavLink to={list.to}
                        key={index}
                        className={({ isActive }) => `${isActive || (list.to === 'dashboard' && window.location.pathname === `/${user.role}`) ? 'bg-[#4A3AFF] text-white font-semibold' : 'text-[#737791]'} text-nowrap flex flex-row place-items-center  gap-2 px-2 py-3  rounded-xl  text-base`}
                        onClick={() => {
                            if (window.innerWidth <= 999) toggleMenu();
                        }}
                    >
                        <div className={`flex justify-center transition-all duration-100 ease-out ${isExpanded ? 'px-2' : 'w-full'}`}>
                            <list.icon />
                        </div>
                        {isExpanded && <span className='text-base capitalize font-medium transition-all duration-100 ease-out'>{list.name}</span>}
                    </NavLink>
                ))}
                <NavLink
                    className='text-[#737791] text-nowrap flex flex-row place-items-center gap-2 px-2 py-3  rounded-xl  text-base'
                   onClick={logoutFunction}>
                    <div className={`flex justify-center transition-all duration-100 ease-out ${isExpanded ? 'px-2' : 'w-full'}`}>
                        <LogOut  />
                    </div>
                    {isExpanded && <span className='text-base capitalize font-medium transition-all duration-100 ease-out'>Logout</span>}
                </NavLink>
            </div>
        </>
    )
}

export default Sidebar
import { BellDot, ChevronUp, KeyRound, LogOut, Mail, Menu, Search, User } from 'lucide-react'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { UserState } from '../../../context/UserContext';
import { notify } from '../../../Utiles/Notification';
import axios from 'axios';
import Logo from '../../../Assets/Images/logo.png'

const Navbar = ({ toggleMenu }) => {
  const baseUrl = import.meta.env.VITE_APP_BASEURL;
  const { user, logout, isOpen, setIsOpen } = UserState();
  const [drop, setDrop] = useState(false);

  const dropdownRef = useRef(null);
  const [custData, setData] = useState()


  const getCustdata = useCallback(async () => {

    try {
      const { token, user_id } = user;
      const response = await axios.post(
        `${baseUrl}/user_data`,
        { user_id : user?.user_id || user?.user?.user_id},
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      if (response?.data?.status) {
        setData(response.data.user_data);
      }
    } catch (error) {
      console.error("Fetch Error: nav", error);
      notify("error", error.response?.data?.message || error.message);
    }
  }, [user]); 
  
  useEffect(() => {
    getCustdata();
  }, [getCustdata ]); // ✅ Correct usage of useEffect
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDrop(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  

  return (
    <>
      <div className="bg-[#F7F7F7] shadow-md sticky top-0 z-40 flex items-center justify-between px-4 gap-5 md:px-6 lg:px-16 h-[8vh]">
        <div className="flex place-items-center lg:gap-10 md:gap-5 gap-3">
          <button onClick={toggleMenu} className="block">
            <Menu />
          </button>
          <Link
            to='/'
            className="flex-shrink-0"
          >
            <img
              src={Logo}
              alt="logo"
              className="h-8 md:h-12 w-auto"
            />
          </Link>
        </div>

        <div className="hidden xl:flex gap-1 w-1/3 flex-col">
          <h1 className='text-2xl font-bold bg-gradient-to-r from-[#4880FF] to-[#7B68EE] capitalize bg-clip-text text-transparent'>
            Welcome, {custData?.full_name}
          </h1>
        </div>

        <div className="flex items-center xl:gap-20 gap-10">
          {user &&
            <div className="flex flex-row place-items-center gap-4 cursor-pointer group relative" onMouseEnter={() => setDrop(true)}>
             { custData?.user_image ?  <img src={custData?.user_image} alt="" className='h-12 w-12 rounded-full object-cover aspect-square ' /> : <h2 className='capitalize font-semibold  text-xl w-10 h-10 rounded-full border flex justify-center items-center'>{custData?.full_name?.[0]}</h2>}
              <div className="flex flex-col">
                <h1 className='text-black font-medium text-base'>{custData?.full_name}</h1>
                <span>{'Administrator'}</span>
              </div>
              <div className="group-hover:rotate-180 transition-all duration-300 ease-out">
                <ChevronUp />
              </div>
              <div ref={dropdownRef} onMouseLeave={() => { setTimeout(() => { setDrop(false); }, 1000); }} className={`absolute flex-col bg-white top-14 -left-12 w-fit text-nowrap rounded-lg overflow-hidden transition-all duration-300 ease-out shadow-lg ${drop ? 'flex' : 'hidden'}`}>
                <Link onClick={() => setDrop(false)} to='/superadmin/setting' className='hover:bg-gray-200 transition-all duration-300 ease-out px-3 py-2 text-base flex flex-row gap-4'><User />My Profile</Link>
                <Link className='hover:bg-gray-200 transition-all duration-300 ease-out px-3 py-2 text-base flex flex-row gap-4' onClick={logout}><LogOut />Logout</Link>
              </div>
            </div>
          }
        </div>
      </div>
    </>
  )
}

export default Navbar
import { BellDot, CalendarDays, CircleAlert, KeyRound, LogOut, Menu, RefreshCw, Search, Settings, UserCircle, UserRound, UserRoundCog } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { UserState } from '../../context/UserContext';
import { onMessage, getMessaging } from 'firebase/messaging';
import Logo from '../../Assets/Images/logo.png';

const Navbar = ({ toggle }) => {
    const { user, logout } = UserState();
    const [profiledropdown, setProfileDropdown] = useState(false);
    const [notification, setNotification] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        const messaging = getMessaging();

        const unsubscribe = onMessage(messaging, (payload) => {
            const newNotification = {
                id: Date.now(),
                title: payload.notification?.title || 'New Notification',
                body: payload.notification?.body || '',
                timestamp: new Date().toISOString(),
                read: false,
                icon: payload.notification?.icon || 'settings',
                color: payload.data?.color || 'hsla(216, 100%, 65%, 1)'
            };

            setNotifications(prev => [newNotification, ...prev]);
            setUnreadCount(prev => prev + 1);
        });

        return () => unsubscribe();
    }, []);

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
        setUnreadCount(0);
    };

    const getNotificationIcon = (iconName) => {
        switch (iconName) {
            case 'settings':
                return <Settings />;
            case 'calendar':
                return <CalendarDays />;
            case 'alert':
                return <CircleAlert />;
            default:
                return <Settings />;
        }
    };

    return (
        <>
            <div className='w-full flex flex-row sticky bg-[#EFEEFF] z-50 top-0 h-[10vh] place-items-center pr-2 md:pr-20'>
                <div className='w-20 flex justify-center items-center'>
                    <button className='xl:hidden block' onClick={toggle}>
                        <Menu />
                    </button>
                </div>
                <div className='transition-all duration-500 w-6/12 py-2 flex md:items-center items-start overflow-hidden'>
                    <Link
                        to={`/${user.role}` + '/dashboard'}
                        className="text-2xl font-bold text-gray-900 transition-colors hover:text-indigo-600"
                    >
                        <img
                            src={Logo}
                            alt="logo"
                            className="h-12 w-auto max-w-full"
                        />
                    </Link>
                </div>
                <div className='w-6/12 transition-all duration-500 md:px-5 px-0 flex flex-row justify-end place-items-center gap-4'>
                    <div className="bg-[#F9FAFB] rounded-full w-fit p-2 text-[#5D5FEF] flex flex-row place-items-center gap-1 ms-auto relative"
                        onMouseEnter={() => setNotification(true)}
                        onMouseLeave={() => setNotification(false)}>
                        <div className="text-xl relative">
                            <BellDot strokeWidth={1.75} />
                            {unreadCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                    {unreadCount}
                                </span>
                            )}
                        </div>
                        {notification && (
                            <div className="absolute top-8 -right-5 mt-2 w-80 bg-white rounded-xl shadow-lg z-20 border-2">
                                <div className="flex justify-between items-center border-b-[0.5px] px-4 py-3">
                                    <h1 className='text-[#404040] text-base'>Notifications</h1>
                                    {unreadCount > 0 && (
                                        <button
                                            onClick={markAllAsRead}
                                            className="text-sm text-blue-600 hover:text-blue-800"
                                        >
                                            Mark all as read
                                        </button>
                                    )}
                                </div>
                                <div className="max-h-[400px] overflow-y-auto">
                                    {notifications.length > 0 ? (
                                        notifications.map((notif) => (
                                            <div
                                                key={notif.id}
                                                className={`px-4 py-3 border-b hover:bg-gray-50 ${!notif.read ? 'bg-blue-50' : ''}`}
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div className="rounded-full p-2.5 text-white flex-shrink-0" style={{ backgroundColor: notif.color }}>
                                                        {getNotificationIcon(notif.icon)}
                                                    </div>
                                                    <div className="flex-1">
                                                        <h2 className="text-sm font-medium text-gray-900">{notif.title}</h2>
                                                        <p className="text-sm text-gray-600">{notif.body}</p>
                                                        <p className="text-xs text-gray-400 mt-1">
                                                            {new Date(notif.timestamp).toLocaleTimeString()}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="py-8 text-center text-gray-500">
                                            No notifications yet
                                        </div>
                                    )}
                                </div>
                                {notifications.length > 0 && (
                                    <Link
                                        to="#"
                                        className='block text-[#A8A8A8] text-center text-base py-4 border-t-[0.5px] hover:text-[#5D5FEF]'
                                    >
                                        See all notifications
                                    </Link>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="flex flex-row place-items-center gap-1 relative"
                        onMouseEnter={() => setProfileDropdown(true)}
                        onMouseLeave={() => setProfileDropdown(false)}
                    >
                        {user.customer.customer_profile_image ? (
                            <img
                                src={user.customer.customer_profile_image}
                                alt={user.customer.full_name}
                                className='md:w-12 w-10 md:h-12 h-10 rounded-full object-cover'
                            />
                        ) : (
                            <UserCircle className="md:w-12 w-10 md:h-12 h-10 text-indigo-600" />
                        )}
                        {profiledropdown && (
                            <div className="absolute top-8 md:-right-10 -right-0 mt-2 w-48 bg-white rounded-xl shadow-lg z-20 border-2">
                                <div className="py-2">
                                    <Link to={`/${user.role}/settings`} className='px-4 py-2 text-sm text-gray-700 text-nowrap hover:bg-gray-100 border-b w-full text-left flex flex-row place-items-center gap-4'>
                                        <div className="" style={{ color: 'hsla(216, 100%, 65%, 1)' }}>
                                            <UserRoundCog />
                                        </div>
                                        Manage Account
                                    </Link>
                                    <Link to={`/${user.role}/manage_lead`} className='px-4 py-2 text-sm text-gray-700 text-nowrap hover:bg-gray-100 w-full border-b text-left flex flex-row place-items-center gap-4'>
                                        <div className="" style={{ color: 'hsla(248, 100%, 78%, 1)' }}>
                                            <RefreshCw />
                                        </div>
                                        Activity Log
                                    </Link>
                                    <button onClick={logout} className='px-4 py-2 text-sm text-gray-700 text-nowrap hover:bg-gray-100 w-full text-left flex flex-row place-items-center gap-4'>
                                        <div className="" style={{ color: 'hsla(0, 100%, 78%, 1)' }}>
                                            <LogOut />
                                        </div>
                                        Logout
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Navbar;
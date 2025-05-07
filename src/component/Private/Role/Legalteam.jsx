import { ChartPie, FolderOpenDot } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import Navbar from '../Components/Navbar';
import Sidebar from '../Components/Sidebar';
import Template from '../Pages/Template';
import { Route, Routes } from 'react-router-dom';
import Addtemplate from '../Pages/Addtemplate';

const Legalteam = () => {

    const Links = [
        {
            to: 'dashboard',
            name: 'Dashboard',
            icon: ChartPie
        },
        {
            to: 'template',
            name: 'Template',
            icon: FolderOpenDot,
        },
    ];

    const [isExpanded, setIsExpanded] = useState(true);
    const toggleMenu = () => {
        setIsExpanded(!isExpanded);
    };

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 1024) {
                setIsExpanded(false);
            } else {
                setIsExpanded(true);
            }
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);



    return (
        <>
            <Navbar toggleMenu={toggleMenu} />
            <div className="flex h-[92vh] overflow-hidden">
                <div className={`text-black lg:block hidden flex-shrink-0 transition-all duration-300 ease-in-out h-full  ${isExpanded ? "w-1/6" : "w-20"} overflow-y-auto`}>
                    <Sidebar isExpanded={isExpanded} toggleMenu={toggleMenu} links={Links} />
                </div>
                {isExpanded && (
                    <>
                        <div
                            className={`fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden transition-all duration-300 ease-out ${isExpanded ? 'translate-x-0' : '-translate-x-5'}`}
                            onClick={toggleMenu}
                        ></div>
                        <div
                            className={` text-black bg-white lg:hidden block z-50 fixed flex-shrink-0 transition-all duration-300 ease-in-out h-full ${isExpanded ? "w-64" : "w-20"} overflow-y-auto`}
                        >
                            <Sidebar isExpanded={isExpanded} toggleMenu={toggleMenu} links={Links} />

                        </div>
                    </>
                )}
                <div className="flex-grow bg-gray-100 overflow-y-auto overflow-hidden">
                    <div className="md:p-6 p-3">
                        <Routes>
                            {/* <Route path='/' element={<Dashboard />} />
                            <Route path='/dashboard' element={<Dashboard />} /> */}
                            <Route path='/template' element={<Template />} />
                            <Route path='/template/add-template' element={<Addtemplate />} />
                        </Routes>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Legalteam
import  { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, ArrowRight } from 'lucide-react';
import Loader from '../../Utiles/Loader';
import Logo from '../../Assets/Images/logo.png'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, isLoading] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleClick = () => {
    navigate("/sign-up-as");
  };

  const handleWaitlistClick = () => {
    navigate("/waitlist");
  };

  const navLinks = [
    { label: 'Entrepreneurs', href: '/entrepreneur' },
    { label: 'Investors', href: '/investor' },
    { label: 'Agents', href: '/agent' },
    { label: 'Events', href: '/events' },
    {label: "Pricing", href: '/pricing'}
  ];

  return (
    <>
      {loading && <Loader />}
      <nav className="w-full top-0 z-50 sticky bg-white shadow-sm">
        <div className="container mx-auto flex items-center justify-between px-4 md:px-6 py-4">
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

          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="p-2 text-gray-800 hover:text-indigo-600 transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="relative group text-gray-700 font-medium hover:text-indigo-600 transition-colors"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}
            {/* <button
            onClick={handleClick}
            className="inline-flex items-center gap-2 bg-[#4A3AFF] text-white font-semibold px-6 py-2 rounded-full hover:bg-indigo-700 transition-all group whitespace-nowrap"
          >
            Sign Up
            <ArrowRight
              size={20}
              className="transition-transform group-hover:translate-x-1"
            />
          </button> */}
            <button
              onClick={handleWaitlistClick}
              className="inline-flex items-center gap-2 bg-[#4A3AFF] text-white font-semibold px-6 py-2 rounded-full hover:bg-indigo-700 transition-all group whitespace-nowrap"
            >
              Join Waitlist
              <ArrowRight
                size={20}
                className="transition-transform group-hover:translate-x-1"
              />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`fixed top-0 left-0 h-full w-full sm:w-3/4 bg-white shadow-2xl transform ${isOpen ? 'translate-x-0' : '-translate-x-full'
            } transition-transform duration-300 ease-in-out md:hidden z-50`}
        >
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <Link to='/' className="flex-shrink-0">
              <img
                src={Logo}
                alt="logo"
                className="h-8 w-auto"
              />
            </Link>
            <button
              onClick={toggleMenu}
              className="p-2 text-gray-800 hover:text-indigo-600 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <div className="flex flex-col p-6 space-y-6">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-lg font-medium text-gray-800 hover:text-indigo-600 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </a>
            ))}
            {/* <button
            onClick={handleClick}
            className="flex items-center justify-center gap-2 bg-[#4A3AFF] text-white font-semibold px-6 py-3 rounded-full hover:bg-indigo-700 transition-all group w-full"
          >
            Sign Up
            <ArrowRight
              size={20}
              className="transition-transform group-hover:translate-x-1"
            />
          </button> */}

            <button
              onClick={handleWaitlistClick}
              className="flex items-center justify-center gap-2 bg-[#4A3AFF] text-white font-semibold px-6 py-3 rounded-full hover:bg-indigo-700 transition-all group w-full"
            >
              Join Waitlist
              <ArrowRight
                size={20}
                className="transition-transform group-hover:translate-x-1"
              />
            </button>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
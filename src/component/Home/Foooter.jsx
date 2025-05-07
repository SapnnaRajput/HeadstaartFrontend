import React from "react";
import {
  UserRound,
  Mail,
  MoveRight,
  Phone,
  MapPin,
  Linkedin,
  Github,
  Instagram,
  Youtube,
  Facebook,
  X  
} from "lucide-react";
import Logo from '../../Assets/Images/logo.png'
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Footer = () => {
  const location = useLocation();
  const hideHelpDesk = ["/login", "/sign-up-as", "/login-as", "/sign-up","/terms-conditions" , "/privacy-policy"].includes(location.pathname);



  const XIcon = () => (
    <svg 
      viewBox="0 0 24 24" 
      width="16" 
      height="16" 
      fill="currentColor"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
  const socialLinks = [
    { name: "linkedin", icon: Linkedin, link: "https://www.linkedin.com/company/headstaart/" },
    { name: "instagram", icon: Instagram, link: "https://www.instagram.com/headstaart/" },
    { name: "x", icon: XIcon, link: "https://x.com/headstaart" },
  ];


  
  return (
    <div className="">
    <footer className="bg-gray-50">
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8 lg:gap-12">
          <div className="col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-1 flex flex-col items-center sm:items-start">
            <Link
              to='/'
              className="text-xl sm:text-2xl font-bold text-gray-900 transition-colors hover:text-indigo-600"
            >
              <img
                src={Logo}
                alt="logo"
                className="h-8 sm:h-10 md:h-12 w-auto max-w-full"
              />
            </Link>
            <p className="mt-3 sm:mt-4 text-gray-600 text-xs sm:text-sm text-center sm:text-left max-w-xs">
              Empowering businesses with innovative solutions and exceptional
              support.
            </p>
  
            <div className="flex gap-3 sm:gap-4 mt-4 sm:mt-6">
              {socialLinks.map(({ name, icon: Icon, link }) => (
                <a
                  key={name}
                  href={link}
                  className="text-gray-600 hover:text-indigo-600 transition-colors"
                  aria-label={name}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center rounded-full border-2 border-gray-300 hover:border-indigo-600">
                    <Icon className="w-3 h-3 sm:w-4 sm:h-4" />
                  </div>
                </a>
              ))}
            </div>
          </div>
  
          {[
            // {
            //   title: "Product",
            //   links: ["Features", "Reviews",],
            //   href:  ["/#features","/#testimonials"],
            // },
            {
              title: "Product",
              links: ["Features", "Reviews"],
              href: ["/", "/"],
              scrollTo: ["features", "testimonials"]
            },
            {
              title: "Company",
              links: ["About", "Contact Us", ],
              href:  ["/about-us","/contact-us"],
              scrollTo: null
            },
            {
              title: "Support",
              links: ["Getting started", "Guide E-Books" ],
              href:['/getting-started',"#","/guide-e-books"],
              scrollTo: null
            }
            ,
          ].map((section) => (
            <div key={section.title} className="mt-6 sm:mt-0 flex flex-col items-center sm:items-start">
              <h3 className="font-bold text-gray-900 text-sm sm:text-base">{section.title}</h3>
              <ul className="mt-2 sm:mt-4 space-y-2 sm:space-y-3 text-center sm:text-left">
                {section.links.map((link, index) => (
                  <li key={link}>
                    <a
                      href={section.href ? section.href[index] : "#"}
                      className="text-gray-600 hover:text-indigo-600 transition-colors text-xs sm:text-sm"
                      onClick={(e) => {
                        e.preventDefault();
                        if (section.scrollTo?.[index]) {
                          // Handle scroll behavior for Product section
                          if (location.pathname !== '/') {
                            const targetId = section.scrollTo[index];
                            window.location.href = `/#${targetId}`;
                            // Add event listener to scroll after page load
                            window.addEventListener('load', () => {
                              const targetElement = document.getElementById(targetId);
                              if (targetElement) {
                                const headerOffset = 100;
                                const elementPosition = targetElement.getBoundingClientRect().top;
                                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                                
                                window.scrollTo({
                                  top: offsetPosition,
                                  behavior: 'smooth'
                                });
                              }
                            });
                          } else {
                            const targetElement = document.getElementById(section.scrollTo[index]);
                            if (targetElement) {
                              const headerOffset = 100;
                              const elementPosition = targetElement.getBoundingClientRect().top;
                              const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                              
                              window.scrollTo({
                                top: offsetPosition,
                                behavior: 'smooth'
                              });
                            }
                          }
                        }
                        else {
                          // Handle regular navigation for Company and Support sections
                          const href = section.href[index];
                          if (href && href !== '#') {
                            window.location.href = href;
                          }
                        }
                      }}
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
  
          <div className="mt-6 sm:mt-0 flex flex-col items-center sm:items-start">
            <h3 className="font-bold text-gray-900 text-sm sm:text-base">Contact Us</h3>
            <ul className="mt-2 sm:mt-4 space-y-2 sm:space-y-3">
              <li className="flex items-center gap-1 sm:gap-2 text-gray-600 text-xs sm:text-sm">
                <Mail className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>start@headstaart.com</span>
              </li>
              {/* <li className="flex items-center gap-1 sm:gap-2 text-gray-600 text-xs sm:text-sm">
                <Phone className="w-3 h-3 sm:w-4 sm:h-4" />
                 <span>(414) 687 - 5892</span> 
              </li> */}
              <li className="flex items-start gap-1 sm:gap-2 text-gray-600 text-xs sm:text-sm">
                <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mt-0.5" />
                <div className="flex flex-col">
                  <span>New Jersey, USA 07203</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
  
        <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-center md:justify-between items-center gap-3 sm:gap-4">
            <p className="text-gray-600 text-xs sm:text-sm text-center md:text-left">
              © {new Date().getFullYear()} HeadStaart. All rights reserved.
            </p>
            <div className="flex gap-4 sm:gap-6 mt-2 md:mt-0">
              <a
                href="/terms-conditions"
                className="text-gray-600 hover:text-indigo-600 transition-colors text-xs sm:text-sm"
              >
                Terms & Conditions
              </a>
              <a
                href="/privacy-policy"
                className="text-gray-600 hover:text-indigo-600 transition-colors text-xs sm:text-sm"
              >
                Privacy Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  </div>
  );
};

export default Footer;

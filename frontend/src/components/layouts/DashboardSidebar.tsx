'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Icon } from '@iconify/react';

export interface SidebarLink {
  name: string;
  url: string;
  icon: string;
  onClick?: () => void;
}

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
  sidebarLinks: SidebarLink[];
}

const DashboardSidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  sidebarLinks = [],
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const [expanded, setExpanded] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const handleLogout = () => {
     
    if (onClose) {
      onClose();
    }
    router.push("/");
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLinkClick = () => {
    if (isMobile && onClose) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black opacity-50 z-40"
        />
      )}

      <div
        className={`fixed sm:relative sm:h-screen top-0 left-0 h-full bg-white shadow-lg z-50 border-r border-gray-200 transition-all duration-300 ease-in-out ${
          expanded ? 'lg:w-64 sm:w-[22vw]' : 'w-20'
        } ${isOpen || !isMobile ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className={`flex items-center space-x-2 ${expanded ? 'block' : 'hidden'}`}>
            <span className="text-lg font-semibold text-gray-900">
              Project Tracker
            </span>
          </div>

          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <Icon
              icon={expanded ? 'mdi:chevron-left' : 'mdi:chevron-right'}
              className="text-xl"
            />
          </button>
        </div>

        {/* Sidebar body */}
        <div className="flex flex-col h-[calc(100%-64px)]">
          {/* Scrollable nav section */}
          <div className={`flex-1 overflow-y-auto ${expanded ? 'px-4' : 'px-2'}`}>
            <div className="py-4">
              <ul className="space-y-2">
                {sidebarLinks?.map((item) => {
                  const isActive = pathname === item.url;

                  return (
                    <li key={item.name}>
                      {item.onClick ? (
                        <button
                          onClick={() => {
                            handleLinkClick();
                            item.onClick?.();
                          }}
                          className={`w-full flex items-center p-3 font-medium gap-x-3 hover:bg-gray-50 rounded-lg transition-all duration-200 text-gray-600 hover:text-gray-900`}
                        >
                          <Icon
                            icon={item.icon}
                            className={`flex-shrink-0 text-xl text-gray-400`}
                          />
                          {expanded && (
                            <span className="duration-300 origin-left text-sm">
                              {item.name}
                            </span>
                          )}
                        </button>
                      ) : (
                        <Link
                          href={item.url}
                          onClick={handleLinkClick}
                          className={`flex items-center p-3 font-medium gap-x-3 hover:bg-gray-50 rounded-lg transition-all duration-200 ${
                            isActive
                              ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                              : 'text-gray-600 hover:text-gray-900'
                          }`}
                        >
                          <Icon
                            icon={item.icon}
                            className={`flex-shrink-0 text-xl ${isActive ? 'text-blue-700' : 'text-gray-400'}`}
                          />
                          {expanded && (
                            <span className="duration-300 origin-left text-sm">
                              {item.name}
                            </span>
                          )}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          {/* Logout section at bottom */}
          <div className="pb-4 border-t border-gray-200 pt-4 px-2">
            <button
              onClick={handleLogout}
              className={`w-full flex items-center gap-3 p-3 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all duration-200 ${
                expanded ? '' : 'justify-center'
              }`}
            >
              <Icon
                icon="mdi:logout"
                className="flex-shrink-0 text-xl"
              />
              {expanded && <span className="text-sm font-medium">Logout</span>}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardSidebar;

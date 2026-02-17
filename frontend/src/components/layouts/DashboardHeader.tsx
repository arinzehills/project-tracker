"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";

interface DashboardHeaderProps {
  onMenuClick: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ onMenuClick }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    router.push("/");
  };

  return (
    <header className="bg-white border-b border-gray-50 px-4 lg:px-6 xl:px-8 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
          >
            <Icon icon="ph:list" className="h-6 w-6" />
          </button>
        </div>

        <div className="flex items-center space-x-4">
          {/* User Profile Button */}
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                U
              </div>
              <span className="text-sm text-gray-700 font-medium hidden sm:inline">
                Profile
              </span>
              <Icon
                icon={isProfileOpen ? "ph:caret-up" : "ph:caret-down"}
                className="h-4 w-4 text-gray-400"
              />
            </button>

            {/* Profile Dropdown */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border border-gray-200 overflow-hidden">
                <div className="border-t border-gray-200"></div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 hover:bg-gray-100 text-red-600 text-sm transition-colors flex items-center space-x-2"
                >
                  <Icon icon="ph:sign-out" className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;

import React from "react";
import { BiHome, BiSolidUserDetail,BiSolidInbox,BiCog  } from 'react-icons/bi';
import { FcWorkflow } from "react-icons/fc";
import SidebarProjectsDropdown from "./SidebarDropdown";

const Sidebar = () => {
  return (
    <aside className="h-screen flex flex-col py-2 px-2 bg-gray-100 w-[240px] text-sm font-medium text-gray-700">
      
      {/* Top Section */}
      <div className="flex flex-col gap-2">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-10">
          <FcWorkflow className="h-7 w-7"/>
          <h1 className="text-2xl font-semibold text-gray-800">WorkWire</h1>
        </div>

        {/* Navigation */}
        <nav>
          <ul className="space-y-1 max-w-full">
            <li className="w-full">
              <a
                href="#"
                className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-200 transition-colors w-full"
              >
                <BiHome className="h-5 w-5" />
                <div className="truncate">Home</div>
              </a>
            </li>
            <li className="w-full">
              <a
                href="#"
                className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-200 transition-colors w-full"
              >
                <BiSolidUserDetail className="h-5 w-5"/>
                <div className="truncate">Profile</div>
              </a>
            </li>
            <li className="w-full">
              <a
                href="#"
                className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-200 transition-colors w-full"
              >
                <BiSolidInbox className="h-5 w-5"/>
                <div className="flex-1 truncate">Inbox</div>
                <div className="ml-auto bg-blue-600 text-white px-2 py-0.5 text-xs rounded-full">
                  14
                </div>
              </a>
            </li>
            <li className="w-full">
              <a
                href="#"
                className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-200 transition-colors w-full"
              >
                <BiCog className="h-5 w-5"/>
                <div className="truncate">Settings</div>
              </a>
            </li>
          </ul>
        </nav>
      </div>

      <div className="py-4 border-b-1"></div>

      {/* Dropdowns - projects */}

      <div className="">
        <SidebarProjectsDropdown/>
      </div>

      {/* Footer */}
      <footer className="mt-auto pt-6 border-t border-gray-300">
        <a className="block text-gray-600 hover:text-gray-800 mb-2" href="#">Settings</a>
        <a className="block text-gray-600 hover:text-gray-800 mb-2" href="#">Help Center</a>
        <div className="mt-2">
          <p className="font-semibold text-gray-800 truncate">Darlene Robertson</p>
          <p className="text-xs text-gray-500 truncate">darlene@gmail.com</p>
        </div>
      </footer>
    </aside>
  );
};

export default Sidebar;

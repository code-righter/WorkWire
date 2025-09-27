import React, { useState } from "react";
import { HiChevronDown, HiDotsHorizontal, HiPlus, HiMenuAlt2 } from "react-icons/hi";

const projects = [
  "Adrian Bert - CRM Dashboard",
  "Trust - SaaS Dashboard",
  "Pertamina Project",
  "Garuda Project"
];

const SidebarProjectsDropdown = () => {
  const [open, setOpen] = useState(true);
  const [selected, setSelected] = useState(0);

  return (
    <div className="text-sm font-medium text-gray-700 py-2">

      {/* Dropdown Header */}
      <div
        className="flex items-center px-2 py-2 cursor-pointer hover:bg-gray-200 rounded-md transition-colors"
        onClick={() => setOpen((v) => !v)}
      >
        <HiChevronDown
          className={`mr-2 w-4 h-4 text-gray-500 transition-transform ${
            open ? "rotate-0" : "-rotate-90"
          }`}
        />
        <p className="flex-1 text-gray-800 font-semibold text-[15px] truncate">
          Projects
        </p>

        {/* <div className="flex items-center gap-2">
          <HiDotsHorizontal className="w-4 h-4 text-gray-400 hover:text-gray-600" />
          <HiPlus className="w-4 h-4 text-gray-400 hover:text-gray-600" />
        </div> */}
      </div>

      {/* Project List */}
      {open && (
        <div className="mt-2">
          {projects.map((proj, i) => (
            <div
              key={proj}
              onClick={() => setSelected(i)}
              className={`
                flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer transition-colors
                ${selected === i
                  ? "bg-blue-100 text-blue-800 font-semibold"
                  : "hover:bg-gray-100 text-gray-700"
                }
              `}
            >
              <HiMenuAlt2 className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <p className="truncate text-[13px]">{proj}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SidebarProjectsDropdown;

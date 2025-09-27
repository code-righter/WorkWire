import React, { useState } from "react";
import GanttChart from "./GanttChart";
import Overview from "./TestGantt";
import TestGantt from "./TestGantt";

const Project = () => {
  const [activeTab, setActiveTab] = useState("Timeline");
  const tabs = ["Timeline", "Kanban", "List", "Board"];

  return (
    <div className="bg-white rounded-lg shadow p-4 min-h-[80vh] flex flex-col gap-4">
      {/* Title */}
      <div className="text-gray-800 py-4 px-2 text-2xl font-semibold">
        <h1>Project</h1>
      </div>

      <hr className="border-gray-200" />

      {/* Breadcrumb */}
      <div className="p-3 text-gray-600 text-sm">
        Projects &gt;{" "}
        <span className="font-medium">Adrian Bert - CRM Dashboard</span>
      </div>

      {/* Tabs + Actions */}
      <div className="flex items-center justify-between px-2">
        {/* Tabs */}
        <nav className="flex space-x-4 border-b border-gray-300">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`py-2 px-4 text-sm font-medium ${
                activeTab === tab
                  ? "border-b-4 border-blue-600 text-blue-600"
                  : "text-gray-600 hover:text-blue-600"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </nav>

        {/* Right controls */}
        <div className="flex items-center space-x-3">
          <input
            type="text"
            placeholder="Search task..."
            className="px-3 py-1 rounded-md border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="bg-blue-600 px-3 py-1 rounded-md text-white text-sm hover:bg-blue-700">
            + Add
          </button>
          <button className="px-3 py-1 rounded-md border border-gray-300 text-sm hover:bg-gray-100">
            Filter
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-2">
        {/* ⚠️ No overflow-auto wrapper — let Syncfusion manage scroll */}
        <div className="h-[500px] rounded-lg border border-gray-200 bg-white">
          <TestGantt />
        </div>
      </div>
    </div>
  );
};

export default Project;
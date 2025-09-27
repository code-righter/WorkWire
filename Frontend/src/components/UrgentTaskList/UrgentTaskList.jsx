import React from "react";

const urgentTasks = [
  { label: "Finish monthly reporting", due: "Today" },
  { label: "Report signing", due: "Today" },
  { label: "Market overview keynote", due: "Today" },
  { label: "Submission", due: "Today" },
  // Add more tasks as needed
];

const UrgentTasks = () => (
  <div className="bg-blue-50 rounded-3xl shadow px-5 py-4 w-90 h-63 flex flex-col">
    <h3 className="font-bold text-base text-gray-800 mb-2">Urgent tasks</h3>
    <div className="overflow-y-auto flex-1 ">
      {urgentTasks.map((task, idx) => (
        <div
          key={idx}
          className="flex items-center justify-between border-b last:border-b-0 py-3 px-2"
        >
          <div className="flex items-center gap-3">
            {/* Custom styled circle for checkbox (not functional) */}
            <span className="h-5 w-5 flex items-center justify-center border-2 border-gray-300 rounded-full bg-white"></span>
            <span className="text-sm text-gray-700">{task.label}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="h-2 w-2 bg-pink-500 rounded-full mr-1" />
            <span className="text-pink-600 text-sm font-semibold">{task.due}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default UrgentTasks;

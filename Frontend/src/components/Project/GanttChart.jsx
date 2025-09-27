import React from "react";
import {
  GanttComponent,
  ColumnsDirective,
  ColumnDirective,
  Inject,
  Edit,
  Selection,
} from "@syncfusion/ej2-react-gantt";

// Dummy task data
const tasks = [
  {
    TaskID: 1,
    TaskName: "Main Page Development",
    StartDate: new Date("2025-09-22"),
    Duration: 5,
    Progress: 60,
    Assignee: "Kevin",
    Status: "Done",
    Priority: "High",
  },
  {
    TaskID: 2,
    TaskName: "Prototyping",
    StartDate: new Date("2025-09-28"),
    Duration: 7,
    Progress: 40,
    Assignee: "Pam",
    Status: "In Progress",
    Priority: "Low",
  },
  {
    TaskID: 3,
    TaskName: "Design",
    StartDate: new Date("2025-10-05"),
    Duration: 10,
    Progress: 20,
    Assignee: "Eleanor",
    Status: "Pending",
    Priority: "Medium",
  },
];

// Map status to colors for taskbars
function handleTaskbarColors(args) {
  if (args.data.Status === "Done") {
    args.taskbarBgColor = "#16a34a"; // green
  } else if (args.data.Status === "In Progress") {
    args.taskbarBgColor = "#3b82f6"; // blue
  } else if (args.data.Status === "Pending") {
    args.taskbarBgColor = "#f97316"; // orange
  }
}

export default function GanttChart() {
  return (
    <div className="p-4">
      <GanttComponent
        id="Gantt"
        dataSource={tasks}
        height="500px"
        rowHeight={45}
        taskbarHeight={30}
        allowSelection={true}
        timelineSettings={{
          topTier: { unit: "Month", format: "MMM yyyy" },
          bottomTier: { unit: "Day", format: "dd" },
        }}
        taskFields={{
          id: "TaskID",
          name: "TaskName",
          startDate: "StartDate",
          duration: "Duration",
          progress: "Progress",
        }}
        queryTaskbarInfo={handleTaskbarColors}
      >
        {/* Left side columns */}
        <ColumnsDirective>
          <ColumnDirective field="TaskName" headerText="Task" width="180" />
          <ColumnDirective field="Assignee" headerText="Assignee" width="120" />
          <ColumnDirective field="Status" headerText="Status" width="100" />
          <ColumnDirective field="Priority" headerText="Priority" width="100" />
        </ColumnsDirective>

        <Inject services={[Edit, Selection]} />
      </GanttComponent>
    </div>
  );
}
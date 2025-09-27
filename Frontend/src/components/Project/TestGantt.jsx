import React from "react";
import { Gantt } from "gantt-task-react";
import "gantt-task-react/dist/index.css";

const tasks = [
  {
    id: "1",
    name: "Project Initiation",
    start: new Date(2025, 8, 1),
    end: new Date(2025, 8, 5),
    type: "task",
    progress: 40,
    isDisabled: false,
    styles: { progressColor: "#4caf50", progressSelectedColor: "#087f23" }
  },
  {
    id: "2",
    name: "Requirement Gathering",
    start: new Date(2025, 8, 6),
    end: new Date(2025, 8, 12),
    type: "task",
    progress: 60,
    isDisabled: false,
    styles: { progressColor: "#2196f3", progressSelectedColor: "#0b62c4" }
  }
];

const TestGantt = () => {
  return React.createElement("div", null,
    React.createElement(Gantt, { tasks: tasks })
  );
};

export default TestGantt;

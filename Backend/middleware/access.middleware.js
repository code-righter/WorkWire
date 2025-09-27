import Project from "../models/project.model.js";
import User from "../models/user.model.js";

const CONTRIBUTOR_ROLES = ["manager"];

const ROLE_PERMISSIONS = {
  superadmin: { routes: ["*"], fields: { task: ["*"] } },
  manager: {
    routes: [
      "updateProject",
      "deleteProject",
      "createTask",
      "updateTask",
      "deleteTask",
      "listProjects",
      "getProject",
      "getTasks",
    ],
    fields: { task: ["status", "priority", "resolved"] },
  },
};

const ROUTE_ACTION_MAP = {
  listProjects: "listProjects",
  getProject: "getProject",
  updateProject: "updateProject",
  deleteProject: "deleteProject",
  createTask: "createTask",
  getTasks: "getTasks",
  updateTask: "updateTask",
  deleteTask: "deleteTask",
};

export const access = async (req, res, next) => {
  try {
    console.log("checking the access in access")
    const { userId } = req.user;
    const { projectId, taskId } = req.params;

    let projectToCheck = projectId;

    // If taskId is passed, find project containing that task
    if (!projectId && taskId) {
      const project = await Project.findOne({ "tasks._id": taskId });
      if (!project) {
        const error = new Error("Task not found");
        error.statusCode = 404;
        throw error;
      }
      projectToCheck = project._id;
    }

    if (!projectToCheck) {
      const error = new Error("Project ID is required for access check");
      error.statusCode = 400;
      throw error;
    }

    // Fetch project
    const project = await Project.findById(projectToCheck);
    if (!project) {
      const error = new Error("Project not found");
      error.statusCode = 404;
      throw error;
    }

    // Check membership
    const isMember =
      project.members.some((m) => m.toString() === userId) ||
      project.manager.toString() === userId;

    if (!isMember) {
      const error = new Error(
        "Access denied: You cannot modify the data."
      );
      error.statusCode = 403;
      throw error;
    }

    // Get user role
    const user = await User.findById(userId).select("role");
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }
    const role = user.role;

    // Map route
    const handlerName = req.route.stack[req.route.stack.length - 1].name;
    const action = ROUTE_ACTION_MAP[handlerName];

    let roleConfig;
    if (CONTRIBUTOR_ROLES.includes(role)) {
      roleConfig = {
        routes: ["listProjects", "getProject", "getTasks", "updateTask"],
        fields: { task: ["status"] }, // contributors can ONLY update status
      };
    } else {
      roleConfig = ROLE_PERMISSIONS[role] || { routes: [], fields: {} };
    }

    // Route-level check
    if (!roleConfig.routes.includes("*") && !roleConfig.routes.includes(action)) {
      const error = new Error(`Access denied: ${role} cannot perform ${action}`);
      error.statusCode = 403;
      throw error;
    }

    // Field-level check (only for updateTask)
    if (action === "updateTask") {
      const allowedFields = roleConfig.fields.task || [];
      if (!allowedFields.includes("*")) {
        Object.keys(req.body).forEach((field) => {
          if (!allowedFields.includes(field)) {
            delete req.body[field]; // strip forbidden fields
          }
        });
      }
    }

    next();
  } catch (error) {
    next(error);
  }
};

export const accessCreateProject = async (req, res, next) => {
  try {
    const { userId } = req.user;

    // Fetch user role
    const user = await User.findById(userId).select("role");
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    if (user.role !== "superadmin" && user.role !== "manager") {
      const error = new Error("Only superadmin or manager can create a project");
      error.statusCode = 403;
      throw error;
    }

    next();
  } catch (error) {
    next(error);
  }
};

export const listProjectsAccess = async (req, res, next) => {
  const CONTRIBUTOR_ROLES = ["manager", "designer", "developer", "tester"];

  const ROLE_PERMISSIONS = {
  superadmin: { routes: ["*"] },
  manager: { routes: ["listProjects"] },
};
  try {
    const { userId } = req.user;

    // Fetch user role
    const user = await User.findById(userId).select("role");
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    const role = user.role;

    let roleConfig;
    if (CONTRIBUTOR_ROLES.includes(role)) {
      roleConfig = { routes: ["listProjects"] }; // contributors can list their own projects
    } else {
      roleConfig = ROLE_PERMISSIONS[role] || { routes: [] };
    }

    // Route-level check
    if (!roleConfig.routes.includes("*") && !roleConfig.routes.includes("listProjects")) {
      const error = new Error(`Access denied: ${role} cannot list projects`);
      error.statusCode = 403;
      throw error;
    }

    next();
  } catch (error) {
    next(error);
  }
};


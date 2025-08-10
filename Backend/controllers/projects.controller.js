import mongoose from 'mongoose'
import User from '../models/user.model.js'
import Project from '../models/project.model.js'

// Utility to resolve email(s) to ObjectId(s)
const resolveUserIds = async (emails) => {
    const users = await User.find({ email: { $in: emails } });
    return users.map((user) => user._id);
};

export const createProject = async (req, res, next) => {
    try {
        console.log("\nCREATING NEW PROJECT\n");
        const { name, description, component ,members = [], timeline, tasks = [] } = req.body;
        const managerId = req.user.userId;

        // Convert member emails to ObjectIds
        const memberIds = await resolveUserIds(members);

        // Convert task assignees (emails) to ObjectIds
        const resolvedTasks = await Promise.all(
        tasks.map(async (task) => {
            const assigneeId = task.assignee
            ? (await resolveUserIds([task.assignee]))[0]
            : null;

            const validDependencies = Array.isArray(task.dependencies)
            ? task.dependencies.filter(dep => mongoose.Types.ObjectId.isValid(dep))
            : [];

            return {
            ...task,
            component: task.component || component, // ✅ default to project component
            assignee: assigneeId,
            dependencies: validDependencies,
            comments: []
            };
        })
        );

        const project = await Project.create({
            name,
            description,
            component,
            members: memberIds,
            timeline,
            manager: managerId,
            tasks: resolvedTasks
        });

        res.status(201).json({
            success: true,
            message: 'Project created successfully',
            data: project
        });
        console.log(`${name} project has been created`)

    } catch (error) {
        next(error); // Forward to your global error handler
    }
};

export const listProjects = async (req, res, next)=>{
    try{
        console.log("\nLISTING PROJECTS\n")
        const userId = req.user.userId;
        
        const projects = await Project.find({
            $or: [
                { manager: userId },
                { collaborators: userId } 
            ]
        }).populate('manager', 'name email') 
          .populate('members', 'name email'); 
        // 3. Return the entire array of found projects
        console.log("Project Controller : ", projects)
        res.status(200).json({
            success: true,
            message: "User's projects retrieved successfully",
            count: projects.length, // It's good practice to include the count
            data: projects // Send the whole array
        });


    }catch(error){
        next(error)
    }
}

export const getProject = async (req, res, next) => {
    try {
        console.log("ROUTE REACHED SINGLE PROJECT");

        const { projectId } = req.params;
        const userId = req.user.userId; // assuming you want to check access

        // Find project by ID and make sure the user is either manager or collaborator
        const project = await Project.findOne({
            _id: projectId,
            $or: [
                { manager: userId },
                { collaborators: userId }
            ]
        })
        .populate('manager', 'name email')
        .populate('members', 'name email')
        .populate('tasks.assignee', 'name email')

        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found or access denied'
            });
        }

        res.status(200).json({
            success: true,
            message: "Project retrieved successfully",
            data: project
        });

    } catch (error) {
        next(error);
    }
};


export const updateProject = async(req, res, next)=>{
    try {
        console.log("\nUPDATING PROJECTS\n");
        const { projectId } = req.params;
        const { name, description, timeline, members } = req.body;

        const updateData = {};

        // Update only if fields are present
        if (name) updateData.name = name;
        if (description) updateData.description = description;
        if (timeline) {
            console.log("trying to update the timeline")
            updateData.timeline = timeline;
            // const updatedTask = 
        }

        // If members are provided as emails, resolve to ObjectIds
        if (members && members.length > 0) {
            const memberIds = await resolveUserIds(members);
            updateData.members = memberIds;
        }

        const updatedProject = await Project.findByIdAndUpdate(
            projectId,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!updatedProject) {
            return res.status(404).json({
                success: false,
                message: 'Project not found',
            });
        }


        res.status(200).json({
            success: true,
            message: 'Project updated successfully',
            data: updatedProject,
        });
    } catch (error) {
        next(error);
    }
};

export const deleteProject = async()=>{
    try{
        console.log("\nDELETING PROJECT\n");
        
        const projectId = req.params;
        const deletedProject = Project.findOneAndDelete({projectId})

        if (!deletedProject) {
            return res.status(404).json({
                success: false,
                message: 'Project not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Project deleted successfully',
            data: deletedProject,
        });
    }
    catch(error){
        next(error)
    }
}

export const createTask = async (req, res, next)=>{
    try{
        const {projectId} = req.params
        const {
            title,
            description,
            component,
            assignee,
            status,
            startDate,
            endDate,
            deadline
        } = req.body;
    
        const project = await Project.findById(projectId);

        if (!project) {
        return res.status(404).json({
            success: false,
            message: 'Project not found',
        });
        }

        let assigneeId = null;
        if (assignee) {
            const [resolvedId] = await resolveUserIds([assignee]);
            assigneeId = resolvedId;
        }

        const newTask = {
            title,
            description,
            component,
            assignee: assigneeId,
            status,
            startDate,
            endDate,
            deadline,
        };

        project.tasks.push(newTask); // Add the task to the tasks array
        await project.save();

        res.status(201).json({
            success: true,
            message: 'Task added successfully',
            data: newTask,
        });

    } catch (error) {
        next(error);
    }
};
        
export const getTasks = async (req, res, next) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findById(projectId).populate('tasks.assignee', 'name email'); // optional: populate assignees

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Tasks fetched successfully',
      data: project.tasks,
    });

  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req, res, next) => {
    try {
        const { projectId, taskId } = req.params;
        const {
            title,
            description,
            component,
            assignee,
            status,
            startDate,
            endDate,
            deadline
        } = req.body;

        const project = await Project.findById(projectId);

        if (!project) {
        return res.status(404).json({
            success: false,
            message: 'Project not found',
        });
    }

    const task = project.tasks.id(taskId); // Find task by _id in tasks array
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    // Update only if fields are present
    if (title) task.title = title;
    if (description) task.description = description;
    if (component) task.component = component;
    if (assignee) {
      const [assignId] = await resolveUserIds([assignee]);
      task.assignee = assignId;
    }
    if (status) task.status = status;
    if (startDate) task.startDate = startDate;
    if (endDate) task.endDate = endDate;
    if (deadline) task.deadline = deadline;

    await project.save(); // Save the whole project with updated task

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: task,
    });

  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const { projectId, taskId } = req.params;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    // Check if task exists
    const task = project.tasks.find((t) => t._id.toString() === taskId);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    // Remove the task using pull
    project.tasks.pull({ _id: taskId });
    await project.save();

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
      data: task, // Optional
    });
  } catch (error) {
    next(error);
  }
};

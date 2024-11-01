import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { v4 as uuidv4 } from "uuid";
import { useUser } from "../context/UserContext";
import axios from "axios";
import { mainUrl } from "../api";

// Task component to display individual tasks
const Task = ({ task, onDelete, onEdit, onView }) => {
  return (
    <Draggable draggableId={task.id} index={task.index}>
      {(provided) => (
        <Paper
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{
            ...provided.draggableProps.style,
            padding: 16,
            marginBottom: 8,
          }}
        >
          <Typography variant="body1">{task.title}</Typography>
          <Typography variant="body2" style={{ overflow: "hidden" }}>
            {task.description}
          </Typography>
          <Typography variant="caption">{`Created: ${new Date(
            task.datetime
          ).toLocaleString()}`}</Typography>
          {/* <Typography
            variant="caption"
            color={task.status === "done" ? "green" : "orange"}
          >
            {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
          </Typography> */}
          <div>
            <Button
              variant="contained"
              color="primary"
              onClick={onView}
              sx={{ marginRight: 5 }}
            >
              View
            </Button>
            <Button
              variant="contained"
              color="warning"
              onClick={onEdit}
              sx={{ marginRight: 5 }}
            >
              Edit
            </Button>
            <Button variant="contained" color="error" onClick={onDelete}>
              Delete
            </Button>
          </div>
        </Paper>
      )}
    </Draggable>
  );
};

// Main TaskManager component
export const TaskManager = () => {
  const { userId } = useUser();
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskStatus, setTaskStatus] = useState("todo");
  const [tasks, setTasks] = useState({
    todo: [],
    pending: [],
    done: [],
  });
  const [editingTask, setEditingTask] = useState(null);
  const [viewingTask, setViewingTask] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [openView, setOpenView] = useState(false);

  // Fetch tasks when the component mounts
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(
          //   `http://localhost:5000/task/gettasks/${userId}`
          `${mainUrl}task/gettasks/${userId}`
        );
        const tasksData = response.data; // Assuming your API returns tasks in this format
        setTasks({
          todo: tasksData.filter((task) => task.status === "todo"),
          pending: tasksData.filter((task) => task.status === "pending"),
          done: tasksData.filter((task) => task.status === "done"),
        });
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, [userId]); // Re-fetch tasks if userId changes

  const handleAddTask = () => {
    if (taskTitle.trim() === "") return alert("Title required"); // Prevent adding empty tasks
    const newTask = {
      id: uuidv4(),
      title: taskTitle,
      description: taskDescription,
      datetime: new Date().toISOString(), // Save current datetime when creating a task
      status: taskStatus,
      userid: userId,
    };
    axios
      //   .post("http://localhost:5000/task/createtask", newTask)
      .post(`${mainUrl}task/createtask`, newTask)
      .then((response) => {
        setTasks((prevTasks) => ({
          ...prevTasks,
          todo: [...prevTasks.todo, response.data],
        }));
        resetForm();
      })
      .catch((error) => console.error("Error adding task:", error));
  };

  const resetForm = () => {
    setTaskTitle("");
    setTaskDescription("");
    setTaskStatus("todo");
  };

  const handleDeleteTask = async (column, taskId) => {
    try {
      //   await axios.delete(`http://localhost:5000/task/delete/${taskId}`); // Call your backend API to delete the task
      await axios.delete(`${mainUrl}task/delete/${taskId}`);
      setTasks((prevTasks) => ({
        ...prevTasks,
        [column]: prevTasks[column].filter((task) => task.id !== taskId),
      }));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setTaskTitle(task.title);
    setTaskDescription(task.description);
    setTaskStatus(task.status);
    setOpenEdit(true);
  };

  const handleViewTask = (task) => {
    setViewingTask(task);
    setOpenView(true);
  };

  const handleSaveTask = async () => {
    try {
      const updatedTask = {
        ...editingTask,
        title: taskTitle,
        description: taskDescription,
        status: taskStatus,
      };
      await axios.put(
        // `http://localhost:5000/task/update/${editingTask.id}`,
        `${mainUrl}task/update/${editingTask.id}`,
        updatedTask
      ); // Call your backend API to update the task

      setTasks((prevTasks) => {
        const updatedTasks = { ...prevTasks };
        const column = editingTask.status;
        updatedTasks[column] = updatedTasks[column].map((task) =>
          task.id === editingTask.id ? updatedTask : task
        );
        return updatedTasks;
      });
    } catch (error) {
      console.error("Error saving task:", error);
    }

    resetForm();
    setOpenEdit(false);
    setEditingTask(null);
  };

  // Function to handle the drag and drop event
  const handleDragEnd = async (result) => {
    const { source, destination } = result;

    // If no destination, return
    if (!destination) return;

    const sourceColumn = source.droppableId;
    const destinationColumn = destination.droppableId;

    const sourceTasks = Array.from(tasks[sourceColumn]);
    const destinationTasks = Array.from(tasks[destinationColumn]);

    const [movedTask] = sourceTasks.splice(source.index, 1); // Remove task from the source column

    // Update the status of the moved task based on the destination column
    movedTask.status = destinationColumn;

    // If moving within the same column
    if (sourceColumn === destinationColumn) {
      sourceTasks.splice(destination.index, 0, movedTask); // Insert task back into the same column
    } else {
      destinationTasks.splice(destination.index, 0, movedTask); // Add task to the destination column
    }

    // Update state with new task lists
    setTasks({
      ...tasks,
      [sourceColumn]: sourceTasks,
      [destinationColumn]: destinationTasks,
    });
    try {
      await axios.put(
        // `http://localhost:5000/task/update/${movedTask.id}`,
        `${mainUrl}task/update/${movedTask.id}`,
        movedTask
      ); // Update task in the backend
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  return (
    <Container>
      <Typography variant="h4" align="center" gutterBottom>
        Task Manager
      </Typography>

      <div style={{ display: "flex", marginBottom: 8 }}>
        <TextField
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
          label="Task Title"
          variant="outlined"
          style={{ flex: 0.3, marginRight: 8 }} // Allow flexbox behavior and spacing
        />
        <TextField
          value={taskDescription}
          onChange={(e) => setTaskDescription(e.target.value)}
          label="Task Description"
          variant="outlined"
          style={{ flex: 0.5, marginLeft: 8 }} // Allow flexbox behavior and spacing
          multiline
          rows={1}
        />

        <Button
          variant="contained"
          color="primary"
          onClick={handleAddTask}
          style={{ flex: 0.2, marginLeft: 8 }}
        >
          Add Task
        </Button>
      </div>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Grid container spacing={3} style={{ marginTop: 16 }}>
          {["todo", "pending", "done"].map((column) => (
            <Grid item xs={4} key={column}>
              <Droppable droppableId={column}>
                {(provided) => (
                  <Paper
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    style={{ padding: 16 }}
                  >
                    <Typography variant="h5" align="center">
                      {column.charAt(0).toUpperCase() + column.slice(1)}
                    </Typography>
                    {tasks[column].map((task, index) => (
                      <Task
                        key={task.id}
                        task={{ ...task, index }} // Pass index for draggable
                        onDelete={() => handleDeleteTask(column, task.id)}
                        onEdit={() => handleEditTask(task)}
                        onView={() => handleViewTask(task)}
                      />
                    ))}
                    {provided.placeholder}
                  </Paper>
                )}
              </Droppable>
            </Grid>
          ))}
        </Grid>
      </DragDropContext>

      {/* Edit Task Dialog */}
      <Dialog open={openEdit} onClose={() => setOpenEdit(false)}>
        <DialogTitle>Edit Task</DialogTitle>
        <DialogContent>
          <TextField
            value={taskTitle} // Controlled input
            onChange={(e) => setTaskTitle(e.target.value)} // Update title in state
            label="Task Title"
            variant="outlined"
            fullWidth
          />
          <TextField
            value={taskDescription} // Controlled input
            onChange={(e) => setTaskDescription(e.target.value)} // Update description in state
            label="Task Description"
            variant="outlined"
            fullWidth
            multiline
            rows={3}
            style={{ marginTop: 8 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEdit(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSaveTask} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Task Dialog */}
      <Dialog open={openView} onClose={() => setOpenView(false)}>
        <DialogTitle>View Task</DialogTitle>
        <DialogContent>
          <Typography variant="h6">
            {viewingTask ? viewingTask.title : ""}
          </Typography>
          <Typography variant="body1">
            {viewingTask ? viewingTask.description : ""}
          </Typography>
          <Typography variant="caption">{`Created: ${
            viewingTask ? viewingTask.datetime : ""
          }`}</Typography>
          <Typography
            variant="caption"
            color={
              viewingTask && viewingTask.status === "done" ? "green" : "orange"
            }
          >
            {viewingTask
              ? viewingTask.status.charAt(0).toUpperCase() +
                viewingTask.status.slice(1)
              : ""}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenView(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

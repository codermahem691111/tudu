
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./home.css";

const API = "https://checking-trae.onrender.com";

function Home() {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingTask, setEditingTask] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  // Get all tasks
  const getTasks = async () => {
    try {
      setLoading(true);

      const response = await axios.get(`${API}/get`);

      setTasks(response.data);
    } catch (error) {
      console.error("Error loading tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTasks();
  }, []);

  // Add task
  const addTask = async (e) => {
    e.preventDefault();

    if (!task.trim()) return;

    try {
      const response = await axios.post(`${API}/add`, {
        task: task.trim(),
      });

      setTasks((prev) => [...prev, response.data]);
      setTask("");
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  // Complete task
  const completeTask = async (id) => {
    try {
      const response = await axios.put(`${API}/edit/${id}`);

      setTasks((prev) =>
        prev.map((item) =>
          item._id === id ? response.data : item
        )
      );
    } catch (error) {
      console.error("Error completing task:", error);
    }
  };

  // Delete task
  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API}/delete/${id}`);

      setTasks((prev) =>
        prev.filter((item) => item._id !== id)
      );
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // Start editing
  const startEdit = (item) => {
    setEditingId(item._id);
    setEditingTask(item.task);
  };

  // Update task
  const updateTask = async (id) => {
    if (!editingTask.trim()) return;

    try {
      const response = await axios.put(`${API}/update/${id}`, {
        task: editingTask.trim(),
      });

      setTasks((prev) =>
        prev.map((item) =>
          item._id === id
            ? {
                ...item,
                task: response.data.task || editingTask.trim(),
              }
            : item
        )
      );

      setEditingId(null);
      setEditingTask("");
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingId(null);
    setEditingTask("");
  };

  // Filter tasks
  const filteredTasks = tasks.filter((item) => {
    if (filter === "active") return !item.done;
    if (filter === "completed") return item.done;

    return true;
  });

  const completedCount = tasks.filter((item) => item.done).length;
  const activeCount = tasks.length - completedCount;

  return (
    <main className="app">
      <section className="todo-container">

        {/* Header */}
        <header className="header">
          <div>
            <span className="eyebrow">PERSONAL PRODUCTIVITY</span>
            <h1>My Tasks</h1>
            <p>Keep your day organized.</p>
          </div>

          <div className="task-counter">
            <strong>{activeCount}</strong>
            <span>active</span>
          </div>
        </header>

        {/* Add Task */}
        <form className="add-form" onSubmit={addTask}>
          <input
            type="text"
            placeholder="What needs to be done?"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            maxLength={200}
          />

          <button type="submit" className="add-btn">
            <span>+</span>
            Add
          </button>
        </form>

        {/* Statistics */}
        <div className="stats">
          <div>
            <span className="stat-number">{tasks.length}</span>
            <span className="stat-label">Total</span>
          </div>

          <div>
            <span className="stat-number">{activeCount}</span>
            <span className="stat-label">Active</span>
          </div>

          <div>
            <span className="stat-number">{completedCount}</span>
            <span className="stat-label">Done</span>
          </div>
        </div>

        {/* Filter */}
        <div className="filter-bar">
          <button
            className={filter === "all" ? "filter active" : "filter"}
            onClick={() => setFilter("all")}
          >
            All
          </button>

          <button
            className={filter === "active" ? "filter active" : "filter"}
            onClick={() => setFilter("active")}
          >
            Active
          </button>

          <button
            className={
              filter === "completed"
                ? "filter active"
                : "filter"
            }
            onClick={() => setFilter("completed")}
          >
            Completed
          </button>
        </div>

        {/* Tasks */}
        <section className="tasks-section">

          {loading ? (
            <div className="empty-state">
              <div className="loader"></div>
              <p>Loading tasks...</p>
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">✓</div>

              <h2>
                {filter === "completed"
                  ? "No completed tasks"
                  : filter === "active"
                  ? "No active tasks"
                  : "Nothing here yet"}
              </h2>

              <p>
                {filter === "all"
                  ? "Add your first task above."
                  : "Try another filter."}
              </p>
            </div>
          ) : (
            <div className="task-list">

              {filteredTasks.map((item) => (
                <article
                  className={
                    item.done
                      ? "task-card completed"
                      : "task-card"
                  }
                  key={item._id}
                >

                  {/* Complete button */}
                  <button
                    className="complete-btn"
                    onClick={() => completeTask(item._id)}
                    aria-label={
                      item.done
                        ? "Completed"
                        : "Mark as complete"
                    }
                  >
                    {item.done ? "✓" : ""}
                  </button>

                  {/* Task content */}
                  <div className="task-content">

                    {editingId === item._id ? (
                      <div className="edit-area">

                        <input
                          autoFocus
                          value={editingTask}
                          onChange={(e) =>
                            setEditingTask(e.target.value)
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              updateTask(item._id);
                            }

                            if (e.key === "Escape") {
                              cancelEdit();
                            }
                          }}
                        />

                        <div className="edit-actions">
                          <button
                            className="save-btn"
                            onClick={() =>
                              updateTask(item._id)
                            }
                          >
                            Save
                          </button>

                          <button
                            className="cancel-btn"
                            onClick={cancelEdit}
                          >
                            Cancel
                          </button>
                        </div>

                      </div>
                    ) : (
                      <>
                        <p className="task-text">
                          {item.task}
                        </p>

                        <span className="task-status">
                          {item.done
                            ? "Completed"
                            : "In progress"}
                        </span>
                      </>
                    )}

                  </div>

                  {/* Actions */}
                  {editingId !== item._id && (
                    <div className="task-actions">

                      <button
                        className="icon-btn edit"
                        onClick={() => startEdit(item)}
                        aria-label="Edit task"
                      >
                        ✎
                      </button>

                      <button
                        className="icon-btn delete"
                        onClick={() => deleteTask(item._id)}
                        aria-label="Delete task"
                      >
                        ×
                      </button>

                    </div>
                  )}

                </article>
              ))}

            </div>
          )}

        </section>

        {/* Footer */}
        <footer className="footer">
          <span>FOCUS • PLAN • COMPLETE</span>
        </footer>

      </section>
    </main>
  );
}

export default Home;

import React, { useEffect, useState } from 'react';
import './home.css';
import Create from './Create';
import api from './api';


import {
  BsCircle,
  BsFillCheckCircleFill,
  BsFillTrashFill,
  BsPencil,
  BsCheckLg,
} from 'react-icons/bs';

const Home = () => {
  const [todos, setTodos] = useState([]);
  const [updatetask, setUpdatetask] = useState('');
  const [taskid, setTaskid] = useState('');

  useEffect(() => {
    api
      .get('/get')
      .then((result) => setTodos(result.data))
      .catch((err) => console.log(err));
  }, []);

  const edit = (id) => {
    api
      .put(`/edit/${id}`)
      .then((result) => {
        console.log(result.data);

        setTodos(
          todos.map((todo) =>
            todo._id === id ? { ...todo, done: !todo.done } : todo
          )
        );
      })
      .catch((err) => console.log(err));
  };

  const Update = (id, updatedTask) => {
    if (!updatedTask.trim()) return;

    api
      .put(`/update/${id}`, { task: updatedTask })
      .then((result) => {
        console.log(result.data);

        setTodos(
          todos.map((todo) =>
            todo._id === id ? { ...todo, task: updatedTask } : todo
          )
        );

        setTaskid('');
        setUpdatetask('');
      })
      .catch((err) => console.log(err));
  };

  const Hdelete = (id) => {
    api
      .delete(`/delete/${id}`)
      .then((result) => {
        console.log(result.data);
        setTodos(todos.filter((todo) => todo._id !== id));
      })
      .catch((err) => console.log(err));
  };

  const remaining = todos.filter((t) => !t.done).length;

  return (
    <main className="todo-app">
      <header className="todo-header">
        <h1>Dibbo's Task to Complete</h1>

        <p>
          {todos.length === 0
            ? '> no active tasks'
            : `> ${remaining} of ${todos.length} tasks pending`}
        </p>
      </header>

      <div className="todo-card">
        <div className="create-wrap">
          <Create />
        </div>

        {todos.length === 0 ? (
          <div className="todo-empty">
            <span>[ ! ]</span>
            No tasks found
          </div>
        ) : (
          <div className="todo-list">
            {todos.map((todo) => (
              <div className="todo-item" key={todo._id}>
                <div className="todo-left">
                  {todo.done ? (
                    <BsFillCheckCircleFill className="todo-check done" />
                  ) : (
                    <BsCircle
                      className="todo-check"
                      onClick={() => edit(todo._id)}
                    />
                  )}

                  {taskid === todo._id ? (
                    <input
                      className="todo-edit-input"
                      type="text"
                      autoFocus
                      value={updatetask}
                      onChange={(e) => setUpdatetask(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          Update(todo._id, updatetask);
                        }

                        if (e.key === 'Escape') {
                          setTaskid('');
                          setUpdatetask('');
                        }
                      }}
                    />
                  ) : (
                    <p className={`todo-text ${todo.done ? 'done' : ''}`}>
                      {todo.task}
                    </p>
                  )}
                </div>

                <div className="todo-actions">
                  <button
                    className={`todo-btn ${
                      taskid === todo._id ? 'save' : 'edit'
                    }`}
                    title={taskid === todo._id ? 'Save' : 'Edit'}
                    onClick={() => {
                      if (taskid === todo._id) {
                        Update(todo._id, updatetask);
                      } else {
                        setTaskid(todo._id);
                        setUpdatetask(todo.task);
                      }
                    }}
                  >
                    {taskid === todo._id ? <BsCheckLg /> : <BsPencil />}
                  </button>

                  <button
                    className="todo-btn delete"
                    title="Delete"
                    onClick={() => Hdelete(todo._id)}
                  >
                    <BsFillTrashFill />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default Home;
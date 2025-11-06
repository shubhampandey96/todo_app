import React, { useState, useEffect } from "react";
import AddTodo from "./AddTodo";
import TodoItem from "./TodoItem";
import BACKEND_URL from "../config/config";

const TodoList = () => {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/get-todos`);
      const data = await response.json();
      console.log("Fetched todos:", data);
      setTodos(Array.isArray(data) ? data : data.todos || []);
    } catch (error) {
      console.error("Error fetching the data", error);
    }
  };

  const addTodo = async (title) => {
    console.log("Adding todo", title);
    try {
      const response = await fetch(`${BACKEND_URL}/add-todo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title }),
      });
      const newTodo = await response.json();
      setTodos((prev) => [...prev, newTodo]);
      console.log("Added:", newTodo);
    } catch (error) {
      console.error("Error while creating the todo", error);
    }
  };

  // TODO: implement delete functionality later
  // const deleteTodo = async (id) => {
  //   await fetch(`${BACKEND_URL}/delete-todo/${id}`, { method: "DELETE" });
  //   setTodos((prev) => prev.filter((todo) => todo._id !== id));
  // };

  return (
    <div>
      <h1>Todo List</h1>
      <AddTodo onAdd={addTodo} />
      <ul>
        {Array.isArray(todos) &&
          todos.map((todo) => (
            <TodoItem key={todo._id} todo={todo} />
          ))}
      </ul>
    </div>
  );
};

export default TodoList;

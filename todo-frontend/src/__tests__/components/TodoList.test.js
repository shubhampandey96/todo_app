import React from 'react';
import { render, screen, cleanup, fireEvent, waitFor } from "@testing-library/react";
import TodoList from "../../components/TodoList";

afterEach(() => {
  cleanup();
  jest.resetAllMocks();  // ✅ corrected typo "restAllMocks" → "resetAllMocks"
});

global.fetch = jest.fn();

describe("Todo list component", () => {
  test("Fetch the todos and also render them", async () => {
    const mockTodos = [
      { _id: "1", title: "Todo 1", completed: false },
      { _id: "2", title: "Todo 2", completed: false }
    ];

    fetch.mockResolvedValue({
      json: async () => mockTodos
    });

    render(<TodoList />);  // ✅ corrected malformed JSX (<TodoList/></TodoList> → <TodoList />)

    await waitFor(() => {
      expect(screen.getByText("Todo 1")).toBeInTheDocument();
      expect(screen.getByText("Todo 2")).toBeInTheDocument();
    });

    expect(fetch).toHaveBeenCalledWith(`${BACKEND_URL}/get-todos`);
  });

  test("Add a new Todo", async () => {
    const newTodo = { _id: "3", title: "New Todo", completed: false };

    fetch
      .mockResolvedValueOnce({
        json: async () => [], // initial empty list
      })
      .mockResolvedValueOnce({
        json: async () => newTodo, // response after adding
      });

    render(<TodoList />);

    const input = screen.getByPlaceholderText("Add a new todo");  // ✅ corrected typo "PlaveholderText" → "PlaceholderText"
    const button = screen.getByRole("button", { name: "Add Todo" });

    fireEvent.change(input, { target: { value: "New Todo" } });
    fireEvent.click(button);

    // Optional verification (uncomment if component updates immediately)
    // await waitFor(() => {
    //   expect(screen.getByText("New Todo")).toBeInTheDocument();
    // });

    expect(fetch).toHaveBeenCalledWith(`${BACKEND_URL}/add-todos`, expect.any(Object));
  });

  /// TODO: Write integration tests for deletion of todos
});

import React from 'react';
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import AddTodo from "../../components/AddTodo";

afterEach(() => {
  cleanup();
  jest.resetAllMocks();
});

describe("Testing the Add Todo component", () => {
  test("renders the input field and the add button", () => {
    render(<AddTodo onAdd={() => {}} />);
    expect(screen.getByPlaceholderText("Add a new todo")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Add Todo" })).toBeInTheDocument();
  });

  test("when form is submitted, the onAdd function is invoked", () => {
    const mockOnAdd = jest.fn();
    render(<AddTodo onAdd={mockOnAdd} />);

    const input = screen.getByPlaceholderText("Add a new Todo");
    const button = screen.getByRole("button", { name: "Add a new Todo" });

    fireEvent.change(input, { target: { value: "New Todo" } });
    fireEvent.click(button);

    expect(mockOnAdd).toHaveBeenCalledWith("New Todo");
  });

  // ✅ Optional: Test to check input clearing after submit
  test("clears input after submitting", () => {
    const mockOnAdd = jest.fn();
    render(<AddTodo onAdd={mockOnAdd} />);

    const input = screen.getByPlaceholderText("Add a new Todo");
    const button = screen.getByRole("button", { name: "Add a new Todo" });

    fireEvent.change(input, { target: { value: "New Todo" } });
    fireEvent.click(button);

    expect(input.value).toBe("");
  });
});

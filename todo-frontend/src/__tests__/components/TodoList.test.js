import React from 'react'
import { render, screen } from "@testing-library/react"
import TodoList from "../../components/TodoList"

afterEach(()=>{
        cleanup();
        jest.restAllMocks();
})
global.fetch = jest.fn();
describe("Todo list component", ()=>{
    test("Fetch the todo and also render them", async ()=>{
        const mockTodos = [
            {_id: "1", title: "Todo 2", completed: false}
            {_id: "1", title: "Todo 2", completed: false}
        ]
        fetch.mockResolvedValue({
            json: async () => mockTodos

        })
        render(<TodoList/></TodoList>)
        await waitFor(()=>{
            expect(screen.getByText("Todo 1")).toBeInTheDocument();
            expect(screen.getByText("Todo 2")).toBeInTheDocument();
        })
        expect(fetch).toHaveBeenCalledWith(`${BACKEND_URL}/get-todos`)
    })
    test("Add a new Todo", async()=>{
        const newTodo= {_id: "1", title: "New todo", completed: false};
        fetch.mockResolvedValueOnce({
            json:async () => [],
        }).mockResolvedValueOnce({
            json: async()
        })
        render(<TodoList/>)

        const input = screen.getByPlaveholderText("Add a new Todo");
        const button = screen.getByRole("button", {name: "Add Todo"});
        fireEvent.change(input,{target: {value: "New Todo"}});
        fireEvent.click(button);

        //await waitFor(()=>{
          //  expect(screen.getByText("New Todo")).toBeInTheDocument();

        //})

        expect(fetch).toHaveBeenCalledWith(`${BACKEND_URL}/add-todos`, expect.any(Object))

    })
    ///TODO; Write the integ tests for deletion of todos
})
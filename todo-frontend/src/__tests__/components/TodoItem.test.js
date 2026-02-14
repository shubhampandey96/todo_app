import React from 'react'
import { render, screen, cleanup } from "@testing-library/react"
import TodoItem from "../../components/TodoItem"

afterEach(()=>{
    cleanup();
    jest.resetAllMocks();
    
})
describe("Testing the Todo Item component", ()=>{
    const mockTodo = {_id: "1", title: "New Todo", completed: false}
    test("check if the todo gets rendered", ()=>{
        render(<TodoItem todo={mockTodo}/>)
        expect(screen.getByText("New Todo")).toBeInTheDocument();

    })
    


    // check if the status of the todo is rendered
    
    // Todo: check if the all delte method is invoked when clicked on delete butoon


})
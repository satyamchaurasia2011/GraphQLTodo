import React, { useEffect, useState } from "react";
import "./Todo.css";
import {
  ApolloClient,
  InMemoryCache,
  useMutation,
  useQuery,
} from "@apollo/client";
import { RestLink } from "apollo-link-rest";
import { ADD_TODO, DELETE_COMPLETED_TODO, DELETE_TODO, GET_TODOS, TOGGLE_TODO } from "./Todographql";

function Todo() {
  const [task, setTask] = useState("");
  const [slide, setSlide] = useState("all");
  const [dowork, setDoWork] = useState(true);
  const { loading, data, error } = useQuery(GET_TODOS);

  const [toggleTodo] = useMutation(TOGGLE_TODO);

  const [addTodo] = useMutation(ADD_TODO, {
    onCompleted: () => setTask(""),
  });

  const [deleteTodo] = useMutation(DELETE_TODO);
 
   const [deleteCompletedTodo] = useMutation(DELETE_COMPLETED_TODO);
  const handleToggleTodo = async ({ id, done }) => {
    const data = await toggleTodo({
      variables: {
        id: id,
        done: !done,
      },
    });
    console("toggled data", data);
  };
  const handleDeleteTodo = async ({ id }) => {
    await deleteTodo({
      variables: { id },
      update: (cache) => {
        const prevData = cache.readQuery({ query: GET_TODOS });
        const newTodos = prevData.todos.filter((todo) => todo.id !== id);
        cache.writeQuery({ query: GET_TODOS, data: { todos: newTodos } });
      },
    });
  };
  const handleDeleteCompletedTodo = async() => {
    await deleteCompletedTodo({
      update: (cache) => {
        const prevData = cache.readQuery({ query: GET_TODOS });
        const newTodos = prevData.todos.filter((todo) => todo.done !== true);
        cache.writeQuery({ query: GET_TODOS, data: { todos: newTodos } });
      },
    })
  }
  const submitHandler = async (e) => {
    e.preventDefault();
    if (task === "") return;
    const data = await addTodo({
      variables: { text: task },
      refetchQueries: [{ query: GET_TODOS }],
    });
    console.log(data);
  };
 const doneAll = async({todos}) => {
  await todos.map(todo => {
     toggleTodo({
      variables: {
        id: todo.id,
        done: dowork,
      },
    });
  });
  setDoWork(prev => !prev);
 }


  if (loading)
    return (
      <div style={{ textAlign: "center", fontSize: "20px", marginTop: "20%" }}>
        Loading...
      </div>
    );
  if (error) return <div>500 error happend</div>;

  return (
    <div className="todo">
      <h1>todos</h1>
      <div>
        <form onSubmit={submitHandler}>
          {data?.todos.length > 0 && <i onClick={() => doneAll(data)} class="fa fa-angle-up"></i>}
          <input
            onChange={(e) => setTask(e.target.value)}
            type="text"
            value={task}
            placeholder="What needs to be done?"
          />
        </form>
        {data?.todos.length > 0 && (
          <>
            {slide === "all" ? (
              <div className="all-todos">
                {data?.todos.map((todo) => {
                  return (
                    <div key={todo.id}>
                      <input
                        checked={todo?.done ? true : false}
                        type="checkbox"
                        onClick={() => handleToggleTodo(todo)}
                      />
                      <p className={todo?.done ? "done" : "not-done"}>
                        {todo?.text}
                      </p>
                      <i
                        class="fa fa-times"
                        onClick={() => handleDeleteTodo(todo)}
                      ></i>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="all-todos">
                {data?.todos.map((todo) => {
                  if (slide === "completed" && todo.done === true)
                    return (
                      <div key={todo.id}>
                        <input
                          checked={todo?.done ? true : false}
                          type="checkbox"
                          onClick={() => handleToggleTodo(todo)}
                        />
                        <p className={todo?.done ? "done" : "not-done"}>
                          {todo?.text}
                        </p>
                      </div>
                    );
                  else if (slide !== "completed" && todo.done === false)
                    return (
                      <div key={todo.id}>
                        <input
                          checked={todo?.done ? true : false}
                          type="checkbox"
                          onClick={() => handleToggleTodo(todo)}
                        />
                        <p className={todo?.done ? "done" : "not-done"}>
                          {todo?.text}
                        </p>
                      </div>
                    );
                })}
              </div>
            )}

            <div className="btm-nav">
              <p>
                {data?.todos.filter((todo) => todo.done === false).length} items
                left
              </p>
              <div>
                <a
                  href="#/"
                  className={slide == "all" && "selected"}
                  onClick={() => setSlide("all")}
                >
                  All
                </a>
                <a
                  href="#/active"
                  className={slide == "active" && "selected"}
                  onClick={() => setSlide("active")}
                >
                  Active
                </a>
                <a
                  href="#/completed "
                  className={slide == "completed" && "selected"}
                  onClick={() => setSlide("completed")}
                >
                  Completed
                </a>
              </div>
              <p style={{cursor:'pointer'}} onClick={() => handleDeleteCompletedTodo()}>Clear Completed</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Todo;

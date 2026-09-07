import  { useState, useRef } from "react";
import { Task, Directions } from "../types/index.tsx";
import "./styles.css"

const columns = ["todo", "in-progress", "completed"];

export default function KanbanBoard() {

  const [todoTask, setTodoTask] = useState<Task[]>([]);
  const [progressTask, setProgressTask] = useState<Task[]>([]);
  const [completedTask, setCompletedTask] = useState<Task[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [isEditingId, setIsEditingId] = useState<number>(-1);
  const [editValue, setEditValue] = useState<string>("");

  const id = useRef(0);

  function findTask(id:number) {
    return todoTask.find((t) => t.id === id) ?? progressTask.find((t) => t.id === id) ?? completedTask.find((t) => t.id === id)
  }

  function removeTask(task:Task | undefined) {
    const taskId = task?.id;
    const colId = task?.columnId;

    if (colId === 0) {
      setTodoTask((prev) => prev.filter((t) => t.id !== taskId));
    }

    if (colId === 1) {
      setProgressTask((prev) => prev.filter((t) => t.id !== taskId));
    }

    if (colId === 2) {
      setCompletedTask((prev) => prev.filter((t) => t.id !== taskId));
    }
  }

  function reorderTask(task:Task | undefined, colId:number) {
    if(!task)return;

    task = {
      ...task,
      columnId: colId
    }
    if (colId === 0) {
      setTodoTask((prev) => [...prev, task]);
    }

    if (colId === 1) {
      setProgressTask((prev) => [...prev, task]);
    }
    if (colId === 2) {
      setCompletedTask((prev) => [...prev, task]);
    }
  }


  const addTask = () => {


    const newTask = {
      id: ++id.current,
      name: inputValue,
      columnId: 0,
    }
    setTodoTask((prev) => [...prev, newTask]);
    setInputValue("");
  };

  const moveTask = (id:number, direction:Directions) => {
    const task = findTask(id);
    const colId = task?.columnId ?? -1;

    removeTask(task);

    if (direction === 'right') {
      reorderTask(task, (colId + 1) % 3);
    }

    if (direction === 'left') {
      reorderTask(task, (colId - 1 + 3) % 3);
    }
  };

  const deleteTask = (id:number) => {
    const task = findTask(id);
    removeTask(task);

  };

  const saveTitle = (idx:number) => {
    const task = findTask(idx);

    if(!task)return;

    const taskId = task?.id;
    const colId = task?.columnId;
    const name = editValue;

    if (name.trim() !== "") {
      removeTask(task);
      if (colId === 0) {
        setTodoTask((prev) => [...prev, {
          id: taskId,
          name: name,
          columnId: 0
        }])
      }

      if (colId === 1) {
        setProgressTask((prev) => [...prev, {
          id: taskId,
          name: name,
          columnId: 1
        }])
      }
      if (colId === 2) {
        setCompletedTask((prev) => [...prev, {
          id: taskId,
          name: name,
          columnId: 2
        }])
      }
    }

    setIsEditingId(-1);
    setEditValue("");
  };

  return (
    <div>
      <h2>Kanban Board</h2>
      <input
        data-testid="task-input"
        placeholder="Enter task"
        className="inputBox"
        value={inputValue}
        onChange={(event) => setInputValue(event.target.value)}
      />
      <button
        data-testid="add-task-button"
        className="addTaskBtn"
        onClick={() => addTask()}
      >
        Add Task
      </button>
      <div className="kanban-board">
        {columns.map((col, ind) => (
          <div key={col} className="column" data-testid={`column-${col}`}>
            <h4>{col.replace("-", " ").toUpperCase()}</h4>
            {
              ind === 0 && todoTask.map((t) => {
                return <div className="task-card ">
                  {isEditingId === t.id && <input
                    value={editValue}
                    className="inputBox"
                    onChange={(e) => setEditValue(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && saveTitle(t.id)}
                    onBlur={() => saveTitle(t.id)}
                    autoFocus={true}
                  >
                  </input>}
                  <div> {t.name} </div>
                  <div className="buttonContainer">
                    <button onClick={() => moveTask(t.id, Directions.RIGHT)} className="shiftBtn">➡️</button>
                    <button onClick={() => setIsEditingId(t.id)} className="editBtn">Edit</button>
                    <button onClick={() => deleteTask(t.id)} className="deleteBtn">Delete</button>
                  </div>
                </div>
              })
            }

            {
              ind === 1 && progressTask.map((t) => {
                return <div className="task-card ">
                  {isEditingId === t.id && <input
                    value={editValue}
                    className="inputBox"
                    onChange={(e) => setEditValue(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && saveTitle(t.id)}
                    onBlur={() => saveTitle(t.id)}
                    autoFocus={true}
                  >
                  </input>}
                  <p>{t.name}</p>
                  <div className="buttonContainer">
                    <button onClick={() => moveTask(t.id, Directions.LEFT)} className="shiftBtn"> ⬅️ </button>
                    <button onClick={() => moveTask(t.id, Directions.RIGHT)} className="shiftBtn">➡️ </button>
                    <button onClick={() => setIsEditingId(t.id)} className="editBtn">Edit</button>
                    <button onClick={() => deleteTask(t.id)} className="deleteBtn">Delete</button>
                  </div>
                </div>
              })
            }
            {
              ind === 2 && completedTask.map((t) => {
                return <div className="task-card ">
                  {isEditingId === t.id && <input
                    value={editValue}
                    className="inputBox"
                    onChange={(e) => setEditValue(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && saveTitle(t.id)}
                    onBlur={() => saveTitle(t.id)}
                    autoFocus={true}
                  >
                  </input>}
                  <p>{t.name}</p>

                  <div className="buttonContainer">
                    <button onClick={() => moveTask(t.id, Directions.LEFT)} className="shiftBtn"> ⬅️ </button>
                    <button onClick={() => setIsEditingId(t.id)}
                      className="editBtn">Edit</button>
                    <button onClick={() => deleteTask(t.id)}
                      className="deleteBtn">Delete</button>
                  </div>
                </div>
              })
            }
          </div>
        ))}
      </div>
    </div>
  );
}

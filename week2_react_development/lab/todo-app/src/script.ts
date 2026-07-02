
import { v4 as uuidv4 } from "uuid";

// console.log(uuidv4())

type taskType = {
    id: string;
    title: string | undefined;
    completed: boolean;
    createdAt: Date;
}


const list = document.querySelector<HTMLUListElement>("#list");
const form = document.querySelector<HTMLFormElement>("#form");
const input = document.querySelector<HTMLInputElement>("#new-task-title");

const tasks: taskType[] = loadTasks(); // Load tasks from local storage

for (const task of tasks) {
    addListItem(task); // Add each task to the list
}

form?.addEventListener("submit", (event) => {
    event.preventDefault(); // Prevent the default form submission behavior

    if(input?.value === "" || input?.value.trim() === "") return;

    const newTask : taskType = {
        id: uuidv4(), // Generate a unique ID for the task
        title: input?.value,
        completed: false,
        createdAt: new Date(),
    };
    
    tasks.push(newTask); // Add the new task to the tasks array

    addListItem(newTask);

    if (input) {
        input.value = "";
    }
    input?.focus(); // Set focus back to the input field
});

function addListItem(task : taskType) {
    const item = document.createElement("li");
    const label = document.createElement("label");
    const checkbox = document.createElement("input");

    checkbox.addEventListener("change", () => {
        task.completed = checkbox.checked;
        console.log(task);

        saveTasks();
    });

    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    label.append(checkbox, task.title || ""); // Use empty string if title is undefined
    item.append(label);
    list?.append(item);
} 

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
    const tasksJson = localStorage.getItem("tasks");
    if (tasksJson == null) return [];
    return JSON.parse(localStorage.getItem("tasks") || "[]") as taskType[];
}

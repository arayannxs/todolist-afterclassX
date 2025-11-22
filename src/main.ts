// src/main.ts

// 1. TYPE DEFINITION & STATE MANAGEMENT
interface Todo {
    id: number;
    text: string;
    completed: boolean;
}

let todos: Todo[] = [];
let nextId: number = 1;


// --- CORE FUNCTIONS (RELY ON ID AND STATE) ---

/**
 * Helper to update text styling based on completion status.
 */
function updateTextStyling(element: HTMLDivElement, isCompleted: boolean): void {
    if (isCompleted) {
        element.classList.add('line-through', 'text-gray-500', 'italic');
        element.classList.remove('text-gray-800');
    } else {
        element.classList.remove('line-through', 'text-gray-500', 'italic');
        element.classList.add('text-gray-800');
    }
}

/**
 * Creates the HTML element for a single Todo item.
 * @param todo The Todo object to render.
 */
function createTodoElement(todo: Todo): HTMLDivElement {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'flex justify-between items-center p-3 my-2 bg-gray-50 border-l-4 border-blue-500 rounded-lg shadow-sm';
    itemDiv.setAttribute('data-id', todo.id.toString());

    // Text Content Container (Clickable to toggle)
    const textContainer = document.createElement('div');
    textContainer.textContent = todo.text;
    textContainer.className = 'flex-grow cursor-pointer select-none text-lg';
    
    updateTextStyling(textContainer, todo.completed);
    textContainer.addEventListener('click', () => toggleTodo(todo.id));

    // Action Buttons Container
    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'flex space-x-2 ml-4';

    // Delete Button
    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
    `;
    deleteButton.className = 'text-red-500 hover:text-red-700 p-1 rounded-full transition-colors';
    deleteButton.setAttribute('aria-label', 'Delete todo');
    deleteButton.addEventListener('click', () => deleteTodo(todo.id));

    actionsDiv.appendChild(deleteButton);
    itemDiv.appendChild(textContainer);
    itemDiv.appendChild(actionsDiv);

    return itemDiv;
}

/**
 * Handles toggling the completion status of a todo item.
 */
function toggleTodo(id: number): void {
    const todoIndex = todos.findIndex(t => t.id === id);
    if (todoIndex > -1) {
        todos[todoIndex].completed = !todos[todoIndex].completed;
        // Re-render to update the list
        renderTodos();
    }
}

/**
 * Handles deleting a todo item.
 */
function deleteTodo(id: number): void {
    todos = todos.filter(t => t.id !== id);
    renderTodos();
}


// --- DOM MANIPULATION & INITIALIZATION ---

/**
 * Renders the entire list of todos to the DOM.
 */
function renderTodos(): void {
    // DOM elements are queried here (inside the function)
    const listContainer = document.getElementById('todo-list-container') as HTMLDivElement;
    const emptyMessage = document.getElementById('empty-message') as HTMLParagraphElement;
    
    if (!listContainer || !emptyMessage) return; // Safety check

    listContainer.innerHTML = ''; 

    if (todos.length === 0) {
        emptyMessage.classList.remove('hidden');
    } else {
        emptyMessage.classList.add('hidden');
        todos.forEach(todo => {
            const todoElement = createTodoElement(todo);
            listContainer.appendChild(todoElement);
        });
    }
}

/**
 * Handles adding a new todo item.
 */
function addTodo(text: string): void {
    const newTodo: Todo = {
        id: nextId++,
        text: text,
        completed: false,
    };
    todos.push(newTodo);
    renderTodos();
}


// 5. EVENT LISTENERS & INITIALIZATION

document.addEventListener('DOMContentLoaded', () => {
    // 3. DOM ELEMENTS - QUERIED LOCALLY
    const form = document.getElementById('todo-form') as HTMLFormElement;
    const input = document.getElementById('todo-input') as HTMLInputElement;

    if (!form || !input) {
        console.error("Initialization Failed: Could not find essential DOM elements.");
        return;
    }

    form.addEventListener('submit', (e: Event) => {
        e.preventDefault();
        const text = input.value.trim();
        if (text) {
            addTodo(text);
            input.value = ''; // Clear the input
        }
    });

    // Initial render when the document is fully loaded
    renderTodos();
});
// src/main.ts
var todos = [];
var nextId = 1;
// --- CORE FUNCTIONS (RELY ON ID AND STATE) ---
/**
 * Helper to update text styling based on completion status.
 */
function updateTextStyling(element, isCompleted) {
  if (isCompleted) {
    element.classList.add("line-through", "text-gray-500", "italic");
    element.classList.remove("text-gray-800");
  } else {
    element.classList.remove("line-through", "text-gray-500", "italic");
    element.classList.add("text-gray-800");
  }
}
/**
 * Creates the HTML element for a single Todo item.
 * @param todo The Todo object to render.
 */
function createTodoElement(todo) {
  var itemDiv = document.createElement("div");
  itemDiv.className =
    "flex justify-between items-center p-3 my-2 bg-gray-50 border-l-4 border-blue-500 rounded-lg shadow-sm";
  itemDiv.setAttribute("data-id", todo.id.toString());
  // Text Content Container (Clickable to toggle)
  var textContainer = document.createElement("div");
  textContainer.textContent = todo.text;
  textContainer.className = "flex-grow cursor-pointer select-none text-lg";
  updateTextStyling(textContainer, todo.completed);
  textContainer.addEventListener("click", function () {
    return toggleTodo(todo.id);
  });
  // Action Buttons Container
  var actionsDiv = document.createElement("div");
  actionsDiv.className = "flex space-x-2 ml-4";
  // Delete Button
  var deleteButton = document.createElement("button");
  deleteButton.innerHTML =
    '\n        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">\n            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />\n        </svg>\n    ';
  deleteButton.className =
    "text-red-500 hover:text-red-700 p-1 rounded-full transition-colors";
  deleteButton.setAttribute("aria-label", "Delete todo");
  deleteButton.addEventListener("click", function () {
    return deleteTodo(todo.id);
  });
  actionsDiv.appendChild(deleteButton);
  itemDiv.appendChild(textContainer);
  itemDiv.appendChild(actionsDiv);
  return itemDiv;
}
/**
 * Handles toggling the completion status of a todo item.
 */
function toggleTodo(id) {
  var todoIndex = todos.findIndex(function (t) {
    return t.id === id;
  });
  if (todoIndex > -1) {
    todos[todoIndex].completed = !todos[todoIndex].completed;
    // Re-render to update the list
    renderTodos();
  }
}
/**
 * Handles deleting a todo item.
 */
function deleteTodo(id) {
  todos = todos.filter(function (t) {
    return t.id !== id;
  });
  renderTodos();
}
// --- DOM MANIPULATION & INITIALIZATION ---
/**
 * Renders the entire list of todos to the DOM.
 */
function renderTodos() {
  // DOM elements are queried here (inside the function)
  var listContainer = document.getElementById("todo-list-container");
  var emptyMessage = document.getElementById("empty-message");
  if (!listContainer || !emptyMessage) return; // Safety check
  listContainer.innerHTML = "";
  if (todos.length === 0) {
    emptyMessage.classList.remove("hidden");
  } else {
    emptyMessage.classList.add("hidden");
    todos.forEach(function (todo) {
      var todoElement = createTodoElement(todo);
      listContainer.appendChild(todoElement);
    });
  }
}
/**
 * Handles adding a new todo item.
 */
function addTodo(text) {
  var newTodo = {
    id: nextId++,
    text: text,
    completed: false,
  };
  todos.push(newTodo);
  renderTodos();
}
// 5. EVENT LISTENERS & INITIALIZATION
document.addEventListener("DOMContentLoaded", function () {
  // 3. DOM ELEMENTS - QUERIED LOCALLY
  var form = document.getElementById("todo-form");
  var input = document.getElementById("todo-input");
  if (!form || !input) {
    console.error(
      "Initialization Failed: Could not find essential DOM elements."
    );
    return;
  }
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var text = input.value.trim();
    if (text) {
      addTodo(text);
      input.value = ""; // Clear the input
    }
  });
  // Initial render when the document is fully loaded
  renderTodos();
});

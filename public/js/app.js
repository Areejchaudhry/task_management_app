
const API_URL = "/api/tasks";

const taskList = document.getElementById("taskList");
const taskForm = document.getElementById("taskForm");
const openFormBtn = document.getElementById("openFormBtn");
const closeFormBtn = document.getElementById("closeFormBtn");
const cancelBtn = document.getElementById("cancelBtn");
const refreshBtn = document.getElementById("refreshBtn");
const statusFilter = document.getElementById("statusFilter");
const messageBox = document.getElementById("message");
const saveBtn = document.getElementById("saveBtn");

let tasks = [];
let editingTaskId = null;
let messageTimer;

async function apiRequest(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
    },
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      result.errors?.join(". ") ||
      result.message ||
      `Request failed with status ${response.status}`
    );
  }

  return result;
}

function showMessage(text, type = "success") {
  clearTimeout(messageTimer);
  messageBox.textContent = text;
  messageBox.className = `message ${type}`;

  messageTimer = setTimeout(() => {
    messageBox.textContent = "";
    messageBox.className = "message";
  }, 4000);
}

function makeElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

function createButton(text, className, action, task) {
  const button = makeElement("button", className, text);
  button.type = "button";
  button.addEventListener("click", () => action(task));
  return button;
}

function updateStatistics() {
  document.getElementById("totalCount").textContent = tasks.length;
  document.getElementById("pendingCount").textContent =
    tasks.filter(task => task.status === "Pending").length;
  document.getElementById("progressCount").textContent =
    tasks.filter(task => task.status === "In Progress").length;
  document.getElementById("completedCount").textContent =
    tasks.filter(task => task.status === "Completed").length;
}

function renderTasks() {
  taskList.replaceChildren();
  updateStatistics();

  if (tasks.length === 0) {
    const empty = makeElement("div", "empty-state");
    empty.append(
      makeElement("strong", "", "No tasks found"),
      makeElement("span", "", "Create a new task to get started.")
    );
    taskList.append(empty);
    return;
  }

  tasks.forEach(task => {
    const card = makeElement("article", "task-card");

    const top = makeElement("div", "task-top");
    const info = makeElement("div", "task-info");
    info.append(makeElement("h3", "task-title", task.title));

    if (task.description) {
      info.append(makeElement("p", "task-description", task.description));
    }

    const badges = makeElement("div", "task-badges");
    badges.append(
      makeElement("span", `pill priority-${task.priority}`, `${task.priority} priority`),
      makeElement(
        "span",
        `pill status-${task.status.replace(/\s+/g, "-")}`,
        task.status
      )
    );

    top.append(info, badges);

    const bottom = makeElement("div", "task-bottom");
    const meta = makeElement("div", "task-meta");

    const dueDateText = task.dueDate
      ? `Due: ${new Date(task.dueDate).toLocaleDateString()}`
      : "No due date";

    meta.append(makeElement("span", "", dueDateText));

    const actions = makeElement("div", "task-actions");

    const statusSelect = document.createElement("select");
    statusSelect.setAttribute("aria-label", `Change status for ${task.title}`);

    ["Pending", "In Progress", "Completed"].forEach(status => {
      const option = document.createElement("option");
      option.value = status;
      option.textContent = status;
      option.selected = status === task.status;
      statusSelect.append(option);
    });

    statusSelect.addEventListener("change", async () => {
      statusSelect.disabled = true;

      try {
        await apiRequest(`${API_URL}/${task._id}`, {
          method: "PUT",
          body: JSON.stringify({ status: statusSelect.value }),
        });

        showMessage("Task status updated.");
        await loadTasks();
      } catch (error) {
        showMessage(error.message, "error");
        statusSelect.value = task.status;
      } finally {
        statusSelect.disabled = false;
      }
    });

    actions.append(
      statusSelect,
      createButton("Edit", "edit-btn", openEditForm, task),
      createButton("Delete", "delete-btn", deleteTask, task)
    );

    bottom.append(meta, actions);
    card.append(top, bottom);
    taskList.append(card);
  });
}

async function loadTasks() {
  taskList.replaceChildren(makeElement("div", "loading-state", "Loading tasks..."));

  try {
    const params = new URLSearchParams();
    if (statusFilter.value) params.set("status", statusFilter.value);

    const query = params.toString();
    const result = await apiRequest(`${API_URL}${query ? `?${query}` : ""}`);

    tasks = result.data || [];
    renderTasks();
  } catch (error) {
    taskList.replaceChildren(
      makeElement("div", "empty-state", "Unable to load tasks. Check that the API is running.")
    );
    showMessage(error.message, "error");
  }
}

function resetForm() {
  taskForm.reset();
  editingTaskId = null;
  document.getElementById("formTitle").textContent = "Create a new task";
  saveBtn.textContent = "Save Task";
}

function openCreateForm() {
  resetForm();
  taskForm.classList.remove("hidden");
  document.getElementById("title").focus();
  taskForm.scrollIntoView({ behavior: "smooth", block: "start" });
}

function openEditForm(task) {
  resetForm();
  editingTaskId = task._id;

  document.getElementById("formTitle").textContent = "Edit task";
  document.getElementById("title").value = task.title;
  document.getElementById("description").value = task.description || "";
  document.getElementById("priority").value = task.priority;
  document.getElementById("status").value = task.status;

  document.getElementById("dueDate").value = task.dueDate
    ? new Date(task.dueDate).toISOString().slice(0, 10)
    : "";

  saveBtn.textContent = "Update Task";
  taskForm.classList.remove("hidden");
  taskForm.scrollIntoView({ behavior: "smooth", block: "start" });
}

function closeForm() {
  taskForm.classList.add("hidden");
  resetForm();
}

async function deleteTask(task) {
  if (!confirm(`Are you sure you want to delete "${task.title}"?`)) return;

  try {
    await apiRequest(`${API_URL}/${task._id}`, { method: "DELETE" });
    showMessage("Task deleted successfully.");

    if (editingTaskId === task._id) closeForm();

    await loadTasks();
  } catch (error) {
    showMessage(error.message, "error");
  }
}

taskForm.addEventListener("submit", async event => {
  event.preventDefault();

  const title = document.getElementById("title").value.trim();

  if (title.length < 2 || title.length > 100) {
    showMessage("Title must be between 2 and 100 characters.", "error");
    return;
  }

  const dueDate = document.getElementById("dueDate").value;

  const payload = {
    title,
    description: document.getElementById("description").value.trim(),
    priority: document.getElementById("priority").value,
    status: document.getElementById("status").value,
    dueDate: dueDate || null,
  };

  const isEditing = Boolean(editingTaskId);
  const url = isEditing ? `${API_URL}/${editingTaskId}` : API_URL;

  saveBtn.disabled = true;
  saveBtn.textContent = isEditing ? "Updating..." : "Saving...";

  try {
    await apiRequest(url, {
      method: isEditing ? "PUT" : "POST",
      body: JSON.stringify(payload),
    });

    showMessage(isEditing ? "Task updated successfully." : "Task created successfully.");
    closeForm();
    await loadTasks();
  } catch (error) {
    showMessage(error.message, "error");
  } finally {
    saveBtn.disabled = false;
    saveBtn.textContent = editingTaskId ? "Update Task" : "Save Task";
  }
});

openFormBtn.addEventListener("click", openCreateForm);
closeFormBtn.addEventListener("click", closeForm);
cancelBtn.addEventListener("click", closeForm);
refreshBtn.addEventListener("click", loadTasks);
statusFilter.addEventListener("change", loadTasks);

loadTasks();

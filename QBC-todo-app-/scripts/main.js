// STRUCTURE
const appState = {
  tasks: [],
  completedTasks: [],
  selectedPriority: "پایین",
  editingTaskId: null,
  darkMode: false,
};

let isEditingCompleted = false;

const priorities = [
  {
    name: "پایین",
    color: "#11A483",
    bgColor: "#C3FFF1",
    textColor: "#11A483",
    darkBg: "#233332",
    darkText: "#02E1A2",
  },
  {
    name: "متوسط",
    color: "#FFAF37",
    bgColor: "#FFEFD6",
    textColor: "#ffaf37",
    darkBg: "#302F2D",
    darkText: "#FFAF37",
  },
  {
    name: "بالا",
    color: "#FF5F37",
    bgColor: "#ffe2db",
    textColor: "#ff5f37",
    darkBg: "#3D2327",
    darkText: "#ff5f37",
  },
];

const getElement = (selector) => document.querySelector(selector);
const getElements = (selector) => document.querySelectorAll(selector);
const createElement = (tag) => document.createElement(tag);

const getPriorityData = (priorityName) => {
  return priorities.find((p) => p.name === priorityName) || priorities[0];
};

const generateTaskId = () => "task_" + Date.now();

const showConfirm = (message) => confirm(message);

const showAlert = (message) => alert(message);

// THEME
const loadThemeFromStorage = () => {
  const savedTheme = localStorage.getItem("darkMode");
  appState.darkMode = savedTheme === "dark";
  return appState.darkMode;
};

const saveThemeToStorage = (isDark) => {
  localStorage.setItem("darkMode", isDark ? "dark" : "light");
  appState.darkMode = isDark;
};

const updateAllTaskBadges = () => {
  const isDark = document.documentElement.classList.contains("dark");

  appState.tasks.forEach((task) => {
    const taskElement = getElement(`#${task.id}`);
    if (!taskElement) return;

    const priorityData = getPriorityData(task.priority);
    const badge = taskElement.querySelector(".task-priority");
    if (badge) {
      badge.style.backgroundColor = isDark
        ? priorityData.darkBg
        : priorityData.bgColor;
      badge.style.color = isDark
        ? priorityData.darkText
        : priorityData.textColor;
    }
  });
};

const applyTheme = (isDark) => {
  const html = document.documentElement;
  const slider = getElement(".slider");

  if (isDark) {
    html.classList.add("dark");
    if (slider) slider.style.right = "calc(50% - 0.25rem)";
  } else {
    html.classList.remove("dark");
    if (slider) slider.style.right = "0.25rem";
  }

  appState.darkMode = isDark;

  updateAllTaskBadges();

  const editForm = getElement(".edit-task-form");
  if (editForm && !editForm.classList.contains("hidden")) {
    highlightEditPriority();
  }
};

const handleLightModeClick = () => {
  applyTheme(false);
  saveThemeToStorage(false);
};

const handleDarkModeClick = () => {
  applyTheme(true);
  saveThemeToStorage(true);
};

const initThemeToggle = () => {
  const isDark = loadThemeFromStorage();
  applyTheme(isDark);

  const lightModeBtn = getElement(".light-mode-btn");
  const darkModeBtn = getElement(".dark-mode-btn");

  if (lightModeBtn)
    lightModeBtn.addEventListener("click", handleLightModeClick);
  if (darkModeBtn) darkModeBtn.addEventListener("click", handleDarkModeClick);
};

// MAKE TASKS
const createTaskHTML = (taskId, title, description, priority) => {
  const priorityData = getPriorityData(priority);

  const isDark = document.documentElement.classList.contains("dark");
  const badgeBgColor = isDark ? priorityData.darkBg : priorityData.bgColor;
  const badgeTextColor = isDark
    ? priorityData.darkText
    : priorityData.textColor;

  return `
    <span class="absolute w-1 h-19 rounded-tl-lg rounded-bl-lg right-0 top-3.5" style="background-color: ${
      priorityData.color
    }"></span>
    <div class="flex p-3 md:p-6 gap-x-4">
      <span class="task-checkbox size-5 border border-gray-300 dark:border-trashEdit rounded-md md:cursor-pointer"></span>
      <div class="flex flex-col gap-y-4">
        <div class="flex flex-col items-start justify-start md:flex-row md:gap-x-3 md:items-center gap-y-1">
          <h3 class="task-title font-YekanBakhSemiBold font-semibold text-sm md:text-base dark:text-white">
            ${title}
          </h3>
          <span class="task-priority py-0.5 px-2 rounded-sm text-xs font-YekanBakhSemiBold" style="background-color: ${badgeBgColor}; color: ${badgeTextColor}">
            ${priority}
          </span>
        </div>
        <p class="task-description text-gray-400 font-YekanBakhRegular text-sm md:text-base">
          ${description || "بدون توضیحات"}
        </p>
      </div>
      <div class="absolute top-5 left-4">
        <div class="task-menu-trigger flex flex-col items-center justify-center space-y-1 md:left-6 md:cursor-pointer">
          <span class="size-1 bg-gray-700 dark:bg-white rounded-full"></span>
          <span class="size-1 bg-gray-700 dark:bg-white rounded-full"></span>
          <span class="size-1 bg-gray-700 dark:bg-white rounded-full"></span>
        </div>
        <div class="task-menu hidden absolute flex items-center justify-center border border-gray-200 dark:border-trashEdit dark:bg-trashEditBg rounded-lg top-full left-0 p-1 gap-x-2.5">
          <svg class="task-delete-btn md:cursor-pointer text-trashEdit dark:text-white" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 7H20M5 7L6 19C6 19.5304 6.21071 20.0391 6.58579 20.4142C6.96086 20.7893 7.46957 21 8 21H16C16.5304 21 17.0391 20.7893 17.4142 20.4142C17.7893 20.0391 18 19.5304 18 19L19 7M9 7V4C9 3.73478 9.10536 3.48043 9.29289 3.29289C9.48043 3.10536 9.73478 3 10 3H14C14.2652 3 14.5196 3.10536 14.7071 3.29289C14.8946 3.48043 15 3.73478 15 4V7M10 12L14 16M14 12L10 16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span class="w-px h-5 bg-gray-200 dark:bg-trashEdit"></span>
          <svg class="task-edit-btn md:cursor-pointer text-trashEdit dark:text-white" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 7H6C5.46957 7 4.96086 7.21071 4.58579 7.58579C4.21071 7.96086 4 8.46957 4 9V18C4 18.5304 4.21071 19.0391 4.58579 19.4142C4.96086 19.7893 5.46957 20 6 20H15C15.5304 20 16.0391 19.7893 16.4142 19.4142C16.7893 19.0391 17 18.5304 17 18V17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M16 4.99998L19 7.99998M20.385 6.58499C20.7788 6.19114 21.0001 5.65697 21.0001 5.09998C21.0001 4.543 20.7788 4.00883 20.385 3.61498C19.9912 3.22114 19.457 2.99988 18.9 2.99988C18.343 2.99988 17.8088 3.22114 17.415 3.61498L9 12V15H12L20.385 6.58499Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      </div>
    </div>
  `;
};

const createCompletedTaskHTML = (taskId, title, priorityColor) => {
  return `
    <div class="absolute right-0 h-[70%] w-1 rounded-tl-xl rounded-bl-xl" style="background-color: ${priorityColor}"></div>
    <div class="flex items-start">
      <input type="checkbox" class="completed-task-checkbox m-4 w-5 h-5 accent-blue-500 cursor-pointer" checked/>
      <label class="text-lg w- mt-2 line-through dark:text-white">${title}</label>
    </div>
    <div class="absolute top-5 left-4">
      <div class="completed-task-menu-trigger flex flex-col items-center justify-center space-y-1 md:left-6 md:cursor-pointer">
        <span class="size-1 bg-gray-700 dark:bg-white rounded-full"></span>
        <span class="size-1 bg-gray-700 dark:bg-white rounded-full"></span>
        <span class="size-1 bg-gray-700 dark:bg-white rounded-full"></span>
      </div>
      <div class="task-menu hidden absolute flex items-center justify-center border border-gray-200 dark:border-trashEdit dark:bg-trashEditBg rounded-lg top-full left-0 p-1 gap-x-2.5">
        <svg class="completed-task-delete-btn md:cursor-pointer text-trashEdit dark:text-white" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 7H20M5 7L6 19C6 19.5304 6.21071 20.0391 6.58579 20.4142C6.96086 20.7893 7.46957 21 8 21H16C16.5304 21 17.0391 20.7893 17.4142 20.4142C17.7893 20.0391 18 19.5304 18 19L19 7M9 7V4C9 3.73478 9.10536 3.48043 9.29289 3.29289C9.48043 3.10536 9.73478 3 10 3H14C14.2652 3 14.5196 3.10536 14.7071 3.29289C14.8946 3.48043 15 3.73478 15 4V7M10 12L14 16M14 12L10 16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
         <span class="w-px h-5 bg-gray-200 dark:bg-trashEdit"></span>
          <svg class="completed-edit-btn md:cursor-pointer text-trashEdit dark:text-white" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 7H6C5.46957 7 4.96086 7.21071 4.58579 7.58579C4.21071 7.96086 4 8.46957 4 9V18C4 18.5304 4.21071 19.0391 4.58579 19.4142C4.96086 19.7893 5.46957 20 6 20H15C15.5304 20 16.0391 19.7893 16.4142 19.4142C16.7893 19.0391 17 18.5304 17 18V17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M16 4.99998L19 7.99998M20.385 6.58499C20.7788 6.19114 21.0001 5.65697 21.0001 5.09998C21.0001 4.543 20.7788 4.00883 20.385 3.61498C19.9912 3.22114 19.457 2.99988 18.9 2.99988C18.343 2.99988 17.8088 3.22114 17.415 3.61498L9 12V15H12L20.385 6.58499Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
      </div>
    </div>
  `;
};

// TASK OPERATIONS
const addTodo = () => {
  const taskTitle = getElement('.add-task-form input[type="text"]');
  const taskDescription = getElement(".add-task-form textarea");

  if (!taskTitle.value.trim()) {
    showAlert("لطفاً نام تسک را وارد کنید");
    return;
  }

  const taskId = generateTaskId();
  const newTask = {
    id: taskId,
    title: taskTitle.value.trim(),
    description: taskDescription.value.trim(),
    priority: appState.selectedPriority,
  };

  appState.tasks.push(newTask);
  saveTasksToStorage();
  renderTask(newTask);

  taskTitle.value = "";
  taskDescription.value = "";
  appState.selectedPriority = "پایین";
  toggleAddTaskForm();
  updateTasksDisplay();
};

const renderTask = (task) => {
  const tasksContainer = getElement(".active-tasks .tasks");
  const taskElement = createElement("div");
  taskElement.className =
    "task-item relative border border-gray-200 dark:border-none dark:bg-[#091120] mt-4 rounded-xl";
  taskElement.id = task.id;
  taskElement.innerHTML = createTaskHTML(
    task.id,
    task.title,
    task.description,
    task.priority
  );

  attachTaskEventListeners(taskElement, task.id);
  tasksContainer.appendChild(taskElement);
};

const attachTaskEventListeners = (taskElement, taskId) => {
  const checkbox = taskElement.querySelector(".task-checkbox");
  const menuTrigger = taskElement.querySelector(".task-menu-trigger");
  const deleteBtn = taskElement.querySelector(".task-delete-btn");
  const editBtn = taskElement.querySelector(".task-edit-btn");

  if (checkbox) checkbox.addEventListener("click", () => completeTodo(taskId));
  if (menuTrigger)
    menuTrigger.addEventListener("click", () => toggleTaskMenu(taskId));
  if (deleteBtn) deleteBtn.addEventListener("click", () => deleteTodo(taskId));
  if (editBtn) editBtn.addEventListener("click", () => editTodo(taskId));
};

const completeTodo = (taskId) => {
  const taskIndex = appState.tasks.findIndex((task) => task.id === taskId);
  if (taskIndex === -1) return;

  const task = appState.tasks[taskIndex];
  const priorityData = getPriorityData(task.priority);

  appState.completedTasks.push(task);
  appState.tasks.splice(taskIndex, 1);
  saveTasksToStorage();

  const taskElement = getElement(`#${taskId}`);
  if (taskElement) taskElement.remove();

  renderCompletedTask(task, priorityData.color);
  updateTasksDisplay();
};

const renderCompletedTask = (task, priorityColor) => {
  const completedSection = getElement(".main-section-2 .my-6");
  const completedTaskElement = createElement("div");
  completedTaskElement.className =
    "completed-task-item relative border-[1px] border-gray-light-e border-solid rounded-xl flex items-start justify-between h-full dark:bg-[#091120] p-2 dark:border-gray";
  completedTaskElement.id = task.id + "_completed";
  completedTaskElement.innerHTML = createCompletedTaskHTML(
    task.id,
    task.title,
    priorityColor
  );

  attachCompletedTaskEventListeners(completedTaskElement, task.id);
  completedSection.appendChild(completedTaskElement);
};

const renderTasksFromState = () => {
  appState.tasks.forEach((task) => renderTask(task));

  appState.completedTasks.forEach((task) => {
    const priorityData = getPriorityData(task.priority);
    renderCompletedTask(task, priorityData.color);
  });
};

const attachCompletedTaskEventListeners = (taskElement, taskId) => {
  const checkbox = taskElement.querySelector(".completed-task-checkbox");
  const menuTrigger = taskElement.querySelector(".completed-task-menu-trigger");
  const deleteBtn = taskElement.querySelector(".completed-task-delete-btn");
  const editBtn = taskElement.querySelector(".completed-edit-btn");

  if (checkbox)
    checkbox.addEventListener("change", () => uncompleteTask(taskId));
  if (menuTrigger)
    menuTrigger.addEventListener("click", () =>
      toggleCompletedTaskMenu(taskId)
    );
  if (deleteBtn)
    deleteBtn.addEventListener("click", () => deleteCompletedTask(taskId));

  if (editBtn)
    editBtn.addEventListener("click", () => editCompletedTask(taskId));
};

const uncompleteTask = (taskId) => {
  const taskIndex = appState.completedTasks.findIndex(
    (task) => task.id === taskId
  );
  if (taskIndex === -1) return;

  const task = appState.completedTasks[taskIndex];
  appState.tasks.push(task);
  appState.completedTasks.splice(taskIndex, 1);
  saveTasksToStorage();

  const completedElement = getElement(`#${taskId}_completed`);
  if (completedElement) completedElement.remove();

  renderTask(task);

  updateTasksDisplay();
};

const deleteTodo = (taskId) => {
  if (!showConfirm("آیا مطمئن هستید که می‌خواهید این تسک را حذف کنید؟")) return;

  appState.tasks = appState.tasks.filter((task) => task.id !== taskId);
  const taskElement = getElement(`#${taskId}`);
  if (taskElement) taskElement.remove();
  updateTasksDisplay();
  saveTasksToStorage();
};

const deleteCompletedTask = (taskId) => {
  if (!showConfirm("آیا مطمئن هستید که می‌خواهید این تسک را حذف کنید؟")) return;

  appState.completedTasks = appState.completedTasks.filter(
    (task) => task.id !== taskId
  );
  saveTasksToStorage();
  const completedElement = getElement(`#${taskId}_completed`);
  if (completedElement) completedElement.remove();
  updateTasksDisplay();
};

const editTodo = (taskId) => {
  const task = appState.tasks.find((t) => t.id === taskId);
  if (!task) return;

  const editForm = getElement(".edit-task-form");
  const editTitle = editForm.querySelector(".edit-task-title");
  const editDesc = editForm.querySelector(".edit-task-description");

  editTitle.value = task.title;
  editDesc.value = task.description === "بدون توضیحات" ? "" : task.description;
  appState.selectedPriority = task.priority;

  appState.editingTaskId = taskId;
  initEditPriorityButtons();
  highlightEditPriority();
  isEditingCompleted = false;

  getElement(".add-task-form").classList.add("hidden");
  const activeTasksContainer = getElement(".active-tasks .tasks");
  activeTasksContainer.appendChild(editForm);
  editForm.classList.remove("hidden");
  editForm.scrollIntoView({ behavior: "smooth" });

  updateTasksDisplay();
};
const editCompletedTask = (taskId) => {
  const completedTask = appState.completedTasks.find((t) => t.id === taskId);
  if (!completedTask) return;

  const editForm = getElement(".edit-task-form");
  const editTitle = editForm.querySelector(".edit-task-title");
  const editDesc = editForm.querySelector(".edit-task-description");

  editTitle.value = completedTask.title;
  editDesc.value =
    completedTask.description === "بدون توضیحات"
      ? ""
      : completedTask.description;
  appState.selectedPriority = completedTask.priority;
  appState.editingTaskId = taskId;
  initEditPriorityButtons();
  highlightEditPriority();

  isEditingCompleted = true;

  getElement(".add-task-form").classList.add("hidden");
  const completedTasksContainer = getElement(".main-section-2 > div.my-6");
  completedTasksContainer.appendChild(editForm);
  editForm.classList.remove("hidden");
  editForm.scrollIntoView({ behavior: "smooth" });

  updateTasksDisplay();
};

const saveEdit = () => {
  if (!appState.editingTaskId) return;

  const editForm = getElement(".edit-task-form");
  const editTitle = editForm.querySelector(".edit-task-title");
  const editDesc = editForm.querySelector(".edit-task-description");

  const task = appState.tasks.find((t) => t.id === appState.editingTaskId);
  if (task) {
    task.title = editTitle.value.trim();
    task.description = editDesc.value.trim();
    task.priority = appState.selectedPriority;

    const taskElement = getElement(`#${appState.editingTaskId}`);
    if (taskElement) {
      taskElement.querySelector(".task-title").textContent = task.title;
      taskElement.querySelector(".task-description").textContent =
        task.description || "بدون توضیحات";

      const priorityData = getPriorityData(task.priority);
      const prioritySpan = taskElement.querySelector(".task-priority");

      const isDark = appState.darkMode;
      prioritySpan.textContent = task.priority;
      prioritySpan.style.backgroundColor = isDark
        ? priorityData.darkBg
        : priorityData.bgColor;
      prioritySpan.style.color = isDark
        ? priorityData.darkText
        : priorityData.textColor;

      const priorityBar = taskElement.querySelector("span.absolute.w-1");
      if (priorityBar) priorityBar.style.backgroundColor = priorityData.color;
    }
    saveTasksToStorage();
  }

  editForm.classList.add("hidden");
  appState.editingTaskId = null;

  updateTasksDisplay();
};

const saveCompletedEdit = () => {
  if (!appState.editingTaskId) return;

  const editForm = getElement(".edit-task-form");
  const editTitle = editForm.querySelector(".edit-task-title");
  const editDesc = editForm.querySelector(".edit-task-description");

  const task = appState.completedTasks.find(
    (t) => t.id === appState.editingTaskId
  );
  if (!task) return;

  task.title = editTitle.value.trim();
  task.description = editDesc.value.trim();
  task.priority = appState.selectedPriority;

  const taskElement = getElement(`#${appState.editingTaskId}_completed`);
  if (taskElement) {
    const label = taskElement.querySelector("label");
    if (label) label.textContent = task.title;

    const priorityData = getPriorityData(task.priority);
    const priorityBar = taskElement.querySelector("div.absolute.right-0");
    if (priorityBar) priorityBar.style.backgroundColor = priorityData.color;

    editForm.classList.add("hidden");
    appState.editingTaskId = null;

    updateTasksDisplay();
  }
  saveTasksToStorage();
};

const initEditPriorityButtons = () => {
  const buttons = getElements(".edit-priority-btn");

  buttons.forEach((btn) => {
    btn.onclick = (e) => {
      e.preventDefault();
      appState.selectedPriority = btn.textContent.trim();
      highlightEditPriority();
    };
  });
};

const highlightEditPriority = () => {
  const buttons = document.querySelectorAll(".edit-priority-btn");

  buttons.forEach((btn) => {
    const btnPriority = btn.textContent.trim();
    const data = getPriorityData(btnPriority);

    if (btnPriority === appState.selectedPriority) {
      btn.style.opacity = "1";
      btn.style.backgroundColor = appState.darkMode
        ? data.darkBg
        : data.bgColor;
      btn.style.color = appState.darkMode ? data.darkText : data.textColor;
    } else {
      btn.style.opacity = "0.5";
      btn.style.backgroundColor = appState.darkMode ? "#233332" : "";
      btn.style.color = appState.darkMode ? "#02E1A2" : "";
    }
  });
};

// UI FUNCTIONS
const toggleAddTaskForm = () => {
  const addTaskBtn = getElement(".add-task-btn");
  const addTaskForm = getElement(".add-task-form");
  const noTaskSection = getElement(".no-task-section");

  if (addTaskForm.classList.contains("hidden")) {
    addTaskForm.classList.remove("hidden");
    addTaskBtn.classList.add("hidden");
    if (noTaskSection) noTaskSection.classList.add("hidden");
  } else {
    addTaskForm.classList.add("hidden");
    addTaskBtn.classList.remove("hidden");
    updateTasksDisplay();
  }
};

const togglePriorityMenu = () => {
  const priorityMenu = getElement(".priority-selector");
  priorityMenu?.classList.toggle("hidden");
};

const selectPriority = (priority) => {
  appState.selectedPriority = priority;

  const priorityBtns = getElements(".priority-btn");
  priorityBtns.forEach((btn) => {
    btn.style.opacity = "0.5";
    btn.style.transform = "scale(1)";
  });

  const selectedIndex = priorities.findIndex((p) => p.name === priority);
  if (selectedIndex !== -1 && priorityBtns[selectedIndex]) {
    priorityBtns[selectedIndex].style.opacity = "1";
    priorityBtns[selectedIndex].style.transform = "scale(1.05)";
  }
};

const toggleTaskMenu = (taskId) => {
  const task = getElement(`#${taskId}`);
  const menu = task?.querySelector(".task-menu");

  getElements(".task-menu").forEach((m) => {
    if (m !== menu) m.classList.add("hidden");
  });

  menu?.classList.toggle("hidden");
};

const toggleCompletedTaskMenu = (taskId) => {
  const task = getElement(`#${taskId}_completed`);
  const menu = task?.querySelector(".task-menu");

  getElements(".task-menu").forEach((m) => {
    if (m !== menu) m.classList.add("hidden");
  });

  menu?.classList.toggle("hidden");
};

const updateTasksDisplay = () => {
  const activeTasksCount = appState.tasks.length;
  const completedTasksCount = appState.completedTasks.length;

  const noTaskSection = getElement(".no-task-section");
  const taskCountText = getElement(".task-count-text");
  const taskCountHidden = getElement(".task-count-hidden");
  const completedCountText = getElement(".completed-count-text");

  if (activeTasksCount === 0) {
    noTaskSection?.classList.remove("hidden");
    if (taskCountText) taskCountText.textContent = "تسکی برای امروز نداری!";
    taskCountText?.classList.remove("hidden");
    taskCountHidden?.classList.add("hidden");
  } else {
    noTaskSection?.classList.add("hidden");
    if (taskCountHidden)
      taskCountHidden.textContent = `${activeTasksCount} تسک را باید انجام دهید.`;
    taskCountText?.classList.add("hidden");
    taskCountHidden?.classList.remove("hidden");
  }

  if (completedCountText) {
    completedCountText.textContent = `${completedTasksCount} تسک انجام شده است.`;
  }
};

//  TAGS TOGGLE
const initTagsToggle = () => {
  const tags = getElement(".tags");
  const tagsIcon = getElement(".tags-icon");

  if (tags && tagsIcon) {
    tags.addEventListener("click", (event) => {
      tagsIcon.classList.toggle("-rotate-90");
    });
  }
};

// EVENT LISTENERS
const initEventListeners = () => {
  const hamburgerBtn = getElement(".hamburger-btn");
  hamburgerBtn?.addEventListener("click", toggleSidebar);

  const addTaskBtn = getElement(".add-task-btn");
  addTaskBtn?.addEventListener("click", toggleAddTaskForm);

  const tagBtn = getElement(".tag-btn");
  tagBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    togglePriorityMenu();
  });

  initTagsToggle();

  const tagBtnContainer = getElement(".tag-btn");
  const tagIcon = getElement(".tags-icon");
  tagBtnContainer?.addEventListener("click", (e) => {
    tagIcon?.classList.toggle("-rotate-90");
  });

  const priorityBtns = getElements(".priority-btn");
  priorityBtns.forEach((btn, index) => {
    btn.style.opacity = "0.5";
    btn.style.transition = "all 0.3s ease";
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      selectPriority(priorities[index].name);
    });
  });

  if (priorityBtns[0]) {
    priorityBtns[0].style.opacity = "1";
    priorityBtns[0].style.transform = "scale(1.05)";
  }

  const submitBtn = getElement(".add-task-submit");
  submitBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    addTodo();
  });

  const editSubmitBtn = getElement(".edit-task-submit");
  editSubmitBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    if (isEditingCompleted) {
      saveCompletedEdit();
    } else {
      saveEdit();
    }
  });

  document.addEventListener("click", (e) => {
    if (
      !e.target.closest(".task-menu") &&
      !e.target.closest(".task-menu-trigger") &&
      !e.target.closest(".completed-task-menu-trigger")
    ) {
      getElements(".task-menu").forEach((menu) => menu.classList.add("hidden"));
    }
  });
};

// INITIALIZATION
const initApp = () => {
  getElement(".add-task-form")?.classList.add("hidden");
  getElement(".edit-task-form")?.classList.add("hidden");
  getElement(".priority-selector")?.classList.add("hidden");

  loadTasksFromStorage();
  renderTasksFromState();
  updateTasksDisplay();
};

document.addEventListener("DOMContentLoaded", () => {
  initThemeToggle();
  initEventListeners();
  initCloseAddTaskButton();
  initApp();
});

// GLOBAL FUNCTIONS

const toggleSidebar = () => {
  const sidebar = getElement("#sidebar");
  if (!sidebar) return;

  const isHidden = sidebar.style.right === "-280px" || !sidebar.style.right;
  sidebar.style.right = isHidden ? "0px" : "-280px";
};

window.toggleSidebar = toggleSidebar;

const saveTasksToStorage = () => {
  localStorage.setItem("tasks", JSON.stringify(appState.tasks));
  localStorage.setItem(
    "completedTasks",
    JSON.stringify(appState.completedTasks)
  );
};

const loadTasksFromStorage = () => {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const completedTasks =
    JSON.parse(localStorage.getItem("completedTasks")) || [];

  appState.tasks = tasks;
  appState.completedTasks = completedTasks;
};

const initCloseAddTaskButton = () => {
  const closeBtn = getElement(".close-add-task-btn");
  closeBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    const addTaskForm = getElement(".add-task-form");
    const addTaskBtn = getElement(".add-task-btn");
    addTaskForm?.classList.add("hidden");
    addTaskBtn?.classList.remove("hidden");
  });
};
